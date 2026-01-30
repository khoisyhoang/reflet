import { useState, useEffect, useRef } from 'react'
import { useQueryState } from 'nuqs'
import toast from 'react-hot-toast'
import {
  initializeEpub,
  applyReaderTheme,
  loadMetadata,
  loadToc,
  generateLocations,
  navigateToLocation,
  navigatePrev,
  navigateNext,
  type Metadata,
  type TocItem,
  type Location,
} from '../services/epubService'
import {
  handleHighlightMerging,
  addHighlight,
  removeHighlight,
  calculateMenuPosition,
  type HighlightData,
} from '../services/highlightService'
import Locations from 'epubjs/types/locations'

interface UseEpubReaderProps {
  epubPath: string
}

export function useEpubReader({ epubPath }: UseEpubReaderProps) {
  const [cfi, setCfi] = useQueryState('cfi', { defaultValue: '' })
  const [epubBook, setEpubBook] = useState<any>(null)
  const [metadata, setMetadata] = useState<Metadata>({})
  const [toc, setToc] = useState<TocItem[]>([])
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null)
  const [totalLocations, setTotalLocations] = useState(0)
  const [showHighlightMenu, setShowHighlightMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
  const [selection, setSelection] = useState<{ text: string; cfi: string }>({
    text: '',
    cfi: '',
  })
  const [highlights, setHighlights] = useState<HighlightData[]>([])

  const renditionRef = useRef<any>(null)
  const viewerRef = useRef<HTMLDivElement | null>(null)
  const currentCfiRef = useRef<string | null>(null)
  const highlightsRef = useRef<HighlightData[]>([])
  // Initialize EPUB
  useEffect(() => {
    if (!viewerRef.current) return

    const { book, rendition } = initializeEpub(epubPath, viewerRef.current)
    setEpubBook(book)
    renditionRef.current = rendition

    // Apply theme
    applyReaderTheme(rendition)

    // Load metadata
    loadMetadata(book).then((meta) => {
      setMetadata(meta)
    })

    // Load TOC
    loadToc(book).then((tocData) => {
      setToc(tocData)
    })

    // Generate locations for progress tracking
    generateLocations(book).then((total) => {
      setTotalLocations(total)
      // Display the book at the beginning if no CFI is set
      if (!cfi) {
        rendition.display()
      }
    })
    
    // Handle location changes
    rendition.on('relocated', (location: Location) => {
      setCurrentLocation(location)
      console.log("location here", location)
      // Reset highlights on page change
      highlightsRef.current = []
      setHighlights([])
      if (location.start.cfi !== currentCfiRef.current) {
        setCfi(location.start.cfi)
        currentCfiRef.current = location.start.cfi
      }
    })

    // Handle clicks to close highlight menu
    rendition.on('click', () => {
      setShowHighlightMenu(false)
    })

    // Handle text selection
    rendition.on('selected', (selectedCfi: string) => {
      const currentRange = rendition.getRange(selectedCfi)
      if (!currentRange) {
        toast.error('Invalid selection, please redo')
        return
      }

      const rect = currentRange.getBoundingClientRect()
      const viewerRect = viewerRef.current?.getBoundingClientRect()

      if (viewerRect) {
        const position = calculateMenuPosition(rect, viewerRect)
        setMenuPosition(position)
      }

      // Handle highlight merging
      const result = handleHighlightMerging(
        rendition,
        selectedCfi,
        currentRange,
        highlightsRef.current
      )

      setSelection({ text: currentRange.toString(), cfi: result.finalCfi })
      setShowHighlightMenu(true)

      // Remove overlapping highlights
      result.highlightsToRemove.forEach((highlight) =>
        removeHighlight(rendition, highlight.cfi)
      )

      // Add new merged highlight
      addHighlight(rendition, result.finalCfi, (cfi, range) => {
        const text = range.toString()
        setSelection({ text, cfi })

        const rect = range.getBoundingClientRect()
        const viewerRect = viewerRef.current?.getBoundingClientRect()
        if (viewerRect) {
          const position = calculateMenuPosition(rect, viewerRect)
          setMenuPosition(position)
        }
        setShowHighlightMenu(true)
      })

      // Update highlights state
      setHighlights((prev) => {
        const filtered = prev.filter(
          (highlight) =>
            !result.highlightsToRemove.some(
              (removed) => removed.cfi === highlight.cfi
            )
        )
        const withNew = filtered.concat({
          cfi: result.finalCfi,
          range: result.finalRange,
        })
        highlightsRef.current = withNew
        return withNew
      })

      toast.success('Text highlighted!')
    })

    return () => {
      if (renditionRef.current) {
        renditionRef.current.destroy()
      }
    }
  }, [epubPath])

  // Sync CFI with URL
  useEffect(() => {
    if (renditionRef.current && cfi !== currentCfiRef.current) {
      renditionRef.current.display(cfi || undefined)
      currentCfiRef.current = cfi
    }
  }, [cfi])

  // Navigation handlers
  const handleTocClick = (href: string) => {
    if (renditionRef.current) {
      navigateToLocation(renditionRef.current, href)
    }
  }

  const handlePrev = () => {
    if (renditionRef.current) {
      navigatePrev(renditionRef.current)
    }
  }

  const handleNext = () => {
    if (renditionRef.current) {
      navigateNext(renditionRef.current)
    }
  }

  // Save progress handler
  const saveProgress = async () => {
    const session = { cfi: currentCfiRef.current, highlights: highlightsRef.current }
    localStorage.setItem('readingSession', JSON.stringify(session))
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    // Simulate occasional failure
    if (Math.random() > 0.8) throw new Error('Failed to save session')
  }

  // Highlight menu handlers
  const handleRemoveHighlight = () => {
    if (selection.cfi && renditionRef.current) {
      removeHighlight(renditionRef.current, selection.cfi)

      setHighlights((prev) => {
        const updated = prev.filter((h) => h.cfi !== selection.cfi)
        highlightsRef.current = updated
        return updated
      })

      toast.success('Highlight removed!')
    }
    setShowHighlightMenu(false)
  }

  const handleCopyText = () => {
    navigator.clipboard.writeText(selection.text)
    toast.success('Text copied to clipboard!')
    setShowHighlightMenu(false)
  }

  const handleAddNotes = () => {
    console.log('Add notes', selection.text)
    setShowHighlightMenu(false)
  }

  return {
    // State
    metadata,
    toc,
    currentLocation,
    totalLocations,
    showHighlightMenu,
    menuPosition,
    selection,
    highlights,
    epubBook, // Add book object for chapter detection
    viewerRef,

    // Handlers
    handleTocClick,
    handlePrev,
    handleNext,
    handleRemoveHighlight,
    handleCopyText,
    handleAddNotes,
    saveProgress,
    setShowHighlightMenu,
  }
}

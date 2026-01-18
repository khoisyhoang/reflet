'use client'

import { useState, useEffect, useRef } from 'react'
import ePub from 'epubjs'
import { useQueryState } from 'nuqs'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ChevronLeft, ChevronRight, MessageCircle, X, Bot, StickyNote, Copy } from 'lucide-react'
import AiChatPanel from './components/AiChatPanel'
import toast from 'react-hot-toast'
import { Popover, PopoverContent } from '@/components/ui/popover'
import { PopoverTrigger } from '@/components/ui/popover'

interface TocItem {
  label: string
  href: string
  subitems?: TocItem[]
}

interface Metadata {
  title?: string
  creator?: string
}

interface Location {
  start: { cfi: string; location: number }
  end: { location: number }
  atStart: boolean
  atEnd: boolean
}

export default function ReadPage() {
  const [cfi, setCfi] = useQueryState('cfi', { defaultValue: '' })
  const [epubBook, setEpubBook] = useState<any>(null)
  const [metadata, setMetadata] = useState<Metadata>({})
  const [toc, setToc] = useState<TocItem[]>([])
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null)
  const [totalLocations, setTotalLocations] = useState(0)
  const [showAiChat, setShowAiChat] = useState(false)
  const [showHighlightMenu, setShowHighlightMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
  const [selectedText, setSelectedText] = useState('')
  const renditionRef = useRef<any>(null)
  const viewerRef = useRef<HTMLDivElement | null>(null)
  const currentCfiRef = useRef<string | null>(null)
  const highlightsRef = useRef<{ cfi: string, range: Range }[]>([])
  const [highlights, setHighlights] = useState<{ cfi: string, range: Range }[]>([])

  function rangesOverlap(a: Range, b: Range) {
    if (!a || !b) return false;

    return (
      a.compareBoundaryPoints(Range.END_TO_START, b) === -1 &&
      a.compareBoundaryPoints(Range.START_TO_END, b) === 1
    );
  }

  const mergeCFIs = (rendition: any, cfiA: string, cfiB: string): string | null => {
    // A: current selected cfi
    // B: overlapping highlight cfi

    const a = rendition.getRange(cfiA)
    const b = rendition.getRange(cfiB)
    if (!a || !b) return null

    const merged = document.createRange()

    // start
    if (a.compareBoundaryPoints(Range.START_TO_START, b) <= 0) {
      merged.setStart(a.startContainer, a.startOffset)
      console.log("a starts before b")
    } else {
      merged.setStart(b.startContainer, b.startOffset)
      console.log("b starts before a")
    }

    // end
    if (a.compareBoundaryPoints(Range.END_TO_END, b) >= 0) {
      merged.setEnd(a.endContainer, a.endOffset)
      console.log("a ends after b")
    } else {
      merged.setEnd(b.endContainer, b.endOffset)
      console.log("b ends after a")
    }

    // Get CFI base from the current section
    const contents = rendition.getContents()[0]
    if (!contents) return null

    // Convert merged range to CFI string using the book's CFI generator
    const mergedCfi = contents.cfiFromRange(merged)
    console.log("mergedCfi", mergedCfi)
    return mergedCfi
  }

  const handleHighlightMerging = (rendition: any, selectedCfi: string, range: Range, highlights: { cfi: string, range: Range }[]) => {
    console.log("gau gau", highlights)
    // search in current hightlights, whether there is any overlap with our current selection
    const existingOverlappingHighlights = highlights.filter(h => rangesOverlap(h.range, range))

    if (existingOverlappingHighlights.length > 0) {
      console.log("existingOverlappingHighlights", existingOverlappingHighlights);
      let finalMergedCfi = selectedCfi
      // Processing all overlapping highlights
      for (const highlight of existingOverlappingHighlights) {
        // Pass in -current selected cfi and -overlapping highlight cfi
        const tempMergedCfi = mergeCFIs(rendition, finalMergedCfi, highlight.cfi)
        if (tempMergedCfi) finalMergedCfi = tempMergedCfi
      }
      const finalMergedRange = rendition.getRange(finalMergedCfi)
      return {
        finalCfi: finalMergedCfi,
        finalRange: finalMergedRange,
        highlightsToRemove: existingOverlappingHighlights
      }
    } else {
      return {
        finalCfi: selectedCfi,
        finalRange: range,
        highlightsToRemove: []
      }
    }
  }

  useEffect(() => {
    if (!viewerRef.current) return

    const book = ePub('/pom.epub')
    setEpubBook(book)

    book.loaded.metadata.then((meta) => {
      setMetadata(meta as Metadata)
    })

    book.loaded.navigation.then((nav) => {
      setToc(nav.toc as TocItem[])
    })

    const rendition = book.renderTo(viewerRef.current, {
      width: '100%',
      height: '100%',
      flow: 'paginated',
      spread: 'none'
    })

    renditionRef.current = rendition

    // Apply custom selection color theme
    rendition.themes.register('yellow-selection', {
      '::selection': {
        'background': 'yellow !important',
        'color': 'black'
      }
    })
    rendition.themes.select('yellow-selection')

    rendition.on('relocated', (location: Location) => {
      setCurrentLocation(location)
      // reset our highlights
      highlightsRef.current = []
      setHighlights([])
      if (location.start.cfi !== currentCfiRef.current) {
        setCfi(location.start.cfi)
        currentCfiRef.current = location.start.cfi
      }
    })

    rendition.on("click", () => {
      setShowHighlightMenu(false)
    })

    // Handle text selection / highlight in the ePub viewer
    rendition.on('selected', (selectedCfi: string) => {
      console.log("selectedCfi", selectedCfi);
      const currentRange = rendition.getRange(selectedCfi)
      if (!currentRange) {
        toast.error('Invalid selection, please redo')
        return
      }
      const rect = currentRange.getBoundingClientRect()
      const viewerRect = viewerRef.current?.getBoundingClientRect()

      if (viewerRect) {
        // Calculate horizontal center of selection relative to viewer
        const selectionCenterX = rect.left - viewerRect.left + rect.width / 2
        // Position menu below if near top, above otherwise
        const isNearTop = rect.top < 60
        setMenuPosition({
          x: selectionCenterX,
          y: isNearTop ? rect.bottom + 5 : rect.top - 45
        })
      }
      setSelectedText(currentRange.toString())
      setShowHighlightMenu(true)

      // Handle highlight merging and addition
      console.log("momentbeforegaugau", highlightsRef.current)
      const result = handleHighlightMerging(rendition, selectedCfi, currentRange, highlightsRef.current)
      console.log("result", result);
      result.highlightsToRemove.forEach(highlight => rendition.annotations.remove(highlight.cfi, 'highlight'))
      rendition.annotations.add('highlight', result.finalCfi, {}, (e: any) => {
        // Handle click on existing highlight
        const range = rendition.getRange(result.finalCfi)
        if (range) {
          const text = range.toString()
          setSelectedText(text)
          // Position menu below if near top, above otherwise
          const rect = range.getBoundingClientRect()
          const viewerRect = viewerRef.current?.getBoundingClientRect()
          if (viewerRect) {
            // Calculate horizontal center of selection relative to viewer
            const selectionCenterX = rect.left - viewerRect.left + rect.width / 2
            // Position menu below if near top, above otherwise
            const isNearTop = rect.top < 60
            setMenuPosition({
              x: selectionCenterX,
              y: isNearTop ? rect.bottom + 5 : rect.top - 45
            })
          }
          setShowHighlightMenu(true)
        }
      }, 'hl-yellow')

      setHighlights(prev => {
        const filtered = prev.filter(highlight => !result.highlightsToRemove.some(removed => removed.cfi === highlight.cfi))
        const withNew = filtered.concat({ cfi: result.finalCfi, range: result.finalRange })
        highlightsRef.current = withNew
        console.log("withNew", withNew);
        return withNew
      })

      toast.success('Text highlighted!')



    })
    book.ready.then(() => {
      book.locations.generate(1000).then(() => {
        console.log("locations:", book.locations.length())
        setTotalLocations(book.locations.length())
      })
    })

    return () => {
      if (renditionRef.current) {
        renditionRef.current.destroy()
      }
    }
  }, [])

  useEffect(() => {
    if (renditionRef.current && cfi !== currentCfiRef.current) {
      renditionRef.current.display(cfi || undefined)
      currentCfiRef.current = cfi
    }
  }, [cfi])

  const handleTocClick = (href: string) => {
    if (renditionRef.current) {
      renditionRef.current.display(href)
    }
  }

  const handlePrev = () => {
    if (renditionRef.current) {
      renditionRef.current.prev()
    }
  }

  const handleNext = () => {
    if (renditionRef.current) {
      renditionRef.current.next()
    }
  }

  const progress = currentLocation && totalLocations ? Math.round((currentLocation.start.location / totalLocations) * 100) : 0
  console.log("highlights", highlights);

  return (
    <Sheet>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 ">
        {/* Main Reading Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  ☰
                </Button>
              </SheetTrigger>
              <h1 className="text-xl font-bold truncate text-gray-900 dark:text-gray-100">{metadata.title || 'Loading...'}</h1>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Progress: {progress}%
            </div>
          </header>

          {/* Viewer and AI Chat */}
          <ResizablePanelGroup orientation="horizontal" className="flex-1">
            <ResizablePanel defaultSize={showAiChat ? 70 : 100} minSize={20} className="flex flex-col">
              {/* Viewer */}
              <div className="relative flex-1 overflow-hidden max-w-screen">
                <div
                  ref={viewerRef}
                  className="w-full h-full"
                />
                <Button
                  onClick={handlePrev}
                  disabled={!currentLocation || currentLocation.atStart}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 border-0"
                  size="icon"
                >
                  <ChevronLeft />
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!currentLocation || currentLocation.atEnd}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 border-0"
                  size="icon"
                >
                  <ChevronRight />
                </Button>
                <Button
                  onClick={() => setShowAiChat(!showAiChat)}
                  className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70 border-0"
                  size="icon"
                >
                  <MessageCircle />
                </Button>
                {showHighlightMenu && (
                  <div
                    className="absolute z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-1 flex gap-1 -translate-x-1/2"
                    style={{ left: menuPosition.x, top: menuPosition.y }}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setShowAiChat(true)
                              setShowHighlightMenu(false)
                            }}
                          >
                            <Bot className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Ask AI</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setShowHighlightMenu(false)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Close</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              console.log('Add notes', selectedText)
                              setShowHighlightMenu(false)
                            }}
                          >
                            <StickyNote className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Add Notes</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              navigator.clipboard.writeText(selectedText)
                              toast.success('Text copied to clipboard!')
                              setShowHighlightMenu(false)
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
                {/* <Popover open={showHighlightMenu} onOpenChange={setShowHighlightMenu}>
                  <PopoverTrigger asChild>
                    <div style={{ display: 'none' }} />
                  </PopoverTrigger>
                  <PopoverContent
                    side="top"
                    align="center"
                    className="z-50 p-1 flex gap-1"
                    // style={{
                    //   position: "absolute",
                    //   left: menuPosition.x,
                    //   top: menuPosition.y,
                    //   transform: "translateX(-50%)",
                    // }}
                    onInteractOutside={() => setShowHighlightMenu(false)}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setShowAiChat(true)
                              setShowHighlightMenu(false)
                            }}
                          >
                            <Bot className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Ask AI</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setShowHighlightMenu(false)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Close</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              console.log('Add notes', selectedText)
                              setShowHighlightMenu(false)
                            }}
                          >
                            <StickyNote className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Add Notes</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              navigator.clipboard.writeText(selectedText)
                              toast.success('Text copied to clipboard!')
                              setShowHighlightMenu(false)
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </PopoverContent>
                </Popover> */}
              </div>
            </ResizablePanel>

            {showAiChat && (
              <>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={30} minSize={20} collapsible className="flex flex-col">
                  <AiChatPanel />
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </div>
      </div>

      {/* TOC Panel */}
      <SheetContent side="left" className="w-80 p-0">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <SheetHeader>
            <SheetTitle>Table of Contents</SheetTitle>
          </SheetHeader>
        </div>
        <div className="overflow-y-auto h-full pb-4">
          <ul className="p-4">
            {toc.map((item, index) => (
              <li key={index} className="mb-2">
                <Button
                  onClick={() => handleTocClick(item.href)}
                  variant="ghost"
                  className="text-left w-full justify-start"
                >
                  {item.label}
                </Button>
                {item.subitems && item.subitems.length > 0 && (
                  <ul className="ml-4 mt-1">
                    {item.subitems.map((subitem, subindex) => (
                      <li key={subindex}>
                        <Button
                          onClick={() => handleTocClick(subitem.href)}
                          variant="ghost"
                          size="sm"
                          className="text-left w-full justify-start ml-4"
                        >
                          {subitem.label}
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  )
}

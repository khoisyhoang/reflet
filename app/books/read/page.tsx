'use client'

import { useState, useEffect, useRef } from 'react'
import ePub from 'epubjs'
import { useQueryState } from 'nuqs'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

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
  const renditionRef = useRef<any>(null)
  const viewerRef = useRef<HTMLDivElement | null>(null)
  const currentCfiRef = useRef<string | null>(null)

  useEffect(() => {
    if (!viewerRef.current) return

    const book = ePub('/pom.epub')
    console.log("book", book);
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

    rendition.on('relocated', (location: Location) => {
      setCurrentLocation(location)
      if (location.start.cfi !== currentCfiRef.current) {
        setCfi(location.start.cfi)
        currentCfiRef.current = location.start.cfi
      }
    })

    book.locations.generate(1000).then(() => {
      setTotalLocations(book.locations.length())
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

  return (
    <Sheet>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Main Reading Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <SheetTrigger asChild>
                <button
                  className="mr-4 text-2xl focus:outline-none text-gray-900 dark:text-gray-100"
                >
                  ☰
                </button>
              </SheetTrigger>
              <h1 className="text-xl font-bold truncate text-gray-900 dark:text-gray-100">{metadata.title || 'Loading...'}</h1>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Progress: {progress}%
            </div>
          </header>

          {/* Viewer */}
          <div
            ref={viewerRef}
            className="flex-1 overflow-hidden"
            style={{ height: 'calc(100vh - 140px)' }}
          />

          {/* Controls */}
          <div className="flex justify-center items-center p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handlePrev}
              className="mx-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!currentLocation || currentLocation.atStart}
            >
              ← Previous
            </button>
            <button
              onClick={handleNext}
              className="mx-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!currentLocation || currentLocation.atEnd}
            >
              Next →
            </button>
          </div>
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
                <button
                  onClick={() => handleTocClick(item.href)}
                  className="text-left hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded w-full text-gray-900 dark:text-gray-100"
                >
                  {item.label}
                </button>
                {item.subitems && item.subitems.length > 0 && (
                  <ul className="ml-4 mt-1">
                    {item.subitems.map((subitem, subindex) => (
                      <li key={subindex}>
                        <button
                          onClick={() => handleTocClick(subitem.href)}
                          className="text-left hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded w-full text-sm text-gray-900 dark:text-gray-100"
                        >
                          {subitem.label}
                        </button>
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

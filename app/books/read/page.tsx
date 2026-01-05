'use client'

import { useState, useEffect, useRef } from 'react'
import ePub from 'epubjs'
import { useQueryState } from 'nuqs'

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
  const [file] = useQueryState('file', { defaultValue: '' })
  const [cfi, setCfi] = useQueryState('cfi', { defaultValue: '' })
  const [epubBook, setEpubBook] = useState<any>(null)
  const [metadata, setMetadata] = useState<Metadata>({})
  const [toc, setToc] = useState<TocItem[]>([])
  const [isTocOpen, setIsTocOpen] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null)
  const [totalLocations, setTotalLocations] = useState(0)
  const renditionRef = useRef<any>(null)
  const viewerRef = useRef<HTMLDivElement | null>(null)
  const currentCfiRef = useRef<string | null>(null)

  useEffect(() => {
    if (!file || !viewerRef.current) return

    const book = ePub(`/${file}.epub`)
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
  }, [file])

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
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* TOC Panel */}
      <div
        className={`fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 z-20 ${
          isTocOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setIsTocOpen(!isTocOpen)}
            className="text-2xl focus:outline-none text-gray-900 dark:text-gray-100"
          >
            ☰
          </button>
          <h2 className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Table of Contents</h2>
        </div>
        <div className="overflow-y-auto h-full pb-4">
          <ul className="p-4">
            {toc.map((item, index) => (
              <li key={index} className="mb-2">
                <button
                  onClick={() => {
                    handleTocClick(item.href)
                    setIsTocOpen(false)
                  }}
                  className="text-left hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded w-full text-gray-900 dark:text-gray-100"
                >
                  {item.label}
                </button>
                {item.subitems && item.subitems.length > 0 && (
                  <ul className="ml-4 mt-1">
                    {item.subitems.map((subitem, subindex) => (
                      <li key={subindex}>
                        <button
                          onClick={() => {
                            handleTocClick(subitem.href)
                            setIsTocOpen(false)
                          }}
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
      </div>

      {/* Overlay when TOC is open */}
      {isTocOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setIsTocOpen(false)}
        />
      )}

      {/* Main Reading Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isTocOpen ? 'ml-0' : 'ml-0'}`}>
        {/* Header */}
        <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            {!isTocOpen && (
              <button
                onClick={() => setIsTocOpen(true)}
                className="mr-4 text-2xl focus:outline-none text-gray-900 dark:text-gray-100"
              >
                ☰
              </button>
            )}
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
  )
}

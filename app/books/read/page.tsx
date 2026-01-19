'use client'

import { useState } from 'react'
import { Sheet } from '@/components/ui/sheet'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
import AiChatPanel from './components/AiChatPanel'
import { ReaderHeader } from './components/ReaderHeader'
import { NavigationButtons } from './components/NavigationButtons'
import { HighlightMenu } from './components/HighlightMenu'
import { TOCPanel } from './components/TOCPanel'
import { useEpubReader } from './hooks/useEpubReader'
import { calculateProgress } from './services/epubService'

export default function ReadPage() {
  const [showAiChat, setShowAiChat] = useState(false)

  const {
    metadata,
    toc,
    currentLocation,
    totalLocations,
    showHighlightMenu,
    menuPosition,
    selection,
    viewerRef,
    handleTocClick,
    handlePrev,
    handleNext,
    handleRemoveHighlight,
    handleCopyText,
    handleAddNotes,
    setShowHighlightMenu,
  } = useEpubReader({ epubPath: '/pom.epub' })

  const progress = calculateProgress(currentLocation, totalLocations)

  return (
    <Sheet>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 flex flex-col">
          <ReaderHeader title={metadata.title || ''} progress={progress} />

          <ResizablePanelGroup orientation="horizontal" className="flex-1">
            <ResizablePanel
              defaultSize={showAiChat ? 70 : 100}
              minSize={20}
              className="flex flex-col"
            >
              <div className="relative flex-1 overflow-hidden max-w-screen">
                <div ref={viewerRef} className="w-full h-full" />

                <NavigationButtons
                  currentLocation={currentLocation}
                  onPrev={handlePrev}
                  onNext={handleNext}
                  onToggleChat={() => setShowAiChat(!showAiChat)}
                />

                {showHighlightMenu && (
                  <HighlightMenu
                    position={menuPosition}
                    selectedText={selection.text}
                    onAskAI={() => {
                      setShowAiChat(true)
                      setShowHighlightMenu(false)
                    }}
                    onRemoveHighlight={handleRemoveHighlight}
                    onAddNotes={handleAddNotes}
                    onCopy={handleCopyText}
                  />
                )}
              </div>
            </ResizablePanel>

            {showAiChat && (
              <>
                <ResizableHandle withHandle />
                <ResizablePanel
                  defaultSize={30}
                  minSize={20}
                  collapsible
                  className="flex flex-col"
                >
                  <AiChatPanel />
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </div>
      </div>

      <TOCPanel toc={toc} onTocClick={handleTocClick} />
    </Sheet>
  )
}

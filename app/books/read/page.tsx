'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Sheet } from '@/components/ui/sheet'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
import AiChatPanel from './components/AiChatPanel'
import { ReaderHeader } from './components/ReaderHeader'
import { NavigationButtons } from './components/NavigationButtons'
import { HighlightMenu } from './components/HighlightMenu'
import { TOCPanel } from './components/TOCPanel'
import { useEpubReader } from './hooks/useEpubReader'
import { calculateProgress } from './services/epubService'
import { useChatSocket } from '@/hooks/useChatSocket'

export default function ReadPage() {

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
    saveProgress,
    setShowHighlightMenu,
  } = useEpubReader({ epubPath: '/pom.epub' })

  const router = useRouter()

  const socket = useChatSocket();

  const handleFinish = async () => {
    const loadingToast = toast.loading('Hold on, we are submitting...')
    try {
      await saveProgress()
      toast.dismiss(loadingToast)
      toast.success('Session saved!')
      router.push('/books')
      

    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error('Failed to save session')
    }
  }

  const progress = calculateProgress(currentLocation, totalLocations)

  return (
    <Sheet>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 max-w-screen">
        <div className="flex-1 flex flex-col">
          <ReaderHeader title={metadata.title || ''} progress={progress} onFinish={handleFinish} />

          <ResizablePanelGroup orientation="horizontal" className="flex-1">
            <ResizablePanel
              defaultSize={75}
              minSize={75}
              maxSize={75}
              className="flex flex-col"
            >
              <div className="relative flex-1 overflow-hidden max-w-[75vw]">
                <div ref={viewerRef} className="w-full h-full" />

                <NavigationButtons
                  currentLocation={currentLocation}
                  onPrev={handlePrev}
                  onNext={handleNext}
                />

                {showHighlightMenu && (
                  <HighlightMenu
                    position={menuPosition}
                    selectedText={selection.text}
                    onAskAI={() => {
                      setShowHighlightMenu(false)
                    }}
                    onRemoveHighlight={handleRemoveHighlight}
                    onAddNotes={handleAddNotes}
                    onCopy={handleCopyText}
                  />
                )}
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />
            <ResizablePanel
              defaultSize={25}
              minSize={25}
              maxSize={25}
              collapsible
              className="flex flex-col"
            >
              <AiChatPanel socket={socket}/>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>

      <TOCPanel toc={toc} onTocClick={handleTocClick} />
    </Sheet>
  )
}

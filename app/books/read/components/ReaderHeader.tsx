import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { SheetTrigger } from '@/components/ui/sheet'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronUp, ChevronDown } from 'lucide-react'

interface ReaderHeaderProps {
  title: string
  progress: number
  onFinish: () => void
}

export function ReaderHeader({ title, progress, onFinish }: ReaderHeaderProps) {
  const [isOpen, setIsOpen] = useState(true)


  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="relative">
        {/* Collapsieble button */}
        {/* <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="absolute top-2 right-2 z-10">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </CollapsibleTrigger> */}
        <CollapsibleContent>
          <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  ☰
                </Button>
              </SheetTrigger>
              <h1 className="text-xl font-bold truncate text-gray-900 dark:text-gray-100">
                {title || 'Loading...'}
              </h1>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Progress: {progress}%
            </div>
            <Button className='' onClick={onFinish}>Finish</Button>
          </header>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

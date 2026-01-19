import { Button } from '@/components/ui/button'
import { SheetTrigger } from '@/components/ui/sheet'

interface ReaderHeaderProps {
  title: string
  progress: number
}

export function ReaderHeader({ title, progress }: ReaderHeaderProps) {
  return (
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
    </header>
  )
}

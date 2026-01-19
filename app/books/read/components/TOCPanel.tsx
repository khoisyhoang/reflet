import { Button } from '@/components/ui/button'
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import type { TocItem } from '../services/epubService'

interface TOCPanelProps {
  toc: TocItem[]
  onTocClick: (href: string) => void
}

export function TOCPanel({ toc, onTocClick }: TOCPanelProps) {
  return (
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
                onClick={() => onTocClick(item.href)}
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
                        onClick={() => onTocClick(subitem.href)}
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
  )
}

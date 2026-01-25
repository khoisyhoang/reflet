import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Location } from '../services/epubService'

interface NavigationButtonsProps {
  currentLocation: Location | null
  onPrev: () => void
  onNext: () => void
}

export function NavigationButtons({
  currentLocation,
  onPrev,
  onNext,
}: NavigationButtonsProps) {
  return (
    <>
      <Button
        onClick={onPrev}
        disabled={!currentLocation || currentLocation.atStart}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 border-0"
        size="icon"
      >
        <ChevronLeft />
      </Button>
      <Button
        onClick={onNext}
        disabled={!currentLocation || currentLocation.atEnd}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 border-0"
        size="icon"
      >
        <ChevronRight />
      </Button>
    </>
  )
}

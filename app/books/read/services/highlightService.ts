/**
 * Service for managing EPUB highlights and CFI operations
 */

export interface HighlightData {
  cfi: string
  range: Range
}

/**
 * Check if two ranges overlap
 */
export function rangesOverlap(a: Range, b: Range): boolean {
  if (!a || !b) return false

  return (
    a.compareBoundaryPoints(Range.END_TO_START, b) === -1 &&
    a.compareBoundaryPoints(Range.START_TO_END, b) === 1
  )
}

/**
 * Merge two CFIs into a single CFI that encompasses both
 */
export function mergeCFIs(
  rendition: any,
  cfiA: string,
  cfiB: string
): string | null {
  const a = rendition.getRange(cfiA)
  const b = rendition.getRange(cfiB)
  if (!a || !b) return null

  const merged = document.createRange()

  // Set start point (earliest)
  if (a.compareBoundaryPoints(Range.START_TO_START, b) <= 0) {
    merged.setStart(a.startContainer, a.startOffset)
  } else {
    merged.setStart(b.startContainer, b.startOffset)
  }

  // Set end point (latest)
  if (a.compareBoundaryPoints(Range.END_TO_END, b) >= 0) {
    merged.setEnd(a.endContainer, a.endOffset)
  } else {
    merged.setEnd(b.endContainer, b.endOffset)
  }

  // Get CFI base from the current section
  const contents = rendition.getContents()[0]
  if (!contents) return null

  // Convert merged range to CFI string
  const mergedCfi = contents.cfiFromRange(merged)
  return mergedCfi
}

/**
 * Handle merging of overlapping highlights
 */
export function handleHighlightMerging(
  rendition: any,
  selectedCfi: string,
  range: Range,
  highlights: HighlightData[]
): {
  finalCfi: string
  finalRange: Range
  highlightsToRemove: HighlightData[]
} {
  // Find overlapping highlights
  const existingOverlappingHighlights = highlights.filter((h) =>
    rangesOverlap(h.range, range)
  )

  if (existingOverlappingHighlights.length > 0) {
    let finalMergedCfi = selectedCfi

    // Merge all overlapping highlights
    for (const highlight of existingOverlappingHighlights) {
      const tempMergedCfi = mergeCFIs(rendition, finalMergedCfi, highlight.cfi)
      if (tempMergedCfi) finalMergedCfi = tempMergedCfi
    }

    const finalMergedRange = rendition.getRange(finalMergedCfi)

    return {
      finalCfi: finalMergedCfi,
      finalRange: finalMergedRange,
      highlightsToRemove: existingOverlappingHighlights,
    }
  }

  return {
    finalCfi: selectedCfi,
    finalRange: range,
    highlightsToRemove: [],
  }
}

/**
 * Add a highlight annotation to the rendition
 */
export function addHighlight(
  rendition: any,
  cfi: string,
  onClick: (cfi: string, range: Range) => void
): void {
  rendition.annotations.add(
    'highlight',
    cfi,
    {},
    (e: any) => {
      const range = rendition.getRange(cfi)
      if (range) {
        onClick(cfi, range)
      }
    },
    '',
    {
      fill: '#FFC107',
      'fill-opacity': '0.2',
    }
  )
}

/**
 * Remove a highlight annotation from the rendition
 */
export function removeHighlight(rendition: any, cfi: string): void {
  rendition.annotations.remove(cfi, 'highlight')
}

/**
 * Calculate menu position based on selection rectangle
 */
export function calculateMenuPosition(
  rect: DOMRect,
  viewerRect: DOMRect
): { x: number; y: number } {
  const selectionCenterX = rect.left - viewerRect.left + rect.width / 2
  const isNearTop = rect.top < 60

  return {
    x: selectionCenterX,
    y: isNearTop ? rect.bottom + 5 : rect.top - 45,
  }
}

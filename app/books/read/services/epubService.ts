/**
 * Service for EPUB initialization and configuration
 */

import ePub from 'epubjs'

export interface TocItem {
  label: string
  href: string
  subitems?: TocItem[]
}

export interface Metadata {
  title?: string
  creator?: string
}

export interface Location {
  start: { cfi: string; location: number }
  href: string
  end: { location: number }
  atStart: boolean
  atEnd: boolean
}

/**
 * Initialize EPUB book and rendition
 */
export function initializeEpub(
  epubPath: string,
  viewerElement: HTMLElement,
  options?: {
    width?: string
    height?: string
    flow?: string
    spread?: string
  }
) {
  const book = ePub(epubPath)

  const rendition = book.renderTo(viewerElement, {
    width: options?.width || '100%',
    height: options?.height || '100%',
    flow: options?.flow || 'paginated',
    spread: options?.spread || 'none',
  })

  return { book, rendition }
}

/**
 * Apply custom theme to rendition
 */
export function applyReaderTheme(rendition: any): void {
  // Apply custom selection color theme
  rendition.themes.register('yellow-selection', {
    '::selection': {
      background: 'rgba(255, 193, 7, 0.2) !important',
      color: 'black',
    },
  })
  rendition.themes.select('yellow-selection')
  rendition.themes.override('color', '#000', true)
}

/**
 * Load book metadata
 */
export async function loadMetadata(book: any): Promise<Metadata> {
  return book.loaded.metadata
}

/**
 * Load table of contents
 */
export async function loadToc(book: any): Promise<TocItem[]> {
  const nav = await book.loaded.navigation
  return nav.toc as TocItem[]
}

/**
 * Generate book locations for progress tracking
 */
export async function generateLocations(
  book: any,
  charsPerPage: number = 1000
): Promise<number> {
  await book.ready
  await book.locations.generate(charsPerPage)
  return book.locations.length()
}

/**
 * Calculate reading progress percentage
 */
export function calculateProgress(
  currentLocation: Location | null,
  totalLocations: number
): number {
  if (!currentLocation || !totalLocations) return 0
  return Math.round((currentLocation.start.location / totalLocations) * 100)
}

/**
 * Navigate to a specific location in the book
 */
export function navigateToLocation(rendition: any, href: string): void {
  rendition.display(href)
}

/**
 * Navigate to previous page
 */
export function navigatePrev(rendition: any): void {
  rendition.prev()
}

/**
 * Navigate to next page
 */
export function navigateNext(rendition: any): void {
  rendition.next()
}

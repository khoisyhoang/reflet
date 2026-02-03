/**
 * Utilities for extracting reading context from EPUB data
 */

import { Book, EpubCFI, NavItem } from "epubjs";
import { Location } from "./epubService";
import { CloudCog } from "lucide-react";

/**
 * Calculate reading progress as a percentage
 * TODO: Uncomment when needed
 */
/*
export function getReadingProgress(
  currentLocation: Location | null,
  totalLocations: number
): number {
  if (!currentLocation || !totalLocations) return 0
  return Math.round((currentLocation.start.location / totalLocations) * 100)
}
*/
export async function getCfiFromHref(book: Book, href: string) {
    const [_, id] = href.split('#')
    const section = book.spine.get(href)
    
    // Ensure the section is loaded before accessing its document
    if (!section.document) {
        await section.load(book.load.bind(book))
    }
    
    const el = (id ? section.document.getElementById(id) : section.document.body) as Element
    return section.cfiFromElement(el)
}

export async function getChapter(book: Book, location: Location): Promise<string | null> {
    if (!book) return null;
    if (!location) return null;
    
    let locationCfi = location.start.cfi;
    let spineItem = book.spine.get(locationCfi);
    
    // Ensure spineItem document is loaded
    if (!spineItem.document) {
        await spineItem.load(book.load.bind(book))
    }
    
    const toc = book.navigation.toc;
    
    
    // Process TOC items sequentially to handle async getCfiFromHref
    let myChapter: NavItem | undefined;
    for (let index = 0; index < toc.length; index++) {
        let item = toc[index];
        const itemCfi = await getCfiFromHref(book, item.href);
        if (EpubCFI.prototype.compare(locationCfi, itemCfi) < 0) {
            myChapter = toc[index-1];
            break;
        }
    }

    return myChapter?.label || null;
};

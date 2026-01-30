/**
 * Utilities for extracting reading context from EPUB data
 */

import { Book, EpubCFI, NavItem } from "epubjs";
import { Location } from "./epubService";

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

export function getChapter(book: Book, location: Location): string | null {
    if (!book) return null;
    if (!location) return null;
    // console.log("location here", location);
    // // Flatten the TOC to handle nested items
    // const flatten = (items: NavItem[]): NavItem[] => {
    //     return items.flatMap(item => [item, ...(item.subitems ? flatten(item.subitems) : [])]);
    // };

    // const flattenedToc = flatten(book.navigation.toc);

    // // Find matching TOC item by canonical href
    // const matches = flattenedToc.filter(item => book.canonical(item.href) === book.canonical(location.href));
    // console.log("matches here", matches);
    // if (matches.length === 0) return null;
    // if (matches.length > 1) {
    //     console.warn("Multiple TOC matches for href:", location.href, matches);
    //     return null;
    // }
    
    // return matches[0].label.trim();
    let locationCfi = location.start.cfi;
    let spineItem = book.spine.get(locationCfi);
    const toc = book.navigation.toc;
    console.log("locationCfi here", location)
    console.log("spineItem here", spineItem);
    console.log("toc here", toc);
    let navItem = book.navigation.get(spineItem.href);
    console.log("navItem here", navItem?.label);
    console.log("current here", navItem?.label);
    return navItem?.label?.trim();
};

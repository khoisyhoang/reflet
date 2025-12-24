import { Work as BaseWork, Edition, EditionOfWork } from '../types/bookTypes';

export interface Work extends BaseWork {
  covers?: number[];
  description?: string | { type: string; value: string };
  subject_places?: string[];
  subject_times?: string[];
  subject_people?: string[];
  links?: Array<{ title: string; url: string }>;
  first_publish_year?: number;  // Changed to match BaseWork
  authors?: Array<{ author: { key: string }; type: { key: string } }>;
  subjects?: string[];  // Added to match actual API response
}

export interface EditionsResponse {
  numFound: number;
  start: number;
  numFoundExact: boolean;
  docs: Edition[];
}

export interface SearchResult {
  numFound: number;
  start: number;
  docs: BaseWork[];
}

/**
 * Search for books using OpenLibrary API
 * @param query - The search query string
 * @param limit - Maximum number of results to return (default: 20)
 * @param sort - Sort option: 'relevance', 'edition_count_asc', 'edition_count_desc' (default: 'edition_count_asc')
 * @returns Promise<BaseWork[]> - Array of book objects
 * @throws Error when API call fails or returns error
 */
export async function searchBooks(query: string | undefined, limit: number = 20, sort: string = 'rating'): Promise<BaseWork[]> {
  if (!query || !query.trim()) {
    query = 'atomic';
  }

  try {
    // Build URL with sort parameter
    let url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}&fields=*,editions`;
    console.log(url);
    
    if (sort) {
      url += `&sort=${encodeURIComponent(sort)}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: any = await response.json();

    // Check for API error in response
    if (data.error) {
      throw new Error(`OpenLibrary API error: ${data.error}`);
    }

    const books = Array.isArray(data.docs) ? data.docs : [];

    return books;
  } catch (error) {
    // Re-throw with more context if it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to OpenLibrary. Please check your internet connection.');
    }
    throw error;
  }
}

/**
 * Fetch editions for a specific work
 * @param workId - The work ID (e.g., 'OL45804W')
 * @param limit - Maximum number of editions to return (default: 50)
 * @returns Promise<Edition[]> - Array of edition objects
 * @throws Error when API call fails or returns error
 */
export async function fetchWorkEditions(workId: string, limit: number = 50): Promise<Edition[]> {
  if (!workId) {
    throw new Error('Work ID cannot be empty');
  }

  try {
    const response = await fetch(
      `https://openlibrary.org/works/${workId}/editions.json?limit=${limit}`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: any = await response.json();

    // Check for API error in response
    if (data.error) {
      throw new Error(`OpenLibrary API error: ${data.error}`);
    }

    const editions = Array.isArray(data.entries) ? data.entries : [];

    return editions;
  } catch (error) {
    // Re-throw with more context if it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to OpenLibrary. Please check your internet connection.');
    }
    throw error;
  }
}

/**
 * Fetch work data for a specific work
 * @param workId - The work ID (e.g., 'OL45804W')
 * @returns Promise<Work> - Work object
 * @throws Error when API call fails or returns error
 */
export async function fetchWork(workId: string): Promise<Work> {
  if (!workId) {
    throw new Error('Work ID cannot be empty');
  }

  try {
    const response = await fetch(`https://openlibrary.org/works/${workId}.json`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: any = await response.json();

    // Check for API error in response
    if (data.error) {
      throw new Error(`OpenLibrary API error: ${data.error}`);
    }

    return data;
  } catch (error) {
    // Re-throw with more context if it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to OpenLibrary. Please check your internet connection.');
    }
    throw error;
  }
}

/**
 * Fetch a specific edition
 * @param editionId - The edition ID (e.g., 'OL7353617M')
 * @returns Promise<Edition> - Edition object
 * @throws Error when API call fails or returns error
 */
export async function fetchEdition(editionId: string): Promise<Edition> {
  if (!editionId) {
    throw new Error('Edition ID cannot be empty');
  }

  try {
    const response = await fetch(`https://openlibrary.org/books/${editionId}.json`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: any = await response.json();

    // Check for API error in response
    if (data.error) {
      throw new Error(`OpenLibrary API error: ${data.error}`);
    }

    return data;
  } catch (error) {
    // Re-throw with more context if it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to OpenLibrary. Please check your internet connection.');
    }
    throw error;
  }
}

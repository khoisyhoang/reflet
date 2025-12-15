export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  publisher?: string[];
  cover_i?: number;
  edition_count?: number;
  // Add other fields as needed
}

export interface Edition {
  key: string;
  title: string;
  publishers?: string[];
  publish_date?: string;
  isbn_10?: string[];
  isbn_13?: string[];
  number_of_pages?: number;
  covers?: number[];
  languages?: string[];
  // Add other fields as needed
}

export interface EditionsResult {
  size: number;
  entries: Edition[];
}

export interface SearchResult {
  numFound: number;
  start: number;
  docs: Book[];
}

/**
 * Search for books using OpenLibrary API
 * @param query - The search query string
 * @param limit - Maximum number of results to return (default: 20)
 * @param sort - Sort option: 'relevance', 'edition_count_asc', 'edition_count_desc' (default: 'edition_count_asc')
 * @returns Promise<Book[]> - Array of book objects
 * @throws Error when API call fails or returns error
 */
export async function searchBooks(query: string, limit: number = 20, sort: 'relevance' | 'edition_count_asc' | 'edition_count_desc' = 'edition_count_asc'): Promise<Book[]> {
  if (!query.trim()) {
    throw new Error('Search query cannot be empty');
  }

  try {
    // Build URL with sort parameter
    let url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}`;
    
    if (sort === 'edition_count_desc') {
      url += '&sort=editions';
    }

    const response = await fetch(url);

    const data: any = await response.json();

    // Check for API error in response
    if (data.error) {
      throw new Error(`OpenLibrary API error: ${data.error}`);
    }

    // Handle API response with error message
    if (data.message && typeof data.message === 'string') {
      throw new Error(`Search failed: ${data.message}`);
    }

    const books = Array.isArray(data.docs) ? data.docs : [];

    // Additional validation - check if response has expected structure
    if (books.length === 0 && data.numFound === undefined) {
      throw new Error('Invalid response format from OpenLibrary API');
    }

    // Sort results based on the sort parameter
    if (sort === 'edition_count_asc') {
      books.sort((a: Book, b: Book) => (a.edition_count || 0) - (b.edition_count || 0));
    }
    // For 'edition_count_desc', we already sorted via API
    // For 'relevance', use default order from API

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

    const data: any = await response.json();

    // Check for API error in response
    if (data.error) {
      throw new Error(`OpenLibrary API error: ${data.error}`);
    }

    // Handle API response with error message
    if (data.message && typeof data.message === 'string') {
      throw new Error(`Failed to fetch editions: ${data.message}`);
    }

    const editions = Array.isArray(data.entries) ? data.entries : [];

    // Additional validation - check if response has expected structure
    if (editions.length === 0 && data.size === undefined) {
      throw new Error('Invalid response format from OpenLibrary API');
    }

    return editions;
  } catch (error) {
    // Re-throw with more context if it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to OpenLibrary. Please check your internet connection.');
    }
    throw error;
  }
}

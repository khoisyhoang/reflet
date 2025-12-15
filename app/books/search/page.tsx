import { searchBooks } from './services/bookService';

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';

  let books: any[] = [];
  let error: string | null = null;

  if (query) {
    try {
      books = await searchBooks(query, 20, 'edition_count_desc');
    } catch (err) {
      error = err instanceof Error ? err.message : 'An error occurred while searching';
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-heading font-black text-primary mb-8">
          Search Results
        </h1>
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-4 border-primary rounded-lg p-6 shadow-[0_0_20px_rgba(0,255,255,0.3)]">
          <p className="text-lg font-sans text-foreground">
            Searching for: <span className="font-bold text-secondary">"{query}"</span>
          </p>
          {error ? (
            <p className="text-red-500 mt-4">{error}</p>
          ) : !query ? (
            <p className="text-muted-foreground mt-4">Enter a search query to find books.</p>
          ) : books.length === 0 ? (
            <p className="text-muted-foreground mt-4">No books found for "{query}".</p>
          ) : (
            <div className="mt-6 space-y-4">
              {books.map((book, index) => (
                <div key={book.key || index} className="bg-background/50 border border-primary/20 rounded-lg p-4 hover:bg-primary/5 transition-colors">
                  <h3 className="text-xl font-heading font-bold text-primary mb-2">
                    {book.title}
                  </h3>
                  {book.author_name && book.author_name.length > 0 && (
                    <p className="text-foreground mb-2">
                      <span className="font-semibold">Author:</span> {book.author_name.join(', ')}
                    </p>
                  )}
                  {book.first_publish_year && (
                    <p className="text-foreground mb-2">
                      <span className="font-semibold">Published:</span> {book.first_publish_year}
                    </p>
                  )}
                  {book.edition_count && (
                    <p className="text-foreground mb-2">
                      <span className="font-semibold">Editions:</span> {book.edition_count}
                    </p>
                  )}
                  {book.publisher && book.publisher.length > 0 && (
                    <p className="text-foreground mb-2">
                      <span className="font-semibold">Publisher:</span> {book.publisher[0]}
                    </p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <a
                      href={`https://openlibrary.org/${book.key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary hover:text-secondary/80 underline text-sm"
                    >
                      View on Open Library
                    </a>
                    <a
                      href={`/books/search/editions?work=${book.key.replace('/works/', '')}`}
                      className="text-primary hover:text-primary/80 underline text-sm"
                    >
                      View Editions ({book.edition_count || 0})
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

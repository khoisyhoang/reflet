import { fetchWorkEditions } from '../services/bookService';

interface EditionsPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function EditionsPage({ searchParams }: EditionsPageProps) {
  const params = await searchParams;
  const workId = params.work || '';

  let editions: any[] = [];
  let error: string | null = null;
  let workTitle = '';

  if (workId) {
    try {
      editions = await fetchWorkEditions(workId, 50);

      // Get work title from the first edition if available
      if (editions.length > 0) {
        workTitle = editions[0].title || 'Unknown Work';
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'An error occurred while fetching editions';
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <a
            href="/books/search"
            className="text-secondary hover:text-secondary/80 underline mb-4 inline-block"
          >
            ← Back to Search Results
          </a>
        </div>

        <h1 className="text-4xl font-heading font-black text-primary mb-4">
          Editions
        </h1>

        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-4 border-primary rounded-lg p-6 shadow-[0_0_20px_rgba(0,255,255,0.3)]">
          <p className="text-lg font-sans text-foreground mb-6">
            {workTitle ? `Available editions for "${workTitle}"` : 'Select a work to view its editions'}
            {workId && (
              <span className="block text-sm text-muted-foreground mt-2">
                Work ID: {workId}
              </span>
            )}
          </p>

          {error ? (
            <p className="text-red-500">{error}</p>
          ) : !workId ? (
            <p className="text-muted-foreground">No work selected.</p>
          ) : editions.length === 0 ? (
            <p className="text-muted-foreground">No editions found for this work.</p>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Found {editions.length} edition{editions.length !== 1 ? 's' : ''}
              </p>

              {editions.map((edition, index) => (
                <div key={edition.key || index} className="bg-background/50 border border-primary/20 rounded-lg p-4 hover:bg-primary/5 transition-colors">
                  <h3 className="text-xl font-heading font-bold text-primary mb-2">
                    {edition.title || 'Untitled Edition'}
                  </h3>

                  {edition.publishers && edition.publishers.length > 0 && (
                    <p className="text-foreground mb-2">
                      <span className="font-semibold">Publisher:</span> {edition.publishers.join(', ')}
                    </p>
                  )}

                  {edition.publish_date && (
                    <p className="text-foreground mb-2">
                      <span className="font-semibold">Published:</span> {edition.publish_date}
                    </p>
                  )}

                  {edition.number_of_pages && (
                    <p className="text-foreground mb-2">
                      <span className="font-semibold">Pages:</span> {edition.number_of_pages}
                    </p>
                  )}

                  {edition.languages && edition.languages.length > 0 && (
                    <p className="text-foreground mb-2">
                      <span className="font-semibold">Languages:</span> {edition.languages.map((lang: any) =>
                        typeof lang === 'string' ? lang.toUpperCase() :
                        (lang.key || '').replace('/languages/', '').toUpperCase()
                      ).join(', ')}
                    </p>
                  )}

                  {(edition.isbn_10 || edition.isbn_13) && (
                    <div className="text-foreground mb-2">
                      <span className="font-semibold">ISBN:</span>
                      {edition.isbn_10 && edition.isbn_10.length > 0 && (
                        <span className="ml-2">ISBN-10: {edition.isbn_10.join(', ')}</span>
                      )}
                      {edition.isbn_13 && edition.isbn_13.length > 0 && (
                        <span className={`${edition.isbn_10 ? 'ml-4' : 'ml-2'}`}>
                          ISBN-13: {edition.isbn_13.join(', ')}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 mt-2">
                    <a
                      href={`https://openlibrary.org/${edition.key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary hover:text-secondary/80 underline text-sm"
                    >
                      View on Open Library
                    </a>

                    {edition.isbn_13 && edition.isbn_13.length > 0 && (
                      <a
                        href={`https://www.worldcat.org/isbn/${edition.isbn_13[0]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 underline text-sm"
                      >
                        Find in Libraries
                      </a>
                    )}
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

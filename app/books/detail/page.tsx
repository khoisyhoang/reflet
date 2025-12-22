import { fetchWorkEditions, fetchWork } from '../services/bookService';
import Image from 'next/image';
import Link from 'next/link';

interface DetailPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function DetailPage({ searchParams }: DetailPageProps) {
  const params = await searchParams;
  const workId = params.work || '';

  let edition: any = null;
  let error: string | null = null;
  let workTitle = '';
  let workCovers: number[] = [];

  if (workId) {
    try {
      // Fetch work data first
      const work = await fetchWork(workId);
      workTitle = work.title || 'Unknown Work';
      workCovers = work.covers || [];

      // Fetch editions and get the first one
      const editions = await fetchWorkEditions(workId, 1); // Get just the first edition
      if (editions.length > 0) {
        edition = editions[0];
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'An error occurred while fetching data';
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/search"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            ← Back to Search Results
          </Link>

          <div className="text-center mb-12">
            <h1 className="text-5xl font-heading font-black text-primary mb-4 tracking-tight">
              Book Details
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              View edition details and start reading
            </p>
          </div>
        </div>

        {error ? (
          <div className="text-center py-12">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        ) : !workId ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No work selected</p>
          </div>
        ) : !edition ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No edition found for this work</p>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Edition Cover */}
              <div className="flex-shrink-0 mx-auto lg:mx-0">
                {edition.covers && edition.covers.length > 0 ? (
                  <Image
                    src={`https://covers.openlibrary.org/b/id/${edition.covers[0]}-L.jpg`}
                    alt={`Cover of ${edition.title || 'Edition'}`}
                    width={200}
                    height={300}
                    className="rounded-lg shadow-lg border border-white/20"
                  />
                ) : (
                  <div className="w-48 h-72 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center border border-white/20">
                    <div className="text-6xl text-primary/40">📚</div>
                  </div>
                )}
              </div>

              {/* Edition Details */}
              <div className="flex-1">
                <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
                  {edition.title || 'Untitled Edition'}
                </h2>
                <h3 className="text-xl text-muted-foreground mb-4">
                  {workTitle}
                </h3>

                {edition.author_name && edition.author_name.length > 0 && (
                  <p className="text-lg text-muted-foreground mb-4">
                    by {edition.author_name.join(', ')}
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {edition.publishers && edition.publishers.length > 0 && (
                    <div>
                      <span className="font-semibold text-foreground">Publisher:</span>
                      <p className="text-muted-foreground">{edition.publishers.join(', ')}</p>
                    </div>
                  )}

                  {edition.publish_date && (
                    <div>
                      <span className="font-semibold text-foreground">Publish Date:</span>
                      <p className="text-muted-foreground">{edition.publish_date}</p>
                    </div>
                  )}

                  {edition.number_of_pages && (
                    <div>
                      <span className="font-semibold text-foreground">Pages:</span>
                      <p className="text-muted-foreground">{edition.number_of_pages}</p>
                    </div>
                  )}

                  {edition.languages && edition.languages.length > 0 && (
                    <div>
                      <span className="font-semibold text-foreground">Language:</span>
                      <p className="text-muted-foreground">
                        {edition.languages.map((lang: any) =>
                          typeof lang === 'string' ? lang.toUpperCase() :
                          (lang.key || '').replace('/languages/', '').toUpperCase()
                        ).join(', ')}
                      </p>
                    </div>
                  )}
                </div>

                {(edition.isbn_10 || edition.isbn_13) && (
                  <div className="mb-6">
                    <span className="font-semibold text-foreground">ISBN:</span>
                    <p className="text-muted-foreground">
                      {edition.isbn_13 && edition.isbn_13.length > 0 && edition.isbn_13[0]}
                      {edition.isbn_10 && edition.isbn_10.length > 0 && edition.isbn_13 && edition.isbn_13.length > 0 && ' / '}
                      {edition.isbn_10 && edition.isbn_10.length > 0 && edition.isbn_10[0]}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-4">
                  <Link
                    href={`/books/reading-session?work=${workId}`}
                    className="bg-green-600/80 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Start Reading
                  </Link>

                  <Link
                    href={`/books/editions?work=${workId}`}
                    className="bg-primary/80 hover:bg-primary text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Change Editions
                  </Link>

                  <Link
                    href={`https://openlibrary.org/${edition.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium backdrop-blur-sm transition-colors"
                  >
                    View on OpenLibrary
                  </Link>

                  {edition.isbn_13 && edition.isbn_13.length > 0 && (
                    <Link
                      href={`https://www.worldcat.org/isbn/${edition.isbn_13[0]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600/80 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Find in Libraries
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

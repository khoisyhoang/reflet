import { fetchWorkEditions, fetchWork } from '../services/bookService';
import Image from 'next/image';
import Link from 'next/link';

interface EditionsPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function EditionsPage({ searchParams }: EditionsPageProps) {
  const params = await searchParams;
  const workId = params.work || '';

  let editions: any[] = [];
  let error: string | null = null;
  let workTitle = '';
  let workCovers: number[] = [];

  if (workId) {
    try {
      // Fetch work data first
      const work = await fetchWork(workId);
      workTitle = work.title || 'Unknown Work';
      workCovers = work.covers || [];

      // Then fetch editions
      editions = await fetchWorkEditions(workId, 50);

      // If we didn't get work title from work data, try from first edition
      if (!workTitle && editions.length > 0) {
        workTitle = editions[0].title || 'Unknown Work';
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'An error occurred while fetching data';
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans p-6">
      <div className="max-w-7xl mx-auto">
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
              Book Editions
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore different editions of this classic work
            </p>
          </div>
        </div>

        {/* Work Info Section */}
        {workId && workTitle && (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl mb-12">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Work Cover */}
              {workCovers && workCovers.length > 0 ? (
                <div className="flex-shrink-0">
                  <Image
                    src={`https://covers.openlibrary.org/b/id/${workCovers[0]}-L.jpg`}
                    alt={`Cover of ${workTitle}`}
                    width={140}
                    height={200}
                    className="rounded-lg shadow-lg border border-white/20"
                  />
                </div>
              ) : (
                <div className="w-32 h-44 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center border border-white/20">
                  <div className="text-5xl text-primary/40">📚</div>
                </div>
              )}

              {/* Work Details */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                  {workTitle}
                </h2>
                <p className="text-lg text-muted-foreground mb-4">
                  Available editions and formats
                </p>
                <div className="text-sm text-muted-foreground">
                  Work ID: <span className="font-mono text-primary">{workId}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Editions Grid */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl">
          {error ? (
            <div className="text-center py-12">
              <p className="text-red-400 text-lg">{error}</p>
            </div>
          ) : !workId ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No work selected</p>
            </div>
          ) : editions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No editions found for this work</p>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center">
                <p className="text-lg text-foreground/80">
                  Found <span className="font-semibold text-primary">{editions.length}</span> edition{editions.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="space-y-4">
                {editions.map((edition, index) => (
                  <div key={edition.key || index} className="group">
                    <div className="bg-white/5 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/10">
                      <div className="flex flex-col md:flex-row">
                        {/* Edition Cover */}
                        <div className="md:w-48 flex-shrink-0 p-4">
                          <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                            {edition.covers && edition.covers.length > 0 ? (
                              <Image
                                src={`https://covers.openlibrary.org/b/id/${edition.covers[0]}-L.jpg`}
                                alt={`Cover of ${edition.title || 'Edition'}`}
                                fill
                                className="object-contain group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center relative">
                                {/* Book-like rectangle */}
                                <div className="absolute inset-2 border-4 border-primary/30 rounded-lg shadow-lg bg-gradient-to-br from-primary/10 to-primary/5 flex flex-col items-center justify-center p-4 text-center">
                                  {/* Book spine effect */}
                                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary/40 rounded-l-lg"></div>
                                  
                                  <h3 className="font-heading font-bold text-foreground text-sm mb-2 leading-tight">
                                    {edition.title || 'Untitled Edition'}
                                  </h3>
                                  {edition.publishers && edition.publishers.length > 0 && (
                                    <p className="text-xs text-muted-foreground leading-tight">
                                      {edition.publishers[0]}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Edition Details */}
                        <div className="flex-1 p-6">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between h-full">
                            <div className="flex-1 space-y-4">
                              {/* Title and Publisher */}
                              <div>
                                <h3 className="font-heading font-bold text-foreground text-xl mb-2 group-hover:text-primary transition-colors leading-tight">
                                  {edition.title || 'Untitled Edition'}
                                </h3>
                                {edition.publishers && edition.publishers.length > 0 && (
                                  <p className="text-sm text-muted-foreground font-medium">
                                    by {edition.publishers.join(', ')}
                                  </p>
                                )}
                              </div>

                              {/* Key Details Grid */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {edition.publish_date && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <div className="w-2 h-2 bg-primary/60 rounded-full"></div>
                                    <span className="text-muted-foreground">Published:</span>
                                    <span className="font-medium text-foreground">{edition.publish_date}</span>
                                  </div>
                                )}
                                {edition.number_of_pages && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <div className="w-2 h-2 bg-primary/60 rounded-full"></div>
                                    <span className="text-muted-foreground">Pages:</span>
                                    <span className="font-medium text-foreground">{edition.number_of_pages}</span>
                                  </div>
                                )}
                                {edition.languages && edition.languages.length > 0 && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <div className="w-2 h-2 bg-primary/60 rounded-full"></div>
                                    <span className="text-muted-foreground">Language:</span>
                                    <span className="font-medium text-foreground">
                                      {edition.languages.map((lang: any) =>
                                        typeof lang === 'string' ? lang.toUpperCase() :
                                        (lang.key || '').replace('/languages/', '').toUpperCase()
                                      ).join(', ')}
                                    </span>
                                  </div>
                                )}
                                {edition.physical_format && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <div className="w-2 h-2 bg-primary/60 rounded-full"></div>
                                    <span className="text-muted-foreground">Format:</span>
                                    <span className="font-medium text-foreground">{edition.physical_format}</span>
                                  </div>
                                )}
                              </div>

                              {/* ISBN Section */}
                              {(edition.isbn_10 || edition.isbn_13) && (
                                <div className="bg-muted/20 rounded-lg p-3 border border-muted/30">
                                  <div className="text-xs text-muted-foreground mb-2 font-medium">ISBN</div>
                                  <div className="space-y-1">
                                    {edition.isbn_13 && edition.isbn_13.length > 0 && (
                                      <div className="text-sm font-mono text-foreground">
                                        ISBN-13: {edition.isbn_13[0]}
                                      </div>
                                    )}
                                    {edition.isbn_10 && edition.isbn_10.length > 0 && (
                                      <div className="text-sm font-mono text-foreground">
                                        ISBN-10: {edition.isbn_10[0]}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Additional Details */}
                              {(edition.weight || (edition.dimensions && edition.dimensions.length > 0)) && (
                                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                                  {edition.weight && (
                                    <div className="flex items-center gap-1">
                                      <span className="font-medium">Weight:</span>
                                      <span>{edition.weight}</span>
                                    </div>
                                  )}
                                  {edition.dimensions && edition.dimensions.length > 0 && (
                                    <div className="flex items-center gap-1">
                                      <span className="font-medium">Dimensions:</span>
                                      <span>{edition.dimensions.join(' × ')}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-2 mt-4 md:mt-0 md:ml-6">
                              <Link
                                href={`/books/detail?work=${workId}&edition=${edition.key.replace('/books/', '')}`}
                                className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors text-center"
                              >
                                Switch to this Edition
                              </Link>
                              <Link
                                href={`https://openlibrary.org/${edition.key}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg text-sm font-medium backdrop-blur-sm transition-colors text-center"
                              >
                                View on Open Library
                              </Link>
                              {edition.isbn_13 && edition.isbn_13.length > 0 && (
                                <Link
                                  href={`https://www.worldcat.org/isbn/${edition.isbn_13[0]}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-blue-600/80 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors text-center"
                                >
                                  Find in Libraries
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

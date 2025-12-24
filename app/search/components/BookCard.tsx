
import Link from 'next/link';
import Image from 'next/image';
import QuickActions from './QuickActions';

interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  edition_count?: number;
  editions?: any; // EditionsResponse
  subject?: string[];
}

interface BookCardProps {
  book: Book;
  index: number;
}

export default function BookCard({ book, index }: BookCardProps) {
  return (
    <Link href={`/books/${book.key.replace('/works/', '')}`} className="group block">
      <div className="bg-white/5 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-white/10">
        <div className="flex">
          {/* Book Cover */}
          <div className="flex-shrink-0 w-32 h-48 relative overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 m-6 rounded-lg">
            {book.cover_i ? (
              <Image
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`}
                alt={`Cover of ${book.title}`}
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-300 rounded-lg"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center relative">
                {/* Book-like rectangle */}
                <div className="absolute inset-4 border-4 border-primary/30 rounded-lg shadow-lg bg-gradient-to-br from-primary/10 to-primary/5 flex flex-col items-center justify-center p-4 text-center">
                  {/* Book spine effect */}
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary/40 rounded-l-lg"></div>

                  <h3 className="font-heading font-bold text-foreground text-sm mb-2 leading-tight">
                    {book.title}
                  </h3>
                  {book.author_name && book.author_name.length > 0 && (
                    <p className="text-xs text-muted-foreground leading-tight">
                      by {book.author_name.join(', ')}
                    </p>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Book Info */}
          <div className="flex-1 p-6 pt-8">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-heading font-bold text-foreground text-xl overflow-hidden text-ellipsis whitespace-nowrap group-hover:text-primary transition-colors flex-1 mr-2">
                {book.title}
              </h3>
              <button className="flex-shrink-0 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors group/btn">
                <svg
                  className="w-5 h-5 text-muted-foreground group-hover/btn:text-primary transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>

            {book.author_name && book.author_name.length > 0 && (
              <p className="text-base text-muted-foreground mb-3 overflow-hidden text-ellipsis whitespace-nowrap">
                by {book.author_name.join(', ')}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              {book.first_publish_year && (
                <span className="bg-muted/50 px-2 py-1 rounded-full">{book.first_publish_year}</span>
              )}
              {book.edition_count && (
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                  {book.edition_count} editions
                </span>
              )}
            </div>

            {book.subject && book.subject.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {book.subject.slice(0, 5).map((subject, idx) => (
                  <span
                    key={idx}
                    className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 dark:from-blue-900/30 dark:to-purple-900/30 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium border border-blue-200 dark:border-blue-800/50 shadow-sm"
                  >
                    {subject}
                  </span>
                ))}
                {book.subject.length > 5 && (
                  <span className="text-muted-foreground text-xs font-medium px-2 py-1">
                    +{book.subject.length - 5} more
                  </span>
                )}
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex gap-3 mt-4">
              <QuickActions workId={book.key.replace('/works/', '')} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

import Link from 'next/link';
import Image from 'next/image';

interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  edition_count?: number;
}

interface BookCardProps {
  book: Book;
  index: number;
}

export default function BookCard({ book, index }: BookCardProps) {
  return (
    <div key={book.key || index} className="group">
      <div className="bg-white/5 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/10">
        {/* Book Cover */}
        <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
          {book.cover_i ? (
            <Image
              src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`}
              alt={`Cover of ${book.title}`}
              fill
              className="object-contain group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center relative">
              {/* Book-like rectangle */}
              <div className="absolute inset-4 border-4 border-primary/30 rounded-lg shadow-lg bg-gradient-to-br from-primary/10 to-primary/5 flex flex-col items-center justify-center p-4 text-center">
                {/* Book spine effect */}
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary/40 rounded-l-lg"></div>

                <h3 className="font-heading font-bold text-foreground text-lg mb-2 leading-tight">
                  {book.title}
                </h3>
                {book.author_name && book.author_name.length > 0 && (
                  <p className="text-sm text-muted-foreground leading-tight">
                    by {book.author_name.join(', ')}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Overlay with quick actions */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex gap-3">
              <Link
                href={`https://openlibrary.org/${book.key}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg text-sm font-medium backdrop-blur-sm transition-colors"
              >
                View
              </Link>
              <Link
                href={`/books/search/editions?work=${book.key.replace('/works/', '')}`}
                className="bg-primary/80 hover:bg-primary text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Editions
              </Link>
            </div>
          </div>
        </div>

        {/* Book Info */}
        <div className="p-4">
          <h3 className="font-heading font-bold text-foreground text-lg mb-2 overflow-hidden text-ellipsis whitespace-nowrap group-hover:text-primary transition-colors">
            {book.title}
          </h3>

          {book.author_name && book.author_name.length > 0 && (
            <p className="text-sm text-muted-foreground mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
              by {book.author_name.join(', ')}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {book.first_publish_year && (
              <span>{book.first_publish_year}</span>
            )}
            {book.edition_count && (
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                {book.edition_count} editions
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

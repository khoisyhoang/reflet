import { searchBooks } from '@/app/books/services/bookService';
import BookCard from './BookCard';
import SortSelector from './SortSelector';

interface BookGridProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function BookGrid({ searchParams }: BookGridProps) {
  const params = await searchParams;
  const query = params.q;
  const sort = params.sort || 'rating';

  let books: any[] = [];
  
  try {
    books = await searchBooks(query, 20, sort);
  } catch (err) {
    console.error('Error fetching books:', err);
  }

  if (books.length === 0) {
    return (
      <div>
        {/* {query && <SortSelector currentSort={sort} />} */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl">
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No books found</div>
            <div className="text-gray-500 text-sm">
              Try adjusting your search terms or check for typos
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* {query && <SortSelector currentSort={sort} />} */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl">
        <div className="grid grid-cols-1 gap-6">
          {books.map((book, index) => (
            <BookCard key={book.key || index} book={book} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

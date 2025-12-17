import { searchBooks } from '../services/bookService';
import BookCard from './BookCard';

interface BookGridProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function BookGrid({ searchParams }: BookGridProps) {
  const params = await searchParams;
  const query = params.q || '';

  let books: any[] = [];

  if (query) {
    try {
      books = await searchBooks(query, 20);
    } catch (err) {
      // For now, just log the error - we could add error handling later
      console.error('Error fetching books:', err);
    }
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {books.map((book, index) => (
          <BookCard key={book.key || index} book={book} index={index} />
        ))}
      </div>
    </div>
  );
}

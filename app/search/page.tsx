import { Suspense } from 'react';
import Link from 'next/link';
import SearchBar from '../components/SearchBar';
import BookGrid from './components/BookGrid';
import BookGridSkeleton from './components/BookGridSkeleton';

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';

  return (
    <div className="min-h-screen bg-background text-foreground font-sans p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Link href="/books/my-books" className="text-primary hover:underline mb-4 inline-block mr-4">
            My Books
          </Link>
          <h1 className="text-5xl font-heading font-black text-primary mb-4 tracking-tight">
            Book Discovery
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Find your next great read from millions of books
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar />

        {query !== "" && <div className="mb-8">
          <p className="text-lg text-foreground/80">
            Searching for: <span className="font-semibold text-primary">"{query}"</span>
          </p>
        </div>}

        <Suspense fallback={<BookGridSkeleton />} key={query}>
          <BookGrid searchParams={searchParams}/>
        </Suspense>
      </div>
    </div>
  );
}

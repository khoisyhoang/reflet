import { Suspense } from 'react';
import SearchBar from '../../components/SearchBar';
import BookGrid from '../components/BookGrid';
import BookGridSkeleton from '../components/BookGridSkeleton';

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

        {query.length < 3 ? (
          <p className="text-lg font-semibold text-red-500">
            Please enter a search term with at least 3 characters.
          </p>
        ) : (
          <Suspense fallback={<BookGridSkeleton />} key={query}>
            <BookGrid searchParams={searchParams}/>
          </Suspense>
        )}
      </div>
    </div>
  );
}

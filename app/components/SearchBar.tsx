'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery.length < 3) {
      setError('Please enter a search term with at least 3 characters.');
      return;
    }
    setError('');
    router.push(`/books/search?q=${encodeURIComponent(trimmedQuery)}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-16">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          placeholder="Search for books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-6 py-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 backdrop-blur-xs border-2 border-primary/30 text-foreground font-sans text-lg placeholder-text-muted focus:outline-none focus:border-primary/60 focus:shadow-[0_0_15px_rgba(0,255,255,0.4)] transition-all duration-300 rounded-full shadow-[0_0_10px_rgba(0,255,255,0.2)] hover:shadow-[0_0_15px_rgba(255,0,128,0.3)]"
        />
        <button type="submit" className="absolute right-6 top-1/2 transform -translate-y-1/2 text-accent">
          <Search size={20} />
        </button>
      </form>
      {error && (
        <p className="text-lg font-semibold text-red-500 mt-4 text-center">
          {error}
        </p>
      )}
    </div>
  );
}

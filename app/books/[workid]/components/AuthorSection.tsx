'use client';

import { useState } from 'react';
import Link from 'next/link';

interface AuthorSectionProps {
  workAuthors: Array<{ key: string; name: string }>;
  edition: any;
}

export default function AuthorSection({ workAuthors, edition }: AuthorSectionProps) {
  const [showFullAuthorBio, setShowFullAuthorBio] = useState(false);

  if (!edition.author_name || edition.author_name.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white">About the author</h3>
      {workAuthors.length > 0 ? (
        workAuthors.map((author, index) => (
          <div key={author.key} className="flex gap-4">
            {/* Mock author avatar */}
            <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center text-2xl">
              👤
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-4">
                <Link
                  href={`https://openlibrary.org${author.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline font-medium"
                >
                  {author.name}
                </Link>
                <button className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
                  Follow
                </button>
              </div>
              <div className="text-sm text-gray-400">
                <span className="font-semibold">1.2M</span> followers • <span className="font-semibold">45</span> books
              </div>
              <div className={`text-gray-300 leading-relaxed ${!showFullAuthorBio ? 'line-clamp-2' : ''}`}>
                {/* Mock bio */}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </div>
              <button
                onClick={() => setShowFullAuthorBio(!showFullAuthorBio)}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                {showFullAuthorBio ? 'Show less' : 'Show more'}
              </button>
            </div>
          </div>
        ))
      ) : (
        <div>{edition.author_name.join(', ')}</div>
      )}
    </div>
  );
}

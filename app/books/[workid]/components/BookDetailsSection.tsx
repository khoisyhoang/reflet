'use client';

import { useState } from 'react';

interface BookDetailsSectionProps {
  edition: any;
  workFirstPublishDate: string | null;
}

export default function BookDetailsSection({ edition, workFirstPublishDate }: BookDetailsSectionProps) {
  const [showBookDetails, setShowBookDetails] = useState(false);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        {edition.number_of_pages && (
          <div>
            <span className="font-semibold text-gray-300">Pages:</span>
            <span className="text-gray-400 ml-2">{edition.number_of_pages}</span>
          </div>
        )}
        {edition.publish_date && (
          <div>
            <span className="font-semibold text-gray-300">Published:</span>
            <span className="text-gray-400 ml-2">{edition.publish_date}</span>
          </div>
        )}
        {workFirstPublishDate && (
          <div>
            <span className="font-semibold text-gray-300">First Published:</span>
            <span className="text-gray-400 ml-2">{workFirstPublishDate}</span>
          </div>
        )}
        <div>
          <span className="font-semibold text-gray-300">Format:</span>
          <span className="text-gray-400 ml-2">Paperback</span> {/* Mock */}
        </div>
      </div>
      <button
        onClick={() => setShowBookDetails(!showBookDetails)}
        className="text-blue-400 hover:text-blue-300 text-sm font-medium"
      >
        {showBookDetails ? 'Hide' : 'Show'} Book details & editions
      </button>
      {showBookDetails && (
        <div className="space-y-2 text-sm text-gray-400">
          {/* Additional details */}
          {edition.isbn_10 && edition.isbn_10.length > 0 && (
            <div>
              <span className="font-semibold text-gray-300">ISBN-10:</span>
              <span className="ml-2 font-mono">{edition.isbn_10[0]}</span>
            </div>
          )}
          {edition.isbn_13 && edition.isbn_13.length > 0 && (
            <div>
              <span className="font-semibold text-gray-300">ISBN-13:</span>
              <span className="ml-2 font-mono">{edition.isbn_13[0]}</span>
            </div>
          )}
          {edition.languages && edition.languages.length > 0 && (
            <div>
              <span className="font-semibold text-gray-300">Language:</span>
              <span className="ml-2">{edition.languages[0]?.key?.split('/').pop().toUpperCase() || 'Unknown'}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

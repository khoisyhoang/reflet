'use client';

import { useState } from 'react';

interface DescriptionSectionProps {
  description: string | null;
}

export default function DescriptionSection({ description }: DescriptionSectionProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  if (!description) return null;

  return (
    <div className="space-y-4">
      <div
        className={`text-gray-300 leading-relaxed ${!showFullDescription ? 'line-clamp-3' : ''}`}
        dangerouslySetInnerHTML={{
          __html: description.length > 300 && !showFullDescription
            ? description.substring(0, 300) + '...'
            : description
        }}
      />
      {description.length > 300 && (
        <button
          onClick={() => setShowFullDescription(!showFullDescription)}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium"
        >
          {showFullDescription ? 'Show less' : '...more'}
        </button>
      )}
    </div>
  );
}

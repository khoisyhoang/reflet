"use client";

import { useRef, useState } from 'react';
import ePub from 'epubjs';

export default function UploadPage() {
  const viewerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [epubBook, setEpubBook] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.epub')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const book = ePub(arrayBuffer);
        setEpubBook(book);

        if (viewerRef.current) {
          const rendition = book.renderTo(viewerRef.current, {
            flow: 'paginated',
            width: '100%',
            height: '100%',
          });

          rendition.display();

          // Track location changes
          rendition.on('relocated', (location: any) => {
            setCurrentLocation(location.start.cfi);
          });

          console.log(`${file.name} file loaded and ready for reading.`);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      console.error('Please select a valid .epub file.');
    }
  };

  const navigateNext = () => {
    if (epubBook?.rendition) {
      epubBook.rendition.next();
    }
  };

  const navigatePrev = () => {
    if (epubBook?.rendition) {
      epubBook.rendition.prev();
    }
  };

  return (
    <div>
      <div className="max-w-3xl mx-auto mb-8">
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-4xl mb-4">📁</div>
          <p className="text-lg mb-2">Click to select file to upload</p>
          <p className="text-sm text-gray-500">
            Support for a single .epub file upload. Strictly prohibited from uploading company data or other banned files.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".epub"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Navigation Controls */}
      {epubBook && (
        <div className="max-w-3xl mx-auto mb-4 flex justify-center items-center gap-4">
          <button
            onClick={navigatePrev}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
            disabled={!currentLocation}
          >
            ← Previous
          </button>
          <span className="text-sm text-gray-600">
            {currentLocation ? 'Reading...' : 'Loading...'}
          </span>
          <button
            onClick={navigateNext}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
            disabled={!currentLocation}
          >
            Next →
          </button>
        </div>
      )}

      <div id="viewer" ref={viewerRef} className="max-w-3xl mx-auto bg-white" style={{ height: '600px', border: '1px solid #ccc' }}></div>
    </div>
  );
}
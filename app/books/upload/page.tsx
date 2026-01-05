"use client";

import { useRef, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, FileText } from 'lucide-react';
import ePub from 'epubjs';

export default function UploadPage() {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [epubBook, setEpubBook] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.name.endsWith('.epub')) {
      setUploadStatus('Processing...');
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const book = ePub(arrayBuffer);
        setEpubBook(book);

        if (viewerRef.current) {
          // Clear previous content
          viewerRef.current.innerHTML = '';

          const rendition = book.renderTo(viewerRef.current, {
            flow: 'paginated',
            width: '100%',
            height: '100%',
          });

          rendition.display();

          rendition.on('relocated', (location: any) => {
            setCurrentLocation(location.start.cfi);
          });

          console.log(`${file.name} file loaded and ready for reading.`);
          setUploadStatus('File loaded successfully');
        }
      };
      reader.onerror = () => {
        setUploadStatus('Failed to read file');
      };
      reader.readAsArrayBuffer(file);
    } else {
      setUploadStatus('Please select a valid .epub file');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/epub+zip': ['.epub']
    },
    maxFiles: 1,
    multiple: false
  });

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
    <div className="container mx-auto p-4">
      <div className="max-w-3xl mx-auto mb-8">
        <Card className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            {isDragActive ? (
              <p className="text-lg font-medium">Drop the EPUB file here...</p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">Drag & drop an EPUB file here, or click to select</p>
                <p className="text-sm text-muted-foreground">Only .epub files are supported</p>
              </div>
            )}
          </div>
          {uploadStatus && (
            <p className={`mt-4 text-center ${uploadStatus.includes('successfully') ? 'text-green-600' : uploadStatus.includes('Failed') || uploadStatus.includes('Please') ? 'text-red-600' : 'text-blue-600'}`}>
              {uploadStatus}
            </p>
          )}
        </Card>
      </div>

      {/* Navigation Controls */}
      {epubBook && (
        <div className="max-w-3xl mx-auto mb-4 flex justify-center items-center gap-4">
          <Button
            onClick={navigatePrev}
            variant="outline"
            disabled={!currentLocation}
          >
            ← Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentLocation ? 'Reading...' : 'Loading...'}
          </span>
          <Button
            onClick={navigateNext}
            variant="outline"
            disabled={!currentLocation}
          >
            Next →
          </Button>
        </div>
      )}

      <Card className="max-w-3xl mx-auto p-4">
        <div id="viewer" ref={viewerRef} className="w-full bg-background rounded" style={{ height: '600px' }}></div>
      </Card>
    </div>
  );
}
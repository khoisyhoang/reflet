'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BookOpen } from 'lucide-react';
import UploadModal from './UploadModal';
import { checkAuth } from '@/app/(auth)/utils/auth';
import { useAuthStore } from '@/store/auth-store';
import { uploadEpubToS3 } from '../../services/uploadService';
import { usePathname } from 'next/navigation';

interface BookSidebarProps {
  edition: any;
}

export default function BookSidebar({ edition }: BookSidebarProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const accessToken = useAuthStore((state) => state.accessToken);
  const pathname = usePathname();

  const handleFileSelected = async (file: File) => {
    const url = await uploadEpubToS3(file, `books/${file.name}`);
    if (url.code === 'success') {
      setUploadedFile(file);
      setShowUploadModal(false);
      return { code: 'success' as const, message: 'File uploaded successfully', data: { url: url.data.url } };
    } else {
      return { code: 'error' as const, message: 'Failed to upload file', data: { url: null } };
    }
  };

  return (
    <>
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onFileSelected={handleFileSelected}
        />
      )}

      {/* Large Book Cover */}
      <div className="flex justify-center mb-6">
        {(edition.cover_i || (edition.covers && edition.covers.length > 0)) ? (
          <div className="relative rounded-2xl shadow-lg">
            <Image
              src={`https://covers.openlibrary.org/b/id/${edition.cover_i || edition.covers[0]}-L.jpg`}
              alt={`Cover of ${edition.title || 'Edition'}`}
              width={280}
              height={420}
              className="object-cover rounded-2xl"
              priority
            />
          </div>
        ) : (
          <div className="w-[280px] h-[420px] bg-gray-700 rounded-2xl flex items-center justify-center relative">
            <div className="absolute inset-4 border-4 border-primary/30 rounded-lg shadow-lg bg-gradient-to-br from-primary/10 to-primary/5 flex flex-col items-center justify-center p-4 text-center">
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary/40 rounded-l-lg"></div>
              <h3 className="font-heading font-bold text-foreground text-lg mb-2 leading-tight">
                {edition.title || 'Unknown Title'}
              </h3>
            </div>
          </div>
        )}
      </div>

      <div className="backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl w-[280px] p-3">
        <div className="space-y-6">
        {/* Read Button */}
        <div className="space-y-2">
          <button
            onClick={async () => {
              await checkAuth(accessToken || '', pathname);
              setShowUploadModal(true);
            }}
            className="w-full bg-green-600 hover:bg-green-500 text-white px-4 py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            {uploadedFile ? 'Continue Reading' : 'Read'}
          </button>
          {uploadedFile && (
            <p className="text-xs text-gray-500 text-center truncate px-1">
              {uploadedFile.name}
            </p>
          )}
        </div>

      {/* Shop this Series Button */}
      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        Shop this Series
      </button>

      {/* Star Rating Input */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-300">Rate this book</h4>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setUserRating(star)}
              className={`w-8 h-8 ${userRating >= star ? 'text-yellow-400' : 'text-gray-600'} hover:text-yellow-400 transition-colors`}
            >
              ★
            </button>
          ))}
        </div>
        {userRating > 0 && (
          <p className="text-xs text-gray-400">You rated this {userRating} star{userRating !== 1 ? 's' : ''}</p>
        )}
      </div>

      {/* Like Button */}
      <div className="space-y-2">
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`w-full px-4 py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
            isLiked
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
          }`}
        >
          <svg className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {isLiked ? 'Liked' : 'Like'}
        </button>
      </div>
      </div>
    </div>
  </>
  );
}

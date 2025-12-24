'use client'; // Added for client-side interactivity like show more toggles and rating inputs

import { fetchWorkEditions, fetchWork, fetchEdition } from '../services/bookService';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface DetailPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default function DetailPage({ searchParams }: DetailPageProps) {
  const [params, setParams] = useState<{ [key: string]: string | undefined }>({});
  const [edition, setEdition] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [workTitle, setWorkTitle] = useState('');
  const [workCovers, setWorkCovers] = useState<number[]>([]);
  const [workDescription, setWorkDescription] = useState<string | null>(null);
  const [workAuthors, setWorkAuthors] = useState<Array<{ key: string; name: string }>>([]);
  const [workFirstPublishDate, setWorkFirstPublishDate] = useState<string | null>(null);
  const [workSubjects, setWorkSubjects] = useState<string[]>([]);

  // Client-side state for interactivity
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showBookDetails, setShowBookDetails] = useState(false);
  const [showFullAuthorBio, setShowFullAuthorBio] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [wantToReadStatus, setWantToReadStatus] = useState<string>('Want to Read');
  const [isLiked, setIsLiked] = useState<boolean>(false);

  useEffect(() => {
    searchParams.then(setParams);
  }, [searchParams]);

  useEffect(() => {
    if (params.work) {
      fetchData(params.work, params.edition);
    }
  }, [params]);

  const fetchData = async (workId: string, editionId?: string) => {
    try {
      const work = await fetchWork(workId);
      setWorkTitle(work.title || 'Unknown Work');
      setWorkCovers(work.covers || []);
      setWorkDescription(work.description ? 
        (typeof work.description === 'string' ? work.description : work.description.value) : null);
      setWorkSubjects(work.subjects || []);
      setWorkFirstPublishDate(work.first_publish_date || null);

      let selectedEdition;
      if (editionId) {
        // Fetch the specific edition
        selectedEdition = await fetchEdition(editionId);
      } else {
        // Fetch the first edition of the work
        const editions = await fetchWorkEditions(workId, 1);
        if (editions.length > 0) {
          selectedEdition = editions[0];
        }
      }

      if (selectedEdition) {
        setEdition(selectedEdition);
      }

      if (work.authors && selectedEdition && (selectedEdition as any)?.author_name) {
        const authors = work.authors.map((authorRef, index) => ({
          key: authorRef.author.key,
          name: (selectedEdition as any).author_name[index] || ''
        }));
        setWorkAuthors(authors);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
    }
  };

  const workId = params.work || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary/20 to-secondary/20 text-white font-sans">
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Search
          </Link>

          <h1 className="text-6xl font-bold mb-4 text-primary">
            Book Details
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover more about this book and start your reading journey
          </p>
        </div>

        {error ? (
          <div className="text-center py-16">
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-400 text-lg">{error}</p>
            </div>
          </div>
        ) : !workId ? (
          <div className="text-center py-16">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto border border-gray-700">
              <p className="text-gray-400 text-lg">No work selected</p>
            </div>
          </div>
        ) : !edition ? (
          <div className="text-center py-16">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto border border-gray-700">
              <p className="text-gray-400 text-lg">No edition found for this work</p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Large Book Cover */}
                <div className="flex justify-center">
                  {edition.covers && edition.covers.length > 0 ? (
                    <div className="relative rounded-2xl shadow-lg">
                      <Image
                        src={`https://covers.openlibrary.org/b/id/${edition.covers[0]}-L.jpg`}
                        alt={`Cover of ${edition.title || 'Edition'}`}
                        width={280}
                        height={420}
                        className="object-cover w-full h-auto rounded-2xl"
                        priority
                      />
                    </div>
                  ) : (
                    <div className="w-70 h-96 bg-gray-700 rounded-2xl flex items-center justify-center">
                      <div className="text-8xl text-blue-400/60">📚</div>
                    </div>
                  )}
                </div>

                {/* Want to Read Dropdown */}
                <div className="space-y-2">
                  <select
                    value={wantToReadStatus}
                    onChange={(e) => setWantToReadStatus(e.target.value)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold text-sm"
                  >
                    <option value="Want to Read">Want to Read</option>
                    <option value="Currently Reading">Currently Reading</option>
                    <option value="Read">Read</option>
                  </select>
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

              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Series Label - Placeholder */}
                <div className="text-sm text-blue-400 font-medium">
                  {/* Assuming no series data, placeholder */}
                  {/* Series: Example Series */}
                </div>

                {/* Book Title */}
                <h1 className="text-4xl lg:text-5xl font-bold text-white">
                  {edition.title || 'Untitled Edition'}
                </h1>

                {/* Edition Info */}
                <div className="text-lg text-gray-400 mt-2">
                  {params.edition ? (
                    <>Viewing this specific edition</>
                  ) : (
                    <>
                      An edition of{' '}
                      <Link
                        href={`/books/editions?work=${params.work}`}
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        {workTitle || 'this work'}
                      </Link>
                      ,{' '}
                      <Link
                        href={`/books/editions?work=${params.work}`}
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        view editions
                      </Link>
                    </>
                  )}
                </div>

                {/* Author */}
                {edition.author_name && edition.author_name.length > 0 && (
                  <div className="text-xl text-blue-400">
                    by{' '}
                    {workAuthors.length > 0 ? (
                      workAuthors.map((author, index) => (
                        <span key={author.key}>
                          <Link
                            href={`https://openlibrary.org${author.key}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline"
                          >
                            {author.name}
                          </Link>
                          {index < workAuthors.length - 1 && ', '}
                        </span>
                      ))
                    ) : (
                      <span>{edition.author_name.join(', ')}</span>
                    )}
                  </div>
                )}

                {/* Community Rating Summary */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-yellow-400 text-lg">★</span>
                    ))}
                  </div>
                  <div className="text-white">
                    <span className="font-semibold">4.2</span> {/* Mock data */}
                    <span className="text-gray-400 ml-1">·</span>
                    <span className="text-gray-400 ml-1">1,234 ratings</span> {/* Mock data */}
                    <span className="text-gray-400 ml-1">·</span>
                    <span className="text-gray-400 ml-1">567 reviews</span> {/* Mock data */}
                  </div>
                </div>

                {/* Description with Show More */}
                {workDescription && (
                  <div className="space-y-4">
                    <div
                      className={`text-gray-300 leading-relaxed ${!showFullDescription ? 'line-clamp-3' : ''}`}
                      dangerouslySetInnerHTML={{
                        __html: workDescription.length > 300 && !showFullDescription
                          ? workDescription.substring(0, 300) + '...'
                          : workDescription
                      }}
                    />
                    {workDescription.length > 300 && (
                      <button
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                      >
                        {showFullDescription ? 'Show less' : '...more'}
                      </button>
                    )}
                  </div>
                )}

                {/* Genre Tags */}
                {workSubjects && workSubjects.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {workSubjects.slice(0, 5).map((subject, index) => (
                      <Link
                        key={index}
                        href={`/search?query=${encodeURIComponent(subject)}`}
                        className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-sm hover:bg-blue-800 transition-colors"
                      >
                        {subject}
                      </Link>
                    ))}
                    {workSubjects.length > 5 && (
                      <button className="text-gray-400 text-sm hover:text-white">
                        +{workSubjects.length - 5} more
                      </button>
                    )}
                  </div>
                )}

                {/* Metadata with Expandable Details */}
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

                {/* Social Reading Indicators */}
                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {/* Mock user avatars */}
                        <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-gray-800"></div>
                        <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-gray-800"></div>
                        <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-gray-800"></div>
                      </div>
                      <span>23 currently reading</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-gray-800"></div>
                        <div className="w-6 h-6 bg-orange-500 rounded-full border-2 border-gray-800"></div>
                        <div className="w-6 h-6 bg-pink-500 rounded-full border-2 border-gray-800"></div>
                      </div>
                      <span>156 want to read</span>
                    </div>
                  </div>
                </div>

                {/* About the Author */}
                {edition.author_name && edition.author_name.length > 0 && (
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
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { fetchWorkEditions, fetchWork, fetchEdition } from '../services/bookService';
import Image from 'next/image';
import Link from 'next/link';
import BookSidebar from './components/BookSidebar';
import DescriptionSection from './components/DescriptionSection';
import BookDetailsSection from './components/BookDetailsSection';
import AuthorSection from './components/AuthorSection';
import BackButton from './components/BackButton';

interface DetailPageProps {
  params: Promise<{ workid: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

interface BookData {
  work: any;
  edition: any;
  workAuthors: Array<{ key: string; name: string }>;
}

function ErrorDisplay({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary/20 to-secondary/20 text-white font-sans">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="text-center py-16">
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-400 text-lg">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

async function fetchBookData(workId: string, editionId?: string): Promise<BookData> {
  const work = await fetchWork(workId);
  
  const edition = editionId 
    ? await fetchEdition(editionId)
    : (await fetchWorkEditions(workId, 1))[0];
  
  if (!edition) {
    throw new Error('No edition found for this work');
  }
  
  const workAuthors = work.author_name && edition && (edition as any)?.author_name
    ? work.author_name.map((authorRef: any, index: number) => ({
        key: authorRef.author.key,
        name: (edition as any).author_name[index] || ''
      }))
    : [];
  
  return { work, edition, workAuthors };
}
export default async function DetailPage({ params, searchParams }: DetailPageProps) {
  const { workid } = await params;
  const { edition: editionId } = await searchParams;

  let bookData: BookData;
  try {
    bookData = await fetchBookData(workid, editionId);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching data';
    return <ErrorDisplay message={errorMessage} />;
  }

  const { work, edition, workAuthors } = bookData;

  const workTitle = work.title || 'Unknown Work';
  const workDescription = work.description ? 
    (typeof work.description === 'string' ? work.description : work.description.value) : null;
  const workSubjects = work.subjects || [];
  const workFirstPublishDate = work.first_publish_year ? work.first_publish_year.toString() : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary/20 to-secondary/20 text-white font-sans">
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="mb-12 relative">
          <BackButton />
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-4 text-primary">
              Book Details
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Discover more about this book and start your reading journey
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <BookSidebar edition={edition} />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
              <div className="space-y-6">
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
                  {editionId ? (
                    <>Viewing this specific edition</>
                  ) : (
                    <>
                      An edition of{' '}
                      <Link
                        href={`/books/${workid}/editions`}
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        {workTitle || 'this work'}
                      </Link>
                      ,{' '}
                      <Link
                        href={`/books/${workid}/editions`}
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        view editions
                      </Link>
                    </>
                  )}
                </div>

                {/* Author */}
                {(edition as any).author_name && (edition as any).author_name.length > 0 && (
                  <div className="text-xl text-blue-400">
                    by{' '}
                    {workAuthors.length > 0 ? (
                      workAuthors.map((author: { key: string; name: string }, index: number) => (
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
                      <span>{(edition as any).author_name.join(', ')}</span>
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

                {/* Description */}
                <DescriptionSection description={workDescription} />

                {/* Genre Tags */}
                {workSubjects && workSubjects.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {workSubjects.slice(0, 5).map((subject: string, index: number) => (
                      <Link
                        key={index}
                        href={`/search?query=${encodeURIComponent(subject)}`}
                        className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-sm hover:bg-blue-800 transition-colors"
                      >
                        {subject}
                      </Link>
                    ))}
                    {workSubjects.length > 5 && (
                      <span className="text-gray-400 text-sm">
                        +{workSubjects.length - 5} more
                      </span>
                    )}
                  </div>
                )}

                {/* Metadata */}
                <BookDetailsSection edition={edition} workFirstPublishDate={workFirstPublishDate} />

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
                <AuthorSection workAuthors={workAuthors} edition={edition} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

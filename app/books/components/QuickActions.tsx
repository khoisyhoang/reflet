'use client';

import { useRouter } from 'next/navigation';

interface QuickActionsProps {
    workId: string;
}

export default function QuickActions({ workId }: QuickActionsProps) {
    const router = useRouter();

    return (
        <div className="flex gap-3">
            <button
                onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    router.push(`/books/reading-session?work=${workId}`);
                }}
                className="bg-green-600/80 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
                Start Reading
            </button>
            <button
                onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    router.push(`/books/search/editions?work=${workId}`);
                }}
                className="bg-primary/80 hover:bg-primary text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
                Editions
            </button>

        </div>
    );
}

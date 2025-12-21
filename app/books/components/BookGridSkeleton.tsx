export default function BookGridSkeleton() {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl">
      <div className="grid grid-cols-1 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-white/5 rounded-2xl overflow-hidden shadow-lg border border-white/10">
              <div className="flex">
                {/* Book Cover Skeleton */}
                <div className="flex-shrink-0 w-32 h-48 bg-gradient-to-br from-primary/20 to-primary/5 m-6 rounded-lg flex items-center justify-center">
                  <div className="w-16 h-20 bg-white/20 rounded-lg"></div>
                </div>

                {/* Book Info Skeleton */}
                <div className="flex-1 p-6 pt-8 space-y-4">
                  {/* Title */}
                  <div className="h-6 bg-white/20 rounded w-3/4"></div>

                  {/* Author */}
                  <div className="h-5 bg-white/10 rounded w-1/2"></div>

                  {/* Badges */}
                  <div className="flex gap-4">
                    <div className="h-5 bg-white/10 rounded-full w-16"></div>
                    <div className="h-5 bg-primary/20 rounded-full w-20"></div>
                  </div>

                  {/* Subject Tags */}
                  <div className="flex gap-2">
                    <div className="h-6 bg-blue-100/50 dark:bg-blue-900/20 rounded-full w-16"></div>
                    <div className="h-6 bg-blue-100/50 dark:bg-blue-900/20 rounded-full w-20"></div>
                    <div className="h-6 bg-blue-100/50 dark:bg-blue-900/20 rounded-full w-14"></div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-4">
                    <div className="h-8 bg-primary/20 rounded-lg w-16"></div>
                    <div className="h-8 bg-green-600/20 rounded-lg w-24"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

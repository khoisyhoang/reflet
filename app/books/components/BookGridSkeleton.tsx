export default function BookGridSkeleton() {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-white/10 rounded-xl overflow-hidden shadow-lg border border-white/10">
              {/* Book Cover Skeleton */}
              <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <div className="w-16 h-20 bg-white/20 rounded-lg"></div>
              </div>

              {/* Book Info Skeleton */}
              <div className="p-4 space-y-3">
                <div className="h-5 bg-white/20 rounded w-3/4"></div>
                <div className="h-4 bg-white/10 rounded w-1/2"></div>
                <div className="flex justify-between items-center">
                  <div className="h-3 bg-white/10 rounded w-12"></div>
                  <div className="h-5 bg-primary/20 rounded-full w-16"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

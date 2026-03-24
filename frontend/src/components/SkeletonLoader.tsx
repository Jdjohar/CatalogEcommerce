export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-5 flex flex-col h-[140px]">
        <div className="h-4 w-1/3 bg-gray-200 rounded mb-3" />
        <div className="h-6 w-full bg-gray-200 rounded mb-2" />
        <div className="h-6 w-2/3 bg-gray-200 rounded mb-4" />
        <div className="mt-auto h-6 w-1/4 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 flex items-center space-x-4 animate-pulse">
      <div className="w-12 h-12 bg-gray-200 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-5 w-1/2 bg-gray-200 rounded" />
        <div className="h-4 w-1/4 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

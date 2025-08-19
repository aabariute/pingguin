export default function SidebarSkeleton() {
  const skeletonContacts = Array(10).fill(null);

  return (
    <aside className="p-2 lg:rounded-bl-md border-r-base-200 w-full flex flex-col lg:items-center gap-1">
      <div className="w-full flex justify-between gap-10">
        <div className="skeleton h-10 w-80 rounded-md lg:w-full"></div>
        <div className="skeleton h-10 w-34 rounded-md lg:hidden"></div>
      </div>

      <div className="overflow-hidden lg:w-full flex lg:flex-col">
        {skeletonContacts.map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-1 my-0.5">
            <div className="relative mx-0.5 lg:mx-0">
              <div className="skeleton size-11 rounded-full" />
            </div>

            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="skeleton h-4 w-32 mb-2" />
              <div className="skeleton h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

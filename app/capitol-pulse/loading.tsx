export default function Loading() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Loading Congress data">
      <div className="h-10 w-2/3 rounded-lg bg-white/10 mb-4" />
      <div className="h-5 w-1/2 rounded bg-white/5 mb-10" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-white/5" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-white/5" />
        ))}
      </div>
      <p className="mt-6 text-sm text-white/40">Fetching the latest from Congress.gov…</p>
    </div>
  );
}

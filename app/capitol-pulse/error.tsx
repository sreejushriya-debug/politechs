"use client";

export default function CapitolPulseError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-8 max-w-2xl">
      <h1 className="text-xl font-display font-bold text-amber-300">We couldn&apos;t reach Congress.gov</h1>
      <p className="mt-2 text-white/60">
        Capitol Pulse pulls everything live from the official Congress.gov API, and it didn&apos;t respond this time. It is usually back within a few minutes.
      </p>
      <button onClick={reset} className="mt-5 rounded-full bg-white/10 px-5 py-2 text-white hover:bg-white/15">
        Try again
      </button>
    </div>
  );
}

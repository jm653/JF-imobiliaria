export default function LoadingArea() {
  return (
    <div
      aria-busy="true"
      className="jf-page min-h-screen animate-pulse text-white"
    >
      <header className="border-b border-white/10 bg-[#050505]/86">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5">
          <div className="h-5 w-28 rounded bg-white/10" />
          <div className="hidden h-7 w-80 rounded-full bg-white/10 sm:block" />
          <div className="h-8 w-20 rounded-full bg-white/10" />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">
        <div className="h-44 rounded-lg border border-[#DAA520]/20 bg-[#DAA520]/10" />
        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="h-28 rounded-lg border border-white/10 bg-white/3"
            />
          ))}
        </div>
        <div className="mt-8 space-y-3">
          <div className="h-5 w-56 rounded bg-white/10" />
          <div className="h-32 rounded-lg border border-white/10 bg-white/3" />
          <div className="h-32 rounded-lg border border-white/10 bg-white/3" />
        </div>
      </main>
    </div>
  );
}

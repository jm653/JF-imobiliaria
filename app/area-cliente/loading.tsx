export default function LoadingAreaCliente() {
  return (
    <main
      aria-busy="true"
      className="min-h-screen overflow-hidden bg-[#050817] px-4 py-24 text-white"
    >
      <div className="mx-auto w-full max-w-2xl animate-pulse space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="h-3 w-28 rounded-full bg-[#DAA520]/35" />
            <div className="h-8 w-56 rounded-lg bg-white/10" />
          </div>
          <div className="h-9 w-20 rounded-full bg-white/10" />
        </div>
        <div className="h-5 w-52 rounded bg-white/10" />
        <section className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="h-5 w-44 rounded bg-white/10" />
          <div className="h-24 rounded-xl bg-white/[0.04]" />
          <div className="h-11 rounded-full bg-[#DAA520]/20" />
        </section>
        <div className="space-y-4">
          <div className="h-6 w-52 rounded bg-white/10" />
          <div className="h-24 rounded-2xl border border-white/10 bg-white/[0.03]" />
        </div>
      </div>
    </main>
  );
}

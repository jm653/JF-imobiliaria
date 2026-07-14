import Link from "next/link";
import AiDemo from "@/components/AiDemo";
import BackgroundPremium from "@/components/BackgroundPremium";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0E27] text-white">
      {/* Fundo em gradiente animado */}
     <BackgroundPremium />

      {/* Navegação */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <span className="font-display text-lg font-bold tracking-tight">
          JF <span className="text-[#DAA520]">Imobiliária</span>
        </span>
        <nav className="hidden items-center gap-8 font-body text-sm text-white/70 md:flex">
          <a href="#como-funciona" className="hover:text-white transition-colors">
            Como funciona
          </a>
          <a href="#corretores" className="hover:text-white transition-colors">
            Para corretores
          </a>
          <Link href="/login" className="hover:text-white transition-colors">
            Entrar
          </Link>
        </nav>
        <Link
          href="/cadastro"
          className="rounded-full border border-[#DAA520]/40 bg-[#DAA520]/10 px-5 py-2 font-body text-sm font-medium text-[#F4C95D] transition-all hover:bg-[#DAA520]/20 hover:border-[#DAA520]/70"
        >
          Criar conta
        </Link>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 pb-24 pt-12 lg:grid-cols-2 lg:px-10 lg:pt-20">
        <div>
          <span className="inline-block rounded-full border border-[#DAA520]/30 bg-[#DAA520]/10 px-4 py-1.5 font-mono text-xs tracking-wide text-[#F4C95D]">
            Marketplace de demanda imobiliária
          </span>

          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Você não procura imóveis.
            <br />
            <span className="bg-gradient-to-r from-[#DAA520] to-[#F4C95D] bg-clip-text text-transparent">
              Eles vêm até você.
            </span>
          </h1>

          <p className="mt-6 max-w-lg font-body text-lg text-white/60">
            Diga o que você quer, em linguagem natural. Nossa IA interpreta o
            pedido, encontra os imóveis compatíveis e conecta você direto com
            os corretores certos — sem perder tempo procurando.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/cadastro?tipo=cliente"
              className="animate-glow rounded-full bg-[#DAA520] px-7 py-3.5 font-body text-sm font-semibold text-[#0A0E27] transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              Quero encontrar um imóvel
            </Link>
            <Link
              href="/cadastro?tipo=corretor"
              className="rounded-full border border-white/20 px-7 py-3.5 font-body text-sm font-semibold text-white/90 transition-all hover:border-white/40 hover:bg-white/5"
            >
              Sou corretor
            </Link>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <AiDemo />
        </div>
      </section>
    </main>
  );
}
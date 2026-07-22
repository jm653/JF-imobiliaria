import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import BackgroundPremium from "@/components/BackgroundPremium";
import SairButton from "@/components/SairButton";
import Link from "next/link";

export default async function ImoveisClientePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.papel === "corretor") redirect("/area-corretor");

  const imoveis = await prisma.imovel.findMany({
    where: { status: "disponivel" },
    include: { corretor: { include: { usuario: true } } },
    orderBy: { criadoEm: "desc" },
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050817] px-4 py-24 text-white">
      <BackgroundPremium />

      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#DAA520]">
              Imóveis disponíveis
            </p>
            <h1 className="font-display text-2xl font-bold text-white">
              Navegue pelos anúncios
            </h1>
          </div>
          <SairButton />
        </div>

        <Link
          href="/area-cliente"
          className="mb-6 inline-block font-body text-sm text-white/50 hover:text-white"
        >
          ← Voltar
        </Link>

        {!imoveis.length && (
          <p className="font-body text-sm text-white/40">
            Nenhum imóvel disponível no momento.
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {imoveis.map((imovel) => (
            <Link
              key={imovel.id}
              href={`/area-cliente/imoveis/${imovel.id}`}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl transition-colors hover:border-[#DAA520]/30"
            >
              <p className="font-display font-semibold text-white">
                {imovel.titulo}
              </p>
              <p className="mt-1 font-body text-sm text-white/50">
                {imovel.cidade}
                {imovel.bairro ? ` — ${imovel.bairro}` : ""}
              </p>
              <p className="mt-2 font-mono text-sm text-[#F4C95D]">
                R$ {imovel.valor.toLocaleString("pt-BR")}
              </p>
              <div className="mt-2 flex flex-wrap gap-2 font-body text-xs text-white/40">
                {imovel.quartos ? <span>{imovel.quartos} quartos</span> : null}
                {imovel.banheiros ? (
                  <span>{imovel.banheiros} banheiros</span>
                ) : null}
                {imovel.garagem && <span>Garagem</span>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
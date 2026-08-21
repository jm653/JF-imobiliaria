import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function PerfilPublicoCorretor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const corretor = await prisma.perfilCorretor.findUnique({
    where: { id },
    include: { usuario: true, imoveis: { where: { status: "disponivel" } } },
  });

  if (!corretor) notFound();

  return (
    <main className="jf-page min-h-screen px-5 py-12 text-white">
      <section className="mx-auto max-w-4xl">
        <p className="jf-kicker">Corretor</p>
        <h1 className="mt-2 font-display text-3xl font-bold">
          {corretor.usuario.nome}
        </h1>
        <p className="mt-2 font-body text-sm text-white/50">
          {corretor.creci ? `CRECI ${corretor.creci}` : "Perfil profissional"}
        </p>

        <div className="mt-8 grid gap-3">
          {corretor.imoveis.map((imovel) => (
            <article key={imovel.id} className="jf-panel rounded-lg p-5">
              <h2 className="font-display text-lg font-semibold">{imovel.titulo}</h2>
              <p className="mt-1 font-body text-sm text-white/50">
                {imovel.cidade} · R$ {imovel.valor.toLocaleString("pt-BR")}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

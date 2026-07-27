import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DashboardShellCliente from "@/components/area/DashboardShellCliente";
import Link from "next/link";

export default async function ImovelDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.papel === "corretor") redirect("/area-corretor");

  const imovel = await prisma.imovel.findUnique({
    where: { id },
    include: { corretor: { include: { usuario: true } } },
  });

  if (!imovel) notFound();

  const telefoneLimpo = imovel.corretor.usuario.telefone?.replace(/\D/g, "");

  return (
    <DashboardShellCliente nome={session.user.name ?? ""}>
      <Link
        href="/area-cliente/imoveis"
        className="mb-6 inline-block font-body text-sm text-white/50 hover:text-white"
      >
        ← Voltar aos imóveis
      </Link>

      <div className="jf-panel-strong rounded-lg p-8">
        <p className="jf-kicker">
          {imovel.cidade}
          {imovel.bairro ? ` — ${imovel.bairro}` : ""}
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold text-white">
          {imovel.titulo}
        </h1>
        <p className="mt-2 font-mono text-2xl font-semibold text-[#F4C95D]">
          R$ {imovel.valor.toLocaleString("pt-BR")}
        </p>

        <div className="mt-4 flex flex-wrap gap-2 font-body text-sm text-white/60">
          {imovel.quartos ? <span>{imovel.quartos} quartos</span> : null}
          {imovel.banheiros ? (
            <span>{imovel.banheiros} banheiros</span>
          ) : null}
          {imovel.garagem && <span>Garagem</span>}
          {imovel.varanda && <span>Varanda</span>}
          {imovel.quintal && <span>Quintal</span>}
        </div>

        {imovel.descricao && (
          <p className="mt-6 font-body text-sm leading-relaxed text-white/70">
            {imovel.descricao}
          </p>
        )}

        <div className="jf-panel mt-8 rounded-lg p-5">
          <p className="font-body text-sm text-white/50">Anunciado por</p>
          <p className="mt-1 font-display font-semibold text-white">
            {imovel.corretor.usuario.nome}
          </p>
          {telefoneLimpo ? (
            <a
              href={`https://wa.me/${telefoneLimpo}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 font-body text-sm font-semibold text-[#05110b] transition-transform hover:scale-[1.02]"
            >
              Falar no WhatsApp
            </a>
          ) : (
            <p className="mt-3 font-body text-xs text-white/40">
              Corretor ainda não adicionou telefone.
            </p>
          )}
        </div>
      </div>
    </DashboardShellCliente>
  );
}
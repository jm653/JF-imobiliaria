import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DashboardShell from "@/components/area/DashboardShell";
import dynamic from "next/dynamic";

const MapaOportunidades = dynamic(
  () => import("@/components/area/MapaOportunidades"),
  { ssr: false }
);

export default async function MapaCorretorPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.papel !== "corretor") redirect("/area-cliente");

  const perfilCorretor = await prisma.perfilCorretor.findUnique({
    where: { usuarioId: session.user.id },
    include: { desbloqueios: true },
  });

  const idsDesbloqueados = new Set(
    perfilCorretor?.desbloqueios.map((d) => d.pedidoId) ?? []
  );

  const pedidosTodos = await prisma.pedidoImovel.findMany({
    where: { status: "ativo" },
    orderBy: { criadoEm: "desc" },
  });

  const pedidosComCoordenadas = pedidosTodos
    .filter((p) => p.latitude != null && p.longitude != null)
    .map((p) => ({
      id: p.id,
      cidade: p.cidade,
      bairro: p.bairro,
      valorMaximo: p.valorMaximo,
      latitude: p.latitude as number,
      longitude: p.longitude as number,
      desbloqueado: idsDesbloqueados.has(p.id),
    }));

  return (
    <DashboardShell nome={session.user.name ?? ""}>
      <div className="mb-6">
        <p className="jf-kicker">Mapa Inteligente</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
          Onde estão as oportunidades
        </h1>
      </div>

      {!pedidosComCoordenadas.length ? (
        <div className="jf-panel rounded-lg p-6 font-body text-sm text-white/45">
          Nenhum pedido com localização disponível ainda.
        </div>
      ) : (
        <MapaOportunidades pedidos={pedidosComCoordenadas} />
      )}
    </DashboardShell>
  );
}   
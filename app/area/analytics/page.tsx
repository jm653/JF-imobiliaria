import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DashboardShell from "@/components/area/DashboardShell";
import GraficoPipeline from "@/components/area/GraficoPipeline";

const ESTAGIOS_ORDEM = [
  "novo_lead",
  "contato_realizado",
  "conversa",
  "visita_agendada",
  "visita_realizada",
  "proposta",
  "negociacao",
  "contrato",
  "concluido",
];

const ESTAGIOS_LABEL: Record<string, string> = {
  novo_lead: "Novo Lead",
  contato_realizado: "Contato",
  conversa: "Conversa",
  visita_agendada: "Visita Agendada",
  visita_realizada: "Visita Feita",
  proposta: "Proposta",
  negociacao: "Negociação",
  contrato: "Contrato",
  concluido: "Concluído",
};

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.papel !== "corretor") redirect("/area-cliente");

  const perfilCorretor = await prisma.perfilCorretor.findUnique({
    where: { usuarioId: session.user.id },
    include: { desbloqueios: true },
  });

  const desbloqueios = perfilCorretor?.desbloqueios ?? [];
  const totalDesbloqueios = desbloqueios.length;
  const totalConcluidos = desbloqueios.filter(
    (d) => d.estagio === "concluido"
  ).length;
  const totalCreditosGastos = desbloqueios.reduce(
    (soma, d) => soma + d.creditosGastos,
    0
  );
  const taxaConversao =
    totalDesbloqueios > 0
      ? Math.round((totalConcluidos / totalDesbloqueios) * 100)
      : 0;

  const dadosPipeline = ESTAGIOS_ORDEM.map((estagio) => ({
    estagio: ESTAGIOS_LABEL[estagio] ?? estagio,
    quantidade: desbloqueios.filter((d) => d.estagio === estagio).length,
  }));

  return (
    <DashboardShell nome={session.user.name ?? ""}>
      <div className="mb-8">
        <p className="jf-kicker">Analytics</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
          Seu desempenho
        </h1>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Contatos desbloqueados", valor: totalDesbloqueios },
          { label: "Negócios concluídos", valor: totalConcluidos },
          { label: "Taxa de conversão", valor: `${taxaConversao}%` },
          { label: "Créditos investidos", valor: totalCreditosGastos },
        ].map((item) => (
          <div key={item.label} className="jf-panel rounded-lg p-4">
            <p className="font-display text-2xl font-bold text-white">
              {item.valor}
            </p>
            <p className="mt-1 font-body text-xs text-white/45">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      <div className="jf-panel rounded-lg p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-white">
          Funil do pipeline
        </h2>
        <GraficoPipeline dados={dadosPipeline} />
      </div>
    </DashboardShell>
  );
}
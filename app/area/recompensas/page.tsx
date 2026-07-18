import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DashboardShell from "@/components/area/DashboardShell";
import { Award, Gem, Sparkles, Star, Trophy } from "lucide-react";

const recompensas = [
  {
    titulo: "Primeira oportunidade",
    descricao: "Desbloqueie seu primeiro cliente qualificado.",
    requisito: 1,
    icon: Sparkles,
  },
  {
    titulo: "Ritmo comercial",
    descricao: "Inicie 5 negociações dentro da plataforma.",
    requisito: 5,
    icon: Star,
  },
  {
    titulo: "Corretor em destaque",
    descricao: "Some 50 pontos de performance.",
    requisito: 50,
    usaScore: true,
    icon: Trophy,
  },
  {
    titulo: "Diamante JF",
    descricao: "Alcance 100 pontos no ranking.",
    requisito: 100,
    usaScore: true,
    icon: Gem,
  },
];

export default async function RecompensasPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.papel !== "corretor") redirect("/area-cliente");

  const perfilCorretor = await prisma.perfilCorretor.findUnique({
    where: { usuarioId: session.user.id },
    include: { desbloqueios: true },
  });

  const desbloqueios = perfilCorretor?.desbloqueios.length ?? 0;
  const score = perfilCorretor?.score ?? 0;

  return (
    <DashboardShell nome={session.user.name ?? ""}>
      <div className="mb-8">
        <p className="jf-kicker">Recompensas</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
          Conquistas profissionais
        </h1>
        <p className="mt-2 max-w-2xl font-body text-sm leading-6 text-white/50">
          Reconheça progresso real: contatos iniciados, constância e evolução no
          ranking.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {recompensas.map((recompensa) => {
          const progressoAtual = recompensa.usaScore ? score : desbloqueios;
          const concluida = progressoAtual >= recompensa.requisito;
          const progresso = Math.min(
            (progressoAtual / recompensa.requisito) * 100,
            100
          );
          const Icone = recompensa.icon;

          return (
            <article
              key={recompensa.titulo}
              className={concluida ? "jf-panel-strong rounded-lg p-5" : "jf-panel rounded-lg p-5"}
            >
              <div className="flex items-start gap-4">
                <div className="rounded-full border border-[#DAA520]/30 bg-[#DAA520]/10 p-3 text-[#F4C95D]">
                  <Icone size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-display text-lg font-semibold text-white">
                      {recompensa.titulo}
                    </h2>
                    {concluida && <Award className="text-[#F4C95D]" size={18} />}
                  </div>
                  <p className="mt-1 font-body text-sm leading-6 text-white/50">
                    {recompensa.descricao}
                  </p>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/7">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#DAA520] to-[#F4C95D]"
                      style={{ width: `${progresso}%` }}
                    />
                  </div>
                  <p className="mt-2 font-mono text-xs text-white/36">
                    {Math.min(progressoAtual, recompensa.requisito).toFixed(0)} /
                    {recompensa.requisito}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </DashboardShell>
  );
}

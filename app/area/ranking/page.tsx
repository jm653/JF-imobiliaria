import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DashboardShell from "@/components/area/DashboardShell";
import { Trophy, Medal, Award } from "lucide-react";

export default async function RankingPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.papel !== "corretor") redirect("/area-cliente");

  const corretores = await prisma.perfilCorretor.findMany({
    include: { usuario: true, desbloqueios: true },
    orderBy: { score: "desc" },
    take: 20,
  });

  const meuPerfil = await prisma.perfilCorretor.findUnique({
    where: { usuarioId: session.user.id },
  });

  const iconesPodio = [Trophy, Medal, Award];

  return (
    <DashboardShell nome={session.user.name ?? ""}>
      <p className="jf-kicker">
        Ranking
      </p>
      <h1 className="mb-8 mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
        Corretores em destaque
      </h1>

      {!corretores.length && (
        <p className="font-body text-sm text-white/40">
          Ainda não há corretores suficientes pra formar um ranking.
        </p>
      )}

      <div className="space-y-3">
        {corretores.map((corretor, i) => {
          const Icone = i < 3 ? iconesPodio[i] : null;
          const souEu = corretor.id === meuPerfil?.id;

          return (
            <div
              key={corretor.id}
              className={`flex items-center justify-between rounded-lg border p-4 transition-all ${
                souEu
                  ? "border-[#DAA520]/50 bg-[#DAA520]/10"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="w-6 text-center font-mono text-sm text-white/40">
                  {i + 1}º
                </span>
                {Icone && (
                  <Icone
                    size={20}
                    className={
                      i === 0
                        ? "text-[#F4C95D]"
                        : i === 1
                          ? "text-white/60"
                          : "text-[#DAA520]/60"
                    }
                  />
                )}
                <div>
                  <p className="font-body text-sm font-medium text-white">
                    {corretor.usuario.nome}
                    {souEu && (
                      <span className="ml-2 text-xs text-[#F4C95D]">
                        (você)
                      </span>
                    )}
                  </p>
                  <p className="font-mono text-xs text-white/40">
                    {corretor.desbloqueios.length} negócio(s) iniciado(s)
                  </p>
                </div>
              </div>
              <span className="font-mono text-sm font-semibold text-[#F4C95D]">
                {corretor.score.toFixed(0)} pts
              </span>
            </div>
          );
        })}
      </div>
    </DashboardShell>
  );
}

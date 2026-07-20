import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DashboardShell from "@/components/area/DashboardShell";
import FormularioVisita from "@/components/area/FormularioVisita";

export default async function AgendaPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.papel !== "corretor") redirect("/area-cliente");

  const perfilCorretor = await prisma.perfilCorretor.findUnique({
    where: { usuarioId: session.user.id },
  });

  const desbloqueios = await prisma.desbloqueio.findMany({
    where: { corretorId: perfilCorretor?.id },
    include: {
      pedido: { include: { cliente: { include: { usuario: true } } } },
    },
    orderBy: { criadoEm: "desc" },
  });

  const agendados = desbloqueios
    .filter((d) => d.dataVisita)
    .sort((a, b) => a.dataVisita!.getTime() - b.dataVisita!.getTime());

  const semData = desbloqueios.filter((d) => !d.dataVisita);

  return (
    <DashboardShell nome={session.user.name ?? ""}>
      <div className="mb-8">
        <p className="jf-kicker">Agenda</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
          Suas visitas
        </h1>
        <p className="mt-2 max-w-2xl font-body text-sm leading-6 text-white/50">
          Organize os horários de visita com cada cliente desbloqueado.
        </p>
      </div>

      <h2 className="mb-4 font-display text-lg font-semibold text-white">
        Próximas visitas
      </h2>

      {!agendados.length && (
        <p className="mb-8 font-body text-sm text-white/40">
          Nenhuma visita agendada ainda.
        </p>
      )}

      <div className="mb-10 space-y-3">
        {agendados.map((item) => (
          <div key={item.id} className="jf-panel rounded-lg p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-display font-semibold text-white">
                  {item.pedido.cliente.usuario.nome}
                </p>
                <p className="mt-1 font-body text-sm text-white/50">
                  {item.pedido.cidade}
                  {item.pedido.bairro ? ` — ${item.pedido.bairro}` : ""}
                </p>
              </div>
              <span className="rounded-full border border-[#DAA520]/30 bg-[#DAA520]/10 px-3 py-1.5 font-mono text-xs text-[#F4C95D]">
                {item.dataVisita?.toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <FormularioVisita
              desbloqueioId={item.id}
              dataAtual={item.dataVisita?.toISOString().slice(0, 16) ?? ""}
            />
          </div>
        ))}
      </div>

      {semData.length > 0 && (
        <>
          <h2 className="mb-4 font-display text-lg font-semibold text-white">
            Sem visita marcada
          </h2>
          <div className="space-y-3">
            {semData.map((item) => (
              <div key={item.id} className="jf-panel rounded-lg p-5">
                <p className="font-display font-semibold text-white">
                  {item.pedido.cliente.usuario.nome}
                </p>
                <p className="mt-1 font-body text-sm text-white/50">
                  {item.pedido.cidade}
                  {item.pedido.bairro ? ` — ${item.pedido.bairro}` : ""}
                </p>
                <FormularioVisita desbloqueioId={item.id} dataAtual="" />
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardShell>
  );
}
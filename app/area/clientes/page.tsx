import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DashboardShell from "@/components/area/DashboardShell";

export default async function ClientesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.papel !== "corretor") redirect("/area-cliente");

  const perfilCorretor = await prisma.perfilCorretor.findUnique({
    where: { usuarioId: session.user.id },
    include: {
      desbloqueios: {
        include: {
          pedido: { include: { cliente: { include: { usuario: true } } } },
        },
        orderBy: { criadoEm: "desc" },
      },
    },
  });

  return (
    <DashboardShell nome={session.user.name ?? ""}>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#DAA520]">
        Clientes
      </p>
      <h1 className="mb-8 mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
        Clientes desbloqueados
      </h1>

      {!perfilCorretor?.desbloqueios.length && (
        <p className="font-body text-sm text-white/40">
          Você ainda não desbloqueou nenhum contato. Vá em Oportunidades pra
          começar.
        </p>
      )}

      <div className="space-y-4">
        {perfilCorretor?.desbloqueios.map((d) => (
          <div
            key={d.id}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:border-[#DAA520]/30"
          >
            <p className="font-display font-semibold text-white">
              {d.pedido.cliente.usuario.nome}
            </p>
            <p className="mt-1 font-body text-sm text-white/50">
              {d.pedido.cliente.usuario.email}
              {d.pedido.cliente.usuario.telefone
                ? ` · ${d.pedido.cliente.usuario.telefone}`
                : ""}
            </p>
            <p className="mt-2 font-body text-xs text-white/40">
              Procurando em {d.pedido.cidade} — até R${" "}
              {d.pedido.valorMaximo.toLocaleString("pt-BR")}
            </p>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
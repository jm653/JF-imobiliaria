import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import BackgroundPremium from "@/components/BackgroundPremium";
import SairButton from "@/components/SairButton";
import NovoPedidoForm from "@/components/area/NovoPedidoForm";

export default async function AreaCliente() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.papel === "corretor") redirect("/area-corretor");

  const perfilCliente = await prisma.perfilCliente.findUnique({
    where: { usuarioId: session.user.id },
    include: {
      pedidos: {
        include: { _count: { select: { desbloqueios: true } } },
        orderBy: { criadoEm: "desc" },
      },
    },
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050817] px-4 py-24 text-white">
      <BackgroundPremium />

      <div className="relative z-10 mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#DAA520]">
              Área do Cliente
            </p>
            <h1 className="font-display text-2xl font-bold text-white">
              Olá, {session.user.name}
            </h1>
          </div>
          <SairButton />
        </div>

        <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
          <NovoPedidoForm />
        </div>

        <h2 className="mb-4 font-display text-lg font-semibold text-white">
          Seus pedidos publicados
        </h2>

        {!perfilCliente?.pedidos.length && (
          <p className="font-body text-sm text-white/40">
            Você ainda não publicou nenhum pedido.
          </p>
        )}

        <div className="space-y-4">
          {perfilCliente?.pedidos.map((pedido) => (
            <div
              key={pedido.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <p className="font-display font-semibold text-white">
                  {pedido.cidade}
                  {pedido.bairro ? ` — ${pedido.bairro}` : ""}
                </p>
                <span className="rounded-full border border-[#DAA520]/40 bg-[#DAA520]/10 px-3 py-1 font-mono text-xs text-[#F4C95D]">
                  {pedido._count.desbloqueios} corretor(es) interessado(s)
                </span>
              </div>
              <p className="mt-1 font-body text-sm text-white/50">
                Até R$ {pedido.valorMaximo.toLocaleString("pt-BR")}
                {pedido.quartos ? ` · ${pedido.quartos} quartos` : ""}
                {pedido.banheiros ? ` · ${pedido.banheiros} banheiros` : ""}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
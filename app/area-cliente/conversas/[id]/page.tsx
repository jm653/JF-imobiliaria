import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DashboardShellCliente from "@/components/area/DashboardShellCliente";
import CaixaMensagem from "@/components/area/CaixaMensagem";
import Link from "next/link";

export default async function ConversaClientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.papel === "corretor") redirect("/area-corretor");

  const perfilCliente = await prisma.perfilCliente.findUnique({
    where: { usuarioId: session.user.id },
  });

  const desbloqueio = await prisma.desbloqueio.findUnique({
    where: { id },
    include: {
      corretor: { include: { usuario: true } },
      pedido: true,
      mensagens: { orderBy: { criadoEm: "asc" } },
    },
  });

  if (!desbloqueio || desbloqueio.pedido.clienteId !== perfilCliente?.id) {
    notFound();
  }

  return (
    <DashboardShellCliente nome={session.user.name ?? ""}>
      <Link
        href="/area-cliente/conversas"
        className="mb-4 inline-block font-body text-sm text-white/50 hover:text-white"
      >
        ← Voltar
      </Link>

      <div className="mb-6">
        <p className="jf-kicker">Conversa</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
          {desbloqueio.corretor.usuario.nome}
        </h1>
      </div>

      <div className="jf-panel mb-4 flex max-h-[50vh] flex-col gap-3 overflow-y-auto rounded-lg p-5">
        {!desbloqueio.mensagens.length && (
          <p className="font-body text-sm text-white/40">
            Nenhuma mensagem ainda.
          </p>
        )}
        {desbloqueio.mensagens.map((msg) => {
          const souEu = msg.autorId === session.user.id;
          return (
            <div
              key={msg.id}
              className={`max-w-[75%] rounded-lg px-4 py-2 font-body text-sm ${
                souEu
                  ? "ml-auto bg-[#DAA520]/15 text-[#F4C95D]"
                  : "bg-white/[0.05] text-white/80"
              }`}
            >
              {msg.conteudo}
            </div>
          );
        })}
      </div>

      <CaixaMensagem desbloqueioId={desbloqueio.id} />
    </DashboardShellCliente>
  );
}
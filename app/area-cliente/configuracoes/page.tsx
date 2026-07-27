import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DashboardShellCliente from "@/components/area/DashboardShellCliente";
import FormularioPerfil from "@/components/area/FormularioPerfil";

export default async function ConfiguracoesClientePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.papel === "corretor") redirect("/area-corretor");

  const usuario = await prisma.usuario.findUnique({
    where: { id: session.user.id },
  });

  if (!usuario) redirect("/login");

  return (
    <DashboardShellCliente nome={session.user.name ?? ""}>
      <div className="mb-8">
        <p className="jf-kicker">Configurações</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
          Seu perfil
        </h1>
      </div>

      <div className="jf-panel max-w-lg rounded-lg p-8">
        <FormularioPerfil
          nomeAtual={usuario.nome}
          telefoneAtual={usuario.telefone ?? ""}
          creciAtual=""
          ehCorretor={false}
        />
      </div>
    </DashboardShellCliente>
  );
}
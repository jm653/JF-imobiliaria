import { redirect } from "next/navigation";
import { auth } from "@/auth";
import DashboardShell from "@/components/area/DashboardShell";

export default async function ConfiguracoesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <DashboardShell nome={session.user.name ?? ""}>
      <div className="mb-8">
        <p className="jf-kicker">Configurações</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
          Preferências da conta
        </h1>
        <p className="mt-2 max-w-2xl font-body text-sm leading-6 text-white/50">
          Esta área vai concentrar perfil, notificações, segurança e integrações.
        </p>
      </div>

      <div className="jf-panel rounded-lg p-6 font-body text-sm text-white/45">
        Configurações avançadas em construção.
      </div>
    </DashboardShell>
  );
}

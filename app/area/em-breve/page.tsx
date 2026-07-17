import { redirect } from "next/navigation";
import { auth } from "@/auth";
import DashboardShell from "@/components/area/DashboardShell";

export default async function EmBreve() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <DashboardShell nome={session.user.name ?? ""}>
      <div className="flex h-[70vh] flex-col items-center justify-center text-center">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[#DAA520]">
          Em construção
        </p>
        <h1 className="font-display text-2xl font-bold text-white">
          Essa funcionalidade está a caminho
        </h1>
        <p className="mt-2 max-w-md font-body text-sm text-white/50">
          Estamos construindo essa parte da plataforma. Volte em breve!
        </p>
      </div>
    </DashboardShell>
  );
}
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import DashboardShellCliente from "@/components/area/DashboardShellCliente";
import IntelligenceMatchTester from "@/components/area/IntelligenceMatchTester";

export default async function IntelligenceClientePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.papel === "corretor") redirect("/area-corretor");

  return (
    <DashboardShellCliente nome={session.user.name ?? ""}>
      <IntelligenceMatchTester />
    </DashboardShellCliente>
  );
}

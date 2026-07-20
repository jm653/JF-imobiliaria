"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function agendarVisita(desbloqueioId: string, dataVisita: string) {
  const session = await auth();
  if (!session?.user || session.user.papel !== "corretor") {
    return { erro: "Apenas corretores podem agendar visitas." };
  }

  const perfilCorretor = await prisma.perfilCorretor.findUnique({
    where: { usuarioId: session.user.id },
  });
  if (!perfilCorretor) {
    return { erro: "Perfil de corretor não encontrado." };
  }

  const desbloqueio = await prisma.desbloqueio.findUnique({
    where: { id: desbloqueioId },
  });

  if (!desbloqueio || desbloqueio.corretorId !== perfilCorretor.id) {
    return { erro: "Você não tem permissão para alterar esse item." };
  }

  await prisma.desbloqueio.update({
    where: { id: desbloqueioId },
    data: { dataVisita: dataVisita ? new Date(dataVisita) : null },
  });

  revalidatePath("/area/agenda");
  revalidatePath("/area/pipeline");

  return { sucesso: true };
}
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function atualizarEstagioPipeline(
  desbloqueioId: string,
  novoEstagio: string
) {
  const session = await auth();
  if (!session?.user || session.user.papel !== "corretor") {
    return { erro: "Apenas corretores podem atualizar o pipeline." };
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
    data: { estagio: novoEstagio },
  });

  revalidatePath("/area/pipeline");

  return { sucesso: true };
}
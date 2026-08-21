"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function solicitarReembolso(desbloqueioId: string) {
  const session = await auth();
  if (!session?.user || session.user.papel !== "corretor") {
    return { erro: "Apenas corretores podem solicitar reembolso." };
  }

  const perfilCorretor = await prisma.perfilCorretor.findUnique({
    where: { usuarioId: session.user.id },
  });
  if (!perfilCorretor) {
    return { erro: "Perfil de corretor não encontrado." };
  }

  const desbloqueio = await prisma.desbloqueio.findUnique({
    where: { id: desbloqueioId },
    include: { mensagens: true },
  });

  if (!desbloqueio || desbloqueio.corretorId !== perfilCorretor.id) {
    return { erro: "Você não tem permissão para essa ação." };
  }

  if (desbloqueio.reembolsado) {
    return { erro: "Esse desbloqueio já foi reembolsado." };
  }

  const diasDesdeDesbloqueio =
    (Date.now() - desbloqueio.criadoEm.getTime()) / (1000 * 60 * 60 * 24);

  if (diasDesdeDesbloqueio < 3) {
    return {
      erro: "Aguarde pelo menos 3 dias após o desbloqueio antes de solicitar reembolso.",
    };
  }

  const clienteRespondeu = desbloqueio.mensagens.some(
    (m) => m.autorId !== session.user.id
  );

  if (clienteRespondeu) {
    return { erro: "O cliente já respondeu essa conversa — sem reembolso." };
  }

  await prisma.$transaction([
    prisma.perfilCorretor.update({
      where: { id: perfilCorretor.id },
      data: { creditos: { increment: desbloqueio.creditosGastos } },
    }),
    prisma.desbloqueio.update({
      where: { id: desbloqueioId },
      data: { reembolsado: true },
    }),
  ]);

  revalidatePath("/area-corretor");
  revalidatePath("/area/pipeline");
  revalidatePath("/area/creditos");

  return { sucesso: true };
}
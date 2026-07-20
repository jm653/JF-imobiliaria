"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function enviarMensagem(desbloqueioId: string, conteudo: string) {
  const session = await auth();
  if (!session?.user) {
    return { erro: "Você precisa estar logado." };
  }

  if (!conteudo.trim()) {
    return { erro: "Escreva uma mensagem." };
  }

  const desbloqueio = await prisma.desbloqueio.findUnique({
    where: { id: desbloqueioId },
    include: {
      corretor: true,
      pedido: { include: { cliente: true } },
    },
  });

  if (!desbloqueio) {
    return { erro: "Conversa não encontrada." };
  }

  const souCorretor = desbloqueio.corretor.usuarioId === session.user.id;
  const souCliente = desbloqueio.pedido.cliente.usuarioId === session.user.id;

  if (!souCorretor && !souCliente) {
    return { erro: "Você não faz parte dessa conversa." };
  }

  await prisma.mensagem.create({
    data: {
      desbloqueioId,
      autorId: session.user.id,
      conteudo: conteudo.trim(),
    },
  });

  revalidatePath(`/area/conversas/${desbloqueioId}`);
  revalidatePath("/area/conversas");

  return { sucesso: true };
}
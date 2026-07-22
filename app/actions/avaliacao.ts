"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function enviarAvaliacao(nota: number, comentario: string) {
  const session = await auth();
  if (!session?.user) {
    return { erro: "Você precisa estar logado." };
  }

  await prisma.avaliacao.upsert({
    where: { usuarioId: session.user.id },
    create: {
      usuarioId: session.user.id,
      nota,
      comentario: comentario || null,
    },
    update: {
      nota,
      comentario: comentario || null,
    },
  });

  revalidatePath("/area-corretor");
  revalidatePath("/area-cliente");

  return { sucesso: true };
}
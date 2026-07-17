"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function adicionarCreditosTeste() {
  const session = await auth();
  if (!session?.user || session.user.papel !== "corretor") {
    return { erro: "Apenas corretores podem adicionar créditos." };
  }

  const perfilCorretor = await prisma.perfilCorretor.findUnique({
    where: { usuarioId: session.user.id },
  });
  if (!perfilCorretor) {
    return { erro: "Perfil de corretor não encontrado." };
  }

  await prisma.perfilCorretor.update({
    where: { id: perfilCorretor.id },
    data: { creditos: { increment: 50 } },
  });

  revalidatePath("/area/creditos");
  revalidatePath("/area-corretor");

  return { sucesso: true };
}
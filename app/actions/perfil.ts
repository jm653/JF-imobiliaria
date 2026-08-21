"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function atualizarPerfil(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { erro: "Você precisa estar logado." };

  const nome = String(formData.get("nome") ?? "").trim();
  const telefone = String(formData.get("telefone") ?? "").trim() || null;
  const creci = String(formData.get("creci") ?? "").trim() || null;

  if (!nome) return { erro: "Informe seu nome." };

  await prisma.usuario.update({
    where: { id: session.user.id },
    data: { nome, telefone },
  });

  if (session.user.papel === "corretor") {
    await prisma.perfilCorretor.update({
      where: { usuarioId: session.user.id },
      data: { creci },
    });
    revalidatePath("/area/configuracoes");
  } else {
    revalidatePath("/area-cliente/configuracoes");
    revalidatePath("/area-cliente");
  }

  return { sucesso: true };
}

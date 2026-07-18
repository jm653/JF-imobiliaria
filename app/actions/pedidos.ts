"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function criarPedido(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.papel !== "cliente") {
    return { erro: "Você precisa estar logado como cliente." };
  }

  const perfilCliente = await prisma.perfilCliente.findUnique({
    where: { usuarioId: session.user.id },
  });
  if (!perfilCliente) {
    return { erro: "Perfil de cliente não encontrado." };
  }

  const cidade = formData.get("cidade") as string;
  const valorMaximo = Number(formData.get("valorMaximo"));
  const bairro = (formData.get("bairro") as string) || null;
  const quartos = formData.get("quartos")
    ? Number(formData.get("quartos"))
    : null;
  const banheiros = formData.get("banheiros")
    ? Number(formData.get("banheiros"))
    : null;
  const garagem = formData.get("garagem") === "on";
  const varanda = formData.get("varanda") === "on";
  const quintal = formData.get("quintal") === "on";
  const aceitaPet = formData.get("aceitaPet") === "on";
  const aceitaFinanciamento = formData.get("aceitaFinanciamento") === "on";
  const descricaoLivre = (formData.get("descricaoLivre") as string) || null;

  if (!cidade || !valorMaximo) {
    return { erro: "Preencha ao menos cidade e valor máximo." };
  }

  await prisma.pedidoImovel.create({
    data: {
      clienteId: perfilCliente.id,
      cidade,
      bairro,
      valorMaximo,
      quartos,
      banheiros,
      garagem,
      varanda,
      quintal,
      aceitaPet,
      aceitaFinanciamento,
      descricaoLivre,
    },
  });

  revalidatePath("/area-cliente");
  revalidatePath("/area-corretor");

  return { sucesso: true };
}

export async function desbloquearContato(pedidoId: string) {
  const session = await auth();
  if (!session?.user || session.user.papel !== "corretor") {
    return { erro: "Apenas corretores podem desbloquear contatos." };
  }

  const perfilCorretor = await prisma.perfilCorretor.findUnique({
    where: { usuarioId: session.user.id },
  });
  if (!perfilCorretor) {
    return { erro: "Perfil de corretor não encontrado." };
  }

  const jaDesbloqueado = await prisma.desbloqueio.findUnique({
    where: {
      pedidoId_corretorId: {
        pedidoId,
        corretorId: perfilCorretor.id,
      },
    },
  });

  if (jaDesbloqueado) {
    return { sucesso: true };
  }

  const CUSTO = 10;
  const PONTOS_POR_DESBLOQUEIO = 5;

  if (perfilCorretor.creditos < CUSTO) {
    return { erro: "Créditos insuficientes." };
  }

  await prisma.$transaction([
    prisma.perfilCorretor.update({
      where: { id: perfilCorretor.id },
      data: {
        creditos: { decrement: CUSTO },
        score: { increment: PONTOS_POR_DESBLOQUEIO },
      },
    }),
    prisma.desbloqueio.create({
      data: {
        pedidoId,
        corretorId: perfilCorretor.id,
        creditosGastos: CUSTO,
      },
    }),
  ]);

  revalidatePath("/area-corretor");
  revalidatePath("/area/ranking");

  return { sucesso: true };
}
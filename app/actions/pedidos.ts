"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function geocodificar(cidade: string, bairro: string | null) {
  const consulta = encodeURIComponent(
    `${bairro ? bairro + ", " : ""}${cidade}, Brasil`
  );
  try {
    const resposta = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${consulta}&format=json&limit=1`,
      { headers: { "User-Agent": "CentralDosImoveisJF/1.0" } }
    );
    const dados = await resposta.json();
    if (dados?.[0]) {
      return {
        latitude: parseFloat(dados[0].lat),
        longitude: parseFloat(dados[0].lon),
      };
    }
  } catch {
    // Falha silenciosa: o pedido é criado sem coordenadas nesse caso
  }
  return { latitude: null, longitude: null };
}

function calcularCompatibilidadeSimples(
  pedido: { cidade: string; valorMaximo: number },
  imovel: { cidade: string; valor: number }
) {
  if (
    pedido.cidade.trim().toLowerCase() !== imovel.cidade.trim().toLowerCase()
  ) {
    return 0;
  }
  if (imovel.valor <= pedido.valorMaximo) return 90;
  const excedente = (imovel.valor - pedido.valorMaximo) / pedido.valorMaximo;
  return Math.max(0, 90 - excedente * 100);
}

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

  const { latitude, longitude } = await geocodificar(cidade, bairro);

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
      latitude,
      longitude,
    },
  });

  // IA 3 — Busca automática: avisa corretores com imóveis compatíveis
  const todosImoveis = await prisma.imovel.findMany({
    where: { status: "disponivel" },
  });

  const compativeis = todosImoveis
    .map((imovel) => ({
      imovel,
      score: calcularCompatibilidadeSimples(
        { cidade, valorMaximo },
        { cidade: imovel.cidade, valor: imovel.valor }
      ),
    }))
    .filter((r) => r.score >= 70);

  if (compativeis.length > 0) {
    await prisma.notificacao.createMany({
      data: compativeis.map((r) => ({
        corretorId: r.imovel.corretorId,
        titulo: "Nova oportunidade compatível!",
        mensagem: `Um cliente busca imóvel em ${cidade} até R$ ${valorMaximo.toLocaleString(
          "pt-BR"
        )} — compatível com "${r.imovel.titulo}".`,
        link: "/area/descoberta",
      })),
    });
  }

  revalidatePath("/area-cliente");
  revalidatePath("/area-corretor");
  revalidatePath("/area/mapa");
  revalidatePath("/area/notificacoes");

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
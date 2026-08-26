"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { LocalEmbeddingProvider } from "@/lib/jf-intelligence";
import { buildPropertyEmbeddingText } from "@/lib/jf-intelligence/embeddings/property-text";
import { normalizeProperty } from "@/lib/jf-intelligence/normalization/normalizer";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

function booleanField(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function optionalNumber(formData: FormData, key: string) {
  const value = formData.get(key);
  if (!value) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

async function salvarFotos(formData: FormData) {
  const arquivos = formData
    .getAll("fotos")
    .filter((arquivo): arquivo is File => arquivo instanceof File && arquivo.size > 0)
    .slice(0, 8);
  const pasta = path.join(process.cwd(), "public", "uploads", "imoveis");
  await mkdir(pasta, { recursive: true });
  const fotos: string[] = [];

  for (const arquivo of arquivos) {
    if (!arquivo.type.startsWith("image/") || arquivo.size > 6 * 1024 * 1024) {
      continue;
    }
    const extensao = arquivo.type.split("/")[1]?.replace("jpeg", "jpg");
    if (!extensao) continue;
    const nome = `${randomUUID()}.${extensao}`;
    await writeFile(path.join(pasta, nome), Buffer.from(await arquivo.arrayBuffer()));
    fotos.push(`/uploads/imoveis/${nome}`);
  }

  return fotos;
}

export async function criarImovel(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.papel !== "corretor") {
    return { erro: "Apenas corretores podem cadastrar imóveis." };
  }

  const perfilCorretor = await prisma.perfilCorretor.findUnique({
    where: { usuarioId: session.user.id },
  });
  if (!perfilCorretor) return { erro: "Perfil de corretor não encontrado." };

  const titulo = String(formData.get("titulo") ?? "").trim();
  const cidade = String(formData.get("cidade") ?? "").trim();
  const valor = Number(formData.get("valor"));
  const tipo = String(formData.get("tipo") ?? "casa");
  const bairro = String(formData.get("bairro") ?? "").trim() || null;
  const descricao = String(formData.get("descricao") ?? "").trim() || null;
  const fotos = await salvarFotos(formData);

  if (!titulo || !cidade || !Number.isFinite(valor) || valor <= 0) {
    return { erro: "Preencha título, cidade e valor corretamente." };
  }

  const draft = {
    id: "draft",
    titulo,
    tipo,
    cidade,
    bairro,
    valor,
    quartos: optionalNumber(formData, "quartos"),
    banheiros: optionalNumber(formData, "banheiros"),
    vagas: optionalNumber(formData, "vagas"),
    areaM2: optionalNumber(formData, "areaM2"),
    garagem: booleanField(formData, "garagem"),
    varanda: booleanField(formData, "varanda"),
    quintal: booleanField(formData, "quintal"),
    piscina: booleanField(formData, "piscina"),
    aceitaPet: booleanField(formData, "aceitaPet"),
    descricao,
    latitude: optionalNumber(formData, "latitude"),
    longitude: optionalNumber(formData, "longitude"),
  };

  const normalized = normalizeProperty(draft);
  const embeddingTexto = buildPropertyEmbeddingText(normalized);
  const embedding = await new LocalEmbeddingProvider().generate(embeddingTexto);

  await prisma.imovel.create({
    data: {
      corretorId: perfilCorretor.id,
      titulo,
      tipo,
      cidade,
      bairro,
      valor,
      quartos: draft.quartos,
      banheiros: draft.banheiros,
      vagas: draft.vagas,
      areaM2: draft.areaM2,
      garagem: draft.garagem,
      varanda: draft.varanda,
      quintal: draft.quintal,
      piscina: draft.piscina,
      aceitaPet: draft.aceitaPet,
      descricao,
      fotos,
      latitude: draft.latitude,
      longitude: draft.longitude,
      embeddingTexto,
      embedding,
    },
  });

  revalidatePath("/area/imoveis");
  revalidatePath("/area/descoberta");
  revalidatePath("/area-cliente/imoveis");
  revalidatePath("/area-cliente/intelligence");

  return { sucesso: true };
}

export async function removerImovel(imovelId: string) {
  const session = await auth();
  if (!session?.user || session.user.papel !== "corretor") {
    return { erro: "Apenas corretores podem remover imóveis." };
  }

  const perfilCorretor = await prisma.perfilCorretor.findUnique({
    where: { usuarioId: session.user.id },
  });
  if (!perfilCorretor) return { erro: "Perfil de corretor não encontrado." };

  await prisma.imovel.updateMany({
    where: { id: imovelId, corretorId: perfilCorretor.id },
    data: { status: "removido" },
  });

  revalidatePath("/area/imoveis");
  revalidatePath("/area-cliente/imoveis");
  return { sucesso: true };
}

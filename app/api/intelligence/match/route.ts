import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { matchClientRequest } from "@/lib/jf-intelligence";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const clientRequest = body?.clientRequest;
  const limit = Number(body?.limit ?? 10);

  if (typeof clientRequest !== "string" || clientRequest.trim().length < 3) {
    return NextResponse.json(
      { erro: "Informe uma descrição válida do imóvel procurado." },
      { status: 400 }
    );
  }

  const imoveis = await prisma.imovel.findMany({
    where: { status: "disponivel" },
    include: { corretor: { include: { usuario: true } } },
    orderBy: { criadoEm: "desc" },
    take: 500,
  });

  const response = await matchClientRequest({
    clientRequest,
    properties: imoveis,
    limit,
  });

  return NextResponse.json(response);
}

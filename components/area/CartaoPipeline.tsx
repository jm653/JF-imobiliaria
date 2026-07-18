"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { atualizarEstagioPipeline } from "@/app/actions/pipeline";

export default function CartaoPipeline({
  desbloqueioId,
  nomeCliente,
  cidade,
  valorMaximo,
  proximoEstagio,
  estagioAnterior,
}: {
  desbloqueioId: string;
  nomeCliente: string;
  cidade: string;
  valorMaximo: number;
  estagioAtual: string;
  proximoEstagio: string | null;
  estagioAnterior: string | null;
}) {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);

  async function mover(novoEstagio: string) {
    setCarregando(true);
    await atualizarEstagioPipeline(desbloqueioId, novoEstagio);
    setCarregando(false);
    router.refresh();
  }

  return (
    <div className="jf-panel rounded-lg p-4">
      <p className="font-body text-sm font-medium text-white">
        {nomeCliente}
      </p>
      <p className="mt-1 font-body text-xs text-white/50">
        {cidade} · até R$ {valorMaximo.toLocaleString("pt-BR")}
      </p>

      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={() => estagioAnterior && mover(estagioAnterior)}
          disabled={!estagioAnterior || carregando}
          className="rounded-full p-1.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-20"
          aria-label="Voltar estágio"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => proximoEstagio && mover(proximoEstagio)}
          disabled={!proximoEstagio || carregando}
          className="rounded-full border border-[#DAA520]/30 bg-[#DAA520]/10 p-1.5 text-[#DAA520] transition-colors hover:bg-[#DAA520]/20 disabled:opacity-20"
          aria-label="Avançar estágio"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

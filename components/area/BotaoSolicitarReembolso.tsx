"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCcw } from "lucide-react";
import { solicitarReembolso } from "@/app/actions/garantia";

export default function BotaoSolicitarReembolso({
  desbloqueioId,
}: {
  desbloqueioId: string;
}) {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleClick() {
    setCarregando(true);
    setErro("");
    const resultado = await solicitarReembolso(desbloqueioId);
    setCarregando(false);

    if (resultado?.erro) {
      setErro(resultado.erro);
      return;
    }

    router.refresh();
  }

  return (
    <div className="mt-2">
      <button
        onClick={handleClick}
        disabled={carregando}
        className="flex w-full items-center justify-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 font-body text-[11px] text-white/50 transition-colors hover:border-[#DAA520]/40 hover:text-[#F4C95D] disabled:opacity-40"
      >
        <RefreshCcw size={12} />
        {carregando ? "Verificando..." : "Cliente não respondeu"}
      </button>
      {erro && (
        <p className="mt-1 font-body text-[11px] text-red-300">{erro}</p>
      )}
    </div>
  );
}
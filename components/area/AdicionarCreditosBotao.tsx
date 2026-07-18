"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import { adicionarCreditosTeste } from "@/app/actions/creditos";

export default function AdicionarCreditosBotao() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);

  async function handleClick() {
    setCarregando(true);
    await adicionarCreditosTeste();
    setCarregando(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleClick}
      disabled={carregando}
      className="jf-primary-action inline-flex items-center justify-center gap-2 px-5 py-2.5 font-body text-sm"
    >
      <Zap size={16} />
      {carregando ? "Recarregando..." : "+ 50 créditos (modo teste)"}
    </button>
  );
}

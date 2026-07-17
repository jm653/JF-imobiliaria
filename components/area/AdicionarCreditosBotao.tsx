"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
      className="rounded-full bg-[#DAA520] px-5 py-2.5 font-body text-sm font-semibold text-[#050817] transition-transform hover:scale-[1.02] disabled:opacity-50"
    >
      {carregando ? "Adicionando..." : "+ 50 créditos (modo teste)"}
    </button>
  );
}
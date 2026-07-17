"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { desbloquearContato } from "@/app/actions/pedidos";

export default function DesbloquearBotao({
  pedidoId,
  custo = 10,
}: {
  pedidoId: string;
  custo?: number;
}) {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleClick() {
    setCarregando(true);
    setErro("");

    const resultado = await desbloquearContato(pedidoId);

    if (resultado?.erro) {
      setErro(resultado.erro);
      setCarregando(false);
      return;
    }

    router.refresh();
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={carregando}
        className="rounded-full border border-[#DAA520]/40 bg-[#DAA520]/10 px-4 py-2 font-body text-sm font-medium text-[#F4C95D] transition-all hover:bg-[#DAA520]/20 disabled:opacity-50"
      >
        {carregando ? "Desbloqueando..." : `Desbloquear contato — ${custo} créditos`}
      </button>
      {erro && <p className="mt-2 text-xs text-red-300">{erro}</p>}
    </div>
  );
}
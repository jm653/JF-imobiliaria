"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyholeOpen } from "lucide-react";
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
        className="jf-primary-action inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 font-body text-sm"
      >
        <LockKeyholeOpen size={16} />
        {carregando ? "Desbloqueando..." : `Desbloquear · ${custo} créditos`}
      </button>
      {erro && <p className="mt-2 text-xs text-red-300">{erro}</p>}
    </div>
  );
}

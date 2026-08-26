"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { desbloquearContato } from "@/app/actions/pedidos";
import BotaoAnimado from "@/components/area/BotaoAnimado";

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
      <BotaoAnimado tipo="button" onClick={handleClick} disabled={carregando}>
        {carregando ? "Desbloqueando..." : `Desbloquear · ${custo} créditos`}
      </BotaoAnimado>
      {erro && <p className="mt-2 text-xs text-red-300">{erro}</p>}
    </div>
  );
}
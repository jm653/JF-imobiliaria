"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { removerImovel } from "@/app/actions/imoveis";

export default function BotaoRemoverImovel({
  imovelId,
}: {
  imovelId: string;
}) {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);

  async function handleClick() {
    if (!confirm("Remover esse imóvel do anúncio?")) return;
    setCarregando(true);
    await removerImovel(imovelId);
    setCarregando(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleClick}
      disabled={carregando}
      className="rounded-full p-2 text-white/30 transition-colors hover:bg-red-500/10 hover:text-red-300 disabled:opacity-30"
      aria-label="Remover imóvel"
    >
      <Trash2 size={16} />
    </button>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { agendarVisita } from "@/app/actions/agenda";

export default function FormularioVisita({
  desbloqueioId,
  dataAtual,
}: {
  desbloqueioId: string;
  dataAtual: string;
}) {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(formData: FormData) {
    setCarregando(true);
    const dataVisita = formData.get("dataVisita") as string;
    await agendarVisita(desbloqueioId, dataVisita);
    setCarregando(false);
    router.refresh();
  }

  return (
    <form action={handleSubmit} className="mt-3 flex flex-wrap items-center gap-2">
      <input
        type="datetime-local"
        name="dataVisita"
        defaultValue={dataAtual}
        className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 font-body text-sm text-white outline-none focus:border-[#DAA520]/60"
      />
      <button
        type="submit"
        disabled={carregando}
        className="rounded-full bg-[#DAA520]/15 px-3 py-1.5 font-body text-xs font-medium text-[#F4C95D] transition-colors hover:bg-[#DAA520]/25 disabled:opacity-50"
      >
        {carregando ? "Salvando..." : dataAtual ? "Atualizar" : "Agendar"}
      </button>
    </form>
  );
}
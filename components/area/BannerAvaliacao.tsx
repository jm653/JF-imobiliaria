"use client";

import { useState } from "react";
import { enviarAvaliacao } from "@/app/actions/avaliacao";

export default function BannerAvaliacao() {
  const [aberto, setAberto] = useState(true);
  const [nota, setNota] = useState(0);
  const [enviado, setEnviado] = useState(false);

  async function handleSubmit(formData: FormData) {
    const comentario = formData.get("comentario") as string;
    await enviarAvaliacao(nota, comentario);
    setEnviado(true);
  }

  if (!aberto) return null;

  if (enviado) {
    return (
      <div className="mb-6 rounded-2xl border border-[#DAA520]/30 bg-[#DAA520]/5 p-5 text-center font-body text-sm text-[#F4C95D]">
        Obrigado pela avaliação! 🙌
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-2xl border border-[#DAA520]/30 bg-[#DAA520]/5 p-5">
      <div className="flex items-center justify-between">
        <p className="font-body text-sm font-medium text-white">
          O que você acha da plataforma até agora?
        </p>
        <button
          onClick={() => setAberto(false)}
          className="font-body text-xs text-white/40 hover:text-white"
        >
          Agora não
        </button>
      </div>

      <form action={handleSubmit} className="mt-3 space-y-3">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setNota(n)}
              className={`text-2xl transition-colors ${
                n <= nota ? "text-[#DAA520]" : "text-white/20"
              }`}
              aria-label={`${n} estrela(s)`}
            >
              ★
            </button>
          ))}
        </div>
        <input
          name="comentario"
          placeholder="Algum comentário? (opcional)"
          className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 font-body text-sm text-white outline-none focus:border-[#DAA520]/60"
        />
        <button
          type="submit"
          disabled={nota === 0}
          className="rounded-full bg-[#DAA520] px-5 py-2 font-body text-sm font-semibold text-[#050817] disabled:opacity-40"
        >
          Enviar avaliação
        </button>
      </form>
    </div>
  );
}
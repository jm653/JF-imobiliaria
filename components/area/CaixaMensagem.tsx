"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { enviarMensagem } from "@/app/actions/mensagens";

export default function CaixaMensagem({
  desbloqueioId,
}: {
  desbloqueioId: string;
}) {
  const router = useRouter();
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(formData: FormData) {
    const conteudo = formData.get("conteudo") as string;
    if (!conteudo.trim()) return;

    setEnviando(true);
    await enviarMensagem(desbloqueioId, conteudo);
    setTexto("");
    setEnviando(false);
    router.refresh();
  }

  return (
    <form action={handleSubmit} className="flex gap-2">
      <input
        name="conteudo"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escreva uma mensagem..."
        className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 font-body text-sm text-white outline-none focus:border-[#DAA520]/60"
      />
      <button
        type="submit"
        disabled={enviando}
        className="rounded-full bg-[#DAA520] p-2.5 text-[#050817] transition-transform hover:scale-105 disabled:opacity-50"
        aria-label="Enviar"
      >
        <Send size={18} />
      </button>
    </form>
  );
}
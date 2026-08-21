"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { atualizarPerfil } from "@/app/actions/perfil";

export default function FormularioPerfil({
  nomeAtual,
  telefoneAtual,
  creciAtual,
  ehCorretor,
}: {
  nomeAtual: string;
  telefoneAtual: string;
  creciAtual: string;
  ehCorretor: boolean;
}) {
  const router = useRouter();
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSalvando(true);
    setErro("");
    const resultado = await atualizarPerfil(formData);
    setSalvando(false);

    if (resultado?.erro) {
      setErro(resultado.erro);
      return;
    }

    router.refresh();
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block font-body text-xs text-white/55">Nome</label>
        <input
          name="nome"
          required
          defaultValue={nomeAtual}
          className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-[#DAA520]/60"
        />
      </div>
      <div>
        <label className="mb-1 block font-body text-xs text-white/55">Telefone</label>
        <input
          name="telefone"
          defaultValue={telefoneAtual}
          placeholder="(00) 00000-0000"
          className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-[#DAA520]/60"
        />
      </div>
      {ehCorretor && (
        <div>
          <label className="mb-1 block font-body text-xs text-white/55">CRECI</label>
          <input
            name="creci"
            defaultValue={creciAtual}
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-[#DAA520]/60"
          />
        </div>
      )}
      {erro && (
        <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {erro}
        </p>
      )}
      <button
        type="submit"
        disabled={salvando}
        className="jf-primary-action px-5 py-2.5 font-body text-sm"
      >
        {salvando ? "Salvando..." : "Salvar perfil"}
      </button>
    </form>
  );
}

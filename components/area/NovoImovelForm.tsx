"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { criarImovel } from "@/app/actions/imoveis";

export default function NovoImovelForm() {
  const router = useRouter();
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(formData: FormData) {
    setCarregando(true);
    setErro("");
    const resultado = await criarImovel(formData);
    setCarregando(false);

    if (resultado?.erro) {
      setErro(resultado.erro);
      return;
    }

    router.refresh();
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <input
          name="titulo"
          required
          placeholder="Título do imóvel"
          className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-[#DAA520]/60 md:col-span-2"
        />
        <select
          name="tipo"
          className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-[#DAA520]/60"
        >
          <option value="casa">Casa</option>
          <option value="apartamento">Apartamento</option>
          <option value="terreno">Terreno</option>
          <option value="comercial">Comercial</option>
        </select>
        <input name="cidade" required placeholder="Cidade" className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-[#DAA520]/60" />
        <input name="bairro" placeholder="Bairro" className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-[#DAA520]/60" />
        <input name="valor" required type="number" min="1" placeholder="Valor" className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-[#DAA520]/60" />
        <input name="quartos" type="number" min="0" placeholder="Quartos" className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-[#DAA520]/60" />
        <input name="banheiros" type="number" min="0" placeholder="Banheiros" className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-[#DAA520]/60" />
        <input name="vagas" type="number" min="0" placeholder="Vagas" className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-[#DAA520]/60" />
        <input name="areaM2" type="number" min="0" placeholder="Área m²" className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-[#DAA520]/60" />
      </div>

      <div className="flex flex-wrap gap-4 font-body text-sm text-white/70">
        {[
          ["garagem", "Garagem"],
          ["varanda", "Varanda"],
          ["quintal", "Quintal"],
          ["piscina", "Piscina"],
          ["aceitaPet", "Aceita pet"],
        ].map(([name, label]) => (
          <label key={name} className="flex items-center gap-2">
            <input type="checkbox" name={name} className="accent-[#DAA520]" />
            {label}
          </label>
        ))}
      </div>

      <textarea
        name="descricao"
        rows={3}
        placeholder="Descrição objetiva do imóvel, localização e diferenciais"
        className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-[#DAA520]/60"
      />

      {erro && (
        <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {erro}
        </p>
      )}

      <button
        type="submit"
        disabled={carregando}
        className="jf-primary-action px-5 py-2.5 font-body text-sm"
      >
        {carregando ? "Cadastrando..." : "Cadastrar imóvel com IA"}
      </button>
    </form>
  );
}

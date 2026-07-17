"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { criarPedido } from "@/app/actions/pedidos";

export default function NovoPedidoForm() {
  const router = useRouter();
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [aberto, setAberto] = useState(false);

  async function handleSubmit(formData: FormData) {
    setCarregando(true);
    setErro("");

    const resultado = await criarPedido(formData);

    if (resultado?.erro) {
      setErro(resultado.erro);
      setCarregando(false);
      return;
    }

    setCarregando(false);
    setAberto(false);
    router.refresh();
  }

  if (!aberto) {
    return (
      <button
        onClick={() => setAberto(true)}
        className="w-full rounded-full bg-[#DAA520] py-3 font-body text-sm font-semibold text-[#050817] transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        + Publicar novo pedido
      </button>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-4 text-left">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="mb-1 block font-body text-xs text-white/60">
            Cidade *
          </label>
          <input
            name="cidade"
            required
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-[#DAA520]/60"
            placeholder="Poços de Caldas"
          />
        </div>
        <div>
          <label className="mb-1 block font-body text-xs text-white/60">
            Bairro
          </label>
          <input
            name="bairro"
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-[#DAA520]/60"
            placeholder="Opcional"
          />
        </div>
        <div>
          <label className="mb-1 block font-body text-xs text-white/60">
            Valor máximo (R$) *
          </label>
          <input
            name="valorMaximo"
            type="number"
            required
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-[#DAA520]/60"
            placeholder="500000"
          />
        </div>
        <div>
          <label className="mb-1 block font-body text-xs text-white/60">
            Quartos
          </label>
          <input
            name="quartos"
            type="number"
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-[#DAA520]/60"
          />
        </div>
        <div>
          <label className="mb-1 block font-body text-xs text-white/60">
            Banheiros
          </label>
          <input
            name="banheiros"
            type="number"
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-[#DAA520]/60"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 font-body text-sm text-white/70">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="garagem" className="accent-[#DAA520]" />{" "}
          Garagem
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="varanda" className="accent-[#DAA520]" />{" "}
          Varanda
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="quintal" className="accent-[#DAA520]" />{" "}
          Quintal
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="aceitaPet"
            className="accent-[#DAA520]"
          />{" "}
          Aceita pet
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="aceitaFinanciamento"
            className="accent-[#DAA520]"
          />{" "}
          Financiamento
        </label>
      </div>

      <div>
        <label className="mb-1 block font-body text-xs text-white/60">
          Descreva com suas palavras (opcional)
        </label>
        <textarea
          name="descricaoLivre"
          rows={3}
          className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-[#DAA520]/60"
          placeholder="Quero uma casa perto do centro, com bastante luz natural..."
        />
      </div>

      {erro && (
        <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {erro}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setAberto(false)}
          className="flex-1 rounded-full border border-white/20 py-2.5 text-sm text-white/70"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={carregando}
          className="flex-1 rounded-full bg-[#DAA520] py-2.5 text-sm font-semibold text-[#050817] disabled:opacity-50"
        >
          {carregando ? "Publicando..." : "Publicar pedido"}
        </button>
      </div>
    </form>
  );
}
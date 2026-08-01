"use client";

import { useState } from "react";

const TAXA_ANUAL_PADRAO = 10.5; // % ao ano — taxa de referência estimada

function calcularParcela(
  valorFinanciado: number,
  taxaAnual: number,
  meses: number
) {
  const taxaMensal = Math.pow(1 + taxaAnual / 100, 1 / 12) - 1;
  if (taxaMensal === 0 || meses === 0) return valorFinanciado / (meses || 1);
  const parcela =
    (valorFinanciado * taxaMensal * Math.pow(1 + taxaMensal, meses)) /
    (Math.pow(1 + taxaMensal, meses) - 1);
  return parcela;
}

export default function SimuladorFinanciamento({
  valorImovel,
}: {
  valorImovel?: number;
}) {
  const [valor, setValor] = useState(valorImovel ?? 300000);
  const [entrada, setEntrada] = useState(
    Math.round((valorImovel ?? 300000) * 0.2)
  );
  const [prazoAnos, setPrazoAnos] = useState(30);
  const [renda, setRenda] = useState(0);

  const valorFinanciado = Math.max(valor - entrada, 0);
  const meses = prazoAnos * 12;
  const parcela = calcularParcela(valorFinanciado, TAXA_ANUAL_PADRAO, meses);
  const comprometimentoRenda = renda > 0 ? (parcela / renda) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block font-body text-xs text-white/60">
            Valor do imóvel (R$)
          </label>
          <input
            type="number"
            value={valor}
            onChange={(e) => setValor(Number(e.target.value))}
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-[#DAA520]/60"
          />
        </div>
        <div>
          <label className="mb-1 block font-body text-xs text-white/60">
            Entrada (R$)
          </label>
          <input
            type="number"
            value={entrada}
            onChange={(e) => setEntrada(Number(e.target.value))}
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-[#DAA520]/60"
          />
        </div>
        <div>
          <label className="mb-1 block font-body text-xs text-white/60">
            Prazo (anos)
          </label>
          <input
            type="number"
            value={prazoAnos}
            onChange={(e) => setPrazoAnos(Number(e.target.value))}
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-[#DAA520]/60"
          />
        </div>
        <div>
          <label className="mb-1 block font-body text-xs text-white/60">
            Sua renda mensal (R$)
          </label>
          <input
            type="number"
            value={renda || ""}
            onChange={(e) => setRenda(Number(e.target.value))}
            placeholder="Opcional"
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#DAA520]/60"
          />
        </div>
      </div>

      <div className="rounded-xl border border-[#DAA520]/30 bg-[#DAA520]/5 p-5">
        <p className="font-body text-sm text-white/50">Parcela estimada</p>
        <p className="mt-1 font-display text-2xl font-bold text-[#F4C95D]">
          R${" "}
          {parcela.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          <span className="text-sm font-normal text-white/40">/mês</span>
        </p>

        {renda > 0 && (
          <p className="mt-2 font-body text-xs text-white/50">
            Isso representa{" "}
            <span
              className={
                comprometimentoRenda > 30 ? "text-red-300" : "text-[#F4C95D]"
              }
            >
              {comprometimentoRenda.toFixed(0)}%
            </span>{" "}
            da renda mensal informada.
            {comprometimentoRenda > 30 &&
              " Bancos costumam recomendar até 30%."}
          </p>
        )}

        <p className="mt-3 font-body text-[11px] leading-relaxed text-white/30">
          Simulação estimada com taxa de referência de {TAXA_ANUAL_PADRAO}% ao
          ano. Não substitui a simulação oficial do seu banco.
        </p>
      </div>
    </div>
  );
}
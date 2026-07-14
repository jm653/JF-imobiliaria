"use client";

import { useEffect, useRef, useState } from "react";

const EXEMPLO =
  "Quero uma casa em Poços de Caldas até R$ 500.000, com 2 quartos e garagem coberta";

const CHIPS = [
  { label: "Poços de Caldas", icon: "📍" },
  { label: "Até R$ 500.000", icon: "💰" },
  { label: "2 quartos", icon: "🛏️" },
  { label: "Garagem coberta", icon: "🚗" },
];

export default function AiDemo() {
  const [texto, setTexto] = useState("");
  const [mostrarChips, setMostrarChips] = useState(false);
  const [mostrarScore, setMostrarScore] = useState(false);
  const cicloRef = useRef(0);

  useEffect(() => {
    const reduzMovimento = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduzMovimento) {
      setTexto(EXEMPLO);
      setMostrarChips(true);
      setMostrarScore(true);
      return;
    }

    let ativo = true;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    async function rodarCiclo() {
      const meuCiclo = ++cicloRef.current;

      setTexto("");
      setMostrarChips(false);
      setMostrarScore(false);

      for (let i = 1; i <= EXEMPLO.length; i++) {
        await new Promise((r) => timeouts.push(setTimeout(r, 32)));
        if (!ativo || meuCiclo !== cicloRef.current) return;
        setTexto(EXEMPLO.slice(0, i));
      }

      await new Promise((r) => timeouts.push(setTimeout(r, 500)));
      if (!ativo || meuCiclo !== cicloRef.current) return;
      setMostrarChips(true);

      await new Promise((r) => timeouts.push(setTimeout(r, 1400)));
      if (!ativo || meuCiclo !== cicloRef.current) return;
      setMostrarScore(true);

      await new Promise((r) => timeouts.push(setTimeout(r, 3800)));
      if (!ativo || meuCiclo !== cicloRef.current) return;
      rodarCiclo();
    }

    rodarCiclo();

    return () => {
      ativo = false;
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 shadow-2xl">
      <div className="flex items-center gap-2 mb-4">
        <span className="h-2 w-2 rounded-full bg-[#DAA520]" />
        <span className="font-mono text-xs tracking-wide text-white/50">
          IA interpretando pedido em tempo real
        </span>
      </div>

      <div className="min-h-[3.5rem] font-body text-lg text-white/90 leading-relaxed">
        {texto}
        <span className="inline-block w-[2px] h-5 bg-[#DAA520] ml-0.5 align-middle animate-[cursor-blink_1s_step-start_infinite]" />
      </div>

      <div className="flex flex-wrap gap-2 mt-5 min-h-[2.5rem]">
        {mostrarChips &&
          CHIPS.map((chip, i) => (
            <span
              key={chip.label}
              className="animate-chip-in opacity-0 flex items-center gap-1.5 rounded-full border border-[#DAA520]/30 bg-[#DAA520]/10 px-3 py-1.5 font-mono text-xs text-[#F4C95D]"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <span>{chip.icon}</span>
              {chip.label}
            </span>
          ))}
      </div>

      {mostrarScore && (
        <div className="animate-chip-in opacity-0 mt-5 flex items-center justify-between rounded-xl border border-[#DAA520]/40 bg-gradient-to-r from-[#DAA520]/15 to-transparent px-4 py-3">
          <span className="font-body text-sm text-white/70">
            3 imóveis compatíveis encontrados
          </span>
          <span className="font-mono text-lg font-semibold text-[#F4C95D]">
            96% match
          </span>
        </div>
      )}
    </div>
  );
}
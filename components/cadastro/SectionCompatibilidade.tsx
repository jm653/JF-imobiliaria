"use client";

import { motion } from "framer-motion";

const imoveis = [
  { compat: 97, nome: "Bairro Jardim", top: "20%", left: "30%" },
  { compat: 91, nome: "Centro", top: "48%", left: "62%" },
  { compat: 85, nome: "Vila Nova", top: "68%", left: "22%" },
  { compat: 76, nome: "Zona Sul", top: "32%", left: "78%" },
];

export default function SectionCompatibilidade() {
  return (
    <section
      id="mapa"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24"
    >
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[#DAA520]"
      >
        Compatibilidade inteligente
      </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-14 max-w-2xl text-center font-display text-3xl font-bold text-white sm:text-5xl"
      >
        Escolha exatamente onde deseja morar.
      </motion.h2>

      <div className="relative h-[380px] w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-sm">
        <svg
          className="absolute inset-0 h-full w-full opacity-20"
          viewBox="0 0 400 380"
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <line
              key={`h${i}`}
              x1="0"
              y1={i * 38}
              x2="400"
              y2={i * 38}
              stroke="#DAA520"
              strokeWidth="0.5"
            />
          ))}
          {Array.from({ length: 11 }).map((_, i) => (
            <line
              key={`v${i}`}
              x1={i * 40}
              y1="0"
              x2={i * 40}
              y2="380"
              stroke="#DAA520"
              strokeWidth="0.5"
            />
          ))}
        </svg>

        {imoveis.map((imovel, i) => (
          <motion.div
            key={imovel.nome}
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            className="absolute flex flex-col items-center"
            style={{ top: imovel.top, left: imovel.left }}
          >
            <span className="absolute -inset-3 -z-10 animate-pulse rounded-full bg-[#DAA520]/20 blur-xl" />
            <div className="rounded-full border border-[#DAA520]/50 bg-[#050817]/80 px-3 py-1.5 font-mono text-sm font-semibold text-[#F4C95D] shadow-lg">
              {imovel.compat}%
            </div>
            <span className="mt-1 font-body text-[11px] text-white/50">
              {imovel.nome}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
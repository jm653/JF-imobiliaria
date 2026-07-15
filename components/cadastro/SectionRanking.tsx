"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Award } from "lucide-react";

const podio = [
  { posicao: 2, nome: "Marina S.", pontos: "2.340 XP", altura: "h-28", icone: Medal },
  { posicao: 1, nome: "Rafael T.", pontos: "3.120 XP", altura: "h-40", icone: Trophy },
  { posicao: 3, nome: "Bruno L.", pontos: "1.980 XP", altura: "h-20", icone: Award },
];

export default function SectionRanking() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[#DAA520]"
      >
        Reconhecimento
      </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-16 max-w-2xl text-center font-display text-3xl font-bold text-white sm:text-5xl"
      >
        Performance merece reconhecimento.
      </motion.h2>

      <div className="flex w-full max-w-2xl items-end justify-center gap-4">
        {podio.map((corretor, i) => {
          const Icone = corretor.icone;
          return (
            <motion.div
              key={corretor.nome}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="flex flex-1 flex-col items-center"
            >
              <Icone
                className={
                  corretor.posicao === 1 ? "text-[#F4C95D]" : "text-white/50"
                }
                size={corretor.posicao === 1 ? 32 : 24}
              />
              <p className="mt-2 font-body text-sm font-medium text-white">
                {corretor.nome}
              </p>
              <p className="font-mono text-xs text-[#DAA520]">
                {corretor.pontos}
              </p>
              <div
                className={`mt-3 w-full rounded-t-xl border border-[#DAA520]/30 bg-gradient-to-t from-[#DAA520]/20 to-transparent ${corretor.altura}`}
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
"use client";

import { motion } from "framer-motion";
import { MessageCircle, Coins } from "lucide-react";

export default function SectionCreditos() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[#DAA520]"
      >
        Sistema de créditos
      </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-14 max-w-2xl text-center font-display text-3xl font-bold text-white sm:text-5xl"
      >
        Cada conexão possui valor.
        <br />
        Cada oportunidade é qualificada.
      </motion.h2>

      <div className="w-full max-w-md space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl"
        >
          <div>
            <p className="font-body text-sm text-white/60">
              Nova oportunidade
            </p>
            <p className="font-display text-lg font-semibold text-white">
              Apartamento 3 quartos — Centro
            </p>
          </div>
          <span className="rounded-full border border-[#DAA520]/40 bg-[#DAA520]/10 px-3 py-1 font-mono text-sm font-semibold text-[#F4C95D]">
            98%
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3">
            <Coins className="text-[#DAA520]" size={20} />
            <span className="font-body text-sm text-white/70">Créditos</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-sm">
            <span className="text-white/40 line-through">500</span>
            <span className="text-[#F4C95D]">→ 480</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center gap-3 rounded-2xl border border-[#DAA520]/40 bg-gradient-to-r from-[#DAA520]/15 to-transparent p-5"
        >
          <MessageCircle className="text-[#F4C95D]" size={20} />
          <div>
            <p className="font-body text-sm text-white/70">
              Contato desbloqueado
            </p>
            <p className="font-mono text-base font-semibold text-[#F4C95D]">
              (35) 9****-****
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
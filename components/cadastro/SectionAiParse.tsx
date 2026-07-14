"use client";

import { motion } from "framer-motion";
import AiDemo from "@/components/AiDemo";

export default function SectionAiParse() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center gap-12 px-6 py-24 lg:flex-row lg:gap-20">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.9 }}
        className="max-w-md text-center lg:text-left"
      >
        <span className="mb-3 inline-block font-mono text-xs uppercase tracking-[0.2em] text-[#DAA520]">
          Inteligência artificial
        </span>
        <h2 className="font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
          Sem formulários.
          <br />
          Apenas converse.
        </h2>
        <p className="mt-5 font-body text-white/50">
          Descreva o imóvel que você procura como quem conversa com um amigo.
          Nossa IA entende, estrutura e já começa a buscar.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.9, delay: 0.15 }}
      >
        <AiDemo />
      </motion.div>
    </section>
  );
}
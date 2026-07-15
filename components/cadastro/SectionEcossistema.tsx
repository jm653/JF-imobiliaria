"use client";

import { motion } from "framer-motion";

const funcionalidades = [
  "Publicação inteligente de imóveis",
  "Ofertas dos clientes",
  "IA conectando pessoas",
  "Compatibilidade automática",
  "Descoberta de bairros",
  "Busca por mapa",
  "CRM completo",
  "Gestão de clientes",
  "Agenda inteligente",
  "WhatsApp integrado",
  "Sistema de créditos",
  "Assistente de IA",
  "Simulação de financiamento",
  "Contratos digitais",
  "Descrição automática por IA",
  "Melhoria de fotos por IA",
  "Dashboard financeiro",
  "Previsão de preços",
  "Alertas inteligentes",
];

export default function SectionEcossistema() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[#DAA520]"
      >
        O ecossistema completo
      </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-12 max-w-2xl text-center font-display text-3xl font-bold text-white sm:text-5xl"
      >
        Não aproximamos imóveis.
        <br />
        Conectamos pessoas.
      </motion.h2>

      <div className="flex max-w-3xl flex-wrap justify-center gap-2.5">
        {funcionalidades.map((item, i) => (
          <motion.span
            key={item}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.4, delay: i * 0.03 }}
            className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-body text-sm text-white/70"
          >
            {item}
          </motion.span>
        ))}
      </div>
    </section>
  );
}
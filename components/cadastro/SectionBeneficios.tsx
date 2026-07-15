"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const paraClientes = [
  "Não perde tempo pesquisando anúncios repetidos",
  "Recebe propostas de corretores qualificados",
  "A IA entende exatamente o que você procura",
  "Você decide quando liberar seu contato",
];

const paraCorretores = [
  "Recebe oportunidades reais, não só anúncios parados",
  "Só investe créditos em leads compatíveis com seu perfil",
  "CRM, agenda, contratos e IA em um único lugar",
  "Reconhecimento por performance: ranking e conquistas",
];

export default function SectionBeneficios() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-20">
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[#DAA520]"
      >
        Dos dois lados
      </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-12 max-w-2xl text-center font-display text-3xl font-bold text-white sm:text-5xl"
      >
        Feito pra quem procura.
        <br />
        Feito pra quem atende.
      </motion.h2>

      <div className="grid w-full max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl"
        >
          <h3 className="mb-5 font-display text-lg font-semibold text-[#F4C95D]">
            Para clientes
          </h3>
          <ul className="space-y-3">
            {paraClientes.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <Check className="mt-0.5 shrink-0 text-[#DAA520]" size={16} />
                <span className="font-body text-sm text-white/70">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl"
        >
          <h3 className="mb-5 font-display text-lg font-semibold text-[#F4C95D]">
            Para corretores
          </h3>
          <ul className="space-y-3">
            {paraCorretores.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <Check className="mt-0.5 shrink-0 text-[#DAA520]" size={16} />
                <span className="font-body text-sm text-white/70">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
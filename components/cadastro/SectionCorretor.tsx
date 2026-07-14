"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  FileText,
  TrendingUp,
  Kanban,
  Bell,
} from "lucide-react";

const paineis = [
  {
    icone: Kanban,
    titulo: "Kanban de leads",
    desc: "Do primeiro contato ao contrato assinado",
  },
  {
    icone: Calendar,
    titulo: "Agenda inteligente",
    desc: "Visitas e reuniões organizadas pela IA",
  },
  {
    icone: Users,
    titulo: "CRM de clientes",
    desc: "Histórico completo de cada relacionamento",
  },
  {
    icone: FileText,
    titulo: "Contratos e propostas",
    desc: "Tudo documentado num só lugar",
  },
  {
    icone: TrendingUp,
    titulo: "Metas e comissões",
    desc: "Acompanhe seu desempenho em tempo real",
  },
  {
    icone: Bell,
    titulo: "Notificações",
    desc: "Nunca perca um lead qualificado",
  },
];

export default function SectionCorretor() {
  return (
    <section
      id="corretores"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24"
    >
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[#DAA520]"
      >
        Para corretores
      </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-14 max-w-2xl text-center font-display text-3xl font-bold text-white sm:text-5xl"
      >
        Sua imobiliária inteira.
        <br className="hidden sm:block" />
        Em um único lugar.
      </motion.h2>

      <div className="grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paineis.map((painel, i) => {
          const Icone = painel.icone;
          return (
            <motion.div
              key={painel.titulo}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-colors hover:border-[#DAA520]/30"
            >
              <Icone className="mb-3 text-[#DAA520]" size={22} />
              <h3 className="font-display text-base font-semibold text-white">
                {painel.titulo}
              </h3>
              <p className="mt-1 font-body text-sm text-white/50">
                {painel.desc}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
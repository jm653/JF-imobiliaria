"use client";

import { motion } from "framer-motion";
import { Send, Sparkles, Coins, Handshake } from "lucide-react";

const passos = [
  {
    numero: "01",
    icone: Send,
    titulo: "Você publica o que procura",
    desc: "Em vez de pesquisar anúncios, você descreve o imóvel ideal: orçamento, localização, quartos, banheiros, garagem, varanda — o que for importante pra você.",
  },
  {
    numero: "02",
    icone: Sparkles,
    titulo: "A IA interpreta e distribui",
    desc: "Nossa Inteligência Artificial entende seu pedido automaticamente e avisa os corretores com imóveis compatíveis — em tempo real.",
  },
  {
    numero: "03",
    icone: Coins,
    titulo: "Corretores desbloqueiam com créditos",
    desc: "Só corretores com imóveis realmente compatíveis investem créditos pra desbloquear seu contato. Isso evita spam e garante leads qualificados dos dois lados.",
  },
  {
    numero: "04",
    icone: Handshake,
    titulo: "Vocês negociam diretamente",
    desc: "Você recebe propostas reais de profissionais preparados — sem precisar procurar dezenas de anúncios sozinho.",
  },
];

export default function SectionComoFunciona() {
  return (
    <section
      id="como-funciona"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 py-20"
    >
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[#DAA520]"
      >
        Como funciona
      </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-12 max-w-2xl text-center font-display text-3xl font-bold text-white sm:text-5xl"
      >
        Pela primeira vez, quem procura publica.
        <br />
        Quem tem o imóvel, disputa.
      </motion.h2>

      <div className="grid w-full max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2">
        {passos.map((passo, i) => {
          const Icone = passo.icone;
          return (
            <motion.div
              key={passo.numero}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="font-mono text-xs text-[#DAA520]/60">
                  {passo.numero}
                </span>
                <Icone className="text-[#DAA520]" size={20} />
              </div>
              <h3 className="font-display text-lg font-semibold text-white">
                {passo.titulo}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-white/55">
                {passo.desc}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
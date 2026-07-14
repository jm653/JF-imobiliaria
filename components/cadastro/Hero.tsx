"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTipoConta } from "./TipoContaContext";

gsap.registerPlugin(ScrollTrigger);

const frases = [
  "O mercado imobiliário nunca mais será o mesmo.",
  "Uma nova central.",
  "Muito mais conexões.",
  "Muito mais oportunidades.",
];

export default function Hero() {
  const { setTipoConta } = useTipoConta();
  const secaoRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!secaoRef.current || !logoRef.current) return;

    const contexto = gsap.context(() => {
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 1.4, ease: "power3.out" }
      );

      gsap.to(logoRef.current, {
        scale: 0.75,
        opacity: 0.25,
        y: -50,
        ease: "none",
        scrollTrigger: {
          trigger: secaoRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, secaoRef);

    return () => contexto.revert();
  }, []);

  function irPara(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section
      ref={secaoRef}
      className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <div ref={logoRef} className="relative mb-8 opacity-0">
        <div className="absolute inset-0 -z-10 rounded-full bg-[#DAA520]/30 blur-3xl" />
        <Image
          src="/logo.jpg"
          alt="Central dos Imóveis JF"
          width={150}
          height={150}
          className="rounded-2xl"
          priority
        />
      </div>

      <div className="space-y-3">
        {frases.map((frase, i) => (
          <motion.p
            key={frase}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 + i * 1.1, ease: "easeOut" }}
            className={
              i === 0
                ? "max-w-2xl font-display text-2xl font-bold text-white sm:text-4xl"
                : "font-body text-lg text-[#F4C95D] sm:text-xl"
            }
          >
            {frase}
          </motion.p>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 5.6 }}
        className="mt-10 flex flex-wrap justify-center gap-4"
      >
        <button
          onClick={() => irPara("historia")}
          className="animate-glow rounded-full bg-[#DAA520] px-7 py-3.5 font-body text-sm font-semibold text-[#050817] transition-transform hover:scale-[1.03] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Conheça a Plataforma
        </button>
        <button
          onClick={() => {
            setTipoConta("corretor");
            irPara("criar-conta");
          }}
          className="rounded-full border border-white/20 px-7 py-3.5 font-body text-sm font-semibold text-white/90 transition-all hover:border-white/40 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DAA520]"
        >
          Sou Corretor
        </button>
      </motion.div>
    </section>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type Fase =
  | "escurecendo"
  | "logo-entrando"
  | "frase-1"
  | "frase-2"
  | "parede-dados"
  | "mergulho"
  | "concluido";

const fragmentosDados = [
  "R$ 450.000",
  "3 quartos",
  "Poços de Caldas",
  "94% match",
  "2 banheiros",
  "Garagem",
  "R$ 680.000",
  "Centro",
  "4 quartos",
  "98% match",
  "Varanda",
  "R$ 320.000",
  "Zona Sul",
  "1 banheiro",
  "91% match",
  "Financiamento",
  "R$ 890.000",
  "Jardim América",
  "5 quartos",
  "87% match",
  "Quintal",
  "R$ 275.000",
  "Vila Nova",
  "96% match",
];

const TOTAL_PARTICULAS = 50;

function aleatorioEstavel(indice: number, sal: number) {
  const valor = Math.sin(indice * 9301 + sal * 49297) * 233280;
  return valor - Math.floor(valor);
}

const particulas = Array.from({ length: TOTAL_PARTICULAS }).map((_, i) => ({
  id: i,
  x: aleatorioEstavel(i, 1) * 100,
  y: aleatorioEstavel(i, 2) * 100,
  tamanho: 1 + aleatorioEstavel(i, 3) * 2.5,
  atraso: aleatorioEstavel(i, 4) * 2,
  duracao: 3 + aleatorioEstavel(i, 5) * 4,
}));

const fragmentos = fragmentosDados.map((texto, i) => ({
  id: i,
  texto,
  x: (aleatorioEstavel(i, 6) - 0.5) * 140,
  y: (aleatorioEstavel(i, 7) - 0.5) * 140,
  atraso: aleatorioEstavel(i, 8) * 0.45,
}));

function Frase({ texto, mostrar }: { texto: string; mostrar: boolean }) {
  return (
    <AnimatePresence>
      {mostrar && (
        <motion.p className="flex flex-wrap justify-center px-6 text-center font-display text-lg font-medium text-white sm:text-2xl">
          {texto.split("").map((letra, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
              transition={{ duration: 0.5, delay: i * 0.02, ease: "easeOut" }}
            >
              {letra === " " ? "\u00A0" : letra}
            </motion.span>
          ))}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export default function AreaEntrada() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [fase, setFase] = useState<Fase>("escurecendo");

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.replace("/login");
      return;
    }

    const destino =
      session.user.papel === "corretor" ? "/area-corretor" : "/area-cliente";

    const reduzMovimento = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const jaViuIntro = sessionStorage.getItem("jf-intro-vista") === "1";

    if (reduzMovimento || jaViuIntro) {
      router.replace(destino);
      return;
    }

    const tempos: Array<[Fase, number]> = [
      ["logo-entrando", 180],
      ["frase-1", 700],
      ["frase-2", 1650],
      ["parede-dados", 2450],
      ["mergulho", 3150],
      ["concluido", 3650],
    ];

    const timeouts = tempos.map(([proximaFase, tempo]) =>
      setTimeout(() => setFase(proximaFase), tempo)
    );
    const timeoutFinal = setTimeout(() => {
      sessionStorage.setItem("jf-intro-vista", "1");
      router.replace(destino);
    }, 3900);

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(timeoutFinal);
    };
  }, [session, status, router]);

  const logoVisivel = fase !== "escurecendo" && fase !== "concluido";
  const mergulhando = fase === "mergulho" || fase === "concluido";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#050505]">
      <div className="absolute inset-0">
        {particulas.map((p) => (
          <motion.span
            key={p.id}
            className="absolute rounded-full bg-[#DAA520]"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.tamanho,
              height: p.tamanho,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0], y: [0, -40, -80] }}
            transition={{
              duration: p.duracao,
              delay: p.atraso,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <AnimatePresence>
        {fase === "parede-dados" && (
          <div className="absolute inset-0 flex items-center justify-center">
            {fragmentos.map((f) => (
              <motion.span
                key={f.id}
                className="absolute whitespace-nowrap font-mono text-xs text-[#DAA520]/70 sm:text-sm"
                initial={{ x: f.x * 0.2, y: f.y * 0.2, opacity: 0, scale: 0.5 }}
                animate={{
                  x: f.x * 4,
                  y: f.y * 4,
                  opacity: [0, 1, 0],
                  scale: 2.2,
                }}
                transition={{ duration: 1.1, delay: f.atraso, ease: "easeIn" }}
              >
                {f.texto}
              </motion.span>
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="relative flex h-full flex-col items-center justify-center gap-8">
        {session?.user && (
          <button
            onClick={() => {
              sessionStorage.setItem("jf-intro-vista", "1");
              router.replace(
                session.user.papel === "corretor"
                  ? "/area-corretor"
                  : "/area-cliente"
              );
            }}
            className="absolute right-5 top-5 rounded-full border border-white/15 px-4 py-2 font-body text-xs text-white/50 transition-colors hover:border-white/30 hover:text-white"
          >
            Pular
          </button>
        )}

        <AnimatePresence>
          {logoVisivel && (
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{
                opacity: 1,
                scale: mergulhando ? 20 : 1,
                filter: mergulhando ? "blur(20px)" : "blur(0px)",
              }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 1 },
                scale: mergulhando
                  ? { duration: 1, ease: "easeIn" }
                  : { duration: 1.2, ease: "easeOut" },
                filter: { duration: 1 },
              }}
            >
              <div className="absolute inset-0 -z-10 animate-pulse rounded-full bg-[#DAA520]/30 blur-3xl" />

              {!mergulhando && (
                <motion.svg
                  className="absolute -inset-4"
                  viewBox="0 0 120 120"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
                >
                  <circle
                    cx="60"
                    cy="60"
                    r="56"
                    fill="none"
                    stroke="#DAA520"
                    strokeWidth="1"
                    strokeDasharray="8 10"
                    opacity={0.6}
                  />
                </motion.svg>
              )}

              <Image
                src="/logo.jpg"
                alt="Central dos Imóveis JF"
                width={100}
                height={100}
                className="rounded-2xl"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {!mergulhando && (
          <div className="min-h-[3.5rem]">
            <Frase
              texto="Bem-vindo à Central dos Imóveis JF"
              mostrar={fase === "frase-1"}
            />
            <Frase
              texto="Onde oportunidades encontram profissionais"
              mostrar={fase === "frase-2"}
            />
          </div>
        )}
      </div>

      <AnimatePresence>
        {fase === "concluido" && (
          <motion.div
            className="absolute inset-0 bg-[#F4C95D]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

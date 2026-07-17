"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function AreaEntrada() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mostrarTexto, setMostrarTexto] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.replace("/login");
      return;
    }

    const reduzMovimento = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const destino =
      session.user.papel === "corretor" ? "/area-corretor" : "/area-cliente";

    if (reduzMovimento) {
      router.replace(destino);
      return;
    }

    const t1 = setTimeout(() => setMostrarTexto(true), 400);
    const t2 = setTimeout(() => {
      router.replace(destino);
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [session, status, router]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, rotate: 360 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
        className="relative"
      >
        <div className="absolute inset-0 -z-10 animate-pulse rounded-full bg-[#DAA520]/30 blur-3xl" />
        <Image
          src="/logo.jpg"
          alt="Central dos Imóveis JF"
          width={100}
          height={100}
          className="rounded-2xl"
        />
      </motion.div>

      <AnimatePresence>
        {mostrarTexto && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-8 text-center"
          >
            <p className="font-display text-lg font-semibold text-white">
              Bem-vindo à Central dos Imóveis JF
            </p>
            <p className="mt-1 font-body text-sm text-white/50">
              Onde oportunidades encontram profissionais.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
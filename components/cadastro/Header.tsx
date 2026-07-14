"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [rolou, setRolou] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    function aoRolar() {
      setRolou(window.scrollY > 40);
    }
    window.addEventListener("scroll", aoRolar);
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        rolou
          ? "border-b border-white/10 bg-[#050817]/70 py-3 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.jpg"
            alt="Central dos Imóveis JF"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <span className="font-display text-sm font-bold tracking-wide text-white">
            CENTRAL DOS IMÓVEIS <span className="text-[#DAA520]">JF</span>
          </span>
        </div>

        <nav className="hidden items-center gap-8 font-body text-sm text-white/60 md:flex">
          <a href="#historia" className="transition-colors hover:text-white">
            A plataforma
          </a>
          <a
            href="#corretores"
            className="transition-colors hover:text-white"
          >
            Para corretores
          </a>
        </nav>

        <a
          href="#criar-conta"
          className="hidden rounded-full border border-[#DAA520]/40 bg-[#DAA520]/10 px-5 py-2 font-body text-sm font-medium text-[#F4C95D] transition-all hover:bg-[#DAA520]/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DAA520] md:block"
        >
          Criar conta
        </a>

        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className="text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DAA520] md:hidden"
          aria-label="Abrir menu"
        >
          {menuAberto ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuAberto && (
        <div className="flex flex-col gap-4 border-t border-white/10 bg-[#050817]/95 px-6 py-6 font-body text-white/80 md:hidden">
          <a href="#historia" onClick={() => setMenuAberto(false)}>
            A plataforma
          </a>
          <a href="#corretores" onClick={() => setMenuAberto(false)}>
            Para corretores
          </a>
          <a href="#criar-conta" onClick={() => setMenuAberto(false)}>
            Criar conta
          </a>
        </div>
      )}
    </header>
  );
}
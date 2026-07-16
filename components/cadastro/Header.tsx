"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();
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
      <div className="mx-auto grid max-w-7xl grid-cols-2 items-center px-6 lg:grid-cols-3 lg:px-10">
        <div className="flex items-center gap-3 justify-self-start">
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

        <nav className="hidden items-center gap-8 font-body text-sm text-white/60 justify-self-center lg:flex">
          <a
            href="#como-funciona"
            className="transition-colors hover:text-white"
          >
            Como funciona
          </a>
          <a
            href="#corretores"
            className="transition-colors hover:text-white"
          >
            Para corretores
          </a>
          {!session?.user && (
            <Link href="/login" className="transition-colors hover:text-white">
              Entrar
            </Link>
          )}
        </nav>

        <div className="flex items-center justify-self-end gap-4">
          {session?.user ? (
            <div className="hidden items-center gap-3 lg:flex">
              <span className="font-body text-sm text-white/70">
                Olá, {session.user.name?.split(" ")[0]}
              </span>
              <button
                onClick={() => signOut({ redirect: false })}
                className="rounded-full border border-white/20 px-4 py-1.5 font-body text-sm text-white/70 transition-colors hover:bg-white/5"
              >
                Sair
              </button>
            </div>
          ) : (
            <a
              href="#criar-conta"
              className="hidden rounded-full border border-[#DAA520]/40 bg-[#DAA520]/10 px-5 py-2 font-body text-sm font-medium text-[#F4C95D] transition-all hover:bg-[#DAA520]/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DAA520] lg:block"
            >
              Criar conta
            </a>
          )}

          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DAA520] lg:hidden"
            aria-label="Abrir menu"
          >
            {menuAberto ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuAberto && (
        <div className="flex flex-col gap-4 border-t border-white/10 bg-[#050817]/95 px-6 py-6 font-body text-white/80 lg:hidden">
          <a href="#como-funciona" onClick={() => setMenuAberto(false)}>
            Como funciona
          </a>
          <a href="#corretores" onClick={() => setMenuAberto(false)}>
            Para corretores
          </a>
          {session?.user ? (
            <button
              onClick={() => {
                setMenuAberto(false);
                signOut({ redirect: false });
              }}
              className="text-left"
            >
              Sair ({session.user.name?.split(" ")[0]})
            </button>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuAberto(false)}>
                Entrar
              </Link>
              <a href="#criar-conta" onClick={() => setMenuAberto(false)}>
                Criar conta
              </a>
            </>
          )}
        </div>
      )}
    </header>
  );
}
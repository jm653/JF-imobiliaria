import Link from "next/link";
import { ReactNode } from "react";
import SairButton from "@/components/SairButton";

const itensMenu = [
  { label: "Início", href: "/area-cliente" },
  { label: "JF Intelligence", href: "/area-cliente/intelligence" },
  { label: "Imóveis", href: "/area-cliente/imoveis" },
  { label: "Conversas", href: "/area-cliente/conversas" },
  { label: "Configurações", href: "/area-cliente/configuracoes" },
];

export default function DashboardShellCliente({
  children,
  nome,
}: {
  children: ReactNode;
  nome: string;
}) {
  return (
    <div className="jf-page min-h-screen text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#050505]/86 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <Link
            href="/area-cliente"
            className="font-display text-sm font-bold tracking-wide"
          >
            CENTRAL <span className="text-[#DAA520]">JF</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-2">
            {itensMenu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-1.5 font-body text-xs text-white/55 transition-colors hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden max-w-32 truncate font-body text-xs text-white/40 sm:block">
              {nome}
            </span>
            <SairButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  );
}

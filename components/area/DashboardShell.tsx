"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Target,
  Sparkles,
  Users,
  Building2,
  MessageCircle,
  Calendar,
  TrendingUp,
  Coins,
  Trophy,
  Gift,
  BarChart3,
  Settings,
} from "lucide-react";
import { ReactNode } from "react";
import SairButton from "@/components/SairButton";

const itensMenu = [
  { icone: Home, label: "Home", href: "/area-corretor" },
  { icone: Target, label: "Oportunidades", href: "/area-corretor" },
  { icone: Sparkles, label: "Descoberta Inteligente", href: "/area/em-breve" },
  { icone: Users, label: "Clientes", href: "/area/clientes" },
  { icone: Building2, label: "Imóveis", href: "/area/em-breve" },
  { icone: MessageCircle, label: "Conversas", href: "/area/em-breve" },
  { icone: Calendar, label: "Agenda", href: "/area/em-breve" },
  { icone: TrendingUp, label: "Pipeline", href: "/area/pipeline" },
  { icone: Coins, label: "Créditos", href: "/area/creditos" },
  { icone: Trophy, label: "Ranking", href: "/area/ranking" },
  { icone: Gift, label: "Recompensas", href: "/area/recompensas" },
  { icone: BarChart3, label: "Analytics", href: "/area/em-breve" },
  { icone: Settings, label: "Configurações", href: "/area/configuracoes" },
];

export default function DashboardShell({
  children,
  nome,
}: {
  children: ReactNode;
  nome: string;
}) {
  const pathname = usePathname();

  return (
    <div className="jf-page flex min-h-screen text-white">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/10 bg-[#050505]/88 backdrop-blur-xl lg:block">
        <div className="flex h-20 items-center gap-3 px-6">
          <div className="h-2 w-2 rounded-full bg-[#DAA520] shadow-[0_0_18px_rgba(218,165,32,0.8)]" />
          <span className="font-display text-sm font-bold tracking-wide">
            CENTRAL <span className="text-[#DAA520]">JF</span>
          </span>
        </div>

        <nav className="mt-4 space-y-1 px-3">
          {itensMenu.map((item) => {
            const Icone = item.icone;
            const ativo =
              pathname === item.href ||
              (item.href !== "/area-corretor" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 font-body text-sm transition-all ${
                  ativo
                    ? "border border-[#DAA520]/20 bg-[#DAA520]/10 text-[#F4C95D]"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icone
                  size={18}
                  className={
                    ativo
                      ? "text-[#DAA520]"
                      : "text-white/40 transition-colors group-hover:text-[#DAA520]"
                  }
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full border-t border-white/10 p-4">
          <p className="mb-2 truncate font-body text-xs text-white/40">
            {nome}
          </p>
          <SairButton />
        </div>
      </aside>

      <main className="flex-1 p-5 lg:ml-64 lg:p-8 xl:p-10">{children}</main>
    </div>
  );
}

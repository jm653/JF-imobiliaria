"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cadastrarUsuario } from "@/app/actions/auth";
import BackgroundPremium from "@/components/BackgroundPremium";

export default function CadastroPage() {
  const router = useRouter();
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(formData: FormData) {
    setCarregando(true);
    setErro("");

    const resultado = await cadastrarUsuario(formData);

    if (resultado?.erro) {
      setErro(resultado.erro);
      setCarregando(false);
      return;
    }

    router.push("/login");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A0E27] px-4 text-white">
      <BackgroundPremium />

      <div className="relative z-10 w-full max-w-md">
        <Link
          href="/"
          className="mb-8 inline-block font-display text-lg font-bold tracking-tight"
        >
          JF <span className="text-[#DAA520]">Imobiliária</span>
        </Link>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-xl">
          <h1 className="font-display text-2xl font-bold text-white">
            Criar conta
          </h1>
          <p className="mt-1 font-body text-sm text-white/50">
            Comece a encontrar ou anunciar imóveis com IA
          </p>

          <form action={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="mb-1.5 block font-body text-sm text-white/70">
                Nome completo
              </label>
              <input
                type="text"
                name="nome"
                required
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 font-body text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#DAA520]/60 focus:ring-2 focus:ring-[#DAA520]/20"
                placeholder="Seu nome"
              />
            </div>

            <div>
              <label className="mb-1.5 block font-body text-sm text-white/70">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 font-body text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#DAA520]/60 focus:ring-2 focus:ring-[#DAA520]/20"
                placeholder="voce@email.com"
              />
            </div>

            <div>
              <label className="mb-1.5 block font-body text-sm text-white/70">
                Senha
              </label>
              <input
                type="password"
                name="senha"
                required
                minLength={6}
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 font-body text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#DAA520]/60 focus:ring-2 focus:ring-[#DAA520]/20"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            {erro && (
              <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 font-body text-sm text-red-300">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="animate-glow mt-2 w-full rounded-full bg-[#DAA520] py-3 font-body text-sm font-semibold text-[#0A0E27] transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
            >
              {carregando ? "Criando conta..." : "Criar conta"}
            </button>
          </form>

          <p className="mt-6 text-center font-body text-sm text-white/40">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-[#F4C95D] hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
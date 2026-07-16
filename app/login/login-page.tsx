"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import BackgroundPremium from "@/components/BackgroundPremium";

export default function LoginPage() {
  const router = useRouter();
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(formData: FormData) {
    setCarregando(true);
    setErro("");

    try {
      const resultado = await signIn("credentials", {
        email: formData.get("email"),
        senha: formData.get("senha"),
        redirect: false,
      });

      if (resultado?.error) {
        setErro("Email ou senha incorretos.");
        setCarregando(false);
        return;
      }

      router.push("/area");
    } catch (erroLogin) {
      console.error("Erro ao entrar:", erroLogin);
      setErro(
        "Houve um problema ao conectar. Verifique o terminal do servidor para mais detalhes."
      );
      setCarregando(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050817] px-4 text-white">
      <BackgroundPremium />

      <div className="relative z-10 w-full max-w-md">
        <Link
          href="/"
          className="mb-8 inline-block font-display text-lg font-bold tracking-tight"
        >
          Central dos Imóveis <span className="text-[#DAA520]">JF</span>
        </Link>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-xl">
          <h1 className="font-display text-2xl font-bold text-white">
            Entrar
          </h1>
          <p className="mt-1 font-body text-sm text-white/50">
            Acesse sua conta na Central dos Imóveis JF
          </p>

          <form action={handleSubmit} className="mt-7 space-y-4">
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
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 font-body text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#DAA520]/60 focus:ring-2 focus:ring-[#DAA520]/20"
                placeholder="Sua senha"
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
              className="mt-2 w-full rounded-full bg-[#DAA520] py-3 font-body text-sm font-semibold text-[#050817] transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="mt-6 text-center font-body text-sm text-white/40">
            Ainda não tem conta?{" "}
            <Link href="/" className="text-[#F4C95D] hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
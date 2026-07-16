"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { cadastrarUsuario } from "@/app/actions/auth";
import { useTipoConta } from "./TipoContaContext";

export default function SignupForm() {
  const router = useRouter();
  const { tipoConta, setTipoConta } = useTipoConta();
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

    try {
      await signIn("credentials", {
        email: formData.get("email"),
        senha: formData.get("senha"),
        redirect: false,
      });
    } catch (erroLogin) {
      // Mesmo se o login automático falhar, a conta já foi criada.
      // Seguimos em frente e deixamos a pessoa entrar manualmente se precisar.
      console.error("Erro ao logar automaticamente após cadastro:", erroLogin);
    }

    router.push("/area");
  }

  return (
    <section
      id="criar-conta"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <p className="mb-2 text-center font-mono text-xs uppercase tracking-[0.2em] text-[#DAA520]">
          Bem-vindo ao futuro do mercado imobiliário
        </p>
        <h2 className="mb-8 text-center font-display text-2xl font-bold text-white sm:text-3xl">
          Crie sua conta
        </h2>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-6 flex rounded-full border border-white/10 bg-white/[0.03] p-1">
            <button
              type="button"
              onClick={() => setTipoConta("cliente")}
              className={`flex-1 rounded-full py-2 font-body text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DAA520] ${
                tipoConta === "cliente"
                  ? "bg-[#DAA520] text-[#050817]"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              Sou Cliente
            </button>
            <button
              type="button"
              onClick={() => setTipoConta("corretor")}
              className={`flex-1 rounded-full py-2 font-body text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DAA520] ${
                tipoConta === "corretor"
                  ? "bg-[#DAA520] text-[#050817]"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              Sou Corretor
            </button>
          </div>

          <form action={handleSubmit} className="space-y-4">
            <input type="hidden" name="tipoConta" value={tipoConta} />

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
              className="animate-glow mt-2 w-full rounded-full bg-[#DAA520] py-3 font-body text-sm font-semibold text-[#050817] transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {carregando ? "Criando conta..." : "Criar conta"}
            </button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
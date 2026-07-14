"use client";

import dynamic from "next/dynamic";
import Header from "@/components/cadastro/Header";
import Hero from "@/components/cadastro/Hero";
import StorySection from "@/components/cadastro/StorySection";
import SectionAiParse from "@/components/cadastro/SectionAiParse";
import SectionCompatibilidade from "@/components/cadastro/SectionCompatibilidade";
import SectionCorretor from "@/components/cadastro/SectionCorretor";
import SignupForm from "@/components/cadastro/SignupForm";
import SmoothScroll from "@/components/cadastro/SmoothScroll";
import { TipoContaProvider } from "@/components/cadastro/TipoContaContext";

const Scene3D = dynamic(() => import("@/components/cadastro/Scene3D"), {
  ssr: false,
});

export default function CadastroPage() {
  return (
    <TipoContaProvider>
      <SmoothScroll>
        <main className="relative bg-[#050817] text-white">
          <Scene3D />
          <Header />

          <Hero />

          <StorySection
            id="historia"
            eyebrow="O problema"
            title="Todos procuram. Poucos encontram."
          />

          <StorySection title="O mercado imobiliário ainda funciona como há décadas." />

          <StorySection eyebrow="A virada" title="Nós mudamos isso." />

          <SectionAiParse />

          <SectionCompatibilidade />

          <SectionCorretor />

          <StorySection
            eyebrow="Central dos Imóveis JF"
            title="Bem-vindo ao futuro do mercado imobiliário."
          />

          <SignupForm />
        </main>
      </SmoothScroll>
    </TipoContaProvider>
  );
}
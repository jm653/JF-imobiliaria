"use client";

import dynamic from "next/dynamic";
import Header from "@/components/cadastro/Header";
import Hero from "@/components/cadastro/Hero";
import StorySection from "@/components/cadastro/StorySection";
import SectionComoFunciona from "@/components/cadastro/SectionComoFunciona";
import SectionAiParse from "@/components/cadastro/SectionAiParse";
import SectionCompatibilidade from "@/components/cadastro/SectionCompatibilidade";
import SectionCorretor from "@/components/cadastro/SectionCorretor";
import SectionCreditos from "@/components/cadastro/SectionCreditos";
import SectionBeneficios from "@/components/cadastro/SectionBeneficios";
import SectionRanking from "@/components/cadastro/SectionRanking";
import SectionEcossistema from "@/components/cadastro/SectionEcossistema";
import SignupForm from "@/components/cadastro/SignupForm";
import SmoothScroll from "@/components/cadastro/SmoothScroll";
import { TipoContaProvider } from "@/components/cadastro/TipoContaContext";

const Scene3D = dynamic(() => import("@/components/cadastro/Scene3D"), {
  ssr: false,
});

export default function Home() {
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
          >
            Hoje, clientes gastam meses pesquisando os mesmos anúncios
            repetidos. Corretores publicam e esperam. Ninguém encontra o que
            realmente procura, na hora certa.
          </StorySection>

          <StorySection title="O mercado imobiliário ainda funciona como há décadas.">
            Portais tradicionais só mostram o que já está anunciado. Se o
            imóvel ideal não existir hoje, você nunca vai saber quando ele
            aparecer.
          </StorySection>

          <StorySection eyebrow="A virada" title="Nós mudamos isso.">
            Na Central dos Imóveis JF, você não procura imóveis — você
            publica exatamente o que quer, e os corretores competem para te
            atender.
          </StorySection>

          <SectionComoFunciona />
          <SectionAiParse />
          <SectionCompatibilidade />
          <SectionCorretor />
          <SectionCreditos />
          <SectionBeneficios />
          <SectionRanking />
          <SectionEcossistema />

          <StorySection
            eyebrow="Central dos Imóveis JF"
            title="Bem-vindo ao futuro do mercado imobiliário."
          >
            Não é apenas mais um portal de anúncios. É a primeira plataforma
            onde clientes publicam o que querem e corretores competem, com
            IA, créditos e reconhecimento por performance — tudo em um único
            lugar.
          </StorySection>

          <SignupForm />
        </main>
      </SmoothScroll>
    </TipoContaProvider>
  );
}
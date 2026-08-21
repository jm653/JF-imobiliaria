"use client";

import { useState } from "react";
import { Brain, Check, Loader2, Search, ShieldAlert, X } from "lucide-react";
import type { MatchResponse } from "@/lib/jf-intelligence";

const exemplo =
  "Quero uma casa até R$ 500.000, com pelo menos 2 quartos, 2 banheiros, garagem, varanda e em uma região tranquila.";

export default function IntelligenceMatchTester() {
  const [texto, setTexto] = useState(exemplo);
  const [resultado, setResultado] = useState<MatchResponse | null>(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function buscarMatch() {
    setCarregando(true);
    setErro("");
    setResultado(null);

    const response = await fetch("/api/intelligence/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientRequest: texto, limit: 10 }),
    });

    const data = await response.json();
    setCarregando(false);

    if (!response.ok) {
      setErro(data?.erro ?? "Não foi possível executar o matching.");
      return;
    }

    setResultado(data);
  }

  return (
    <div className="space-y-6">
      <section className="jf-panel-strong rounded-lg p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-full bg-[#DAA520]/15 p-3 text-[#F4C95D]">
            <Brain size={22} />
          </div>
          <div>
            <p className="jf-kicker">JF Intelligence</p>
            <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Encontre imóveis por significado
            </h1>
          </div>
        </div>

        <textarea
          value={texto}
          onChange={(event) => setTexto(event.target.value)}
          rows={5}
          className="w-full resize-none rounded-lg border border-white/10 bg-black/25 px-4 py-3 font-body text-sm leading-6 text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#DAA520]/55"
          placeholder="Descreva o imóvel que você procura"
        />

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2 font-mono text-xs text-white/36">
            <span>Parsing</span>
            <span>→</span>
            <span>Filtros</span>
            <span>→</span>
            <span>Embeddings</span>
            <span>→</span>
            <span>Score</span>
          </div>
          <button
            onClick={buscarMatch}
            disabled={carregando || texto.trim().length < 3}
            className="jf-primary-action inline-flex items-center justify-center gap-2 px-5 py-2.5 font-body text-sm"
          >
            {carregando ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
            {carregando ? "Calculando compatibilidade..." : "Encontrar meu match"}
          </button>
        </div>

        {erro && (
          <p className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 font-body text-sm text-red-300">
            {erro}
          </p>
        )}
      </section>

      {carregando && (
        <div className="grid gap-3 md:grid-cols-3">
          {["Interpretando sua necessidade...", "Analisando imóveis...", "Calculando compatibilidade..."].map(
            (item) => (
              <div key={item} className="jf-panel rounded-lg p-4 font-body text-sm text-white/55">
                {item}
              </div>
            )
          )}
        </div>
      )}

      {resultado && (
        <>
          <section className="jf-panel rounded-lg p-5">
            <div className="mb-3 flex items-center gap-2 text-[#F4C95D]">
              <ShieldAlert size={17} />
              <p className="font-body text-sm font-semibold">Interpretação estruturada</p>
            </div>
            <div className="grid gap-3 font-body text-sm text-white/55 md:grid-cols-3">
              <p>Tipo: {resultado.query.propertyType}</p>
              <p>Cidade: {resultado.query.location.city ?? "não identificada"}</p>
              <p>Preço máx.: {resultado.query.price.max ? `R$ ${resultado.query.price.max.toLocaleString("pt-BR")}` : "não informado"}</p>
              <p>Quartos mín.: {resultado.query.bedrooms.min ?? "não informado"}</p>
              <p>Banheiros mín.: {resultado.query.bathrooms.min ?? "não informado"}</p>
              <p>Vagas mín.: {resultado.query.parkingSpaces.min ?? "não informado"}</p>
            </div>
          </section>

          <div className="grid gap-4">
            {resultado.results.length === 0 && (
              <div className="jf-panel rounded-lg p-6 font-body text-sm text-white/45">
                Nenhum imóvel passou pelos filtros rígidos no momento.
              </div>
            )}

            {resultado.results.map((match) => (
              <article key={match.propertyId} className="jf-panel rounded-lg p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="jf-chip rounded-full px-3 py-1 font-mono text-xs">
                        {match.score}% MATCH
                      </span>
                      <span className="rounded-full border border-white/10 px-3 py-1 font-mono text-xs text-white/38">
                        semântica {match.subScores.semanticScore}%
                      </span>
                    </div>
                    <h2 className="font-display text-xl font-semibold text-white">
                      {match.property.title}
                    </h2>
                    <p className="mt-1 font-body text-sm text-white/52">
                      R$ {match.property.price.toLocaleString("pt-BR")} · {match.property.city}
                      {match.property.neighborhood ? ` · ${match.property.neighborhood}` : ""}
                    </p>
                    <p className="mt-3 max-w-3xl font-body text-sm leading-6 text-white/60">
                      {match.explanation}
                    </p>
                  </div>

                  <div className="grid min-w-52 gap-2 font-mono text-xs text-white/45">
                    <span>Preço: {match.subScores.priceScore}%</span>
                    <span>Localização: {match.subScores.locationScore}%</span>
                    <span>Estrutura: {match.subScores.structureScore}%</span>
                    <span>Features: {match.subScores.featuresScore}%</span>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    {match.matchedRequirements.map((item) => (
                      <p key={item} className="flex gap-2 font-body text-sm text-emerald-200/80">
                        <Check size={16} />
                        {item}
                      </p>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {match.unmatchedRequirements.map((item) => (
                      <p key={item} className="flex gap-2 font-body text-sm text-red-200/80">
                        <X size={16} />
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className="font-mono text-xs text-white/32">
            {resultado.meta.totalProperties} imóveis avaliados · {resultado.meta.candidatesAfterFilters} candidatos após filtros · {resultado.meta.processingMs}ms
          </p>
        </>
      )}
    </div>
  );
}

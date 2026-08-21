import { NormalizedProperty, PropertyType, StructuredRequest } from "../shared/types";
import { hasAny, normalizeText, unique } from "../shared/text";

const NUMBER_WORDS: Record<string, number> = {
  um: 1,
  uma: 1,
  dois: 2,
  duas: 2,
  tres: 3,
  quatro: 4,
  cinco: 5,
  seis: 6,
  sete: 7,
  oito: 8,
  nove: 9,
  dez: 10,
};

const PROPERTY_RULES: Array<{ type: PropertyType; terms: string[] }> = [
  { type: "apartment", terms: ["apartamento", "apto", "flat", "cobertura"] },
  { type: "house", terms: ["casa", "sobrado", "residencia"] },
  { type: "land", terms: ["terreno", "lote"] },
  { type: "commercial", terms: ["sala comercial", "loja", "galpao", "comercial"] },
];

const FEATURE_RULES: Array<{ feature: string; terms: string[] }> = [
  { feature: "pool", terms: ["piscina"] },
  { feature: "garage", terms: ["garagem", "vaga", "vagas"] },
  { feature: "balcony", terms: ["varanda", "sacada"] },
  { feature: "backyard", terms: ["quintal", "jardim"] },
  { feature: "pet_friendly", terms: ["pet", "cachorro", "gato"] },
  { feature: "financing", terms: ["financiamento", "financiar"] },
  { feature: "near_school", terms: ["perto de escola", "proximo a escola", "escola"] },
  { feature: "quiet_region", terms: ["tranquilo", "silencioso", "calmo", "residencial"] },
  { feature: "near_center", terms: ["perto do centro", "proximo ao centro", "regiao central", "centro"] },
  { feature: "family_friendly", terms: ["familia", "filhos", "familiar"] },
];

const PREFERENCE_MARKERS = [
  "preferencialmente",
  "seria bom",
  "gostaria",
  "se possivel",
  "desejavel",
  "preferencia",
];

export function normalizeNumberToken(token: string) {
  const clean = normalizeText(token).replace(",", ".");
  if (NUMBER_WORDS[clean] != null) return NUMBER_WORDS[clean];
  const numeric = Number(clean.replace(/\./g, ""));
  return Number.isFinite(numeric) ? numeric : null;
}

export function parseMoney(input: string) {
  const text = normalizeText(input);
  const meioMilhao = /meio\s+milhao/.test(text) ? 500000 : null;
  if (meioMilhao) return meioMilhao;

  const moneyPattern =
    /(?:r\$\s*)?(\d{2,3}(?:[\.\s]\d{3})+|\d+(?:[,.]\d+)?)\s*(milhao|milhoes|mil|k)?/g;
  const preferred = text.match(
    /(?:ate|at[eé]|maximo|max|or[cç]amento|valor)\s+(?:de\s+)?(?:r\$\s*)?(\d{2,3}(?:[\.\s]\d{3})+|\d+(?:[,.]\d+)?)\s*(milhao|milhoes|mil|k)?/
  );
  const matches = [...text.matchAll(moneyPattern)];
  const match = preferred ?? matches.find((item) => item[2]) ?? matches[0];
  if (!match) return null;

  const raw = Number(match[1].replace(/\s/g, "").replace(/\./g, "").replace(",", "."));
  if (!Number.isFinite(raw)) return null;
  const suffix = match[2];

  if (suffix === "mil" || suffix === "k") return Math.round(raw * 1000);
  if (suffix === "milhao" || suffix === "milhoes") return Math.round(raw * 1000000);
  return Math.round(raw);
}

export function normalizePropertyType(input: string): PropertyType {
  const text = normalizeText(input);
  return PROPERTY_RULES.find((rule) => hasAny(text, rule.terms))?.type ?? "unknown";
}

export function extractFeatures(input: string) {
  const text = normalizeText(input);
  const preferenceMode = hasAny(text, PREFERENCE_MARKERS);
  const features = FEATURE_RULES.filter((rule) => hasAny(text, rule.terms)).map(
    (rule) => rule.feature
  );

  return {
    requiredFeatures: preferenceMode ? [] : unique(features),
    preferredFeatures: preferenceMode ? unique(features) : [],
  };
}

export function normalizeProperty(input: {
  id: string;
  titulo: string;
  tipo?: string | null;
  cidade: string;
  bairro?: string | null;
  valor: number;
  quartos?: number | null;
  banheiros?: number | null;
  vagas?: number | null;
  areaM2?: number | null;
  garagem?: boolean | null;
  varanda?: boolean | null;
  quintal?: boolean | null;
  piscina?: boolean | null;
  aceitaPet?: boolean | null;
  descricao?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  embedding?: number[];
  corretor?: { usuario?: { nome?: string | null } } | null;
}): NormalizedProperty {
  const features = [
    input.garagem ? "garage" : null,
    input.varanda ? "balcony" : null,
    input.quintal ? "backyard" : null,
    input.piscina ? "pool" : null,
    input.aceitaPet ? "pet_friendly" : null,
    ...extractFeatures(`${input.titulo} ${input.descricao ?? ""}`).requiredFeatures,
  ].filter(Boolean) as string[];

  return {
    id: input.id,
    title: input.titulo,
    description: input.descricao ?? null,
    propertyType: normalizePropertyType(input.tipo ?? input.titulo),
    city: input.cidade,
    neighborhood: input.bairro ?? null,
    price: input.valor,
    bedrooms: input.quartos ?? null,
    bathrooms: input.banheiros ?? null,
    parkingSpaces: input.vagas ?? (input.garagem ? 1 : null),
    areaM2: input.areaM2 ?? null,
    features: unique(features),
    latitude: input.latitude ?? null,
    longitude: input.longitude ?? null,
    embedding: input.embedding,
    brokerName: input.corretor?.usuario?.nome ?? null,
  };
}

export function validateStructuredRequest(request: StructuredRequest) {
  if (!request.originalText || request.originalText.length < 3) {
    throw new Error("Descreva melhor o imóvel procurado.");
  }

  if (
    request.price.max != null &&
    (!Number.isFinite(request.price.max) || request.price.max <= 0)
  ) {
    throw new Error("Preço máximo inválido.");
  }

  return request;
}

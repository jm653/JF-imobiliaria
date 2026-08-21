import { MATCHING_LIMITS } from "../shared/config";
import { EmbeddingProvider } from "../shared/types";
import { normalizeText } from "../shared/text";

const SEMANTIC_SYNONYMS: Record<string, string[]> = {
  quiet_region: ["tranquilo", "silencioso", "calmo", "residencial", "familiar", "seguro"],
  near_center: ["centro", "central", "perto do centro", "5 minutos", "comercio"],
  near_school: ["escola", "colegio", "criancas", "filhos", "familia"],
  garage: ["garagem", "vaga", "carro", "estacionamento"],
  pool: ["piscina", "lazer", "area de lazer"],
  balcony: ["varanda", "sacada", "vista"],
  backyard: ["quintal", "jardim", "espaco externo"],
};

function hashToken(token: string) {
  let hash = 0;
  for (let i = 0; i < token.length; i++) {
    hash = (hash * 31 + token.charCodeAt(i)) >>> 0;
  }
  return hash % MATCHING_LIMITS.embeddingDimensions;
}

export class LocalEmbeddingProvider implements EmbeddingProvider {
  async generate(text: string) {
    const vector = new Array(MATCHING_LIMITS.embeddingDimensions).fill(0);
    const normalized = normalizeText(text);
    const tokens = normalized.split(/\s+/).filter((token) => token.length > 2);

    for (const token of tokens) {
      vector[hashToken(token)] += 1;
    }

    for (const [concept, synonyms] of Object.entries(SEMANTIC_SYNONYMS)) {
      if (synonyms.some((term) => normalized.includes(term))) {
        vector[hashToken(concept)] += 3;
      }
    }

    const norm = Math.sqrt(vector.reduce((total, value) => total + value * value, 0));
    return norm ? vector.map((value) => value / norm) : vector;
  }
}

export function cosineSimilarity(a: number[], b: number[]) {
  if (!a.length || !b.length) return 0;
  const length = Math.min(a.length, b.length);
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (!normA || !normB) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

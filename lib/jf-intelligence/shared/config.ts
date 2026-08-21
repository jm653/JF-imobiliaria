export const MATCHING_WEIGHTS = {
  hardRequirements: 0.35,
  price: 0.2,
  location: 0.15,
  features: 0.1,
  structure: 0.05,
  semanticSimilarity: 0.15,
} as const;

export const MATCHING_LIMITS = {
  defaultLimit: 10,
  maxLimit: 25,
  maxCandidatesBeforeScoring: 250,
  embeddingDimensions: 64,
  minimumViableScore: 1,
} as const;

export const FEATURE_LABELS: Record<string, string> = {
  pool: "piscina",
  garage: "garagem",
  balcony: "varanda",
  backyard: "quintal",
  pet_friendly: "aceita pet",
  financing: "aceita financiamento",
  near_school: "perto de escola",
  quiet_region: "regiao tranquila",
  near_center: "perto do centro",
  family_friendly: "perfil familiar",
};

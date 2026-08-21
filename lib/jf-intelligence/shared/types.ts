export type PropertyType =
  | "house"
  | "apartment"
  | "land"
  | "commercial"
  | "unknown";

export type MatchPriority = "HIGH" | "MEDIUM" | "LOW";

export type NumericRange = {
  min: number | null;
  max: number | null;
};

export type StructuredRequest = {
  originalText: string;
  propertyType: PropertyType;
  location: {
    city: string | null;
    state: string | null;
    neighborhood: string | null;
  };
  price: NumericRange;
  bedrooms: NumericRange;
  bathrooms: NumericRange;
  parkingSpaces: { min: number | null };
  requiredFeatures: string[];
  preferredFeatures: string[];
  hardConstraints: string[];
  softPreferences: string[];
  lifestyleContext: string[];
};

export type NormalizedProperty = {
  id: string;
  title: string;
  description: string | null;
  propertyType: PropertyType;
  city: string;
  neighborhood: string | null;
  price: number;
  bedrooms: number | null;
  bathrooms: number | null;
  parkingSpaces: number | null;
  areaM2: number | null;
  features: string[];
  latitude: number | null;
  longitude: number | null;
  embedding?: number[];
  brokerName?: string | null;
};

export type MatchSubScores = {
  overallScore: number;
  priceScore: number;
  locationScore: number;
  structureScore: number;
  featuresScore: number;
  semanticScore: number;
  hardRequirementsScore: number;
};

export type MatchResult = {
  propertyId: string;
  property: NormalizedProperty;
  score: number;
  subScores: MatchSubScores;
  matchedRequirements: string[];
  unmatchedRequirements: string[];
  matchedPreferences: string[];
  conflicts: string[];
  warnings: string[];
  explanation: string;
  semanticSimilarity: number;
};

export type MatchContext = {
  query: StructuredRequest;
  property: NormalizedProperty;
  subScores: MatchSubScores;
  matchedRequirements: string[];
  unmatchedRequirements: string[];
  matchedPreferences: string[];
  conflicts: string[];
  warnings: string[];
};

export type MatchResponse = {
  query: StructuredRequest;
  results: MatchResult[];
  meta: {
    totalProperties: number;
    candidatesAfterFilters: number;
    processingMs: number;
    source: "local-deterministic";
  };
};

export interface AIProvider {
  extractPreferences(input: string): Promise<StructuredRequest>;
  generateEmbedding(input: string): Promise<number[]>;
  generateExplanation(input: MatchContext): Promise<string>;
}

export interface EmbeddingProvider {
  generate(text: string): Promise<number[]>;
}

export type BrokerCompatibilityInput = {
  regionScore?: number;
  specialtyScore?: number;
  portfolioScore?: number;
  availabilityScore?: number;
  reputationScore?: number;
};

export type RegionRecommendationInput = {
  budgetMax?: number;
  city?: string | null;
  lifestyleContext?: string[];
  requiredInfrastructure?: string[];
};

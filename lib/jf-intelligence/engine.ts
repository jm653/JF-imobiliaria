import { buildMatchContext } from "./scoring/matching-score";
import { rankResults } from "./ranking/rank-results";
import { normalizeProperty } from "./normalization/normalizer";
import { retrieveHybridCandidates } from "./retrieval/hybrid-retrieval";
import { LocalAIProvider } from "./providers/local-ai-provider";
import { MATCHING_LIMITS } from "./shared/config";
import { MatchResponse } from "./shared/types";

type RawProperty = Parameters<typeof normalizeProperty>[0];

export async function matchClientRequest(input: {
  clientRequest: string;
  properties: RawProperty[];
  limit?: number;
}): Promise<MatchResponse> {
  const startedAt = Date.now();
  const aiProvider = new LocalAIProvider();
  const limit = Math.min(
    Math.max(input.limit ?? MATCHING_LIMITS.defaultLimit, 1),
    MATCHING_LIMITS.maxLimit
  );

  const query = await aiProvider.extractPreferences(input.clientRequest);
  const properties = input.properties.map(normalizeProperty);
  const candidates = await retrieveHybridCandidates(query, properties);

  const results = await Promise.all(
    candidates.map(async ({ property, semanticSimilarity, conflicts }) => {
      const context = buildMatchContext(query, property, semanticSimilarity, conflicts);
      const explanation = await aiProvider.generateExplanation(context);

      return {
        propertyId: property.id,
        property,
        score: context.subScores.overallScore,
        subScores: context.subScores,
        matchedRequirements: context.matchedRequirements,
        unmatchedRequirements: context.unmatchedRequirements,
        matchedPreferences: context.matchedPreferences,
        conflicts: context.conflicts,
        warnings: context.warnings,
        explanation,
        semanticSimilarity,
      };
    })
  );

  return {
    query,
    results: rankResults(
      results.filter((result) => result.score >= MATCHING_LIMITS.minimumViableScore),
      limit
    ),
    meta: {
      totalProperties: properties.length,
      candidatesAfterFilters: candidates.length,
      processingMs: Date.now() - startedAt,
      source: "local-deterministic",
    },
  };
}

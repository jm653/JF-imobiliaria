import { LocalEmbeddingProvider, cosineSimilarity } from "../embeddings/local-embedding-provider";
import { buildPropertyEmbeddingText, buildRequestEmbeddingText } from "../embeddings/property-text";
import { retrieveStructuredCandidates } from "../filtering/hard-filters";
import { MATCHING_LIMITS } from "../shared/config";
import { NormalizedProperty, StructuredRequest } from "../shared/types";

export async function retrieveHybridCandidates(
  request: StructuredRequest,
  properties: NormalizedProperty[],
  embeddingProvider = new LocalEmbeddingProvider()
) {
  const structured = retrieveStructuredCandidates(
    request,
    properties,
    MATCHING_LIMITS.maxCandidatesBeforeScoring
  );
  const queryEmbedding = await embeddingProvider.generate(buildRequestEmbeddingText(request));

  const candidates = await Promise.all(
    structured.accepted.map(async ({ property, conflicts }) => {
      const propertyEmbedding =
        property.embedding?.length
          ? property.embedding
          : await embeddingProvider.generate(buildPropertyEmbeddingText(property));

      return {
        property,
        conflicts,
        semanticSimilarity: cosineSimilarity(queryEmbedding, propertyEmbedding),
      };
    })
  );

  return candidates.sort((a, b) => b.semanticSimilarity - a.semanticSimilarity);
}

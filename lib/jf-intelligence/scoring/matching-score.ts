import { MATCHING_WEIGHTS } from "../shared/config";
import { MatchContext, MatchSubScores, NormalizedProperty, StructuredRequest } from "../shared/types";
import { clamp, normalizeText, roundScore } from "../shared/text";

function scorePrice(request: StructuredRequest, property: NormalizedProperty) {
  if (request.price.max == null) return 80;
  if (property.price <= request.price.max) return 100;
  const over = (property.price - request.price.max) / request.price.max;
  if (over > 0.35) return 5;
  return clamp(100 - over * 220);
}

function scoreLocation(request: StructuredRequest, property: NormalizedProperty) {
  if (!request.location.city) return 75;
  const requestedCity = normalizeText(request.location.city);
  const propertyCity = normalizeText(property.city);
  if (requestedCity === propertyCity) return 100;
  if (propertyCity.includes(requestedCity) || requestedCity.includes(propertyCity)) return 80;
  return 0;
}

function scoreStructure(request: StructuredRequest, property: NormalizedProperty) {
  const parts: number[] = [];

  if (request.bedrooms.min != null) {
    parts.push(
      property.bedrooms == null
        ? 45
        : property.bedrooms >= request.bedrooms.min
          ? 100
          : Math.max(0, 100 - (request.bedrooms.min - property.bedrooms) * 38)
    );
  }

  if (request.bathrooms.min != null) {
    parts.push(
      property.bathrooms == null
        ? 45
        : property.bathrooms >= request.bathrooms.min
          ? 100
          : Math.max(0, 100 - (request.bathrooms.min - property.bathrooms) * 34)
    );
  }

  if (request.parkingSpaces.min != null) {
    parts.push(
      property.parkingSpaces == null
        ? 35
        : property.parkingSpaces >= request.parkingSpaces.min
          ? 100
          : Math.max(0, 100 - (request.parkingSpaces.min - property.parkingSpaces) * 42)
    );
  }

  return parts.length ? parts.reduce((sum, value) => sum + value, 0) / parts.length : 78;
}

function scoreFeatures(request: StructuredRequest, property: NormalizedProperty) {
  const requested = [...request.requiredFeatures, ...request.preferredFeatures];
  if (!requested.length) return 78;
  const matched = requested.filter((feature) => property.features.includes(feature));
  return (matched.length / requested.length) * 100;
}

function scoreHardRequirements(request: StructuredRequest, property: NormalizedProperty) {
  const checks: boolean[] = [];

  if (request.propertyType !== "unknown") checks.push(property.propertyType === request.propertyType);
  if (request.price.max != null) checks.push(property.price <= request.price.max);
  if (request.bedrooms.min != null) checks.push((property.bedrooms ?? 0) >= request.bedrooms.min);
  if (request.bathrooms.min != null) checks.push((property.bathrooms ?? 0) >= request.bathrooms.min);
  if (request.parkingSpaces.min != null) {
    checks.push((property.parkingSpaces ?? 0) >= request.parkingSpaces.min);
  }
  for (const feature of request.requiredFeatures) {
    checks.push(property.features.includes(feature));
  }

  if (!checks.length) return 80;
  return (checks.filter(Boolean).length / checks.length) * 100;
}

function applyCriticalPenalties(
  request: StructuredRequest,
  property: NormalizedProperty,
  score: number
) {
  let penalized = score;

  if (
    request.propertyType !== "unknown" &&
    property.propertyType !== "unknown" &&
    request.propertyType !== property.propertyType
  ) {
    penalized = Math.min(penalized, 18);
  }

  if (request.price.max != null && property.price > request.price.max * 1.8) {
    penalized = Math.min(penalized, 20);
  }

  if (request.bedrooms.min != null && (property.bedrooms ?? 0) <= request.bedrooms.min - 2) {
    penalized = Math.min(penalized, 38);
  }

  return penalized;
}

export function buildMatchContext(
  request: StructuredRequest,
  property: NormalizedProperty,
  semanticSimilarity: number,
  conflicts: string[]
): MatchContext {
  const matchedRequirements: string[] = [];
  const unmatchedRequirements: string[] = [];
  const matchedPreferences: string[] = [];
  const warnings: string[] = [];

  if (request.price.max != null) {
    if (property.price <= request.price.max) matchedRequirements.push("Dentro do orçamento.");
    else unmatchedRequirements.push("Preço acima do orçamento.");
  }

  if (request.bedrooms.min != null) {
    if ((property.bedrooms ?? 0) >= request.bedrooms.min) matchedRequirements.push("Quantidade de quartos atendida.");
    else unmatchedRequirements.push("Quantidade de quartos abaixo do mínimo.");
  }

  if (request.bathrooms.min != null) {
    if ((property.bathrooms ?? 0) >= request.bathrooms.min) matchedRequirements.push("Quantidade de banheiros atendida.");
    else unmatchedRequirements.push("Quantidade de banheiros abaixo do mínimo.");
  }

  if (request.parkingSpaces.min != null) {
    if ((property.parkingSpaces ?? 0) >= request.parkingSpaces.min) matchedRequirements.push("Vagas de garagem atendidas.");
    else unmatchedRequirements.push("Vagas de garagem abaixo do mínimo.");
  }

  for (const feature of request.requiredFeatures) {
    if (property.features.includes(feature)) matchedRequirements.push(`Característica obrigatória atendida: ${feature}.`);
    else unmatchedRequirements.push(`Característica obrigatória ausente: ${feature}.`);
  }

  for (const feature of request.preferredFeatures) {
    if (property.features.includes(feature)) matchedPreferences.push(`Preferência atendida: ${feature}.`);
  }

  if (semanticSimilarity >= 0.62) {
    matchedPreferences.push("Descrição semanticamente próxima ao estilo buscado.");
  } else if (semanticSimilarity < 0.18) {
    warnings.push("Baixa similaridade semântica entre a descrição e o pedido.");
  }

  const subScores: MatchSubScores = {
    overallScore: 0,
    priceScore: roundScore(scorePrice(request, property)),
    locationScore: roundScore(scoreLocation(request, property)),
    structureScore: roundScore(scoreStructure(request, property)),
    featuresScore: roundScore(scoreFeatures(request, property)),
    semanticScore: roundScore(semanticSimilarity * 100),
    hardRequirementsScore: roundScore(scoreHardRequirements(request, property)),
  };

  const weighted =
    subScores.hardRequirementsScore * MATCHING_WEIGHTS.hardRequirements +
    subScores.priceScore * MATCHING_WEIGHTS.price +
    subScores.locationScore * MATCHING_WEIGHTS.location +
    subScores.featuresScore * MATCHING_WEIGHTS.features +
    subScores.structureScore * MATCHING_WEIGHTS.structure +
    subScores.semanticScore * MATCHING_WEIGHTS.semanticSimilarity;

  subScores.overallScore = roundScore(applyCriticalPenalties(request, property, weighted));

  return {
    query: request,
    property,
    subScores,
    matchedRequirements,
    unmatchedRequirements,
    matchedPreferences,
    conflicts,
    warnings,
  };
}

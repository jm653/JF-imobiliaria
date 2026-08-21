import { NormalizedProperty, StructuredRequest } from "../shared/types";
import { normalizeText } from "../shared/text";

export type FilterDecision = {
  passed: boolean;
  conflicts: string[];
};

export function evaluateHardFilters(
  request: StructuredRequest,
  property: NormalizedProperty
): FilterDecision {
  const conflicts: string[] = [];

  if (
    request.propertyType !== "unknown" &&
    property.propertyType !== "unknown" &&
    request.propertyType !== property.propertyType
  ) {
    conflicts.push("Tipo de imóvel diferente do solicitado.");
  }

  if (request.hardConstraints.includes("not_apartment") && property.propertyType === "apartment") {
    conflicts.push("Cliente informou que não quer apartamento.");
  }

  if (request.hardConstraints.includes("not_house") && property.propertyType === "house") {
    conflicts.push("Cliente informou que não quer casa.");
  }

  if (request.price.max != null && property.price > request.price.max * 1.35) {
    conflicts.push("Preço muito acima do orçamento máximo.");
  }

  if (
    request.location.city &&
    normalizeText(request.location.city) !== normalizeText(property.city)
  ) {
    conflicts.push("Cidade diferente da solicitada.");
  }

  return {
    passed: conflicts.length === 0,
    conflicts,
  };
}

export function retrieveStructuredCandidates(
  request: StructuredRequest,
  properties: NormalizedProperty[],
  maxCandidates: number
) {
  const softRejected: Array<{ property: NormalizedProperty; conflicts: string[] }> = [];
  const accepted: Array<{ property: NormalizedProperty; conflicts: string[] }> = [];

  for (const property of properties) {
    const decision = evaluateHardFilters(request, property);
    if (decision.passed) accepted.push({ property, conflicts: decision.conflicts });
    else softRejected.push({ property, conflicts: decision.conflicts });
  }

  return {
    accepted: accepted.slice(0, maxCandidates),
    rejected: softRejected,
  };
}

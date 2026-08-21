import { NormalizedProperty, StructuredRequest } from "../shared/types";
import { FEATURE_LABELS } from "../shared/config";

export function buildPropertyEmbeddingText(property: NormalizedProperty) {
  return [
    property.title,
    property.description,
    property.propertyType,
    property.city,
    property.neighborhood,
    property.bedrooms ? `${property.bedrooms} quartos` : null,
    property.bathrooms ? `${property.bathrooms} banheiros` : null,
    property.parkingSpaces ? `${property.parkingSpaces} vagas garagem` : null,
    ...property.features.map((feature) => FEATURE_LABELS[feature] ?? feature),
  ]
    .filter(Boolean)
    .join(". ");
}

export function buildRequestEmbeddingText(request: StructuredRequest) {
  return [
    request.originalText,
    request.propertyType,
    request.location.city,
    request.bedrooms.min ? `${request.bedrooms.min} quartos` : null,
    request.bathrooms.min ? `${request.bathrooms.min} banheiros` : null,
    request.parkingSpaces.min ? `${request.parkingSpaces.min} vagas garagem` : null,
    ...request.requiredFeatures,
    ...request.preferredFeatures,
    ...request.lifestyleContext,
  ]
    .filter(Boolean)
    .join(". ");
}

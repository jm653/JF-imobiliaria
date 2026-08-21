import {
  extractFeatures,
  normalizeNumberToken,
  normalizePropertyType,
  parseMoney,
  validateStructuredRequest,
} from "../normalization/normalizer";
import { StructuredRequest } from "../shared/types";
import { hasAny, normalizeText, unique } from "../shared/text";

const CITY_PATTERNS = [
  /(?:em|na cidade de|para)\s+([a-z\s]+?)(?:,| com| ate| at[eé]| por| perto|$)/,
  /(?:no|na)\s+([a-z\s]+?)(?:,| com| ate| at[eé]| por| perto|$)/,
];

function firstNumberNear(text: string, terms: string[]) {
  for (const term of terms) {
    const pattern = new RegExp(`(\\d+|um|uma|dois|duas|tres|quatro|cinco)\\s+${term}`);
    const direct = text.match(pattern);
    if (direct) return normalizeNumberToken(direct[1]);

    const reverse = text.match(new RegExp(`${term}\\s+(\\d+|um|uma|dois|duas|tres|quatro|cinco)`));
    if (reverse) return normalizeNumberToken(reverse[1]);
  }
  return null;
}

function extractCity(text: string) {
  for (const pattern of CITY_PATTERNS) {
    const match = text.match(pattern);
    if (match?.[1]) {
      const city = match[1].replace(/\b(casa|apartamento|imovel|bairro)\b/g, "").trim();
      if (city.length >= 3 && city.length <= 40) return city;
    }
  }
  return null;
}

function extractLifestyle(text: string) {
  const context: string[] = [];
  if (hasAny(text, ["filhos", "familia", "criancas"])) context.push("family");
  if (hasAny(text, ["trabalho no centro", "trabalha no centro"])) context.push("works_downtown");
  if (hasAny(text, ["tranquilo", "silencioso", "calmo"])) context.push("quiet_lifestyle");
  if (hasAny(text, ["escola", "colegio"])) context.push("school_access");
  return context;
}

export function parseClientRequest(input: string): StructuredRequest {
  const text = normalizeText(input);
  const priceMax = parseMoney(text);
  const bedrooms = firstNumberNear(text, ["quartos?", "dormitorios?"]);
  const bathrooms = firstNumberNear(text, ["banheiros?", "suite", "suites"]);
  const parking = firstNumberNear(text, ["vagas?", "garagem", "carros?"]);
  const features = extractFeatures(text);
  const propertyType = normalizePropertyType(text);
  const hardConstraints: string[] = [];

  if (text.includes("nao quero apartamento")) hardConstraints.push("not_apartment");
  if (text.includes("nao quero casa")) hardConstraints.push("not_house");
  if (propertyType !== "unknown") hardConstraints.push(`type:${propertyType}`);
  if (priceMax) hardConstraints.push("price:max");
  if (bedrooms) hardConstraints.push("bedrooms:min");
  if (bathrooms) hardConstraints.push("bathrooms:min");

  const request: StructuredRequest = {
    originalText: input,
    propertyType,
    location: {
      city: extractCity(text),
      state: null,
      neighborhood: null,
    },
    price: {
      min: null,
      max: priceMax,
    },
    bedrooms: {
      min: bedrooms,
      max: null,
    },
    bathrooms: {
      min: bathrooms,
      max: null,
    },
    parkingSpaces: {
      min: parking,
    },
    requiredFeatures: features.requiredFeatures,
    preferredFeatures: features.preferredFeatures,
    hardConstraints: unique(hardConstraints),
    softPreferences: features.preferredFeatures,
    lifestyleContext: extractLifestyle(text),
  };

  return validateStructuredRequest(request);
}

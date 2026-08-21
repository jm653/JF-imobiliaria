import { MatchPriority } from "../shared/types";

export function prioritizeLead(input: {
  compatibilityScore: number;
  requestCompleteness?: number;
  hasAvailableProperty?: boolean;
  lastInteractionDays?: number | null;
}): MatchPriority {
  let score = input.compatibilityScore;
  score += (input.requestCompleteness ?? 0.5) * 10;
  if (input.hasAvailableProperty) score += 8;
  if (input.lastInteractionDays != null && input.lastInteractionDays > 7) score -= 10;

  if (score >= 82) return "HIGH";
  if (score >= 58) return "MEDIUM";
  return "LOW";
}

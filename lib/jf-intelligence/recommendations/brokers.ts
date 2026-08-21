import { BrokerCompatibilityInput } from "../shared/types";
import { clamp, roundScore } from "../shared/text";

export function calculateBrokerCompatibility(input: BrokerCompatibilityInput) {
  const score =
    (input.regionScore ?? 50) * 0.25 +
    (input.specialtyScore ?? 50) * 0.2 +
    (input.portfolioScore ?? 50) * 0.25 +
    (input.availabilityScore ?? 50) * 0.15 +
    (input.reputationScore ?? 50) * 0.15;

  return roundScore(clamp(score));
}

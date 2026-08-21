export type PriceAnalysisInput = {
  targetPrice: number;
  similarPrices: number[];
};

export function estimatePriceBand(input: PriceAnalysisInput) {
  if (!input.similarPrices.length) {
    return {
      estimate: input.targetPrice,
      min: Math.round(input.targetPrice * 0.9),
      max: Math.round(input.targetPrice * 1.1),
      confidence: "LOW" as const,
    };
  }

  const sorted = [...input.similarPrices].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  return {
    estimate: median,
    min: Math.round(median * 0.92),
    max: Math.round(median * 1.08),
    confidence: sorted.length >= 5 ? ("MEDIUM" as const) : ("LOW" as const),
  };
}

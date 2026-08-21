import { MatchResult } from "../shared/types";

export function rankResults(results: MatchResult[], limit: number) {
  return [...results]
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.semanticSimilarity - a.semanticSimilarity;
    })
    .slice(0, limit);
}

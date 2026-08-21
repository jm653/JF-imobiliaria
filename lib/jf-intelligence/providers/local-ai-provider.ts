import { parseClientRequest } from "../parsing/client-request-parser";
import { LocalEmbeddingProvider } from "../embeddings/local-embedding-provider";
import { generateRuleBasedExplanation } from "../explanations/rule-based-explanation";
import { AIProvider, MatchContext } from "../shared/types";

export class LocalAIProvider implements AIProvider {
  private embeddings = new LocalEmbeddingProvider();

  async extractPreferences(input: string) {
    return parseClientRequest(input);
  }

  async generateEmbedding(input: string) {
    return this.embeddings.generate(input);
  }

  async generateExplanation(input: MatchContext) {
    return generateRuleBasedExplanation(input);
  }
}

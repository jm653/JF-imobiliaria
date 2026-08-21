import { FEATURE_LABELS } from "../shared/config";
import { MatchContext } from "../shared/types";

function readableFeature(feature: string) {
  return FEATURE_LABELS[feature] ?? feature.replace(/_/g, " ");
}

export function generateRuleBasedExplanation(context: MatchContext) {
  const { property, subScores, unmatchedRequirements, matchedPreferences, conflicts } = context;
  const positives = context.matchedRequirements.slice(0, 3).join(" ");
  const preferences = matchedPreferences.slice(0, 2).join(" ");
  const problems = [...conflicts, ...unmatchedRequirements].slice(0, 2).join(" ");
  const features = property.features.map(readableFeature).slice(0, 4).join(", ");

  return [
    `${subScores.overallScore}% de compatibilidade com ${property.title}.`,
    positives || `O imóvel tem dados objetivos suficientes para comparação e está em ${property.city}.`,
    features ? `Destaques identificados: ${features}.` : null,
    preferences || null,
    problems ? `Pontos de atenção: ${problems}` : "Nenhum conflito crítico foi identificado nos dados disponíveis.",
  ]
    .filter(Boolean)
    .join(" ");
}

export type AssistantToolResult = {
  answer: string;
  source: "internal-tool";
};

export function refuseUnscopedQuestion(): AssistantToolResult {
  return {
    answer:
      "Preciso consultar uma ferramenta interna autorizada antes de responder sobre dados de clientes, contatos ou oportunidades.",
    source: "internal-tool",
  };
}

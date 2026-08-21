const ACCENT_MAP: Record<string, string> = {
  á: "a",
  à: "a",
  â: "a",
  ã: "a",
  ä: "a",
  é: "e",
  ê: "e",
  ë: "e",
  í: "i",
  ï: "i",
  ó: "o",
  ô: "o",
  õ: "o",
  ö: "o",
  ú: "u",
  ü: "u",
  ç: "c",
};

export function normalizeText(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[áàâãäéêëíïóôõöúüç]/g, (char) => ACCENT_MAP[char] ?? char)
    .replace(/[^\w\s$.,-]/g, " ")
    .replace(/\s+/g, " ");
}

export function unique<T>(items: T[]) {
  return Array.from(new Set(items));
}

export function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

export function roundScore(value: number) {
  return Math.round(clamp(value));
}

export function hasAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

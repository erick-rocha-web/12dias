// Regras puras (sem DOM): normalização de respostas, datas e disponibilidade.

const DIACRITICS = /[\u0300-\u036f]/g;
const PUNCTUATION = /[.,;:!?\u00a1\u00bf"'\u201c\u201d\u2018\u2019\u00b4`()[\]{}\u2026\u2013\u2014_/\-]/g;

export function normalize(text) {
  return String(text ?? "")
    .normalize("NFD")
    .replace(DIACRITICS, "")
    .toLowerCase()
    .replace(PUNCTUATION, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Compara a resposta inteira com cada variante aceita (nunca por substring).
export function matches(input, answers) {
  const value = normalize(input);
  if (!value) return false;
  return answers.some((answer) => normalize(answer) === value);
}

// Senhas-frase: ignora também os espaços ("Diante de Deus" = "diantededeus"),
// mas continua exigindo igualdade com a frase inteira.
export function matchesPhrase(input, answer) {
  const value = normalize(input).replace(/ /g, "");
  return value !== "" && value === normalize(answer).replace(/ /g, "");
}

// Data de hoje (AAAA-MM-DD) no calendário de São Paulo, independente do fuso do aparelho.
export function todayISO(timeZone, now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (type) => parts.find((p) => p.type === type).value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function formatDayMonth(iso) {
  const [, month, day] = iso.split("-");
  return `${day}/${month}`;
}

// "available": data chegou e está publicado.
// "soon": data chegou, mas o conteúdo ainda não foi publicado.
// "future": a data ainda não chegou.
export function chapterStatus(chapter, today) {
  if (today < chapter.opens) return "future";
  return chapter.published ? "available" : "soon";
}

export function words(text) {
  return normalize(text).split(" ").filter(Boolean);
}

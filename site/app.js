import { SITE, CHAPTERS } from "./chapters.js";
import { matches, matchesPhrase, todayISO, formatDayMonth, chapterStatus } from "./logic.js";

/* ---------- Progresso (localStorage com queda para memória) ---------- */

const STORAGE_KEY = "erick-alicia-12-capitulos-2026-v1";

const storage = {
  load() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      return data && typeof data === "object" && !Array.isArray(data) ? data : null;
    } catch {
      return null;
    }
  },
  save(data) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Sem armazenamento: o progresso continua em memória nesta visita.
    }
  },
};

const store = storage.load() ?? {};
store.version = 2;
if (!store.chapters || typeof store.chapters !== "object") store.chapters = {};

// Campos de versões anteriores (enigmas simples) ficam guardados, mas não
// contam como senha resolvida. Só `word` é aproveitado.
function progressOf(id) {
  const p = (store.chapters[id] ??= {});
  p.started = p.started === true;
  p.passwordSolved = p.passwordSolved === true;
  p.passwordHints = Number.isInteger(p.passwordHints) ? p.passwordHints : 0;
  p.wordSearchOpen = p.wordSearchOpen === true;
  p.word = typeof p.word === "string" && p.word ? p.word : null;
  p.completed = p.passwordSolved && !!p.word;
  return p;
}

function persist() {
  store.updatedAt = new Date().toISOString();
  storage.save(store);
}

/* ---------- Datas ---------- */

function currentDay() {
  // Simulação de data apenas em teste local: ?data=2026-10-02
  const sim = new URLSearchParams(location.search).get("data");
  const local = location.protocol === "file:" || ["localhost", "127.0.0.1"].includes(location.hostname);
  if (local && sim && /^\d{4}-\d{2}-\d{2}$/.test(sim)) return sim;
  return todayISO(SITE.timeZone);
}

const today = currentDay();
const statusOf = (ch) => chapterStatus(ch, today);
const availableChapters = () => CHAPTERS.filter((ch) => statusOf(ch) === "available");

/* ---------- DOM ---------- */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === false || value == null) continue;
    if (key === "class") el.className = value;
    else if (key.startsWith("on")) el.addEventListener(key.slice(2), value);
    else el.setAttribute(key, value === true ? "" : value);
  }
  for (const child of children.flat()) {
    if (child == null || child === false) continue;
    el.append(child instanceof Node ? child : document.createTextNode(child));
  }
  return el;
}

const paragraphs = (list, cls) => list.map((t) => h("p", { class: cls }, t));

function say(region, message) {
  region.textContent = "";
  // Pequeno atraso para leitores de tela anunciarem mensagens repetidas.
  setTimeout(() => (region.textContent = message), 30);
}

function answerField({ id, label, placeholder, button, onSubmit }) {
  const feedback = h("p", { class: "feedback", role: "status", "aria-live": "polite" });
  const input = h("input", {
    id,
    type: "text",
    placeholder,
    autocomplete: "off",
    autocapitalize: "off",
    autocorrect: "off",
    spellcheck: "false",
    enterkeyhint: "send",
  });
  input.addEventListener("input", () => input.removeAttribute("aria-invalid"));
  const form = h(
    "form",
    {
      class: "answer-form",
      novalidate: true,
      onsubmit: (event) => {
        event.preventDefault();
        if (!input.value.trim()) return say(feedback, "Escreve sua resposta antes de enviar.");
        const wrong = onSubmit(input.value);
        if (wrong) {
          input.setAttribute("aria-invalid", "true");
          say(feedback, wrong);
        }
      },
    },
    h("label", { for: id }, label),
    h("div", { class: "field-row" }, input, h("button", { class: "btn btn-primary", type: "submit" }, button)),
  );
  return [form, feedback];
}

const els = {
  chapter: document.getElementById("chapter"),
  board: document.getElementById("board-list"),
  map: document.getElementById("map-list"),
  mapNote: document.getElementById("map-note"),
};

let currentId = null;
let renderedKeys = new Set();

function selectDefault() {
  const open = availableChapters();
  if (!open.length) return null;
  const pending = open.filter((ch) => !progressOf(ch.id).completed);
  return (pending.at(-1) ?? open.at(-1)).id;
}

function chapterFromHash() {
  const match = location.hash.match(/^#capitulo-(\d{2})$/);
  if (!match) return null;
  const ch = CHAPTERS.find((c) => c.id === match[1]);
  return ch && statusOf(ch) === "available" ? ch.id : null;
}

function scrollAndFocus(card) {
  if (!card) return;
  card.scrollIntoView({ block: "start", behavior: reduceMotion.matches ? "auto" : "smooth" });
  (card.querySelector("[data-focus]") ?? card).focus({ preventScroll: true });
}

/* ---------- Capítulo ---------- */

function renderChapter({ focusKey = null, unlocked = false } = {}) {
  const ch = CHAPTERS.find((c) => c.id === currentId);
  const cards = ch ? buildChapter(ch, unlocked) : [buildBeforeStart()];

  const previous = renderedKeys;
  renderedKeys = new Set(cards.map((c) => c.dataset.key));
  for (const card of cards) {
    if (previous.size && !previous.has(card.dataset.key)) card.classList.add("is-new");
  }
  els.chapter.replaceChildren(...cards);
  if (focusKey) scrollAndFocus(els.chapter.querySelector(`[data-key="${focusKey}"]`));
}

function buildBeforeStart() {
  const first = CHAPTERS[0];
  return h(
    "article",
    { class: "card opening", "data-key": "waiting" },
    h("p", { class: "kicker" }, first.month),
    paragraphs([SITE.intro], "lead"),
    h("p", { class: "notice" }, `Abre em ${formatDayMonth(first.opens)}.`),
  );
}

function buildChapter(ch, unlocked) {
  const p = progressOf(ch.id);
  const cards = [buildOpening(ch, p)];
  if (!p.started) return cards;

  cards.push(buildPuzzleLetter(ch, p, unlocked));
  if (!p.passwordSolved) return cards;

  cards.push(buildReveal(ch, p));
  if (!p.wordSearchOpen) return cards;

  cards.push(buildBible(ch, p));
  if (!p.word) return cards;

  cards.push(buildClosing(ch));
  return cards;
}

function buildOpening(ch, p) {
  return h(
    "article",
    { class: "card opening", "data-key": "opening" },
    h("p", { class: "kicker" }, ch.month),
    h("h2", { class: "chapter-title", tabindex: "-1", "data-focus": true }, ch.subtitle),
    paragraphs([SITE.intro], "lead"),
    !p.started && h("button", { class: "btn btn-primary", type: "button", onclick: () => start(ch) }, ch.startLabel),
    p.completed && h("p", { class: "notice" }, "Capítulo concluído. Pode reler tudo com calma."),
  );
}

// Carta, buquê e bilhete: partes de uma mesma página, disponíveis juntas.
function buildPuzzleLetter(ch, p, unlocked) {
  const b = ch.bouquet;
  const c = ch.cipher;

  const letter = h(
    "article",
    { class: "card letter puzzle-letter", "data-key": "puzzle" },
    h("h3", { class: "visually-hidden", tabindex: "-1", "data-focus": true }, `Carta de ${ch.month.toLowerCase()}`),
    h("div", { class: "letter-body" }, paragraphs(ch.letter)),

    h(
      "section",
      { class: "part", "aria-labelledby": `buque-${ch.id}` },
      h("h3", { id: `buque-${ch.id}`, class: "part-title" }, b.title),
      h(
        "div",
        { class: "fragments" },
        b.fragments.map((f) => h("p", { class: "fragment" }, h("strong", {}, f.lead), " ", f.text)),
      ),
      h("p", { class: "format-note" }, b.format),
      h(
        "p",
        { class: "story-link" },
        h(
          "a",
          { href: b.storyLink.href, target: "_blank", rel: "noopener noreferrer" },
          b.storyLink.label,
          h("span", { class: "visually-hidden" }, " (abre em outra aba)"),
        ),
        h("span", { class: "story-note" }, b.storyLink.note),
      ),
    ),

    h(
      "section",
      { class: "part", "aria-labelledby": `bilhete-${ch.id}` },
      h("h3", { id: `bilhete-${ch.id}`, class: "part-title" }, c.title),
      paragraphs(c.rule, "rule"),
      buildGrid(c.rows, p.passwordSolved && unlocked),
    ),
  );

  const cipherPart = letter.lastElementChild;

  if (p.passwordSolved) {
    cipherPart.append(
      h("p", { class: `solved-answer${unlocked ? " is-unlocked" : ""}` }, "Senha: ", h("strong", {}, c.solvedLabel)),
    );
    return letter;
  }

  const [form, feedback] = answerField({
    id: `senha-${ch.id}`,
    label: c.fieldLabel,
    placeholder: c.placeholder,
    button: c.buttonLabel,
    onSubmit: (value) => {
      if (!matchesPhrase(value, c.answer)) return c.wrong;
      solvePassword(ch);
    },
  });

  const hintList = h("ul", { class: "hints", "aria-live": "polite" });
  const hintButton = h("button", { class: "btn btn-quiet", type: "button" });
  const shown = Math.min(p.passwordHints, c.hints.length);
  const update = (count) => {
    hintButton.hidden = count >= c.hints.length;
    hintButton.textContent = count === 0 ? c.hintFirst : c.hintMore;
  };
  const addHint = (i) => hintList.append(h("li", {}, c.hints[i]));
  for (let i = 0; i < shown; i++) addHint(i);
  update(shown);
  hintButton.addEventListener("click", () => {
    const count = Math.min(progressOf(ch.id).passwordHints + 1, c.hints.length);
    progressOf(ch.id).passwordHints = count;
    persist();
    addHint(count - 1);
    update(count);
    if (hintButton.hidden) hintList.lastElementChild?.setAttribute("tabindex", "-1");
    if (hintButton.hidden) hintList.lastElementChild?.focus({ preventScroll: true });
  });

  cipherPart.append(form, feedback, h("div", { class: "hint-area" }, hintList, hintButton));
  return letter;
}

function buildGrid(rows, unlocked) {
  const cols = rows[0].length;
  return h(
    "div",
    { class: `cipher${unlocked ? " is-unlocked" : ""}` },
    h(
      "table",
      { class: "cipher-grid" },
      h("caption", { class: "visually-hidden" }, `Bilhete cifrado: ${rows.length} linhas e ${cols} colunas`),
      h(
        "thead",
        {},
        h(
          "tr",
          {},
          Array.from({ length: cols }, (_, i) => h("th", { scope: "col" }, String(i + 1))),
        ),
      ),
      h(
        "tbody",
        {},
        rows.map((row) => h("tr", {}, [...row].map((letter) => h("td", {}, letter)))),
      ),
    ),
  );
}

function buildReveal(ch, p) {
  const r = ch.reveal;
  return h(
    "article",
    { class: "card letter reveal", "data-key": "reveal" },
    h("h3", { tabindex: "-1", "data-focus": true }, r.title),
    paragraphs(r.paragraphs),
    !p.wordSearchOpen &&
      h("button", { class: "btn btn-primary", type: "button", onclick: () => openWordSearch(ch) }, r.action),
  );
}

function buildBible(ch, p) {
  const b = ch.bible;
  const card = h(
    "article",
    { class: "card bible", "data-key": "bible" },
    h("h3", { tabindex: "-1", "data-focus": true }, b.title),
    h(
      "p",
      { class: "reference" },
      h("strong", {}, b.reference),
      h("span", { "aria-hidden": "true" }, " · "),
      h("span", {}, String(b.wordNumber)),
    ),
    h("p", { class: "translation" }, `Tradução: ${b.translation}.`),
    h("p", {}, b.intro),
    h("p", { class: "instruction" }, b.instructions),
    h(
      "details",
      { class: "alt-verse" },
      h("summary", {}, b.altLabel),
      h("blockquote", {}, h("p", {}, b.verse), h("footer", {}, `${b.reference}, ${b.translation}`)),
    ),
    h(
      "p",
      {},
      h(
        "a",
        { href: b.link, target: "_blank", rel: "noopener noreferrer" },
        b.linkLabel,
        h("span", { class: "visually-hidden" }, " (abre em outra aba)"),
      ),
    ),
  );

  if (p.word) {
    card.append(h("p", { class: "solved-answer" }, "Nossa palavra: ", h("strong", {}, p.word)));
    return card;
  }

  const [form, feedback] = answerField({
    id: `palavra-${ch.id}`,
    label: b.fieldLabel,
    button: b.buttonLabel,
    onSubmit: (value) => {
      if (!matches(value, b.answers)) return b.wrong;
      saveWord(ch);
    },
  });
  card.append(form, feedback);
  return card;
}

function buildClosing(ch) {
  const c = ch.closing;
  return h(
    "article",
    { class: "card letter closing", "data-key": "closing" },
    h("h3", { tabindex: "-1", "data-focus": true }, c.title),
    paragraphs(c.paragraphs),
    h("p", { class: "signature" }, c.signature.flatMap((line, i) => (i ? [h("br"), line] : [line]))),
    h(
      "button",
      {
        class: "btn btn-quiet",
        type: "button",
        onclick: () => scrollAndFocus(els.chapter.querySelector('[data-key="puzzle"]')),
      },
      "Reler o capítulo",
    ),
  );
}

/* ---------- Ações (cada uma confere a etapa anterior) ---------- */

function start(ch) {
  progressOf(ch.id).started = true;
  persist();
  renderChapter({ focusKey: "puzzle" });
}

function solvePassword(ch) {
  const p = progressOf(ch.id);
  if (!p.started) return;
  p.passwordSolved = true;
  p.solvedAt ??= new Date().toISOString();
  persist();
  renderChapter({ focusKey: "reveal", unlocked: true });
}

function openWordSearch(ch) {
  const p = progressOf(ch.id);
  if (!p.passwordSolved) return;
  p.wordSearchOpen = true;
  persist();
  renderChapter({ focusKey: "bible" });
}

function saveWord(ch) {
  const p = progressOf(ch.id);
  if (!p.passwordSolved || !p.wordSearchOpen) return;
  p.word = ch.bible.word;
  p.completedAt ??= new Date().toISOString();
  persist();
  renderChapter({ focusKey: "closing" });
  renderBoard(ch.id);
  renderMap();
}

/* ---------- Quadro das palavras e mapa ---------- */

function renderBoard(justSaved = null) {
  els.board.replaceChildren(
    ...CHAPTERS.map((ch) => {
      const word = progressOf(ch.id).word;
      const day = formatDayMonth(ch.opens);
      return h(
        "li",
        { class: `slot${word ? " is-filled" : ""}${justSaved === ch.id ? " just-saved" : ""}` },
        word
          ? h("span", { class: "slot-word" }, h("span", { class: "visually-hidden" }, `Palavra de ${day}: `), word)
          : h("span", { class: "slot-blank" }, h("span", { class: "visually-hidden" }, `Espaço de ${day}, ainda vazio`)),
      );
    }),
  );
}

function renderMap() {
  els.map.replaceChildren(
    ...CHAPTERS.map((ch) => {
      const status = statusOf(ch);
      const done = status === "available" && progressOf(ch.id).completed;
      const label =
        status === "future"
          ? `Abre em ${formatDayMonth(ch.opens)}`
          : status === "soon"
            ? "Em breve"
            : done
              ? "Concluído"
              : "Disponível";
      return h(
        "li",
        {},
        h(
          "button",
          {
            type: "button",
            class: `map-item is-${done ? "done" : status}`,
            "aria-current": ch.id === currentId ? "true" : false,
            "aria-disabled": status === "available" ? false : "true",
            onclick: () => {
              if (status === "future") return say(els.mapNote, `${ch.month} abre em ${formatDayMonth(ch.opens)}.`);
              if (status === "soon") return say(els.mapNote, "A próxima lembrança chega em breve.");
              if (location.hash === `#capitulo-${ch.id}`) show({ scroll: true });
              else location.hash = `capitulo-${ch.id}`;
            },
          },
          h("span", { class: "map-month" }, ch.month),
          h("span", { class: "map-status" }, label),
        ),
      );
    }),
  );

  const todays = CHAPTERS.find((ch) => ch.opens === today);
  els.mapNote.textContent = todays && statusOf(todays) === "soon" ? "A próxima lembrança chega em breve." : "";
}

/* ---------- Início ---------- */

function show({ scroll = false } = {}) {
  const next = chapterFromHash() ?? selectDefault();
  if (next !== currentId) renderedKeys = new Set();
  currentId = next;
  renderChapter();
  renderBoard();
  renderMap();
  if (scroll) scrollAndFocus(els.chapter.firstElementChild);
}

document.title = SITE.title;
window.addEventListener("hashchange", () => show({ scroll: true }));
show();

import { SITE, CHAPTERS } from "./chapters.js";
import { matches, matchesPhrase, matchesDate, todayISO, formatDayMonth, chapterStatus } from "./logic.js";

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
  p.poemOrder = Array.isArray(p.poemOrder) ? p.poemOrder : null;
  p.orderSolved = p.orderSolved === true;
  p.giftChoices = Array.isArray(p.giftChoices) ? p.giftChoices : null;
  p.giftsSolved = p.giftsSolved === true;
  p.giftHints = Number.isInteger(p.giftHints) ? p.giftHints : 0;
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

  const buildLetter =
    ch.puzzleType === "poem-chain"
      ? buildPoemLetter
      : ch.puzzleType === "gift-logic"
        ? buildGiftLetter
        : ch.puzzleType === "phone-cipher"
          ? buildPhoneLetter
          : buildPuzzleLetter;
  cards.push(buildLetter(ch, p, unlocked));
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

  cipherPart.append(form, feedback, buildHints(ch, c));
  return letter;
}

// Pistas opcionais: uma por vez, só quando pedidas. O contador fica salvo
// (`counter` separa conjuntos de pistas de um mesmo capítulo).
function buildHints(ch, c, { hints = c.hints, counter = "passwordHints" } = {}) {
  const hintList = h("ul", { class: "hints", "aria-live": "polite" });
  const hintButton = h("button", { class: "btn btn-quiet", type: "button" });
  const shown = Math.min(progressOf(ch.id)[counter], hints.length);
  const update = (count) => {
    hintButton.hidden = count >= hints.length;
    hintButton.textContent = count === 0 ? c.hintFirst : c.hintMore;
  };
  const addHint = (i) => hintList.append(h("li", {}, hints[i]));
  for (let i = 0; i < shown; i++) addHint(i);
  update(shown);
  hintButton.addEventListener("click", () => {
    const count = Math.min(progressOf(ch.id)[counter] + 1, hints.length);
    progressOf(ch.id)[counter] = count;
    persist();
    addHint(count - 1);
    update(count);
    if (hintButton.hidden) hintList.lastElementChild?.setAttribute("tabindex", "-1");
    if (hintButton.hidden) hintList.lastElementChild?.focus({ preventScroll: true });
  });

  return h("div", { class: "hint-area" }, hintList, hintButton);
}

// Novembro: versos embaralhados que ela reorganiza com botões (arrastar não é necessário).
function validOrder(order, verses) {
  return Array.isArray(order) && order.length === verses.length && verses.every((v) => order.includes(v.id));
}

function buildPoemLetter(ch, p, unlocked) {
  const c = ch.poem;
  const byId = new Map(c.verses.map((v) => [v.id, v]));
  if (!validOrder(p.poemOrder, c.verses)) p.poemOrder = c.verses.map((v) => v.id);
  // Ordem já conferida: os versos ficam no lugar.
  if (p.orderSolved) p.poemOrder = [...c.solution];

  const list = h("ol", { class: "poem-sheet" });
  const moved = h("p", { class: "visually-hidden", role: "status", "aria-live": "polite" });
  const orderFeedback = h("p", { class: "feedback", role: "status", "aria-live": "polite" });

  const move = (id, delta, dir) => {
    const order = progressOf(ch.id).poemOrder;
    const from = order.indexOf(id);
    const to = from + delta;
    if (from < 0 || to < 0 || to >= order.length) return;
    [order[from], order[to]] = [order[to], order[from]];
    persist();
    orderFeedback.textContent = "";
    drawList();
    const item = list.querySelector(`[data-verse="${id}"]`);
    const btn = item.querySelector(`[data-dir="${dir}"]`);
    (btn.disabled ? item.querySelector(`[data-dir="${dir === "up" ? "down" : "up"}"]`) : btn).focus();
    say(moved, `Verso movido para a posição ${to + 1} de ${order.length}.`);
  };

  const moveButton = (id, dir, short, disabled) =>
    h(
      "button",
      {
        type: "button",
        class: "move-btn",
        "data-dir": dir,
        "aria-label": `${dir === "up" ? "Mover para cima" : "Mover para baixo"}: ${short}`,
        disabled,
        onclick: () => move(id, dir === "up" ? -1 : 1, dir),
      },
      h("span", { "aria-hidden": "true" }, dir === "up" ? "↑" : "↓"),
    );

  function drawList() {
    const { poemOrder: order, orderSolved: fixed } = progressOf(ch.id);
    list.classList.toggle("is-fixed", fixed);
    list.replaceChildren(
      ...order.map((id, i) => {
        const text = byId.get(id).text;
        const short = text.split(" ").slice(0, 3).join(" ");
        return h(
          "li",
          { class: "verse", "data-verse": id },
          h("span", { class: "verse-text" }, text),
          !fixed &&
            h(
              "span",
              { class: "verse-moves" },
              moveButton(id, "up", short, i === 0),
              moveButton(id, "down", short, i === order.length - 1),
            ),
        );
      }),
    );
  }
  drawList();

  const part = h(
    "section",
    { class: "part", "aria-labelledby": `versos-${ch.id}` },
    h("h3", { id: `versos-${ch.id}`, class: "part-title" }, c.title),
    paragraphs(c.rule, "rule"),
    list,
    moved,
  );

  const letter = h(
    "article",
    { class: "card letter puzzle-letter", "data-key": "puzzle" },
    h("h3", { class: "visually-hidden", tabindex: "-1", "data-focus": true }, `Carta de ${ch.month.toLowerCase()}`),
    h("div", { class: "letter-body" }, paragraphs(ch.letter)),
    part,
  );

  if (p.passwordSolved) {
    part.append(
      h("p", { class: `solved-answer${unlocked ? " is-unlocked" : ""}` }, "Senha: ", h("strong", {}, c.solvedLabel)),
    );
    return letter;
  }

  const passwordArea = h("div", { class: "poem-password" });
  const showPassword = (focus) => {
    const [form, feedback] = answerField({
      id: `senha-${ch.id}`,
      label: c.fieldLabel,
      placeholder: c.placeholder,
      button: c.buttonLabel,
      onSubmit: (value) => {
        if (!matches(value, [c.answer])) return c.wrong;
        solvePassword(ch);
      },
    });
    const found = h("p", { class: "poem-found", tabindex: "-1" }, c.rightOrder);
    passwordArea.replaceChildren(found, form, feedback);
    if (focus) found.focus();
  };

  if (p.orderSolved) {
    showPassword(false);
    part.append(passwordArea);
  } else {
    const check = h(
      "button",
      {
        type: "button",
        class: "btn btn-primary poem-check",
        onclick: () => {
          const pr = progressOf(ch.id);
          if (pr.poemOrder.join() !== c.solution.join()) return say(orderFeedback, c.wrongOrder);
          pr.orderSolved = true;
          persist();
          check.remove();
          orderFeedback.remove();
          drawList();
          showPassword(true);
        },
      },
      c.checkLabel,
    );
    part.append(check, orderFeedback, passwordArea);
  }

  part.append(buildHints(ch, c));
  return letter;
}

// Dezembro: quatro embrulhos em ordem fixa, um seletor de presente em cada.
// Os bilhetes só entram na página depois da combinação inteira estar certa.
function buildGiftLetter(ch, p, unlocked) {
  const c = ch.gifts;
  const optionIds = c.options.map((o) => o.id);
  const labelOf = new Map(c.options.map((o) => [o.id, o.label]));
  const valid =
    Array.isArray(p.giftChoices) &&
    p.giftChoices.length === c.wraps.length &&
    p.giftChoices.every((v) => v === "" || optionIds.includes(v));
  if (!valid) p.giftChoices = c.wraps.map(() => "");
  if (p.giftsSolved) p.giftChoices = c.wraps.map((w) => w.answer);

  const giftsFeedback = h("p", { class: "feedback", role: "status", "aria-live": "polite" });
  let justRevealed = false;

  const wrapCard = (w, i) => {
    const fixed = progressOf(ch.id).giftsSolved;
    const choice = progressOf(ch.id).giftChoices[i];
    const selectId = `embrulho-${ch.id}-${w.id}`;
    const value = h(
      "span",
      { class: `gift-value${choice ? "" : " is-empty"}`, "aria-hidden": fixed ? false : "true" },
      choice ? labelOf.get(choice) : c.emptyOption,
    );
    let pick;
    if (fixed) {
      pick = h("p", { class: "gift-pick is-fixed" }, value);
    } else {
      const select = h(
        "select",
        {
          id: selectId,
          onchange: () => {
            progressOf(ch.id).giftChoices[i] = select.value;
            persist();
            value.textContent = select.value ? labelOf.get(select.value) : c.emptyOption;
            value.classList.toggle("is-empty", !select.value);
            giftsFeedback.textContent = "";
          },
        },
        h("option", { value: "" }, c.emptyOption),
        c.options.map((o) => h("option", { value: o.id, selected: o.id === choice }, o.label)),
      );
      pick = h("div", { class: "gift-pick" }, value, select);
    }
    return h(
      "li",
      { class: `gift gift-${w.tone}` },
      h("span", { class: "gift-ribbon", "aria-hidden": "true" }),
      fixed ? h("span", { class: "gift-name" }, w.name) : h("label", { class: "gift-name", for: selectId }, w.name),
      pick,
      fixed &&
        h(
          "p",
          { class: `gift-note${justRevealed ? " is-revealed" : ""}` },
          h("span", { class: "gift-note-label" }, `${c.noteLabel} `),
          h("span", { class: "gift-note-number" }, w.note),
        ),
    );
  };

  const wrapList = h("ol", { class: "gift-row" });
  const drawWraps = () => wrapList.replaceChildren(...c.wraps.map(wrapCard));
  drawWraps();

  const part = h(
    "section",
    { class: "part", "aria-labelledby": `embrulhos-${ch.id}` },
    h("h3", { id: `embrulhos-${ch.id}`, class: "part-title" }, c.title),
    paragraphs(c.rule, "rule"),
    h("ul", { class: "gift-clues" }, c.clues.map((clue) => h("li", {}, clue))),
    wrapList,
  );

  const letter = h(
    "article",
    { class: "card letter puzzle-letter", "data-key": "puzzle" },
    h("h3", { class: "visually-hidden", tabindex: "-1", "data-focus": true }, `Carta de ${ch.month.toLowerCase()}`),
    h("div", { class: "letter-body" }, paragraphs(ch.letter)),
    part,
  );

  const readingArea = () =>
    h(
      "div",
      { class: "gift-reading" },
      h("p", { class: "poem-found", tabindex: "-1" }, c.found),
      h("div", { class: "reading-clue" }, paragraphs(c.reading)),
    );

  if (p.passwordSolved) {
    part.append(
      readingArea(),
      h("p", { class: `solved-answer${unlocked ? " is-unlocked" : ""}` }, "Senha: ", h("strong", {}, c.solvedLabel)),
    );
    return letter;
  }

  const passwordArea = h("div", { class: "gift-password" });
  const showPassword = (focus) => {
    const [form, feedback] = answerField({
      id: `senha-${ch.id}`,
      label: c.fieldLabel,
      placeholder: c.placeholder,
      button: c.buttonLabel,
      onSubmit: (value) => {
        if (!matchesDate(value, c.answer)) return c.wrong;
        solvePassword(ch);
      },
    });
    const reading = readingArea();
    passwordArea.replaceChildren(reading, form, feedback, buildHints(ch, c));
    if (focus) reading.firstElementChild.focus();
  };

  if (p.giftsSolved) {
    showPassword(false);
    part.append(passwordArea);
    return letter;
  }

  const giftHints = buildHints(ch, c, { hints: c.giftHints, counter: "giftHints" });
  const check = h(
    "button",
    {
      type: "button",
      class: "btn btn-primary gift-check",
      onclick: () => {
        const pr = progressOf(ch.id);
        const picks = pr.giftChoices;
        if (picks.some((v) => !v)) return say(giftsFeedback, c.incomplete);
        if (new Set(picks).size !== picks.length) return say(giftsFeedback, c.repeated);
        if (!c.wraps.every((w, i) => picks[i] === w.answer)) return say(giftsFeedback, c.wrongCombo);
        pr.giftsSolved = true;
        persist();
        check.remove();
        giftsFeedback.remove();
        giftHints.remove();
        justRevealed = true;
        drawWraps();
        showPassword(true);
      },
    },
    c.checkLabel,
  );
  part.append(check, giftsFeedback, giftHints, passwordArea);
  return letter;
}

// Janeiro: celular antigo com visor e teclado só de referência (não decifra nada).
function buildPhoneLetter(ch, p, unlocked) {
  const c = ch.phone;
  const groups = c.message.split(" ");

  const phone = h(
    "figure",
    { class: `phone${p.passwordSolved && unlocked ? " is-unlocked" : ""}` },
    h("span", { class: "phone-speaker", "aria-hidden": "true" }),
    h(
      "div",
      { class: "phone-screen" },
      h("p", { class: "visually-hidden" }, `Recado no visor, ${groups.length} grupos de números:`),
      h(
        "p",
        { class: "phone-message" },
        groups.flatMap((g, i) => [i ? " " : null, h("span", { class: "phone-group" }, g)]),
      ),
    ),
    h(
      "ol",
      { class: "phone-keys", "aria-label": "Teclado do celular" },
      c.keys.map((k) =>
        h(
          "li",
          { class: "phone-key" },
          h("span", { class: "phone-digit", "aria-hidden": "true" }, k.digit),
          h("span", { class: "phone-letters", "aria-hidden": "true" }, k.letters),
          h(
            "span",
            { class: "visually-hidden" },
            k.letters ? `Tecla ${k.digit}: ${[...k.letters].join(" ")}` : `Tecla ${k.digit}: sem letras`,
          ),
        ),
      ),
    ),
  );

  const part = h(
    "section",
    { class: "part", "aria-labelledby": `celular-${ch.id}` },
    h("h3", { id: `celular-${ch.id}`, class: "part-title" }, c.title),
    paragraphs(c.rule, "rule"),
    phone,
  );

  const letter = h(
    "article",
    { class: "card letter puzzle-letter", "data-key": "puzzle" },
    h("h3", { class: "visually-hidden", tabindex: "-1", "data-focus": true }, `Carta de ${ch.month.toLowerCase()}`),
    h("div", { class: "letter-body" }, paragraphs(ch.letter)),
    part,
  );

  if (p.passwordSolved) {
    part.append(
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
  part.append(form, feedback, buildHints(ch, c));
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
    b.instructions && h("p", { class: "instruction" }, b.instructions),
    h(
      "details",
      { class: "alt-verse" },
      h("summary", {}, b.altLabel),
      b.altHeading
        ? h("div", { class: "alt-text" }, h("p", { class: "alt-heading" }, b.altHeading), h("p", {}, b.verse))
        : h("blockquote", {}, h("p", {}, b.verse), h("footer", {}, `${b.reference}, ${b.translation}`)),
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
  if (ch.puzzleType === "poem-chain" && !p.orderSolved) return;
  if (ch.puzzleType === "gift-logic" && !p.giftsSolved) return;
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

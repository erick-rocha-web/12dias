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
  p.drawingCells = Array.isArray(p.drawingCells) ? p.drawingCells : null;
  p.drawingSolved = p.drawingSolved === true;
  p.drawingHints = Number.isInteger(p.drawingHints) ? p.drawingHints : 0;
  p.cryptoLegend = p.cryptoLegend && typeof p.cryptoLegend === "object" && !Array.isArray(p.cryptoLegend) ? p.cryptoLegend : {};
  p.pathCells = Array.isArray(p.pathCells) ? p.pathCells : null;
  p.pathSolved = p.pathSolved === true;
  p.pathHints = Number.isInteger(p.pathHints) ? p.pathHints : 0;
  p.boothSolved = p.boothSolved === true;
  p.boothHints = Number.isInteger(p.boothHints) ? p.boothHints : 0;
  p.reelOrder = Array.isArray(p.reelOrder) ? p.reelOrder : null;
  p.projectionDraft = typeof p.projectionDraft === "string" ? p.projectionDraft : "";
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
          : ch.puzzleType === "picture-logic"
            ? buildDrawingLetter
            : ch.puzzleType === "book-cryptogram"
              ? buildCryptoLetter
              : ch.puzzleType === "church-path"
                ? buildPathLetter
                : ch.puzzleType === "cinema-three-dimensions"
                  ? buildCinemaLetter
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

// Fevereiro: nonograma com letras. Cada casa alterna entre vazia (0),
// pintada (1) e marcada com X (2). As letras ficam visíveis o tempo todo.
const CELL_STATES = ["sem pintura", "pintada", "marcada com X"];

function buildDrawingLetter(ch, p, unlocked) {
  const c = ch.drawing;
  const rowCount = c.rows.length;
  const colCount = c.rows[0].length;
  const total = rowCount * colCount;
  const solution = c.solution.join("");
  const valid =
    Array.isArray(p.drawingCells) &&
    p.drawingCells.length === total &&
    p.drawingCells.every((v) => v === 0 || v === 1 || v === 2);
  if (!valid) p.drawingCells = Array(total).fill(0);

  const letterAt = (i) => c.rows[Math.floor(i / colCount)][i % colCount];
  const cellLabel = (i, state) =>
    `${letterAt(i)}, linha ${Math.floor(i / colCount) + 1}, coluna ${(i % colCount) + 1}, ${CELL_STATES[state]}`;
  // Desenho resolvido: fica só o coração pintado, sem as marcas de X.
  const stateOf = (i) => {
    const pr = progressOf(ch.id);
    return pr.drawingSolved ? Number(solution[i]) : pr.drawingCells[i];
  };

  const drawingFeedback = h("p", { class: "feedback", role: "status", "aria-live": "polite" });
  const board = h("div", { class: "nonogram" });
  let focusIndex = 0;
  const cellButtons = () => board.querySelectorAll("button.nono-cell");

  const paint = (cell, i) => {
    const state = stateOf(i);
    cell.className = `nono-cell is-state-${state}`;
    cell.setAttribute("aria-label", cellLabel(i, state));
  };

  // Uma única parada de Tab na grade; as setas, Home e End mudam de casa.
  const moveFocus = (from, key) => {
    const r = Math.floor(from / colCount);
    const col = from % colCount;
    const next = {
      ArrowLeft: col > 0 ? from - 1 : from,
      ArrowRight: col < colCount - 1 ? from + 1 : from,
      ArrowUp: r > 0 ? from - colCount : from,
      ArrowDown: r < rowCount - 1 ? from + colCount : from,
      Home: r * colCount,
      End: r * colCount + colCount - 1,
    }[key];
    if (next === undefined) return false;
    cellButtons()[next].focus();
    return true;
  };

  const clue = (nums, cls, label) =>
    h(
      "span",
      { class: `nono-clue ${cls}` },
      h("span", { class: "visually-hidden" }, `${label}: `),
      nums.map((n) => h("span", { class: "nono-num" }, String(n))),
    );

  function drawBoard() {
    const solved = progressOf(ch.id).drawingSolved;
    board.classList.toggle("is-solved", solved);
    board.classList.toggle("is-unlocked", solved && unlocked);
    const children = [h("span", { class: "nono-corner", "aria-hidden": "true" })];
    c.colClues.forEach((nums, col) => children.push(clue(nums, "nono-col-clue", `Pista da coluna ${col + 1}`)));
    c.rows.forEach((row, r) => {
      children.push(clue(c.rowClues[r], "nono-row-clue", `Pista da linha ${r + 1}`));
      for (let col = 0; col < colCount; col++) {
        const i = r * colCount + col;
        const cell = solved
          ? h("span", { role: "img" }, h("span", { "aria-hidden": "true" }, letterAt(i)))
          : h(
              "button",
              {
                type: "button",
                tabindex: i === focusIndex ? "0" : "-1",
                onclick: () => {
                  const cells = progressOf(ch.id).drawingCells;
                  cells[i] = (cells[i] + 1) % 3;
                  persist();
                  drawingFeedback.textContent = "";
                  paint(cell, i);
                },
                onfocus: () => {
                  cellButtons().forEach((b) => (b.tabIndex = -1));
                  focusIndex = i;
                  cell.tabIndex = 0;
                },
                onkeydown: (event) => {
                  if (moveFocus(i, event.key)) event.preventDefault();
                },
              },
              h("span", { class: "nono-letter", "aria-hidden": "true" }, letterAt(i)),
            );
        paint(cell, i);
        children.push(cell);
      }
    });
    board.replaceChildren(...children);
  }
  drawBoard();

  const part = h(
    "section",
    { class: "part", "aria-labelledby": `desenho-${ch.id}` },
    h("h3", { id: `desenho-${ch.id}`, class: "part-title" }, c.title),
    paragraphs(c.rule, "rule"),
    h(
      "div",
      {
        class: "nonogram-wrap",
        role: "group",
        "aria-label": "Desenho com letras. Use as setas para mudar de casa e Enter ou Espaço para trocar o estado.",
      },
      board,
    ),
  );

  const letter = h(
    "article",
    { class: "card letter puzzle-letter", "data-key": "puzzle" },
    h("h3", { class: "visually-hidden", tabindex: "-1", "data-focus": true }, `Carta de ${ch.month.toLowerCase()}`),
    h("div", { class: "letter-body" }, paragraphs(ch.letter)),
    part,
  );

  const foundNote = () => h("p", { class: "poem-found", tabindex: "-1" }, c.found);

  if (p.passwordSolved) {
    part.append(
      foundNote(),
      h("p", { class: `solved-answer${unlocked ? " is-unlocked" : ""}` }, "Senha: ", h("strong", {}, c.solvedLabel)),
    );
    return letter;
  }

  const passwordArea = h("div", { class: "drawing-password" });
  const showPassword = (focus) => {
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
    const found = foundNote();
    passwordArea.replaceChildren(found, form, feedback);
    if (focus) found.focus();
  };

  if (p.drawingSolved) {
    showPassword(false);
    part.append(passwordArea);
    return letter;
  }

  const drawingHints = buildHints(ch, c, { counter: "drawingHints" });
  const check = h(
    "button",
    {
      type: "button",
      class: "btn btn-primary",
      onclick: () => {
        const pr = progressOf(ch.id);
        // Toda casa do gabarito pintada e nenhuma outra (X conta como vazia).
        if (!pr.drawingCells.every((v, i) => (v === 1) === (solution[i] === "1"))) {
          return say(drawingFeedback, c.wrongDrawing);
        }
        pr.drawingSolved = true;
        persist();
        actions.remove();
        drawingFeedback.remove();
        drawingHints.remove();
        unlocked = true;
        drawBoard();
        showPassword(true);
      },
    },
    c.checkLabel,
  );
  const clear = h(
    "button",
    {
      type: "button",
      class: "btn btn-quiet",
      onclick: () => {
        progressOf(ch.id).drawingCells.fill(0);
        persist();
        drawingFeedback.textContent = "";
        drawBoard();
      },
    },
    c.clearLabel,
  );
  const actions = h("div", { class: "drawing-actions" }, check, clear);
  part.append(actions, drawingFeedback, drawingHints, passwordArea);
  return letter;
}

// Março: criptograma de substituição. A legenda é só rascunho e nunca é
// conferida; quem valida é a senha.
const TEXT_STYLE = "︎"; // Evita que ☀ e ♠ apareçam como emoji.

function legendLetter(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(-1);
}

function buildCryptoLetter(ch, p, unlocked) {
  const c = ch.crypto;
  const nameOf = new Map(c.legend.map((l) => [l.symbol, l.name]));
  // Legenda salva: só símbolos conhecidos e uma letra cada.
  p.cryptoLegend = Object.fromEntries(
    c.legend.map((l) => [l.symbol, legendLetter(p.cryptoLegend[l.symbol])]).filter(([, v]) => v),
  );

  const drafts = [];
  const glyph = (symbol) => {
    const draft = h("span", { class: "crypto-draft", "aria-hidden": "true" }, p.cryptoLegend[symbol] ?? "");
    draft.dataset.symbol = symbol;
    drafts.push(draft);
    return h("span", { class: "crypto-glyph" }, h("span", { class: "crypto-symbol", "aria-hidden": "true" }, symbol + TEXT_STYLE), draft);
  };

  // Cada palavra fica inteira na linha; a barra acompanha a palavra anterior.
  const cryptoText = (t, i) => {
    const words = t.symbols.split(" / ").map((w) => w.split(" "));
    return h(
      "section",
      { class: "crypto-text", "aria-labelledby": `cripto-${ch.id}-${i}` },
      h("h4", { id: `cripto-${ch.id}-${i}`, class: "crypto-title" }, t.title),
      h(
        "p",
        { class: "crypto-line" },
        words.map((w, wi) =>
          h(
            "span",
            { class: "crypto-word" },
            h("span", { class: "visually-hidden" }, `${w.map((s) => nameOf.get(s)).join(", ")}. `),
            w.map(glyph),
            wi < words.length - 1 && h("span", { class: "crypto-slash", "aria-hidden": "true" }, "/"),
          ),
        ),
      ),
    );
  };
  const texts = c.texts.map(cryptoText);

  const legendList = h(
    "ul",
    { class: "crypto-legend" },
    c.legend.map((l, i) => {
      const id = `legenda-${ch.id}-${i}`;
      const input = h("input", {
        id,
        type: "text",
        class: "legend-input",
        value: p.cryptoLegend[l.symbol] ?? "",
        autocomplete: "off",
        autocapitalize: "characters",
        autocorrect: "off",
        spellcheck: "false",
        readonly: p.passwordSolved,
      });
      const apply = () => {
        const letter = legendLetter(input.value);
        input.value = letter;
        const pr = progressOf(ch.id);
        if (letter) pr.cryptoLegend[l.symbol] = letter;
        else delete pr.cryptoLegend[l.symbol];
        persist();
        for (const d of drafts) if (d.dataset.symbol === l.symbol) d.textContent = letter;
      };
      input.addEventListener("input", (event) => {
        if (!event.isComposing) apply();
      });
      input.addEventListener("compositionend", apply);
      input.addEventListener("focus", () => input.select());
      return h(
        "li",
        { class: "legend-item" },
        h(
          "label",
          { for: id, class: "legend-symbol" },
          h("span", { "aria-hidden": "true" }, l.symbol + TEXT_STYLE),
          h("span", { class: "visually-hidden" }, `Letra do símbolo ${l.name}`),
        ),
        input,
      );
    }),
  );

  const part = h(
    "section",
    { class: "part", "aria-labelledby": `capa-${ch.id}` },
    h("h3", { id: `capa-${ch.id}`, class: "part-title" }, c.title),
    paragraphs(c.rule, "rule"),
    h("div", { class: `crypto${p.passwordSolved && unlocked ? " is-unlocked" : ""}` }, texts),
    h(
      "div",
      { class: "legend-area" },
      h("h4", { class: "crypto-title" }, c.legendTitle),
      !p.passwordSolved && h("p", { class: "legend-rule" }, c.legendRule),
      legendList,
    ),
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

// Abril: caminho no tabuleiro da igreja. O percurso guarda índices de casa
// (linha * colunas + coluna, a partir de 0) e sempre começa na Porta.
const PATH_ICONS = {
  door: '<path d="M6 21V10a6 6 0 0 1 12 0v11"/><path d="M4 21h16"/><circle cx="14.5" cy="14" r="0.9" fill="currentColor" stroke="none"/>',
  flower:
    '<circle cx="12" cy="5.6" r="2.4"/><circle cx="15.4" cy="9" r="2.4"/><circle cx="12" cy="12.4" r="2.4"/><circle cx="8.6" cy="9" r="2.4"/><circle cx="12" cy="9" r="1.2" fill="currentColor" stroke="none"/><path d="M12 14.8V21"/><path d="M12 18.5c-1.8 0-3.3-1-3.9-2.8 1.8 0 3.3 1 3.9 2.8z"/>',
  candle: '<path d="M12 2.8c1.5 1.7 1.9 2.7 1.9 3.5a1.9 1.9 0 0 1-3.8 0c0-.8.4-1.8 1.9-3.5z"/><path d="M12 8.2V10"/><path d="M9 10h6v11H9z"/>',
  cross: '<path d="M12 3v18"/><path d="M7 8h10"/>',
  altar: '<path d="M12 2.5v7"/><path d="M9.5 5h5"/><path d="M3 12.5h18"/><path d="M5 12.5V21"/><path d="M19 12.5V21"/><path d="M8.5 16.5h7"/>',
};

function svgNode(markup) {
  const t = document.createElement("template");
  t.innerHTML = markup;
  return t.content.firstElementChild;
}

const pathIcon = (name) =>
  svgNode(
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${PATH_ICONS[name]}</svg>`,
  );

function buildPathLetter(ch, p, unlocked) {
  const c = ch.path;
  const rowCount = c.rows.length;
  const colCount = c.rows[0].length;
  const total = rowCount * colCount;
  const indexOf = ([row, col]) => (row - 1) * colCount + (col - 1);
  const solution = c.solution.map(indexOf);
  const start = solution[0];
  const end = solution.at(-1);
  const markAt = new Map(c.landmarks.map((l) => [indexOf([l.row, l.col]), l]));
  const rowOf = (i) => Math.floor(i / colCount);
  const colOf = (i) => i % colCount;
  const letterAt = (i) => c.rows[rowOf(i)][colOf(i)];
  const neighbors = (a, b) => Math.abs(rowOf(a) - rowOf(b)) + Math.abs(colOf(a) - colOf(b)) === 1;

  const valid =
    Array.isArray(p.pathCells) &&
    p.pathCells[0] === start &&
    new Set(p.pathCells).size === p.pathCells.length &&
    p.pathCells.every((v, i) => Number.isInteger(v) && v >= 0 && v < total && (i === 0 || neighbors(p.pathCells[i - 1], v)));
  if (!valid) p.pathCells = [start];
  if (p.pathSolved) p.pathCells = [...solution];

  const pathFeedback = h("p", { class: "feedback", role: "status", "aria-live": "polite" });
  const steps = h("p", { class: "path-steps", "aria-live": "polite" });
  const board = h("div", { class: "path-board" });
  let focusIndex = p.pathCells.at(-1);
  const cellButtons = () => board.querySelectorAll("button.path-cell");
  let undo = null;

  // Uma única parada de Tab no tabuleiro; as setas, Home e End mudam de casa.
  const moveFocus = (from, key) => {
    const r = rowOf(from);
    const col = colOf(from);
    const next = {
      ArrowLeft: col > 0 ? from - 1 : from,
      ArrowRight: col < colCount - 1 ? from + 1 : from,
      ArrowUp: r > 0 ? from - colCount : from,
      ArrowDown: r < rowCount - 1 ? from + colCount : from,
      Home: r * colCount,
      End: r * colCount + colCount - 1,
    }[key];
    if (next === undefined) return false;
    cellButtons()[next].focus();
    return true;
  };

  const step = (i) => {
    const cells = progressOf(ch.id).pathCells;
    const last = cells.at(-1);
    if (i === last) return;
    if (cells.includes(i)) return say(pathFeedback, c.visited);
    if (last === end) return say(pathFeedback, c.atEnd);
    if (!neighbors(last, i)) return say(pathFeedback, c.notNeighbor);
    cells.push(i);
    persist();
    pathFeedback.textContent = "";
    focusIndex = i;
    drawBoard();
    cellButtons()[i].focus();
  };

  function drawBoard() {
    const { pathCells: cells, pathSolved: solved } = progressOf(ch.id);
    const last = cells.at(-1);
    board.classList.toggle("is-solved", solved);
    board.classList.toggle("is-unlocked", solved && unlocked);
    steps.textContent = `${c.stepsLabel}: ${cells.length - 1}`;
    if (undo) undo.disabled = cells.length < 2;

    const points = cells.map((i) => `${colOf(i) + 0.5},${rowOf(i) + 0.5}`).join(" ");
    const children = [
      svgNode(
        `<svg class="path-lines" viewBox="0 0 ${colCount} ${rowCount}" preserveAspectRatio="none" aria-hidden="true" focusable="false"><polyline points="${points}"/></svg>`,
      ),
    ];
    for (let i = 0; i < total; i++) {
      const mark = markAt.get(i);
      const on = cells.includes(i);
      const state = i === last ? "você está aqui" : on ? "no caminho" : "livre";
      const cls = `path-cell${on ? " is-on" : ""}${i === last && !solved ? " is-last" : ""}${mark ? " is-mark" : ""}`;
      const content = [
        mark && h("span", { class: "path-icon" }, pathIcon(mark.icon)),
        h("span", { class: "path-letter" }, letterAt(i)),
        mark && h("span", { class: "path-label" }, mark.label),
      ];
      const cell = solved
        ? h("span", { class: cls }, content)
        : h(
            "button",
            {
              type: "button",
              class: cls,
              "aria-label": `${letterAt(i)}${mark ? `, ${mark.label}` : ""}, linha ${rowOf(i) + 1}, coluna ${colOf(i) + 1}, ${state}`,
              tabindex: i === focusIndex ? "0" : "-1",
              onclick: () => step(i),
              onfocus: () => {
                cellButtons().forEach((b) => (b.tabIndex = -1));
                focusIndex = i;
                cellButtons()[i].tabIndex = 0;
              },
              onkeydown: (event) => {
                if (moveFocus(i, event.key)) event.preventDefault();
              },
            },
            content,
          );
      children.push(h("div", { class: "path-slot" }, cell));
    }
    board.replaceChildren(...children);
  }

  const part = h(
    "section",
    { class: "part", "aria-labelledby": `caminho-${ch.id}` },
    h("h3", { id: `caminho-${ch.id}`, class: "part-title" }, c.title),
    paragraphs(c.rule, "rule"),
    h("ul", { class: "path-clues" }, c.clues.map((clue) => h("li", {}, clue))),
    h(
      "div",
      {
        class: "path-wrap",
        role: "group",
        "aria-label": p.pathSolved
          ? "Tabuleiro da igreja com o caminho encontrado."
          : "Tabuleiro da igreja. Use as setas para mudar de casa e Enter ou Espaço para andar até ela.",
      },
      board,
    ),
    steps,
  );

  const letter = h(
    "article",
    { class: "card letter puzzle-letter", "data-key": "puzzle" },
    h("h3", { class: "visually-hidden", tabindex: "-1", "data-focus": true }, `Carta de ${ch.month.toLowerCase()}`),
    h("div", { class: "letter-body" }, paragraphs(ch.letter)),
    part,
  );

  const foundNote = () => h("p", { class: "poem-found", tabindex: "-1" }, c.found);

  if (p.passwordSolved) {
    drawBoard();
    part.append(
      foundNote(),
      h("p", { class: `solved-answer${unlocked ? " is-unlocked" : ""}` }, "Senha: ", h("strong", {}, c.solvedLabel)),
    );
    return letter;
  }

  const passwordArea = h("div", { class: "path-password" });
  const showPassword = (focus) => {
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
    const found = foundNote();
    passwordArea.replaceChildren(found, form, feedback);
    if (focus) found.focus();
  };

  if (p.pathSolved) {
    drawBoard();
    showPassword(false);
    part.append(passwordArea);
    return letter;
  }

  const pathHints = buildHints(ch, c, { counter: "pathHints" });
  undo = h(
    "button",
    {
      type: "button",
      class: "btn btn-quiet",
      onclick: () => {
        const cells = progressOf(ch.id).pathCells;
        if (cells.length < 2) return;
        cells.pop();
        persist();
        pathFeedback.textContent = "";
        focusIndex = cells.at(-1);
        drawBoard();
      },
    },
    c.undoLabel,
  );
  const reset = h(
    "button",
    {
      type: "button",
      class: "btn btn-quiet",
      onclick: () => {
        progressOf(ch.id).pathCells = [start];
        persist();
        pathFeedback.textContent = "";
        focusIndex = start;
        drawBoard();
      },
    },
    c.resetLabel,
  );
  const check = h(
    "button",
    {
      type: "button",
      class: "btn btn-primary",
      onclick: () => {
        const pr = progressOf(ch.id);
        if (pr.pathCells.join() !== solution.join()) return say(pathFeedback, c.wrongPath);
        pr.pathSolved = true;
        persist();
        actions.remove();
        pathFeedback.remove();
        pathHints.remove();
        unlocked = true;
        drawBoard();
        part.querySelector(".path-wrap").setAttribute("aria-label", "Tabuleiro da igreja com o caminho encontrado.");
        showPassword(true);
      },
    },
    c.checkLabel,
  );
  const actions = h("div", { class: "path-actions" }, check, undo, reset);
  drawBoard();
  part.append(actions, pathFeedback, pathHints, passwordArea);
  return letter;
}

// Maio: primeiro a chave da cabine; só depois aparecem as fitas e os quadros.
// As fitas podem trocar de lugar, mas nada é decifrado automaticamente.
const HEART = "♥︎";

function buildCinemaLetter(ch, p, unlocked) {
  const b = ch.booth;
  const c = ch.projection;

  const booth = h(
    "section",
    { class: "part", "aria-labelledby": `cabine-${ch.id}` },
    h("h3", { id: `cabine-${ch.id}`, class: "part-title" }, b.title),
    h("div", { class: "booth-riddle" }, paragraphs(b.riddle)),
    h(
      "p",
      { class: "story-link" },
      h(
        "a",
        { href: b.creditsLink.href, target: "_blank", rel: "noopener noreferrer" },
        b.creditsLink.label,
        h("span", { class: "visually-hidden" }, " (abre em outra aba)"),
      ),
    ),
  );

  const letter = h(
    "article",
    { class: "card letter puzzle-letter", "data-key": "puzzle" },
    h("h3", { class: "visually-hidden", tabindex: "-1", "data-focus": true }, `Carta de ${ch.month.toLowerCase()}`),
    h("div", { class: "letter-body" }, paragraphs(ch.letter)),
    booth,
  );

  if (!p.boothSolved) {
    const [form, feedback] = answerField({
      id: `cabine-chave-${ch.id}`,
      label: b.fieldLabel,
      placeholder: b.placeholder,
      button: b.buttonLabel,
      onSubmit: (value) => {
        if (!b.answers.some((a) => matchesPhrase(value, a))) return b.wrong;
        const pr = progressOf(ch.id);
        pr.boothSolved = true;
        persist();
        renderChapter({ focusKey: "projection", unlocked: true });
      },
    });
    booth.append(form, feedback, buildHints(ch, b, { counter: "boothHints" }));
    return letter;
  }

  booth.append(h("p", { class: "solved-answer" }, "Chave: ", h("strong", {}, b.solvedLabel)));

  // Ordem das fitas: sempre uma permutação dos nomes; a inicial é a da tela.
  const names = c.reels.map((r) => r.name);
  const byName = new Map(c.reels.map((r) => [r.name, r]));
  if (!(p.reelOrder?.length === names.length && names.every((n) => p.reelOrder.includes(n)))) p.reelOrder = [...names];

  const reelList = h("ol", { class: "reels" });
  const moved = h("p", { class: "visually-hidden", role: "status", "aria-live": "polite" });

  const move = (name, delta, dir) => {
    const order = progressOf(ch.id).reelOrder;
    const from = order.indexOf(name);
    const to = from + delta;
    if (from < 0 || to < 0 || to >= order.length) return;
    [order[from], order[to]] = [order[to], order[from]];
    persist();
    drawReels();
    const item = reelList.querySelector(`[data-reel="${name}"]`);
    const btn = item.querySelector(`[data-dir="${dir}"]`);
    (btn.disabled ? item.querySelector(`[data-dir="${dir === "up" ? "down" : "up"}"]`) : btn).focus();
    say(moved, `Fita ${name} movida para a posição ${to + 1} de ${order.length}.`);
  };

  const moveButton = (name, dir, disabled) =>
    h(
      "button",
      {
        type: "button",
        class: "move-btn",
        "data-dir": dir,
        "aria-label": `${dir === "up" ? "Mover para cima" : "Mover para baixo"}: fita ${name}`,
        disabled,
        onclick: () => move(name, dir === "up" ? -1 : 1, dir),
      },
      h("span", { "aria-hidden": "true" }, dir === "up" ? "↑" : "↓"),
    );

  function drawReels() {
    const { reelOrder: order, passwordSolved: fixed } = progressOf(ch.id);
    reelList.replaceChildren(
      ...order.map((name, i) => {
        const reel = byName.get(name);
        return h(
          "li",
          { class: "reel", "data-reel": name },
          h(
            "div",
            { class: "reel-head" },
            h("span", { class: "reel-name" }, name),
            h("span", { class: "reel-role" }, `Fita ${i + 1}: ${c.roles[i].toLowerCase()}`),
            !fixed &&
              h(
                "span",
                { class: "reel-moves" },
                moveButton(name, "up", i === 0),
                moveButton(name, "down", i === order.length - 1),
              ),
          ),
          h("p", { class: "visually-hidden" }, `Números da fita ${name}: ${reel.numbers.join(", ")}.`),
          h(
            "div",
            { class: "reel-strip", "aria-hidden": "true" },
            reel.numbers.map((n) => h("span", { class: "reel-num" }, String(n))),
          ),
        );
      }),
    );
  }
  drawReels();

  const frame = (rows, fi) =>
    h(
      "table",
      { class: "frame" },
      h("caption", { class: "frame-title" }, `Quadro ${fi + 1}`),
      h(
        "thead",
        {},
        h(
          "tr",
          {},
          h("td", { class: "frame-corner" }),
          [1, 2, 3].map((n) =>
            h("th", { scope: "col" }, h("span", { class: "visually-hidden" }, "Coluna "), String(n)),
          ),
        ),
      ),
      h(
        "tbody",
        {},
        rows.map((row, ri) =>
          h(
            "tr",
            {},
            h("th", { scope: "row" }, h("span", { class: "visually-hidden" }, "Linha "), String(ri + 1)),
            [...row].map((l) =>
              l === "*"
                ? h("td", { class: "frame-heart" }, h("span", { "aria-hidden": "true" }, HEART), h("span", { class: "visually-hidden" }, "coração"))
                : h("td", {}, l),
            ),
          ),
        ),
      ),
    );

  const draftId = `rascunho-${ch.id}`;
  const draft = h("textarea", {
    id: draftId,
    class: "draft-input",
    rows: "3",
    autocomplete: "off",
    autocapitalize: "characters",
    autocorrect: "off",
    spellcheck: "false",
  });
  draft.value = p.projectionDraft;
  draft.addEventListener("input", () => {
    progressOf(ch.id).projectionDraft = draft.value;
    persist();
  });

  const justOpened = unlocked && !p.passwordSolved;
  const projection = h(
    "section",
    { class: `part${justOpened ? " is-opened" : ""}`, "aria-labelledby": `projecao-${ch.id}`, "data-key": "projection" },
    h("h3", { id: `projecao-${ch.id}`, class: "part-title", tabindex: "-1", "data-focus": true }, c.title),
    paragraphs(c.rule, "rule"),
    h("div", { class: `projector${p.passwordSolved && unlocked ? " is-unlocked" : ""}` }, reelList, moved),
    h("div", { class: "frames" }, c.frames.map(frame)),
    h("div", { class: "draft" }, h("label", { for: draftId }, c.draftLabel), draft),
  );
  letter.append(projection);

  if (p.passwordSolved) {
    projection.append(
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
  projection.append(form, feedback, buildHints(ch, c));
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
  if (ch.puzzleType === "picture-logic" && !p.drawingSolved) return;
  if (ch.puzzleType === "church-path" && !p.pathSolved) return;
  if (ch.puzzleType === "cinema-three-dimensions" && !p.boothSolved) return;
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

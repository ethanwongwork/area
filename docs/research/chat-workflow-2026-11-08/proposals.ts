/**
 * The chat workflow study's proposals (2026-11-08), shared by the README's table and the review page (entry.tsx).
 * Copy is in design words (PRODUCT_UI rule 24), names no product, never an em dash or a middle dot.
 */
export type Pick = "build" | "change" | "later";
export type Stage = "Input" | "Output" | "Loop" | "Engine";

export interface Proposal {
  id: string;
  stage: Stage;
  title: string;
  /** What it is, in a sentence or two. */
  what: string;
  /** Why: the measured reason. */
  why: string;
  /** What it touches in Area. */
  affects: string;
  /** Intake rung: composition, slot, option, new component, app only. */
  kind: string;
  /** Today in Area, one line. */
  now: string;
  rec: Pick;
}

export const PROPOSALS: Proposal[] = [
  {
    id: "p1", stage: "Engine", title: "Answers you can see",
    what: "Give the agent Area's own tools: show a screen or component with changes applied, offer options, ask a question, log design changes. The chat draws each as Area UI (a picture card, an option set, a question card) instead of prose.",
    why: "Every reference folds its work and answers in words; none can draw the design itself. Area can, because the stage already draws a screen with changes as overrides (the Design view's log). Without these tools the agent only has files and commands, so every answer is text or code.",
    affects: "electron/agent.cjs (in-process tools beside the file tools), chat/session.ts (new part kinds), chat.tsx (draws them). Unblocks P2, P3, P4, P9.",
    kind: "App only (the engine); draws existing components",
    now: "The agent has files, search and commands only; its answers are markdown and diffs.",
    rec: "build",
  },
  {
    id: "p2", stage: "Output", title: "Changes in design words",
    what: "A turn's changes read as what changed on the design (Save button: corner 8 to 12; Cards: shadow Resting to Floating) with a before and after picture, Keep and Undo. Files and lines fold under Show code. Approvals ask the same way: the picture and one plain line, the code a click away.",
    why: "Every reference names files with +N and −N and shows code to approve. A designer judges a corner by looking at it. Area's change log already speaks this language (component, prop, token).",
    affects: "Edit summary (a design row: name, from and to, an optional picture, no counts), Approval's body, chat.tsx's Keep and Undo, the agent's instructions.",
    kind: "Slot and option on Edit summary (rung 4 and 5); Approval unchanged",
    now: "Edited 2 files +24 −3, a code diff per file; the approval shows the diff or the command.",
    rec: "build",
  },
  {
    id: "p3", stage: "Output", title: "Questions back, with choices",
    what: "When a request is open, the agent asks one question at a time as a question card: two to four answers, the recommended one first and marked, a picture where the answer is visible, Something else and Skip. The answer stays in the conversation as the person's reply.",
    why: "Measured: references put the question over the composer (a tray up to 320 tall, lettered rows, Other last, Skip, a single choice moves on at once), fold it to Answer questions (N) when set aside, and keep each answer as a card in the conversation. Area built this card for Setup, but the live chat turns the agent's question tool off and asks in prose.",
    affects: "agent.cjs (turn the question tool on, answer it from the card), session.ts, chat.tsx; Approval and the question kit as they are.",
    kind: "Nothing new: Approval and question-kit's card",
    now: "The agent asks in its reply's prose; the person types an answer.",
    rec: "build",
  },
  {
    id: "p4", stage: "Output", title: "Options side by side",
    what: "Ask for options (or the agent offers them) and two to four versions appear as pictures in a row, each named by its one difference. Pick one to apply it; say More like B or Mix A and C to go again. Nothing is written into the screen's code until one is kept.",
    why: "Measured: one reference shows Response A and Response B as two cards side by side (each 85% wide, radius 14), Response A is Better marks one Selected and dims the other to 0.6; the rest regenerate and compare from memory. The owner asked for A/B examples. Options drawn as change sets cost no code and compare at once.",
    affects: "The agent's options tool (P1), the stage's overrides (design-edit.ts), Approval layout grid with pictures, Design card; Explorations keep the ones not picked.",
    kind: "Composition: Approval grid with pictures over Design card frames",
    now: "One reply at a time; to compare, the person asks again.",
    rec: "build",
  },
  {
    id: "p5", stage: "Output", title: "The work folded into one line",
    what: "While it works, one quiet line says what is happening in plain words (Looking at the settings page, Changing the buttons). Done, it reads Worked 18s, looked at 6 things, changed 2 screens, and opens to the steps. Settings › Chat chooses Summary or Every step.",
    why: "Measured: one reference folds tool use to a single muted line (Searched the web, read a page; 15/21, 60% ink); another counts it (Worked for 2m 5s); a third offers a density setting. Area shows every read, search and command by file name.",
    affects: "chat.tsx (AssistantParts grouping, verbs in design words), Step group, Settings › Chat row.",
    kind: "Composition on Step group; one Settings row (app)",
    now: "Each tool call is a Step with its file or command; reads fold to Explored N items.",
    rec: "build",
  },
  {
    id: "p6", stage: "Input", title: "Context as design things",
    what: "The @ menu and the + menu offer what a designer works with: this page, a layer, a component, a token, the theme, a saved reference, a past chat, an image or file. Each rides in the composer as a chip with its icon; pictures really reach the agent.",
    why: "Measured: the + menus list things with a plain line each (Add photos & files, Design system, Research) and colored marks; one @ menu opens on 3 recent items, then Files, Past chats, Browser; a 14 ring shows how full the conversation is. Area's @ menu lists repository file paths, and an attached image is sent as its name only.",
    affects: "chat.tsx's menu groups, Composer menu rows, Chip icons, agent.cjs (images as image blocks, things as resolved context).",
    kind: "Composition on Composer menu and Chip; engine fix for images",
    now: "@ offers eleven code files; the selection is one chip; images go as names.",
    rec: "build",
  },
  {
    id: "p7", stage: "Output", title: "Short answers, details folded",
    what: "Replies lead with the answer in two or three sentences, then a picture or a table when it helps, then More for the reasons. No headings in short replies. Each ends with the next step as a choice when there is one.",
    why: "Measured: references read at 15 to 16 with 16 between paragraphs and headings only in long replies; one ends its answer with the question that narrows it. The owner asked for succinct answers and simpler results.",
    affects: "The agent's instructions, the reply's markdown (a fold for More), Message.",
    kind: "Composition (Accordion fold in a reply); instructions",
    now: "Keep replies short is one line of the agent's instructions; the reply is free markdown.",
    rec: "build",
  },
  {
    id: "p8", stage: "Loop", title: "Restore to any message",
    what: "Every message the agent acted on saves a version of the project. Each of your messages has Restore to here; a reply has Try another way, which starts an exploration beside the current one. Versions shows chat turns by their words.",
    why: "Measured: references put Restore Checkpoint on each message (then Redo), ask Revert files to this message? before editing an earlier one, and offer Regenerate and Branch in new chat. Area keeps per-file Undo and a project history of 100 iterations, but the two do not meet: a chat edit is not a version.",
    affects: "projects.ts history (a version per kept turn), chat.tsx message actions, the Versions page, Explorations.",
    kind: "Composition and app (Message actions, Versions)",
    now: "Keep or Undo per file, this turn only; no way back to an earlier message.",
    rec: "build",
  },
  {
    id: "p9", stage: "Input", title: "Design changes as one card",
    what: "Send to chat puts the Design view's changes in the composer as one card (4 design changes on Settings), opening to the list, with room to add a sentence before sending. The transcript shows the card, not the long text the agent receives.",
    why: "Today the person's bubble shows the whole generated message, numbered lines and token names, the least designer-like thing in the chat.",
    affects: "design-inspector.tsx (Send to chat), chat.tsx (a change-set chip), Message (the person's bubble with an attachment row).",
    kind: "Composition: Chip or Attachment in the context row",
    now: "A long numbered text message, sent at once.",
    rec: "build",
  },
  {
    id: "p10", stage: "Input", title: "Room for long prompts",
    what: "The composer grows to eight lines, then an Expand control opens it to the panel's height. Starters in the / menu fill a short outline to complete (Explore options for…, Match this reference…, Tidy the spacing on…). A long paste becomes a chip.",
    why: "Measured: one reference grows to 182 (7 lines) then offers Expand, which fills the column (583 in a 766 window); another grows to 384 then scrolls; a third folds a long paste into a Clipboard (N lines) pill, keeps a draft per chat and walks the last 10 prompts with the up arrow. Area stops at five rows of 28.",
    affects: "Composer (an expanded state and its control), chat.tsx's / menu, Composer menu.",
    kind: "A boolean on Composer (rung 6) plus composition",
    now: "Five lines, then it scrolls; / offers New chat only.",
    rec: "build",
  },
  {
    id: "p11", stage: "Input", title: "Ask, suggest or change",
    what: "The + menu's first group says how the agent should help: Ask (answers, changes nothing), Suggest (options to pick from), Change (edits, asking first). The choice rides in the composer as a quiet chip.",
    why: "Measured: references put modes in the + menu, each with one plain line (Ask: Answer questions without making edits; Plan: Generate an implementation plan; Thinking: For detailed answers), each in its own color; a plan arrives as a card to read before Build. A non-technical person needs to know before sending whether their screen will change.",
    affects: "chat.tsx (the + menu and the chip), agent.cjs (Ask maps to the read-only permission mode).",
    kind: "Composition: the kit's + menu (Menu) and Chip",
    now: "No choice; every message may change files, after asking.",
    rec: "build",
  },
  {
    id: "p12", stage: "Input", title: "Point at it",
    what: "In Chat, a click on the stage drops a numbered pin with a note (this, smaller) into the composer as context, several per message.",
    why: "Measured: one reference's design mode reads Point at anything and tell the agent what to fix: click an element or drag an area, draw marks, describe the change, and the picture and marks go to the chat. Proposed in Area's visual questions study (Q1) and left open.",
    affects: "design-select.tsx, chat.tsx context chips, the stage's overlay.",
    kind: "App composition (stage overlay); Chip",
    now: "The Canvas selection rides as one chip.",
    rec: "later",
  },
  {
    id: "p13", stage: "Loop", title: "Ask about a part of a reply",
    what: "Select words in a reply and Ask about this quotes them into the composer. Your own message has Edit; a reply has Try again.",
    why: "Measured: one reference shows Ask over a selection (100 × 28) and Edit message, Regenerate and Branch in the reply's menu. Area's reply has Copy only.",
    affects: "chat.tsx (selection popover, message actions), Message actions.",
    kind: "Composition: Message actions, Popover",
    now: "Copy reply only.",
    rec: "build",
  },
  {
    id: "p14", stage: "Input", title: "Effort, not models",
    what: "The composer offers Quick or Thorough; which model that means lives in Settings › Chat.",
    why: "Measured: one reference shows a Think toggle in the composer, another the model and its effort under it. Model names mean little to a non-technical person.",
    affects: "chat.tsx's Model picker (efforts), Settings › Chat.",
    kind: "Option already on Model picker (efforts)",
    now: "Three model names in the composer.",
    rec: "later",
  },
];

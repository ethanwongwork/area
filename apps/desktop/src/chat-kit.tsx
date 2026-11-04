/**
 * Chat in the kit (owner, 2026-11-02: "can you show me examples of the full type ramp in effect ... i want to see chat
 * examples, responses, item trackers, anything that can show up in a feed or chat response, in this kit"): Area's own chat
 * parts composed as a conversation and a response would be, so Labs › Feed (and the Feed Kit) shows them in use.
 *
 *   Conversation   a person's turn and an answer, with their actions, then the Composer in its full shape (owner,
 *                  2026-11-02: "a more complex/detailed composer version was created that mimiced cursor/claude code, can
 *                  you use that"; then "if the label in the composer isnt necessary then feel free to remove it"): the
 *                  Composer gallery's combined composition (content/demos/composer-expansion.tsx) without its mode tag:
 *                  where it runs above, attach and the permission menu, the model with its effort, the mic
 *   Composers      the gallery's other two shapes, without the tag or a placeholder note: Cursor's Agents window (a
 *                  suggestion under it) and the Claude app's reply composer (its tools and model in a row under it)
 *   Response       one answer as a chat draws it, on three type styles (owner, 2026-11-02: "too many type styles ...
 *                  shouldnt the table style and code style be like the other code block and tables found in the rest of
 *                  the kit"): its headings title-xs (16/22, strong, the kit's section titles' step), its reading text
 *                  (text-lg 15/22), and the UI text of the kit's own Table and Code block (13); a list and a citation.
 *                  It ran h1 to h4, a quote, a caption and a badge for a turn: six sizes in one reply
 *   Trackers       what an agent's turn shows while it works: a Plan on its rail, a group of Steps, Reasoning, an Edit
 *                  summary, an Approval and a Turn notice
 *
 * Copy is one real, generic scenario (owner, 2026-11-02: "use real generic chat/code/design specific copy for these so
 * that it makes sense"): a person asks an agent to add a dark mode switch to a settings page; the agent plans, reads,
 * edits, runs the tests and asks before installing; a reply explains spacing tokens. Never an em dash, never a product.
 */
import { useState, type ReactNode } from "react";
import { Approval, Attachment, Button, Chip, Pagination, Menu, MenuItem, MenuSeparator, Citation, CodeBlock, Code, Composer, ComposerMic, Diff, ComposerMenu, ModelPicker, PromptSuggestions, EditSummary, EditSummaryFile, Message, MessageActions, Plan, Reasoning, Step, StepGroup, Table, TableCell, TableHeaderCell, Timestamp, TurnNotice, type ComposerMenuGroup, type DiffHunk } from "@area/react";
import { AddIcon, BugIcon, DismissIcon, FileCodeIcon, ClipboardListIcon, HelpIcon, LayersIcon, PlugIcon, SparkleIcon, AttachIcon, BookIcon, ChatIcon, TerminalIcon, ListIcon, PencilIcon, LaptopIcon, ShieldIcon, CopyIcon, DocumentIcon, MoreHorizontalIcon, RefreshIcon, SearchIcon, ThumbsDownIcon, ThumbsUpIcon } from "@area/icons";
import { CARD_SCOPE, FEED_CODE, FEED_TABLE } from "./tile.tsx";
import { appScale } from "./app-scale.ts";
import { QuestionRun } from "./question-kit.tsx";

/* The composers' controls, in UI words: where the turn runs, what it may do without asking, and the model with its effort
   (models stay the placeholder vocabulary's options, never a product's names). */
const MODELS = [{ value: "large", label: "Large" }, { value: "fast", label: "Fast" }];
const EFFORTS = [{ value: "light", label: "Light" }, { value: "medium", label: "Medium" }, { value: "high", label: "High" }];
const Model = ({ size }: { size?: "sm" }) => <ModelPicker size={size} label="Model" items={MODELS} efforts={EFFORTS} defaultEffort="medium" />;
const Where = () => <ModelPicker size="sm" label="Where it runs" triggerProps={{ icon: <LaptopIcon /> }} items={[{ value: "local", label: "Local" }, { value: "cloud", label: "Cloud" }]} />;
const Permission = () => <ModelPicker label="Permissions" triggerProps={{ icon: <ShieldIcon /> }} items={[{ value: "ask", label: "Ask first" }, { value: "auto", label: "Edit automatically" }]} />;
const PLACEHOLDER = "Ask anything";

/** A chat's root: one column, and every frame in it (the feed's table, code block and cards, and the chat's own Plan, Edit
 *  summary and Approval) in the cards' stroke (CARD_SCOPE), so a reply draws one edge, not the feed's 6% beside the app's
 *  12% (2026-11-02 pass: Plan and Edit summary stood darker than the table and code block under them). */
const chat = (modifier?: "turn" | "menu") => ({ className: modifier ? `studio-chat studio-chat--${modifier}` : "studio-chat", "data-area-stroke": CARD_SCOPE["data-area-stroke"] });

/* The plus menu (owner, 2026-11-02, with a reference: "can you add this dropdown for the plus icon, i like the colored
   icons"): the composer's + opens Area's Menu, its modes first, each mark in its tone's ink (Plan info, Debug danger,
   Multitask discovery, Ask success, so a mode reads by color before its word), each note on its label's line, muted (the
   live check: one line a row keeps the menu short), then what can be
   added (files, the model, connectors) in the menu's own quiet ink. The tone is the icon's own color (a span the icon
   inherits from), not a restyled Menu. */
const toned = (ink: "info" | "danger" | "discovery" | "success", icon: ReactNode) => <span className="studio-chat__tone" style={{ color: `var(--area-fg-${ink})` }}>{icon}</span>;
export const ADD_ITEMS = <>
  <MenuItem icon={toned("info", <ClipboardListIcon />)}>Plan<span className="studio-chat__aside">Write a plan before any change</span></MenuItem>
  <MenuItem icon={toned("danger", <BugIcon />)}>Debug<span className="studio-chat__aside">Find what caused an issue</span></MenuItem>
  <MenuItem icon={toned("discovery", <LayersIcon />)}>Multitask<span className="studio-chat__aside">Run several agents at once</span></MenuItem>
  <MenuItem icon={toned("success", <HelpIcon />)}>Ask<span className="studio-chat__aside">Answer without making changes</span></MenuItem>
  <MenuSeparator />
  <MenuItem icon={<AttachIcon />}>Files</MenuItem>
  <MenuItem icon={<SparkleIcon />}>Large <span className="studio-chat__effort">High</span></MenuItem>
  <MenuItem icon={<PlugIcon />}>Connectors</MenuItem>
</>;
/** The composer's +: the add menu, opening above it. */
const Add = ({ size }: { size?: "sm" }) => <Menu aria-label="Add" side="top" align="start" tooltip="Add"
  trigger={<Button variant="ghost" tone="neutral" size={size} iconOnly aria-label="Add" icon={<AddIcon />} />}>{ADD_ITEMS}</Menu>;

const action = (label: string, icon: ReactNode) => <Button variant="ghost" tone="neutral" iconOnly aria-label={label} icon={icon} />;
const ANSWER_ACTIONS = <MessageActions>{action("Copy", <CopyIcon />)}{action("Good response", <ThumbsUpIcon />)}{action("Bad response", <ThumbsDownIcon />)}{action("Regenerate", <RefreshIcon />)}{action("More actions", <MoreHorizontalIcon />)}</MessageActions>;

/** A person's turn, an answer, and the Composer under them. */
export function Conversation() {
  return (
    <div {...chat()}>
      <Timestamp dateTime={new Date(2026, 10, 2, 9, 41)}>Today 9:41 AM</Timestamp>
      {/* No actions on the person's turn: they show only on hover and kept a hidden row's height under the bubble, which
          set the answer twice as far from it as the turns elsewhere. */}
      <Message author="user">Can you add a dark mode switch to the settings page?</Message>
      <Message author="assistant" authorName="Assistant" actions={ANSWER_ACTIONS}>
        <p>Yes. I'll put it under Appearance, with the other display options.</p>
        <p>Here's what I'll change:</p>
        <ul>
          <li>a Theme switch with Light, Dark and System,</li>
          <li>the choice saved locally, so it holds after a reload,</li>
          <li>and <Code>data-theme</Code> set on the root, so every token follows.</li>
        </ul>
      </Message>
      <Composer layout="stacked" placeholder={PLACEHOLDER} header={<Where />}
        leadingActions={<><Add /><Permission /></>} mode={<Model />} trailingActions={<ComposerMic />} />
    </div>
  );
}

/** The Composer's other shapes, from its gallery: Cursor's Agents window, then the Claude app's reply composer. */
export function Composers() {
  return (
    <div {...chat()}>
      <div className="studio-chat__composer">
        <Composer layout="stacked" placeholder={PLACEHOLDER} header={<Where />} leadingActions={<Add />} mode={<Model />} trailingActions={<ComposerMic />} />
        <PromptSuggestions layout="chips" items={[{ id: "mode", label: "Switch mode", shortcut: ["Shift", "Tab"] }]} />
      </div>
      <Composer placeholder={PLACEHOLDER} footer={<><Add size="sm" /><ComposerMic size="sm" /><span className="studio-chat__spacer" /><Model size="sm" /></>} />
    </div>
  );
}

const CODE = `.card {
  padding: var(--area-space-16);
  gap: var(--area-space-8);
}`;

/** One answer as a chat draws it: headings, reading text, a list, the kit's Table and Code block. */
export function Response() {
  return (
    <div {...chat()}>
      <Message author="assistant" authorName="Assistant" actions={ANSWER_ACTIONS} className="studio-response">
        <p>Spacing tokens step on a 4px grid, so related things sit closer together than unrelated ones.</p>
        <h3>Choosing a step</h3>
        <p>Use the smallest step that still separates two things. <Citation href="#chat-response" icon={<BookIcon size={12} />} label="Spacing" title="Spacing guidelines" /></p>
        <ol>
          <li>Start from the content's own padding.</li>
          <li>Space groups further apart than the items in them.</li>
          <li>Keep one gap per role across the page.</li>
        </ol>
        <h3>The scale</h3>
        <Table wrapperProps={FEED_TABLE} layout="fixed" aria-label="The scale">
          <thead><tr><TableHeaderCell>Token</TableHeaderCell><TableHeaderCell>Use</TableHeaderCell><TableHeaderCell numeric fit>Value</TableHeaderCell></tr></thead>
          <tbody>
            <tr><TableCell><Code>space-4</Code></TableCell><TableCell className="studio-muted">Icon to label</TableCell><TableCell numeric fit>4</TableCell></tr>
            <tr><TableCell><Code>space-8</Code></TableCell><TableCell className="studio-muted">Related controls</TableCell><TableCell numeric fit>8</TableCell></tr>
            <tr><TableCell><Code>space-16</Code></TableCell><TableCell className="studio-muted">Card padding</TableCell><TableCell numeric fit>16</TableCell></tr>
            <tr><TableCell><Code>space-24</Code></TableCell><TableCell className="studio-muted">Between sections</TableCell><TableCell numeric fit>24</TableCell></tr>
          </tbody>
        </Table>
        <CodeBlock code={CODE} language="css" lineNumbers={false} {...FEED_CODE} {...appScale()} />
        <p>Want me to apply these to the settings page?</p>
      </Message>
    </div>
  );
}

const PLAN = [
  { id: "1", label: "Read the theme tokens", status: "done" as const, meta: "4 of 4" },
  { id: "2", label: "Add the theme switch", status: "current" as const, progress: 0.5, meta: "1 of 2", items: [
    { id: "2a", label: "Settings page", status: "done" as const },
    { id: "2b", label: "Saved preference", status: "current" as const },
  ] },
  { id: "3", label: "Run the tests", status: "pending" as const },
];
const HUNKS: DiffHunk[] = [{ lines: [
  { kind: "context", text: '<Section title="Appearance">', old: 41, new: 41 },
  { kind: "removed", text: '  <Row label="Theme">Light</Row>', old: 42 },
  { kind: "added", text: '  <Row label="Theme"><ThemeSwitch /></Row>', new: 42 },
  { kind: "context", text: "</Section>", old: 43, new: 43 },
] }];
const CHOICES = [
  { value: "once", label: "Yes", description: "Install it this time" },
  { value: "always", label: "Yes, and don't ask again", description: "For installs in this project" },
  { value: "no", label: "No", description: "Write the switch without it" },
];

/** What an agent's turn shows while it works, in the order a turn shows it: its thinking, what it read, its plan, what it
 *  changed, what it asks, and how it ended, all at the UI size (13/18) under the reply's 15/22, 12 apart. */
export function Trackers() {
  const [choice, setChoice] = useState<string>();
  return (
    <div {...chat("turn")}>
      {/* Unframed lines start on the feed's text inset, 4 in from the frames, as every text in the feed does. */}
      <div className="studio-chat__text"><Reasoning seconds={4}>The switch should follow the system theme until someone picks one, so System is the default.</Reasoning></div>
      <div className="studio-chat__text">
        <StepGroup verb="Explored" detail="3 files">
          <Step verb="Read" detail="settings.tsx" icon={<FileCodeIcon />} />
          <Step verb="Searched" detail="“data-theme”" icon={<SearchIcon />} meta="2s" />
          <Step verb="Read" detail="theme.ts" icon={<FileCodeIcon />} />
        </StepGroup>
      </div>
      {/* No glyph before the title (owner, 2026-11-02: "delete the agent icon why is it being used there"), and the
          Plan's own count, done of its items, so the count and the bar's three segments agree (it was "3 of 5"). */}
      <div className="studio-chat__text"><Plan items={PLAN} rail bar="segmented" title="Dark mode" variant="plain" /></div>
      <div className="studio-chat__text"><EditSummary title="Edited 2 files" added={30} removed={4} variant="plain">
        <EditSummaryFile name="src/pages/settings.tsx" icon={<FileCodeIcon />} added={24} removed={3} status="pending" diff={<Diff aria-label="Changes to settings.tsx" hunks={HUNKS} />} defaultOpen />
        <EditSummaryFile name="src/theme.ts" icon={<FileCodeIcon />} added={6} removed={1} status="pending" />
      </EditSummary></div>
      <Approval title="Run npm install?" description="It adds one package to package.json." items={CHOICES} value={choice} onChoose={setChoice} />
      <div className="studio-chat__text"><TurnNotice status="stopped">You stopped this reply after 12s.</TurnNotice></div>
    </div>
  );
}

/* --- The Chat kit (Labs › Chat, src/pages/chat-lab.tsx; docs/research/chat-kit-2026-11-02) ----------------------------
 * The same content as the feed, in a conversation: what a reply carries (the feed's cards, a chart, colors), what rides on
 * the composer (attachments, the command menu), an agent's turn folded to one line, a question in the composer's place
 * and an activity log, each drawn by the component the feed uses, at the width the chat is given. */

/** A reply that carries the feed's own cards (owner, 2026-11-02: "the same or similar content may be featured in both"):
 *  two design cards, a chart and a color scale, each the feed's frame, one column wide or two across when they fit. */
export function CardsReply({ designs, chart, colors }: { designs: ReactNode; chart: ReactNode; colors: ReactNode }) {
  return (
    <div {...chat()}>
      <Message author="user">Show me both layouts, and how requests are trending this month.</Message>
      <Message author="assistant" authorName="Assistant" actions={ANSWER_ACTIONS} className="studio-response">
        <p>Here are both layouts, the dashboard first.</p>
        <div className="studio-chat__block">{designs}</div>
        <p>Requests by model this month, so far and projected:</p>
        <div className="studio-chat__block">{chart}</div>
        <p>And the blue scale the charts draw from, lightest first.</p>
        <div className="studio-chat__block">{colors}</div>
      </Message>
    </div>
  );
}

/** What waits in the composer before it is sent: a picture and a file, each removable, over the field. */
export function Attachments({ image }: { image?: string }) {
  const [files, setFiles] = useState(["settings.tsx", "tokens.json"]);
  const [picture, setPicture] = useState(Boolean(image));
  const chips = <>
    {picture && image ? <Attachment src={image} name="Screenshot" onDismiss={() => setPicture(false)} /> : null}
    {files.map(name => <Chip key={name} kind="input" size="sm" icon={<DocumentIcon />} onDismiss={() => setFiles(list => list.filter(entry => entry !== name))}>{name}</Chip>)}
  </>;
  return (
    <div {...chat()}>
      <Composer layout="stacked" placeholder={PLACEHOLDER} context={chips} leadingActions={<Add />} mode={<Model />} trailingActions={<ComposerMic />} />
    </div>
  );
}

const COMMANDS: ComposerMenuGroup[] = [
  { label: "Modes", items: [
    { id: "plan", label: "Plan", icon: <ListIcon /> },
    { id: "ask", label: "Ask", icon: <ChatIcon /> },
  ] },
  { label: "Add", items: [
    { id: "files", label: "Files", icon: <AttachIcon /> },
    { id: "settings", label: "settings.tsx", icon: <FileCodeIcon />, path: "src/pages" },
  ] },
];

/** The composer's command menu, open over its field (the person typed "/"). */
export function Commands() {
  const [active, setActive] = useState("plan");
  return (
    <div {...chat("menu")}>
      <Composer layout="stacked" defaultValue="/" placeholder={PLACEHOLDER} leadingActions={<Add />} mode={<Model />}
        menu={<ComposerMenu id="chat-kit-commands" aria-label="Commands" items={COMMANDS} activeId={active}
          onActiveChange={setActive} onPick={item => setActive(item.id)} />} />
    </div>
  );
}

const OUTPUT = `{
  "tests": 31,
  "passed": 31,
  "failed": 0
}`;

/** An agent's whole turn folded to one line (Claude Code's "18 tools, edited 5 files"), open: what it ran and edited,
 *  one step open to its output in the kit's Code block, and the reply under it. */
export function AgentTurn() {
  return (
    <div {...chat("turn")}>
      <div className="studio-chat__text">
        <StepGroup verb="Worked" detail="6 tools, edited 2 files, ran 2 commands" meta="1m 48s" defaultOpen>
          <Step verb="Read" detail="tokens.css" icon={<FileCodeIcon />} />
          <Step verb="Edited" detail="settings.tsx" icon={<PencilIcon />} />
          <Step verb="Ran" detail="npm run typecheck" icon={<TerminalIcon />} meta="9s" />
          <Step verb="Ran" detail="npm test" icon={<TerminalIcon />} meta="14s" defaultOpen>
            <CodeBlock code={OUTPUT} language="json" lineNumbers={false} {...FEED_CODE} {...appScale()} />
          </Step>
        </StepGroup>
      </div>
      <Message author="assistant" authorName="Assistant" actions={ANSWER_ACTIONS}>
        <p>The switch is in, and all 31 tests pass. It follows the system theme until someone picks one, then remembers the choice in <Code>localStorage</Code>.</p>
      </Message>
    </div>
  );
}

/* The questions an agent asks before it starts, one at a time (docs/research/chat-kit-2026-11-02/questions.md: every
   measured product docks the card at the composer, keys each option, ends the list with a free-text row, counts the
   questions "N of M" with chevrons, always offers Skip, and moves on by itself once one choice is picked). */
const QUESTIONS = [
  { title: "Which theme should the app open in?", items: [
    { value: "system", label: "Match the system", description: "Follows the device's light or dark setting" },
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
  ] },
  { title: "Where should the switch go?", items: [
    { value: "appearance", label: "Appearance section", description: "With the other display options" },
    { value: "menu", label: "Account menu", description: "One click from any page" },
    { value: "both", label: "Both" },
  ] },
  { title: "Should the choice follow the person to other devices?", items: [
    { value: "sync", label: "Yes, save it to the account" },
    { value: "local", label: "No, keep it on this device" },
  ] },
];

/** Questions in the composer's place: the question as the card's title, its count and chevrons and a close at the head's
 *  end, keyed answers a light line apart (a pick moves to the next question), and a line for an answer of one's own with
 *  Skip at its end (the live check, docs/research/chat-kit-2026-11-02/live.md). */
export function Question() {
  const [page, setPage] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({ 0: "system" });
  const question = QUESTIONS[page - 1]!;
  const next = () => setPage(current => Math.min(QUESTIONS.length, current + 1));
  return (
    <div {...chat()}>
      <Message author="assistant" authorName="Assistant"><p>Before I add the switch, three quick questions.</p></Message>
      <Approval key={page} title={question.title} items={question.items} value={answers[page - 1]}
        onChoose={value => { setAnswers(current => ({ ...current, [page - 1]: value })); next(); }}
        onInstead={() => next()} insteadPlaceholder="Something else" onDismiss={next} dismissLabel="skip"
        actions={<>
          <Pagination layout="compact" size="sm" pageCount={QUESTIONS.length} page={page} onPageChange={setPage}
            labels={{ nav: "Questions", previous: "Previous question", next: "Next question", status: (current, count) => <>{current} of {count}</> }} />
          <Button variant="ghost" tone="neutral" size="sm" iconOnly aria-label="Close questions" icon={<DismissIcon />} />
        </>} />
    </div>
  );
}

/** Visual questions in a chat (src/question-kit.tsx): the agent says what it will ask, then the setting questions one at
 *  a time, each a frame over its question, a pick moving on, in the composer's place. */
export function VisualRun() {
  return (
    <div {...chat()}>
      <Message author="assistant" authorName="Assistant"><p>A few questions to set the look. Point at an answer to see it in the frame first.</p></Message>
      <QuestionRun />
    </div>
  );
}

/** A chat's root around anything the kit shows in one (a visual question on its own). */
export function InChat({ children }: { children: ReactNode }) {
  return <div {...chat()}>{children}</div>;
}

/** The + menu open over the composer, as it shows when the + is pressed: Area's Menu as a placed surface (the menu with no
 *  trigger, its host placing it, as ModelPicker's), 8 above the field. */
export function AddMenu() {
  return (
    <div {...chat()}>
      <div className="studio-chat__over">
        <Menu aria-label="Add" className="studio-chat__menu">{ADD_ITEMS}</Menu>
        <Composer layout="stacked" placeholder={PLACEHOLDER} leadingActions={<Add />} mode={<Model />} trailingActions={<ComposerMic />} />
      </div>
    </div>
  );
}

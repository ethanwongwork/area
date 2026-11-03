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
 * Copy is the kit's abstract prose (type-kit.tsx TYPE_PARAGRAPH: a quiet room, the morning, a clock), never an em dash;
 * items and values take the placeholder vocabulary where a component's own words would read as a story.
 */
import { useState, type ReactNode } from "react";
import { Approval, Button, Citation, CodeBlock, Code, Composer, ComposerAttach, ComposerMic, Diff, ModelPicker, PromptSuggestions, EditSummary, EditSummaryFile, Message, MessageActions, Plan, Reasoning, Step, StepGroup, Table, TableCell, TableHeaderCell, Timestamp, TurnNotice, type DiffHunk } from "@area/react";
import { BookIcon, LaptopIcon, ShieldIcon, CopyIcon, DocumentIcon, MoreHorizontalIcon, RefreshIcon, SearchIcon, ThumbsDownIcon, ThumbsUpIcon } from "@area/icons";
import { FEED_CODE, FEED_TABLE } from "./tile.tsx";
import { appScale } from "./app-scale.ts";

/* The composers' controls, in UI words: where the turn runs, what it may do without asking, and the model with its effort
   (models stay the placeholder vocabulary's options, never a product's names). */
const MODELS = [{ value: "one", label: "Option one" }, { value: "two", label: "Option two" }];
const EFFORTS = [{ value: "light", label: "Light" }, { value: "medium", label: "Medium" }, { value: "high", label: "High" }];
const Model = ({ size }: { size?: "sm" }) => <ModelPicker size={size} label="Model" items={MODELS} efforts={EFFORTS} defaultEffort="medium" />;
const Where = () => <ModelPicker size="sm" label="Where it runs" triggerProps={{ icon: <LaptopIcon /> }} items={[{ value: "local", label: "Local" }, { value: "cloud", label: "Cloud" }]} />;
const Permission = () => <ModelPicker label="Permissions" triggerProps={{ icon: <ShieldIcon /> }} items={[{ value: "ask", label: "Ask first" }, { value: "auto", label: "Edit automatically" }]} />;
const PLACEHOLDER = "Ask anything";

const action = (label: string, icon: ReactNode) => <Button variant="ghost" tone="neutral" iconOnly aria-label={label} icon={icon} />;
const ANSWER_ACTIONS = <MessageActions>{action("Copy", <CopyIcon />)}{action("Good response", <ThumbsUpIcon />)}{action("Bad response", <ThumbsDownIcon />)}{action("Regenerate", <RefreshIcon />)}{action("More actions", <MoreHorizontalIcon />)}</MessageActions>;

/** A person's turn, an answer, and the Composer under them. */
export function Conversation() {
  return (
    <div className="studio-chat">
      <Timestamp dateTime={new Date(2026, 10, 2, 6, 40)}>Today 6:40 AM</Timestamp>
      {/* No actions on the person's turn: they show only on hover and kept a hidden row's height under the bubble, which
          set the answer twice as far from it as the turns elsewhere. */}
      <Message author="user">Describe the room in the morning, before anyone is up.</Message>
      <Message author="assistant" authorName="Assistant" actions={ANSWER_ACTIONS}>
        <p>A quiet room at the edge of the morning, where the light comes in sideways and settles on the table.</p>
        <p>Nothing much happens here, and that is the point:</p>
        <ul>
          <li>the pages turn,</li>
          <li>the tea goes cold,</li>
          <li>and at <Code>6:40</Code> a clock somewhere agrees with itself.</li>
        </ul>
      </Message>
      <Composer layout="stacked" placeholder={PLACEHOLDER} header={<Where />}
        leadingActions={<><ComposerAttach /><Permission /></>} mode={<Model />} trailingActions={<ComposerMic />} />
    </div>
  );
}

/** The Composer's other shapes, from its gallery: Cursor's Agents window, then the Claude app's reply composer. */
export function Composers() {
  return (
    <div className="studio-chat">
      <div className="studio-chat__composer">
        <Composer layout="stacked" placeholder={PLACEHOLDER} header={<Where />} leadingActions={<ComposerAttach />} mode={<Model />} trailingActions={<ComposerMic />} />
        <PromptSuggestions layout="chips" items={[{ id: "mode", label: "Switch mode", shortcut: ["Shift", "Tab"] }]} />
      </div>
      <Composer placeholder={PLACEHOLDER} footer={<><ComposerAttach size="sm" /><ComposerMic size="sm" /><span className="studio-chat__spacer" /><Model size="sm" /></>} />
    </div>
  );
}

const CODE = `const hours = clocks
  .filter(clock => clock.agrees)
  .map(clock => clock.time);`;

/** One answer as a chat draws it: headings, reading text, a list, the kit's Table and Code block. */
export function Response() {
  return (
    <div className="studio-chat">
      <Message author="assistant" authorName="Assistant" actions={ANSWER_ACTIONS} className="studio-response">
        <p>The light comes in sideways and settles on the table. Nothing much happens here, and that is the point.</p>
        <h3>Morning</h3>
        <p>The pages turn, the tea goes cold, and somewhere a clock agrees with itself. <Citation href="#feed-response" icon={<BookIcon size={12} />} label="Notes" title="Notes on the room" /></p>
        <ol>
          <li>A table, by the window.</li>
          <li>Two chairs, one of them pulled out.</li>
          <li>A clock that runs a minute fast.</li>
        </ol>
        <h3>By the hour</h3>
        <Table wrapperProps={FEED_TABLE} layout="fixed" aria-label="By the hour">
          <thead><tr><TableHeaderCell>Hour</TableHeaderCell><TableHeaderCell>Light</TableHeaderCell><TableHeaderCell numeric fit>Pages</TableHeaderCell></tr></thead>
          <tbody>
            <tr><TableCell>6:40</TableCell><TableCell className="studio-muted">Sideways</TableCell><TableCell numeric fit>12</TableCell></tr>
            <tr><TableCell>7:15</TableCell><TableCell className="studio-muted">On the table</TableCell><TableCell numeric fit>31</TableCell></tr>
            <tr><TableCell>8:00</TableCell><TableCell className="studio-muted">Across the floor</TableCell><TableCell numeric fit>48</TableCell></tr>
          </tbody>
        </Table>
        <CodeBlock code={CODE} language="ts" lineNumbers={false} {...FEED_CODE} {...appScale()} />
        <p>Who keeps the hours when no one is counting them?</p>
      </Message>
    </div>
  );
}

const PLAN = [
  { id: "1", label: "Open the window", status: "done" as const, meta: "2 of 2" },
  { id: "2", label: "Count the pages", status: "current" as const, progress: 0.5, meta: "1 of 2", items: [
    { id: "2a", label: "The first chapter", status: "done" as const, meta: "12" },
    { id: "2b", label: "The second chapter", status: "current" as const },
  ] },
  { id: "3", label: "Set the clock", status: "pending" as const },
];
const HUNKS: DiffHunk[] = [{ lines: [
  { kind: "context", text: "The light comes in sideways.", old: 1, new: 1 },
  { kind: "removed", text: "The clock runs a minute fast.", old: 2 },
  { kind: "added", text: "The clock agrees with itself.", new: 2 },
] }];
const CHOICES = [
  { value: "keep", label: "Keep the clock", description: "It runs a minute fast" },
  { value: "set", label: "Set it to the hour", description: "It agrees with itself" },
];

/** What an agent's turn shows while it works, in the order a turn shows it: its thinking, what it read, its plan, what it
 *  changed, what it asks, and how it ended, all at the UI size (13/18) under the reply's 15/22, 12 apart. */
export function Trackers() {
  const [choice, setChoice] = useState<string>();
  return (
    <div className="studio-chat studio-chat--turn">
      {/* Unframed lines start on the feed's text inset, 4 in from the frames, as every text in the feed does. */}
      <div className="studio-chat__text"><Reasoning seconds={4}>The clock runs a minute fast, so the hour it shows is the next one.</Reasoning></div>
      <div className="studio-chat__text">
        <StepGroup verb="Read" detail="3 notes">
          <Step verb="Read" detail="window.md" icon={<DocumentIcon />} />
          <Step verb="Searched" detail="“clock”" icon={<SearchIcon />} meta="2s" />
          <Step verb="Read" detail="table.md" icon={<DocumentIcon />} />
        </StepGroup>
      </div>
      {/* No glyph before the title (owner, 2026-11-02: "delete the agent icon why is it being used there"), and the
          Plan's own count, done of its items, so the count and the bar's three segments agree (it was "3 of 5"). */}
      <Plan items={PLAN} rail bar="segmented" title="Morning" />
      <EditSummary title="Edited 1 file" added={1} removed={1}>
        <EditSummaryFile name="room.md" added={1} removed={1} status="pending" diff={<Diff aria-label="Changes to room.md" hunks={HUNKS} />} defaultOpen />
      </EditSummary>
      <Approval title="Set the clock?" description="It runs a minute fast." items={CHOICES} value={choice} onChoose={setChoice} />
      <div className="studio-chat__text"><TurnNotice status="stopped">You stopped this reply after 12s.</TurnNotice></div>
    </div>
  );
}

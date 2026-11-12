/**
 * Agent chat gallery specimens (Phase 2 of docs/research/inspector-chat-2026-10-18): Step, Step group, Reasoning, Edit
 * summary and Diff, Approval, Plan and Turn notice. One variant per tile, at the Inspector's narrow column (280), in
 * the system's placeholder copy. Specs: docs/specs/{step,edit-summary,approval,plan,turn-notice}.md.
 */
import { useState } from "react";
import { Approval, Badge, Button, CodeBlock, Diff, EditSummary, EditSummaryChange, EditSummaryFile, Pagination, Plan, Reasoning, Step, StepGroup, TurnNotice, type DiffHunk, type EditFileState } from "@area/react";
import { AgentIcon, DocumentIcon } from "@area/icons";

const frame = { inlineSize: 280 };

// ---- Step ----
export const GalleryStep = () => <div style={frame}><Step verb="Label" detail="Value" /></div>;
export const GalleryStepRunning = () => <div style={frame}><Step verb="Label" detail="Value" status="running" /></div>;
export const GalleryStepFailed = () => <div style={frame}><Step verb="Label" detail="Value" status="error" /></div>;
export const GalleryStepOpen = () => (
  <div style={frame}><Step verb="Label" detail="Value" defaultOpen><CodeBlock size="sm" lineNumbers={false} code="Body text" /></Step></div>
);
export const GalleryStepIcon = () => <div style={frame}><Step verb="Label" detail="Value" icon={<DocumentIcon />} /></div>;
export const GalleryStepMeta = () => <div style={frame}><Step verb="Label" detail="Value" meta="2s" /></div>;
export const GalleryStepLong = () => (
  <div style={frame}><Step verb="Label" detail="A longer value that runs past the end of the column" /></div>
);

export const GalleryStepGroup = () => (
  <div style={frame}>
    <StepGroup verb="Label" detail="3 items">
      <Step verb="Label" detail="Item one" /><Step verb="Label" detail="Item two" /><Step verb="Label" detail="Item three" />
    </StepGroup>
  </div>
);
export const GalleryStepGroupOpen = () => (
  <div style={frame}>
    <StepGroup verb="Label" detail="3 items" defaultOpen>
      <Step verb="Label" detail="Item one" /><Step verb="Label" detail="Item two" /><Step verb="Label" detail="Item three" />
    </StepGroup>
  </div>
);

export const GalleryReasoning = () => <div style={frame}><Reasoning seconds={4}>Body text</Reasoning></div>;
export const GalleryReasoningOpen = () => <div style={frame}><Reasoning seconds={4} defaultOpen>Body text</Reasoning></div>;
export const GalleryReasoningRunning = () => <div style={frame}><Reasoning running /></div>;

// ---- Edit summary and Diff ----
const hunks: DiffHunk[] = [
  { lines: [
    { kind: "context", text: "Body text", old: 1, new: 1 },
    { kind: "deleted", text: "Value", old: 2 },
    { kind: "added", text: "Value", new: 2 },
    { kind: "context", text: "Body text", old: 3, new: 3 },
  ] },
  { folded: 12, lines: [
    { kind: "context", text: "Body text", old: 16, new: 16 },
    { kind: "added", text: "Value", new: 17 },
  ] },
];

function Summary({ open, status = "pending" }: { open?: boolean; status?: EditFileState }) {
  const [states, setStates] = useState<EditFileState[]>([status, status]);
  const set = (index: number, next: EditFileState) => setStates(current => current.map((value, i) => i === index ? next : value));
  const pending = states.some(value => value === "pending");
  return (
    <div style={frame}>
      <EditSummary title="Title" added={3} deleted={1}
        onKeepAll={pending ? () => setStates(current => current.map(value => value === "pending" ? "kept" : value)) : undefined}
        onUndoAll={pending ? () => setStates(current => current.map(value => value === "pending" ? "undone" : value)) : undefined}>
        <EditSummaryFile name="Item one" added={2} deleted={1} status={states[0]} onKeep={() => set(0, "kept")} onUndo={() => set(0, "undone")}
          diff={<Diff aria-label="Changes to Item one" hunks={hunks} />} defaultOpen={open} />
        <EditSummaryFile name="Item two" added={1} deleted={0} status={states[1]} onKeep={() => set(1, "kept")} onUndo={() => set(1, "undone")}
          diff={<Diff aria-label="Changes to Item two" hunks={[hunks[1]!]} />} />
      </EditSummary>
    </div>
  );
}
export const GalleryEditSummary = () => <Summary />;
export const GalleryEditSummaryOpen = () => <Summary open />;
export const GalleryEditSummaryKept = () => <Summary status="kept" />;
export const GalleryEditSummaryUndone = () => <Summary status="undone" />;
/** Design changes: a row a change in the design's words, the files under Show code, Keep all and Undo all settling both. */
export const GalleryEditSummaryDesign = () => {
  const [status, setStatus] = useState<EditFileState>("pending");
  const pending = status === "pending";
  return (
    <div style={frame}>
      <EditSummary title="Title" added={3} deleted={1}
        onKeepAll={pending ? () => setStatus("kept") : undefined} onUndoAll={pending ? () => setStatus("undone") : undefined}
        code={<>
          <EditSummaryFile name="Item one" added={2} deleted={1} status={status} diff={<Diff aria-label="Changes to Item one" hunks={hunks} />} />
          <EditSummaryFile name="Item two" added={1} deleted={0} status={status} diff={<Diff aria-label="Changes to Item two" hunks={[hunks[1]!]} />} />
        </>}>
        <EditSummaryChange name="Item one" property="Label" from="Value one" to="Value two" status={status} />
        <EditSummaryChange name="Item two" property="Label" from="Value one" to="Value two" status={status} />
      </EditSummary>
    </div>
  );
};
export const GalleryDiff = () => <div style={frame}><Diff aria-label="Changes to Item one" hunks={hunks} /></div>;
/** A comment on a line: the + at each line's start writes a note under it (the first line's shows here). */
function DiffComment() {
  const [notes, setNotes] = useState([{ hunk: 0, line: 2 }]);
  return (
    <div style={frame}>
      <Diff aria-label="Changes to Item one" hunks={hunks} notes={notes.map(at => ({ ...at, content: "Body text" }))}
        onComment={(_line, at) => setNotes(current => current.some(note => note.hunk === at.hunk && note.line === at.line) ? current : [...current, at])} />
    </div>
  );
}
export const GalleryDiffComment = () => <DiffComment />;

// ---- Approval ----
const options = [
  { value: "one", label: "Option one" },
  { value: "two", label: "Option two" },
  { value: "three", label: "Option three" },
];
export const GalleryApproval = () => (
  <div style={frame}><Approval title="Title" description="Description" items={options} onChoose={() => {}} /></div>
);
export const GalleryApprovalDetail = () => (
  <div style={frame}>
    <Approval title="Title" description="Description" items={options} onChoose={() => {}}>
      <CodeBlock size="sm" lineNumbers={false} code="Value" />
    </Approval>
  </div>
);
// A question (Claude Code's AskUserQuestion): each choice says what it comes to; asked again, the answer given is marked;
// among several questions, where it is sits in the head and the way on in the foot.
const described = [
  { value: "one", label: "Option one", description: "Description" },
  { value: "two", label: "Option two", description: "Description" },
  { value: "three", label: "Option three", description: "Description" },
];
export const GalleryApprovalDescriptions = () => (
  <div style={frame}><Approval title="Title" description="Description" items={described} onChoose={() => {}} /></div>
);
export const GalleryApprovalAnswered = () => {
  const [value, setValue] = useState("two");
  return <div style={frame}><Approval title="Title" description="Description" items={options} value={value} onChoose={setValue} /></div>;
};
export const GalleryApprovalQuestions = () => {
  const [page, setPage] = useState(2);
  return (
    <div style={frame}>
      <Approval title="Title" items={options} onChoose={() => setPage(next => Math.min(4, next + 1))} dismissLabel="skip"
        actions={<Pagination layout="compact" size="sm" pageCount={4} page={page} onPageChange={setPage} labels={{ nav: "Questions", status: (at, count) => <>{at} of {count}</> }} />}
        footer={<Button size="sm" variant="ghost" tone="neutral" onClick={() => setPage(next => Math.min(4, next + 1))}>Skip</Button>} />
    </div>
  );
};
// Grid (visual questions, 2026-11-03): short answers two across, and pictured answers, each drawn over its key and label.
export const GalleryApprovalGrid = () => (
  <div style={frame}><Approval title="Title" layout="grid" items={[...options, { value: "four", label: "Option four" }]} onChoose={() => {}} /></div>
);
const pictured = ["one", "two", "three", "four"].map((value, index) => ({
  value, label: `Option ${["one", "two", "three", "four"][index]}`,
  visual: <span style={{ inlineSize: 24, blockSize: 24, borderRadius: [0, 4, 8, 12][index], background: "var(--area-neutral-solid)" }} />,
}));
export const GalleryApprovalPictures = () => (
  <div style={frame}><Approval title="Title" layout="grid" items={pictured} onChoose={() => {}} /></div>
);
// Plain (2026-11-04): no card of its own, for several questions in one card of the host's.
export const GalleryApprovalPlain = () => (
  <div style={frame}><Approval variant="plain" title="Title" description="Description" items={options} onChoose={() => {}} /></div>
);
export const GalleryApprovalInstead = () => (
  <div style={frame}><Approval title="Title" description="Description" items={options} onChoose={() => {}} onInstead={() => {}} insteadPlaceholder="Placeholder" /></div>
);

// ---- Plan ----
const planItems = [
  { id: "1", label: "Item one", status: "complete" as const },
  { id: "2", label: "Item two", status: "current" as const },
  { id: "3", label: "Item three", status: "pending" as const },
  { id: "4", label: "Item four", status: "pending" as const },
];
export const GalleryPlan = () => <div style={frame}><Plan items={planItems} /></div>;
export const GalleryPlanFolded = () => <div style={frame}><Plan items={planItems} defaultOpen={false} /></div>;
export const GalleryPlanCancelled = () => (
  <div style={frame}>
    <Plan items={[planItems[0]!, { id: "2", label: "Item two", status: "cancelled" }, { ...planItems[2]!, status: "current" }, planItems[3]!]} />
  </div>
);

// A plan's progress as a bar under its head (owner 2026-10-25): one bar for the whole plan, or a segment per item, the
// items then phases with their own counts and the current one's ring filling.
export const GalleryPlanBar = () => <div style={frame}><Plan items={planItems} bar="single" defaultOpen={false} /></div>;
const phases = [
  { id: "1", label: "Item one", status: "complete" as const, meta: "3 of 3" },
  { id: "2", label: "Item two", status: "current" as const, progress: 0.5, meta: "2 of 4" },
  { id: "3", label: "Item three", status: "pending" as const, meta: "0 of 2" },
  { id: "4", label: "Item four", status: "pending" as const, meta: "0 of 3" },
];
export const GalleryPlanSegmented = () => <div style={frame}><Plan items={phases} bar="segmented" count="5 of 12" /></div>;
// The whole tracker in one container (owner 2026-10-25, an agent run's timeline): marks on a rail, each item's values
// as chips after its words, the current item's own steps in an inset box.
const railItems = [
  { id: "1", label: "Item one", status: "complete" as const, detail: <><Badge size="sm" variant="outline">Value</Badge><Badge size="sm" variant="outline">Value</Badge></> },
  { id: "2", label: "Item two", status: "current" as const, progress: 0.5, meta: "1 of 2", items: [
    { id: "2a", label: "Step one", status: "complete" as const, meta: "Value" },
    { id: "2b", label: "Step two", status: "current" as const },
  ] },
  { id: "3", label: "Item three", status: "pending" as const },
];
export const GalleryPlanRail = () => <div style={frame}><Plan items={railItems} rail bar="segmented" icon={<AgentIcon />} title="Title" count="3 of 6" /></div>;

// ---- Turn notice ----
export const GalleryTurnNotice = () => <div style={frame}><TurnNotice status="stopped">Body text</TurnNotice></div>;
export const GalleryTurnNoticeError = () => (
  <div style={frame}><TurnNotice status="error" action={<Button variant="ghost" tone="neutral" size="sm">Action</Button>}>Error message</TurnNotice></div>
);
export const GalleryTurnNoticeCompacted = () => <div style={frame}><TurnNotice status="compacted">Body text</TurnNotice></div>;

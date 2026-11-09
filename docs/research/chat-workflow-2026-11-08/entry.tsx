/**
 * Chat Workflow review page (2026-11-08). One row per proposal (proposals.ts): what, why, what it touches, its kind, and
 * the proposed chat drawn with Area's real components in a 360 panel (the Inspector's middle width). Picks and notes go to
 * the page's db (`verdicts/<id>`: pick, note, at) for ArtifactData to read back; until a pick is made the row shows the
 * recommendation. Built by build.mjs against a tree; no app code changes.
 *
 * Copy: design words, no product names, no em dashes, no middle dots. Where a proposal changes a component (Edit summary's
 * design rows), the row is drawn with Area's parts and says so.
 */
import { createRoot } from "react-dom/client";
import { useEffect, useState, type ReactNode } from "react";
import { Accordion, AccordionItem, Approval, Button, Chip, Composer, ComposerMenu, Input, Message, MessageActions, ModelPicker, PromptSuggestions, Segmented, Step, StepGroup } from "@area/react";
import { AddIcon, AttachIcon, ChatIcon, ColorIcon, ComponentIcon, CopyIcon, EyeIcon, HelpIcon, HistoryIcon, ImageIcon, LayersIcon, MaximizeIcon, PencilIcon, RefreshIcon, SparkleIcon, TokenIcon, DocumentIcon } from "@area/icons";
import { MiniPicture, type MiniKind } from "@src/choice-visuals.tsx";
import { PROPOSALS, type Pick, type Proposal } from "./proposals.ts";

/* --- Pictures ------------------------------------------------------------------------------------------------------- */

type Scope = Record<string, string>;
const CALM: Scope = { "data-area-radius": "14", "data-area-density": "36" };
const BUSY: Scope = { "data-area-radius": "4", "data-area-density": "28" };
/** A small real screen in its own settings (choice-visuals' mini UI), with a name under it. */
function Pic({ kind = "settings", scope = {}, name, pins }: { kind?: MiniKind; scope?: Scope; name?: ReactNode; pins?: Array<[number, number]> }) {
  return (
    <figure className="cw-pic">
      <div className="cw-pic__frame" {...scope}>
        <MiniPicture kind={kind} />
        {pins?.map(([x, y], index) => <span key={index} className="cw-pin" style={{ left: `${x}%`, top: `${y}%` }}>{index + 1}</span>)}
      </div>
      {name ? <figcaption className="cw-pic__name">{name}</figcaption> : null}
    </figure>
  );
}
const Pair = ({ before, after, kind }: { before: Scope; after: Scope; kind?: MiniKind }) => (
  <div className="cw-pair"><Pic kind={kind} scope={before} name="Before" /><Pic kind={kind} scope={after} name="After" /></div>
);

/* --- Chat pieces ---------------------------------------------------------------------------------------------------- */

const You = ({ children, actions }: { children: ReactNode; actions?: ReactNode }) => <Message author="user" actions={actions}>{children}</Message>;
const Agent = ({ children, actions }: { children: ReactNode; actions?: ReactNode }) => <Message author="assistant" authorName="Claude" actions={actions}>{children}</Message>;
const P = ({ children }: { children: ReactNode }) => <p className="cw-p">{children}</p>;
const noop = () => {};
const Box = ({ children, menu }: { children?: ReactNode; menu?: ReactNode }) => <Composer layout="stacked" placeholder="Ask, or describe a change" onSubmit={noop} context={children} menu={menu} />;

/** The proposed Edit summary row: what changed on the design, from and to; drawn with Step rows (the proposal). */
function DesignChanges() {
  return (
    <div className="cw-summary">
      <div className="cw-summary__head">
        <span className="cw-summary__title">Changed 3 things on Settings</span>
        <span className="cw-summary__actions"><Button size="sm" variant="ghost" tone="neutral">Undo</Button><Button size="sm" variant="soft" tone="neutral">Keep</Button></span>
      </div>
      <div className="cw-summary__rows">
        <Step verb="Save button" detail="corner 8 to 12" icon={<ComponentIcon />} status="done" />
        <Step verb="Cards" detail="shadow Resting to Floating" icon={<LayersIcon />} status="done" />
        <Step verb="Page" detail="room between sections 24 to 32" icon={<TokenIcon />} status="done" />
        <Step verb="Show code" detail="2 files" icon={<DocumentIcon />} status="done" />
      </div>
    </div>
  );
}

const menu = (groups: Array<{ label: string; items: Array<[string, string, ReactNode]> }>, label: string, active?: string) => (
  <ComposerMenu id={`cw-menu-${label}`} aria-label={label} activeId={active} onPick={noop}
    items={groups.map(group => ({ label: group.label, items: group.items.map(([id, name, icon]) => ({ id, label: name.split("|")[0]!, path: name.split("|")[1], icon })) }))} />
);

/* --- The proposed chats, one per proposal --------------------------------------------------------------------------- */

const DEMOS: Record<string, () => ReactNode> = {
  p1: () => <>
    <You>Make the settings page feel calmer</You>
    <Agent actions={<MessageActions><Button size="sm" variant="soft" tone="neutral">Keep</Button><Button size="sm" variant="ghost" tone="neutral">Undo</Button><Button size="sm" variant="ghost" tone="neutral">Show changes</Button></MessageActions>}>
      <P>Softer corners and more room between rows. Nothing else moved.</P>
      <Pair before={BUSY} after={CALM} />
    </Agent>
  </>,
  p2: () => <>
    <Agent><P>Done. The page now uses your system's larger corner and more room.</P><DesignChanges /></Agent>
    <Approval title="Round the Save button's corners to 12?" description="Settings page" onChoose={noop}
      items={[{ value: "yes", label: "Yes" }, { value: "chat", label: "Yes, for this chat" }, { value: "no", label: "No" }]}>
      <Pair before={BUSY} after={{ ...BUSY, "data-area-radius": "12" }} />
    </Approval>
  </>,
  p3: () => <>
    <You>Redo the settings page</You>
    <Approval title="Which feeling should it have?" description="I'll keep your colors and type." layout="grid" onChoose={noop} onInstead={noop} insteadPlaceholder="Something else"
      className="cw-choices" items={[
        { value: "calm", label: <span className="cw-noted">Calm<span>Recommended</span></span>, visual: <Pic scope={CALM} /> },
        { value: "dense", label: "Dense", visual: <Pic scope={BUSY} /> },
      ]} />
  </>,
  p4: () => <>
    <You>Show me options for the cards</You>
    <Agent><P>Three directions, each one change. Pick one to keep it.</P></Agent>
    <Approval title="Which cards?" layout="grid" onChoose={noop} onInstead={noop} insteadPlaceholder="More like…, or mix two" className="cw-choices cw-choices--three"
      items={[
        { value: "a", label: "A, softer", visual: <Pic kind="dashboard" scope={{ "data-area-radius": "16" }} /> },
        { value: "b", label: "B, lifted", visual: <Pic kind="dashboard" scope={{ "data-area-shadow-resting": "8" }} /> },
        { value: "c", label: "C, flat", visual: <Pic kind="dashboard" scope={{ "data-area-radius": "2", "data-area-shadow-resting": "0" }} /> },
      ]} />
  </>,
  p5: () => <>
    <You>Tidy the spacing on Settings</You>
    <Agent>
      <StepGroup verb="Worked" detail="looked at 6 things, changed 2 screens" meta="18s">
        <Step verb="Looked at" detail="Settings page" icon={<EyeIcon />} />
        <Step verb="Looked at" detail="Spacing tokens" icon={<TokenIcon />} />
        <Step verb="Changed" detail="Settings page" icon={<PencilIcon />} />
      </StepGroup>
      <P>Rows now sit on the 8 step and sections on 32.</P>
    </Agent>
  </>,
  p6: () => <>
    <Box menu={menu([
      { label: "This page", items: [["page", "Settings|page", <LayersIcon />], ["save", "Save button|layer", <ComponentIcon />]] },
      { label: "System", items: [["button", "Button|component", <ComponentIcon />], ["corner", "Corners|tokens", <TokenIcon />], ["theme", "Theme|light and dark", <ColorIcon />]] },
      { label: "Also", items: [["ref", "Saved references|images", <ImageIcon />], ["chat", "Past chats", <ChatIcon />]] },
    ], "Add context", "button")}><Chip kind="input" size="sm" icon={<LayersIcon />} onDismiss={noop}>Settings</Chip><Chip kind="input" size="sm" icon={<ComponentIcon />} onDismiss={noop}>Button</Chip><Chip kind="input" size="sm" icon={<ImageIcon />} onDismiss={noop}>Reference 2</Chip></Box>
  </>,
  p7: () => <>
    <You>Why do the cards look heavy?</You>
    <Agent>
      <P>Their edge and their shadow both draw, so each card has two outlines. Dropping the edge fixes it.</P>
      <Accordion variant="plain" size="sm"><AccordionItem value="why" heading="More">Cards take the Resting shadow and the 12% stroke. At this size the shadow alone reads as the edge, the way the menus already work.</AccordionItem></Accordion>
      <PromptSuggestions layout="chips" label="Next" items={[{ id: "do", label: "Drop the edge" }, { id: "show", label: "Show both" }]} onSelect={noop} />
    </Agent>
  </>,
  p8: () => <>
    <You actions={<MessageActions><Button size="sm" variant="ghost" tone="neutral" icon={<HistoryIcon />}>Restore to here</Button></MessageActions>}>Make the header smaller</You>
    <Agent actions={<MessageActions><Button size="sm" variant="ghost" tone="neutral" icon={<RefreshIcon />}>Try another way</Button></MessageActions>}><P>The header is 40 now, one step down. Saved as a version.</P></Agent>
  </>,
  p9: () => <>
    <You><span className="cw-attached"><Chip kind="input" size="sm" icon={<PencilIcon />}>4 design changes on Settings</Chip></span>Make these consistent with the rest</You>
    <Box><Chip kind="input" size="sm" icon={<PencilIcon />} onDismiss={noop}>2 design changes on Home</Chip></Box>
  </>,
  p10: () => <>
    <Composer layout="stacked" onSubmit={noop} menu={menu([{ label: "Start from", items: [["explore", "Explore options for…|three versions to pick from", <SparkleIcon />], ["match", "Match this reference…|attach a picture", <ImageIcon />], ["tidy", "Tidy the spacing on…|on the system's steps", <TokenIcon />]] }], "Starters", "explore")} defaultValue={"Explore options for the settings page:\n1. Keep the sections and their order\n2. Make the rows calmer, more room\n3. Try a version with the actions at the top\n4. Keep my colors"}
      trailingActions={<Button size="sm" variant="ghost" tone="neutral" iconOnly icon={<MaximizeIcon />} aria-label="Expand" />} />
  </>,
  p11: () => <>
    <Box menu={menu([{ label: "How to help", items: [["ask", "Ask|answers, changes nothing", <HelpIcon />], ["suggest", "Suggest|options to pick from", <SparkleIcon />], ["change", "Change|edits, asking first", <PencilIcon />]] },
      { label: "Add", items: [["files", "Files and pictures", <AttachIcon />]] }], "Add", "suggest")}><Chip kind="input" size="sm" icon={<SparkleIcon />} onDismiss={noop}>Suggest</Chip></Box>
  </>,
  p12: () => <>
    <Pic kind="settings" scope={BUSY} pins={[[30, 30], [72, 64]]} name="Settings, two pins" />
    <Box><Chip kind="input" size="sm" onDismiss={noop}>1 this, smaller</Chip><Chip kind="input" size="sm" onDismiss={noop}>2 more room here</Chip></Box>
  </>,
  p13: () => <>
    <Agent actions={<MessageActions><Button size="sm" variant="ghost" tone="neutral" iconOnly icon={<CopyIcon />} aria-label="Copy" /><Button size="sm" variant="ghost" tone="neutral" iconOnly icon={<RefreshIcon />} aria-label="Try again" /></MessageActions>}>
      <P>The list feels tight because <mark className="cw-mark">rows sit 4 apart while the cards sit 12 apart</mark>.</P>
      <span className="cw-float"><Button size="sm" variant="soft" tone="neutral">Ask about this</Button></span>
    </Agent>
  </>,
  p14: () => <Composer layout="stacked" placeholder="Ask, or describe a change" onSubmit={noop}
    mode={<ModelPicker size="sm" label="Effort" items={[{ value: "quick", label: "Quick", description: "Small edits and questions" }, { value: "thorough", label: "Thorough", description: "Larger changes, takes longer" }]} defaultValue="quick" />} />,
};

/* --- Picks ----------------------------------------------------------------------------------------------------------- */

interface Verdict { pick?: Pick; note?: string }
type Doc = { set(data: Record<string, unknown>): Promise<void> };
type Db = { collection(path: string): { onSnapshot(next: (snap: { docs: Array<{ id: string; data(): Record<string, unknown> | undefined }> }) => void, error?: (e: unknown) => void): () => void; doc(id: string): Doc } };
declare global { interface Window { claude?: { use(name: string): Promise<unknown> } } }

function useVerdicts() {
  const [db, setDb] = useState<Db | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "offline">("loading");
  const [verdicts, setVerdicts] = useState<Record<string, Verdict>>({});
  useEffect(() => {
    let off = () => {};
    const timer = window.setTimeout(() => setState(current => current === "loading" ? "offline" : current), 10000);
    window.claude?.use("db").then(found => {
      const store = found as Db | null;
      if (!store) { setState("offline"); return; }
      setDb(store);
      off = store.collection("verdicts").onSnapshot(snap => {
        window.clearTimeout(timer);
        setVerdicts(Object.fromEntries(snap.docs.map(doc => [doc.id, (doc.data() ?? {}) as Verdict])));
        setState("ready");
      }, () => setState("offline"));
    }, () => setState("offline"));
    if (!window.claude) setState("offline");
    return () => { off(); window.clearTimeout(timer); };
  }, []);
  const save = (id: string, next: Verdict) => {
    setVerdicts(all => ({ ...all, [id]: { ...all[id], ...next } }));
    const merged = { ...verdicts[id], ...next };
    db?.collection("verdicts").doc(id).set({ pick: merged.pick ?? null, note: merged.note ?? "", at: new Date().toISOString() }).catch(() => setState("offline"));
  };
  return { verdicts, save, state };
}

const PICKS: Array<{ value: Pick; label: string }> = [{ value: "build", label: "Build" }, { value: "change", label: "Change it" }, { value: "later", label: "Not now" }];
const say = (pick: Pick) => PICKS.find(entry => entry.value === pick)!.label;

function Row({ proposal, verdict, onSave, writable }: { proposal: Proposal; verdict?: Verdict; onSave: (next: Verdict) => void; writable: boolean }) {
  const [note, setNote] = useState(verdict?.note ?? "");
  useEffect(() => setNote(verdict?.note ?? ""), [verdict?.note]);
  const pick = verdict?.pick ?? proposal.rec;
  return (
    <section className="cw-row" id={proposal.id}>
      <div className="cw-row__text">
        <div className="cw-row__eyebrow"><span className="cw-id">{proposal.id.toUpperCase()}</span><span>{proposal.stage}</span></div>
        <h2 className="cw-row__title">{proposal.title}</h2>
        <p className="cw-row__what">{proposal.what}</p>
        <dl className="cw-facts">
          <dt>Why</dt><dd>{proposal.why}</dd>
          <dt>Today</dt><dd>{proposal.now}</dd>
          <dt>Touches</dt><dd>{proposal.affects}</dd>
          <dt>Kind</dt><dd>{proposal.kind}</dd>
        </dl>
        <div className="cw-pick">
          <Segmented size="sm" label={`Pick for ${proposal.title}`} items={PICKS} value={pick} disabled={!writable}
            onValueChange={next => onSave({ pick: next as Pick })} />
          <span className="cw-pick__state">{verdict?.pick ? "Picked" : `Recommended: ${say(proposal.rec)}`}</span>
        </div>
        <Input size="sm" aria-label={`Note on ${proposal.title}`} placeholder="A note (optional)" value={note} disabled={!writable}
          onChange={event => setNote(event.currentTarget.value)} onBlur={() => { if (note !== (verdict?.note ?? "")) onSave({ note }); }} />
      </div>
      <div className="cw-row__demo">
        <div className={`cw-panel studio-chat${["p6", "p10", "p11"].includes(proposal.id) ? " cw-panel--menu" : ""}`} data-area-stroke="2" inert>{DEMOS[proposal.id]?.()}</div>
        <p className="cw-row__caption">{proposal.id === "p2" ? "Proposed, drawn with Area's Step rows (Edit summary's design row is the change)" : "Proposed, drawn with Area's components"}</p>
      </div>
    </section>
  );
}

const FLOW: Array<[string, string, string]> = [
  ["Input", "Say what you want, with the things it is about", "P6 context, P9 change card, P10 long prompts, P11 ask or change, P12 pins, P14 effort"],
  ["Output", "See it, pick it, answer a question", "P1 pictures, P2 design words, P3 questions, P4 options, P5 folded work, P7 short answers"],
  ["Loop", "Keep, refine, compare, go back", "P8 restore and explorations, P13 ask about a part, P4 more like this"],
];

function Page() {
  const { verdicts, save, state } = useVerdicts();
  const picked = Object.values(verdicts).filter(entry => entry.pick).length;
  return (
    <main className="cw">
      <header className="cw-head">
        <h1 className="cw-head__title">Chat workflow</h1>
        <p className="cw-head__lede">How people talk to Area's Chat and what it gives back, for designers and people who don't read code. Fourteen proposals, ranked; each shows the proposed chat in Area's own components. Pick per row; the recommendation stands until you do.</p>
        <p className="cw-head__state">{state === "ready" ? `${picked} of ${PROPOSALS.length} picked, saved as you go` : state === "loading" ? "Loading picks…" : "Picks can't be saved in this view; the recommendations are shown"}</p>
      </header>
      <div className="cw-flow">
        {FLOW.map(([stage, line, items]) => <div key={stage} className="cw-flow__cell"><span className="cw-flow__stage">{stage}</span><span>{line}</span><span className="cw-flow__items">{items}</span></div>)}
      </div>
      {PROPOSALS.map(proposal => <Row key={proposal.id} proposal={proposal} verdict={verdicts[proposal.id]} onSave={next => save(proposal.id, next)} writable={state === "ready"} />)}
    </main>
  );
}

createRoot(document.getElementById("cw-root")!).render(<Page />);

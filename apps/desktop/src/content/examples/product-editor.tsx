/**
 * A code editor's main window, 1440 × 900, built only from Area: a stress test of the system against an IDE's compact
 * chrome (title bar, side bar with a file tree, editor group, bottom panel, agent pane, status bar).
 *
 * Region sizes are the measured ones (docs/research/ui-patterns-2026-10-22/cursor-figma.md, read from the installed
 * bundle): side bar min(300, window / 4) = 300, agent pane min(400, window / 2.5) = 400, editor tabs 35, breadcrumbs
 * under the tabs 32, panel title 35. Everything a component sizes itself keeps the component's size at type 13,
 * Compact (rows, the title bar, the status bar's controls); where that differs from the product it is left to differ.
 *
 * No product or company name in the copy; the one person is David Tee.
 */
import type { ReactNode } from "react";
import {
  Approval, Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, Button, CodeBlock, Composer,
  ComposerAttach, Count, EditSummary, EditSummaryFile, Input, Kbd, Message, ModelPicker, Nav, NavItem, Panel, Plan, Segmented, Separator, Step,
  StepGroup, Tabs, Titlebar, Toolbar, ToolbarItem, TreeView,
  type CodeLineMark, type PlanItem, type TreeViewNode,
} from "@area/react";
import {
  AddIcon, ArrowLeftIcon, ArrowRightIcon, BellIcon, BlocksIcon, DismissIcon, DocumentIcon, ErrorIcon, FileCodeIcon, FileJsonIcon, FilesIcon,
  FolderIcon, FolderOpenIcon, GitBranchIcon, HistoryIcon, MaximizeIcon, MoreHorizontalIcon, PanelBottomIcon, PanelLeftIcon, PanelRightIcon,
  SearchIcon, SettingsIcon, SplitIcon, SyncIcon, TrashIcon, WarningIcon,
} from "@area/icons";

const noop = () => undefined;

/* --- The file open in the editor ---------------------------------------------------------------------------------- */

/** Each row of the editor: the text, and whether the pending edit deleted or added it. */
const SOURCE: ReadonlyArray<readonly [text: string, mark?: CodeLineMark]> = [
  [`import { Money, sum } from "../lib/money";`],
  [`import type { Order } from "./types";`],
  [`import { OrderStore } from "./store";`],
  [``],
  [`const MAX_COUPONS = 3;`],
  [``],
  [`export class OrderService {`],
  [`  constructor(private readonly store: OrderStore) {}`],
  [``],
  [`  // The total a customer pays: lines, less coupons, plus tax.`],
  [`  total(order: Order): Money {`],
  [`    const subtotal = sum(order.lines.map(line => line.price.times(line.quantity)));`],
  [`    const discount = order.coupons`, "deleted"],
  [`      .map(coupon => coupon.apply(subtotal))`, "deleted"],
  [`      .at(-1) ?? Money.zero(subtotal.currency);`, "deleted"],
  [`    const coupons = order.coupons.slice(0, MAX_COUPONS);`, "added"],
  [`    const discount = coupons.reduce(`, "added"],
  [`      (total, coupon) => total.plus(coupon.apply(subtotal.minus(total))),`, "added"],
  [`      Money.zero(subtotal.currency));`, "added"],
  [`    const taxable = subtotal.minus(discount);`],
  [`    return taxable.plus(taxable.times(order.taxRate));`],
  [`  }`],
  [``],
  [`  async submit(order: Order): Promise<string> {`],
  [`    if (order.lines.length === 0) {`],
  [`      throw new Error("An order needs at least one line.");`],
  [`    }`],
  [`    const total = this.total(order);`],
  [`    return this.store.save({ ...order, total, status: "submitted" });`],
  [`  }`],
  [`}`],
];
/** The row the caret is on (Code block numbers every row, a deleted one too: see the report). */
const CURRENT_ROW = 21;
const MARKS: Record<number, CodeLineMark> = Object.fromEntries(SOURCE.flatMap(([, mark], index) => mark ? [[index + 1, mark]] : []));

/**
 * TypeScript in Code block's six syntax classes, one line of markup a line of code. The app's highlighter
 * (content/highlight.mjs) reads JSX only, so this screen brings its own pass; the classes are Code block's.
 */
const escapeHtml = (text: string) => text.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char);
const TOKEN = /(\/\/.*$)|("(?:[^"\\]|\\.)*")|\b(import|from|export|class|const|return|new|async|type|private|readonly|constructor|if|throw|this)\b|\b([A-Z][A-Za-z0-9_]*)\b|\b([a-z_$][\w$]*)(?=\()|([{}()[\];,])/g;
const KINDS = ["comment", "string", "keyword", "tag", "attr", "punct"] as const;
function highlightLine(line: string): string {
  let out = "", last = 0;
  for (const match of line.matchAll(TOKEN)) {
    const at = match.index ?? 0;
    const kind = KINDS[match.slice(1).findIndex(group => group !== undefined)];
    out += escapeHtml(line.slice(last, at)) + `<span class="area-syntax-${kind}">${escapeHtml(match[0])}</span>`;
    last = at + match[0].length;
  }
  return out + escapeHtml(line.slice(last));
}
const SOURCE_HTML = SOURCE.map(([text]) => highlightLine(text)).join("\n");

/* --- The side bar's tree ------------------------------------------------------------------------------------------ */

const ts = <FileCodeIcon />;
const TREE: TreeViewNode[] = [
  { id: "root", label: "orders-api", icon: <FolderOpenIcon />, children: [
    { id: "src", label: "src", icon: <FolderOpenIcon />, children: [
      { id: "lib", label: "lib", icon: <FolderOpenIcon />, children: [
        { id: "money", label: "money.ts", icon: ts },
      ] },
      { id: "orders", label: "orders", icon: <FolderOpenIcon />, children: [
        { id: "coupons", label: "coupons.ts", icon: ts, status: "untracked" },
        { id: "service", label: "service.ts", icon: ts, status: "modified" },
        { id: "service-test", label: "service.test.ts", icon: ts, status: "modified" },
        { id: "store", label: "store.ts", icon: ts },
        { id: "types", label: "types.ts", icon: ts },
      ] },
      { id: "index", label: "index.ts", icon: ts },
    ] },
    { id: "scripts", label: "scripts", icon: <FolderIcon />, children: [
      { id: "seed", label: "seed.ts", icon: ts },
    ] },
    { id: "package", label: "package.json", icon: <FileJsonIcon /> },
    { id: "readme", label: "README.md", icon: <DocumentIcon /> },
    { id: "tsconfig", label: "tsconfig.json", icon: <FileJsonIcon /> },
  ] },
];

/* --- The bottom panel's terminal ---------------------------------------------------------------------------------- */

const TERMINAL = [
  "make test FILTER=orders",
  "",
  " RUN  src/orders/service.test.ts",
  "  ✓ total adds every line (2 ms)",
  "  ✓ total applies one coupon (1 ms)",
  "  ✗ total applies two coupons in order (4 ms)",
  "      expected 81.00, received 90.00",
  "  ✓ submit rejects an empty order (1 ms)",
  "",
  " Tests  1 failed, 3 passed (4)",
  " Time   0.42 s",
].join("\n");

/* --- The agent's turn --------------------------------------------------------------------------------------------- */

const PLAN: PlanItem[] = [
  { id: "read", label: "Read the failing test and total()", status: "complete" },
  { id: "fix", label: "Apply every coupon, each to what is left", status: "complete" },
  { id: "test", label: "Add a test for three coupons", status: "current" },
  { id: "run", label: "Run the order tests", status: "pending" },
];
const MODELS = [
  { value: "auto", label: "Auto" },
  { value: "fast", label: "Fast" },
  { value: "deep", label: "Deep" },
];

const iconButton = (label: string, glyph: ReactNode, extra: { selected?: boolean } = {}) =>
  <Button size="sm" variant="ghost" tone="neutral" iconOnly aria-label={label} icon={glyph} {...extra} />;
const statusItem = (label: string, extra: { icon?: ReactNode; name?: string } = {}) =>
  <ToolbarItem><Button size="sm" variant="ghost" tone="neutral" icon={extra.icon} aria-label={extra.name}>{label}</Button></ToolbarItem>;

export function ProductEditorScreen() {
  return (
    <div className="px-editor" data-area-type="13" data-area-density="28">
      {/* Title bar: the window controls' room, back and forward, the command field with the project's name, then the
          layout toggles and settings. */}
      <Titlebar size="sm" windowControls="macos"
        end={<>
          {iconButton("Side bar", <PanelLeftIcon />, { selected: true })}
          {iconButton("Panel", <PanelBottomIcon />, { selected: true })}
          {iconButton("Agent", <PanelRightIcon />, { selected: true })}
          {iconButton("Settings", <SettingsIcon />)}
        </>}>
        {iconButton("Back", <ArrowLeftIcon />)}
        {iconButton("Forward", <ArrowRightIcon />)}
        <div className="px-editor__command">
          <Input className="px-editor__command-field" size="sm" variant="soft" readOnly aria-label="Search files and commands" icon={<SearchIcon />}
            defaultValue="orders-api" suffix={<Kbd keys={["cmd", "P"]} size="sm" />} />
        </div>
      </Titlebar>

      <div className="px-editor__body">
        {/* Side bar: the views, then the open view's tree. */}
        <Panel className="px-editor__pane" data-area-chrome="" data-area-ground="recessed" flush resizable="end" defaultWidth={300} minWidth={214} aria-label="Side bar"
          action={
            <Nav orientation="horizontal" aria-label="Views">
              <NavItem href="#" current icon={<FilesIcon />} aria-label="Explorer" />
              <NavItem href="#" icon={<SearchIcon />} aria-label="Search" />
              <NavItem href="#" icon={<GitBranchIcon />} aria-label="Source control" trailing={<Count count={3} size="sm" variant="soft" label="changes" />} />
              <NavItem href="#" icon={<BlocksIcon />} aria-label="Extensions" />
            </Nav>
          }>
          <TreeView aria-label="Files" size="sm" guides items={TREE} currentId="service" defaultSelectedIds={["service"]}
            defaultExpandedIds={["root", "src", "lib", "orders"]} />
        </Panel>

        {/* Editor group over the bottom panel. */}
        <div className="px-editor__group">
          <div className="px-editor__tabs">
            <Tabs aria-label="Open files" value="service" items={[
              { value: "service", label: "service.ts", icon: <FileCodeIcon />, status: "modified" },
              { value: "service-test", label: "service.test.ts", icon: <FileCodeIcon />, unseen: true },
              { value: "types", label: "types.ts", icon: <FileCodeIcon /> },
              { value: "money", label: "money.ts", icon: <FileCodeIcon /> },
            ]} />
            <span className="px-editor__grow" />
            {iconButton("Split editor", <SplitIcon />)}
            {iconButton("More", <MoreHorizontalIcon />)}
          </div>
          <Separator spacing="none" decorative />
          <div className="px-editor__crumbs">
            <Breadcrumb nowrap aria-label="Path">
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink href="#">src</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink href="#">orders</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink href="#">service.ts</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink href="#">OrderService</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>total</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="px-editor__code">
            <CodeBlock aria-label="service.ts" flush size="sm" copyable={false} html={SOURCE_HTML} marks={MARKS} highlightLines={[CURRENT_ROW]} />
            {/* The pending edit's controls: one bar for the hunk, at the editor's foot. */}
            <div className="px-editor__review">
              <Toolbar variant="surface" size="sm" aria-label="Review edit">
                <ToolbarItem><Button size="sm" variant="ghost" tone="neutral">Reject <Kbd keys={["cmd", "N"]} size="sm" /></Button></ToolbarItem>
                <ToolbarItem><Button size="sm">Accept <Kbd keys={["cmd", "Y"]} size="sm" /></Button></ToolbarItem>
              </Toolbar>
            </div>
          </div>
          <Separator spacing="none" decorative />
          <section className="px-editor__panel" aria-label="Panel">
            <div className="px-editor__panel-head">
              <Tabs aria-label="Panel views" size="sm" value="terminal" items={[
                { value: "problems", label: "Problems", trailing: <Count count={3} size="sm" variant="soft" /> },
                { value: "output", label: "Output" },
                { value: "terminal", label: "Terminal" },
              ]} />
              <span className="px-editor__grow" />
              {iconButton("New terminal", <AddIcon />)}
              {iconButton("Split terminal", <SplitIcon />)}
              {iconButton("Kill terminal", <TrashIcon />)}
              {iconButton("Maximize panel", <MaximizeIcon />)}
              {iconButton("Close panel", <DismissIcon />)}
            </div>
            <div className="px-editor__panel-body">
              <CodeBlock aria-label="Terminal" flush size="sm" lineNumbers={false} copyable={false} prompt="$" code={TERMINAL} />
            </div>
          </section>
        </div>

        {/* Agent pane: the chats, the turn, the composer pinned at its foot. */}
        <Panel className="px-editor__pane" flush bareFooter resizable="start" defaultWidth={400} minWidth={300} aria-label="Agent"
          action={<>
            <Tabs aria-label="Chats" size="sm" selection="plate" value="coupons" items={[
              { value: "coupons", label: "Fix coupon total" },
              { value: "retry", label: "Retry failed saves" },
            ]} />
            <span className="px-editor__grow" />
            {iconButton("New chat", <AddIcon />)}
            {iconButton("Chat history", <HistoryIcon />)}
            {iconButton("More", <MoreHorizontalIcon />)}
          </>}
          footer={
            <Composer layout="stacked" placeholder="Plan, search, build anything" aria-label="Message the agent"
              leadingActions={<ComposerAttach size="sm" label="Attach" />}
              mode={<>
                <Segmented size="sm" aria-label="Mode" defaultValue="agent" items={[{ value: "agent", label: "Agent" }, { value: "ask", label: "Ask" }]} />
                <ModelPicker size="sm" label="Model" items={MODELS} defaultValue="auto" />
              </>} />
          }>
          <div className="px-editor__thread">
            <Message author="user" authorName="David Tee">
              The two-coupon test fails: the total only takes the last coupon off. Find out why and fix it.
            </Message>
            <Message authorName="Agent">
              <p>total() mapped every coupon over the subtotal and kept only the last result, so earlier coupons were dropped. I now apply each coupon to what is left, up to the limit.</p>
            </Message>
            <StepGroup verb="Explored" detail="3 files" meta="8s" status="complete">
              <Step verb="Read" detail="src/orders/service.ts" status="complete" />
              <Step verb="Read" detail="src/orders/service.test.ts" status="complete" />
              <Step verb="Read" detail="src/lib/money.ts" status="complete" />
            </StepGroup>
            <Plan items={PLAN} />
            <EditSummary title="Edited 2 files" added={18} deleted={6} onKeepAll={noop} onUndoAll={noop}>
              <EditSummaryFile name="service.ts" icon={<FileCodeIcon />} added={4} deleted={3} status="pending" onKeep={noop} onUndo={noop} />
              <EditSummaryFile name="service.test.ts" icon={<FileCodeIcon />} added={14} deleted={3} status="pending" onKeep={noop} onUndo={noop} />
            </EditSummary>
            <Approval title="Run this command?" description="Runs the order tests in the terminal." dismissLabel="skip"
              items={[{ value: "run", label: "Run" }, { value: "skip", label: "Skip" }]} onChoose={noop}>
              <CodeBlock size="sm" lineNumbers={false} copyable={false} prompt="$" code="make test FILTER=orders" />
            </Approval>
          </div>
        </Panel>
      </div>

      {/* Status bar. */}
      <Separator spacing="none" decorative />
      <div className="px-editor__status">
        <Toolbar size="sm" fullWidth aria-label="Status">
          {statusItem("fix/coupon-total", { icon: <GitBranchIcon />, name: "Branch fix/coupon-total" })}
          {statusItem("0↓ 2↑", { icon: <SyncIcon />, name: "Sync: 0 to pull, 2 to push" })}
          {statusItem("1", { icon: <ErrorIcon />, name: "1 error" })}
          {statusItem("2", { icon: <WarningIcon />, name: "2 warnings" })}
          <span className="px-editor__grow" />
          {statusItem(`Ln ${CURRENT_ROW}, Col 12`)}
          {statusItem("Spaces: 2")}
          {statusItem("UTF-8")}
          {statusItem("TypeScript")}
          <ToolbarItem>{iconButton("Notifications", <BellIcon />)}</ToolbarItem>
        </Toolbar>
      </div>
    </div>
  );
}

/**
 * Product chat: a conversation app's main window in mid-conversation, 1440 × 900, as a stress test of Area. Every
 * control, surface, text style and colour is an Area component or token; `styles/product-chat.css` lays the regions out
 * and nothing else. Values are the measured ones (area-ui-compose › screens.md, Chat; docs/research/ui-patterns-2026-10-22/
 * chatgpt-desktop.md; docs/research/captures/{message,composer,nav}); each pick is marked in the stylesheet.
 *
 *   sidebar   a docked Panel: its toggle in the bar; new chat, search, library rows; the past chats in dated groups, the
 *             open one current; the person pinned in its footer
 *   main      a bar (the model, then Share and More at its end); the thread, a 768 reading column of turns; the composer
 *             docked at the column's foot, a reply still arriving so its send is Stop
 *
 * No product or company name in the copy; the model is "Model 5"; the person is David Tee (DESIGN_SYSTEM.md, Example copy).
 */
import {
  Attachment, Avatar, Button, Code, CodeBlock, Composer, ComposerAttach, ComposerMic, ComposerNote, CopyButton, Kbd, Menu, MenuItem, MenuSeparator,
  Message, MessageActions, ModelPicker, Nav, NavGroup, NavItem, Panel, Reasoning, ScrollArea, Table,
} from "@area/react";
import {
  ArchiveIcon, ChevronDownIcon, ComposeIcon, FolderIcon, GridIcon, LibraryIcon, MoreHorizontalIcon, OptionsIcon, PanelLeftIcon, PencilIcon, RefreshIcon,
  SearchIcon, ShareIcon, ThumbsDownIcon, ThumbsUpIcon, UploadIcon,
} from "@area/icons";

const MODELS = [
  { value: "model-5", label: "Model 5", description: "Best for everyday work" },
  { value: "model-5-thinking", label: "Model 5 Thinking", description: "Takes longer on hard problems" },
  { value: "model-5-mini", label: "Model 5 mini", description: "Fastest" },
];

const CURRENT = "Streaming a large export";
const CHATS: ReadonlyArray<{ label: string; items: readonly string[] }> = [
  { label: "Today", items: [CURRENT, "Rename columns in a spreadsheet", "Packing list for a week away"] },
  { label: "Yesterday", items: ["Explain a retry policy", "Draft a note to the landlord", "Weeknight dinner ideas", "Tidy up a regular expression"] },
  { label: "Previous 7 days", items: ["Compare two phone plans", "Outline for a team offsite", "Fix a flaky test", "Birthday message for a friend", "Summarize meeting notes", "Plan a 10 km training block", "Choose a standing desk"] },
];

const SNIPPET = `import csv

def export_rows(cursor, path, batch_size=5_000):
    with open(path, "w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(column[0] for column in cursor.description)
        while batch := cursor.fetchmany(batch_size):
            writer.writerows(batch)`;

const REPLY = `Stream the export in batches\n\nThe job times out because it loads every row before it writes the first one.\n\n${SNIPPET}`;

const APPROACHES = [
  { name: "Load everything", memory: "Grows with the table", time: "Times out past 2 million rows" },
  { name: "Batches of 5,000", memory: "About 40 MB, flat", time: "6 min" },
  { name: "Server-side cursor", memory: "About 12 MB, flat", time: "5 min" },
];

const action = (label: string, glyph: React.ReactNode, extra: Record<string, unknown> = {}) =>
  <Button size="sm" variant="ghost" tone="neutral" iconOnly aria-label={label} icon={glyph} {...extra} />;

/** A past chat's own menu, shown on the row while it is hovered or holds focus. */
const chatMenu = (name: string) => (
  <Menu aria-label={`${name} options`} align="start"
    trigger={<Button size="sm" variant="ghost" tone="neutral" iconOnly aria-label={`Options for ${name}`} icon={<MoreHorizontalIcon />} />}>
    <MenuItem icon={<UploadIcon />}>Share</MenuItem>
    <MenuItem icon={<PencilIcon />}>Rename</MenuItem>
    <MenuItem icon={<ArchiveIcon />}>Archive</MenuItem>
  </Menu>
);

export function ProductChatScreen() {
  return (
    <div className="px-chat">
      <Panel className="px-chat__side" data-area-chrome="" data-area-ground="recessed" flush bareBar aria-label="Sidebar"
        action={action("Close sidebar", <PanelLeftIcon />)}
        footer={
          <div className="px-chat__person">
            <Avatar size="sm" fallback="DT" aria-hidden="true" />
            <span className="px-chat__person-text">
              <span className="px-chat__person-name">David Tee</span>
              <span className="px-chat__person-plan">Personal plan</span>
            </span>
            {action("Account options", <MoreHorizontalIcon />)}
          </div>
        }>
        <div className="px-chat__side-groups">
          <Nav aria-label="Primary">
            <NavItem href="#" icon={<ComposeIcon />} trailing={<Kbd keys={["shift", "cmd", "O"]} size="sm" />}>New chat</NavItem>
            <NavItem href="#" icon={<SearchIcon />} trailing={<Kbd keys={["cmd", "K"]} size="sm" />}>Search chats</NavItem>
            <NavItem href="#" icon={<LibraryIcon />}>Library</NavItem>
            <NavItem href="#" icon={<GridIcon />}>Apps</NavItem>
            <NavItem href="#" icon={<FolderIcon />}>Projects</NavItem>
          </Nav>
          <Nav aria-label="Chats">
            {CHATS.map(group => (
              <NavGroup key={group.label} label={group.label}>
                {group.items.map(name => (
                  <NavItem key={name} href="#" current={name === CURRENT} actions={chatMenu(name)} revealActions>{name}</NavItem>
                ))}
              </NavGroup>
            ))}
          </Nav>
        </div>
      </Panel>

      <main className="px-chat__main">
        <header className="px-chat__bar">
          <ModelPicker items={MODELS} defaultValue="model-5" size="lg" />
          <span className="px-chat__grow" />
          <Button size="md" variant="ghost" tone="neutral" icon={<UploadIcon />}>Share</Button>
          <Menu aria-label="Chat options" align="end"
            trigger={<Button size="md" variant="ghost" tone="neutral" iconOnly aria-label="Chat options" icon={<MoreHorizontalIcon />} />}>
            <MenuItem icon={<PencilIcon />}>Rename</MenuItem>
            <MenuItem icon={<FolderIcon />}>Move to project</MenuItem>
            <MenuItem icon={<ArchiveIcon />}>Archive</MenuItem>
            <MenuSeparator />
            <MenuItem icon={<ShareIcon />}>Report</MenuItem>
          </Menu>
        </header>

        <ScrollArea className="px-chat__thread">
          <div className="px-chat__column px-chat__turns">
            <Message author="user">
              Our nightly export started timing out once the table passed two million rows. What is the usual fix, and can you show a version that streams instead of loading everything first?
            </Message>

            <Message author="assistant" className="px-chat__reply"
              actions={
                <MessageActions>
                  <CopyButton value={REPLY} label="Copy reply" variant="ghost" tone="neutral" size="sm" iconOnly />
                  {action("Good reply", <ThumbsUpIcon />, { defaultSelected: false })}
                  {action("Bad reply", <ThumbsDownIcon />, { defaultSelected: false })}
                  {action("Try again", <RefreshIcon />)}
                  {action("More", <MoreHorizontalIcon />)}
                </MessageActions>
              }>
              <h2 className="px-chat__heading">Stream the export in batches</h2>
              <p>
                The job times out because it loads every row before it writes the first one. Memory grows with the table, the database holds one long transaction open, and nothing reaches the file until the very end. Reading and writing a batch at a time keeps all three flat.
              </p>
              <p>Three changes do most of the work:</p>
              <ul>
                <li>Fetch with <Code>fetchmany()</Code> in place of <Code>fetchall()</Code>, so only one batch is in memory.</li>
                <li>Write each batch as it arrives, and keep <Code>batch_size</Code> between 1,000 and 10,000 rows.</li>
                <li>Open the cursor on the server, so the database sends rows as you ask for them.</li>
              </ul>
              <CodeBlock language="python" code={SNIPPET} lineNumbers={false} />
              <p>For a table of this size, the three approaches compare like this:</p>
              <Table flush aria-label="Approaches compared">
                <thead><tr><th>Approach</th><th>Memory</th><th>Time</th></tr></thead>
                <tbody>
                  {APPROACHES.map(row => <tr key={row.name}><td>{row.name}</td><td>{row.memory}</td><td>{row.time}</td></tr>)}
                </tbody>
              </Table>
              <p>Start with batches of 5,000. Move to a server-side cursor only if memory is still the limit.</p>
            </Message>

            <div className="px-chat__sent">
              <Attachment kind="file" name="export-job.log" />
              <Message author="user">Here is last night's log. Does the timeout line up with the batch size?</Message>
            </div>

            <Message author="assistant" className="px-chat__reply" streaming>
              <Reasoning seconds={6}>Read the log for the first slow batch and the moment the connection closed.</Reasoning>
              <p>
                It does. The first 180 batches each finish in under a second, then the log shows batch 181 waiting 30 seconds before the connection closes. That matches the
              </p>
            </Message>
          </div>
        </ScrollArea>

        <div className="px-chat__dock">
          <div className="px-chat__column">
            <Composer layout="stacked" submitPill loading onStop={() => {}} placeholder="Ask anything" label="Message" stopLabel="Stop"
              leadingActions={<>
                <ComposerAttach label="Add photos and files" />
                <Button size="md" variant="ghost" tone="neutral" icon={<OptionsIcon />}>Tools</Button>
              </>}
              trailingActions={<>
                <ModelPicker items={MODELS} defaultValue="model-5" label="Model for this message" />
                <ComposerMic />
              </>}
              footer={<ComposerNote>Replies can be wrong. Check important facts.</ComposerNote>} />
          </div>
        </div>
      </main>
    </div>
  );
}

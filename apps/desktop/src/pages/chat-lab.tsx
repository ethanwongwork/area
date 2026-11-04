/**
 * Labs › Chat (owner, 2026-11-02: "also start a chat feed kit, maybe the chat components for feed will follow different
 * rules? … the min and max widths may be different, but the same or similar content may be featured in both"): the kit's
 * content as a conversation draws it, at the three widths a chat is given, so what changes with the width can be seen on
 * one page. docs/research/chat-kit-2026-11-02 holds the measurements (ChatGPT, Claude, Claude Code, Cursor) and the rules.
 *
 * Widths, the Canvas bar's first menu, each the chat's own column (the content box, not the window):
 *   Panel   268, the Inspector at its least at type 13 (296) less its two 14 insets: Area's own Chat, Cursor's agent pane
 *   Split   456, a chat beside what it made: ChatGPT's compact thread (min(456px, 100%)), Claude's chat beside an artifact
 *   Column  768, the reading column: ChatGPT's and Claude's thread (48rem), Home's feed
 * What stays: the type (every product keeps its chat size at every width), the blocks' order and spacing, the frames.
 * What changes is drawn by the components themselves (a bubble's width, a table's scroll, cards two across or one).
 *
 * Location: #labs/chat.
 */
import { useState, type CSSProperties } from "react";
import { PanelSection } from "@area/react";
import { useStudio, Workspace } from "../studio.tsx";
import { CanvasSection, Tile, TileGrid } from "../tile.tsx";
import { useViewOption, ViewFilter, ViewLead } from "../view-controls.tsx";
import { Facts } from "../facts.tsx";
import { ScreenFigure, SHOWCASE } from "../setup-screen.tsx";
import { ColorCard, Sheet as ColorSheet } from "./color.tsx";
import { SCALES } from "../tokens.ts";
import { Bars } from "../data-views.tsx";
import { AddMenu, AgentTurn, Attachments, CardsReply, Commands, Composers, Conversation, Question, Response, Trackers } from "../chat-kit.tsx";
import { url, useLibrary } from "./imagery.tsx";
import { ActivityLog, EventMarks } from "../activity-kit.tsx";

type Width = "panel" | "split" | "column";
const WIDTHS: ReadonlyArray<{ value: Width; label: string; px: number }> = [
  { value: "panel", label: "Panel", px: 268 }, /* spec: the Inspector's least at 13/32 (296) less 2 × 14 */
  { value: "split", label: "Split", px: 456 }, /* spec: ChatGPT's compact thread, min(456px, 100%) */
  { value: "column", label: "Column", px: 768 }, /* spec: ChatGPT's and Claude's 48rem, the app's reading column */
];
/** A design card's least width in a reply: two across a 456 column (each 220 with the 12 gap), one across the Panel. */
const CARD_MIN = 200; /* pick */
/** The color steps a reply shows: Blue's lighter half, five cards. */
const STEPS = (SCALES.find(scale => scale.id === "blue")?.steps ?? []).slice(0, 5);

export function ChatLabPage() {
  const { library } = useLibrary();
  const { theme } = useStudio();
  const screen = { "data-area-theme": theme };
  const [width, setWidth] = useViewOption<Width>("chat-lab:width", "column", WIDTHS.map(entry => entry.value));
  const chosen = WIDTHS.find(entry => entry.value === width)!;
  const image = library?.items[0] ? url(library.items[0].thumb) : undefined;

  const designs = (
    <TileGrid span="wide" cards min={CARD_MIN}>
      <Tile span="wide" stage="screen" inert label="Morning" status="published" value="Published"><ScreenFigure className="studio-theme-card" hold={SHOWCASE} scope={screen} /></Tile>
      <Tile span="wide" stage="screen" inert label="Night" status="draft" value="Draft"><ScreenFigure className="studio-theme-card" screen="analytics" scope={screen} /></Tile>
    </TileGrid>
  );
  const [step, setStep] = useState<string | null>(null);
  const colors = (
    <ColorSheet grid value={step} onChoose={setStep}>
      <TileGrid span="unit" className="studio-color-grid">
        {STEPS.map(item => <ColorCard key={item.level} scale="blue" item={item} copy="hex" />)}
      </TileGrid>
    </ColorSheet>
  );

  // Every section draws its chat at the chosen width, bare (a chat has no frame of its own; owner, 2026-11-02).
  const frame = { className: "studio-chatkit__frame", "data-width": width, style: { "--_chat-width": `${chosen.px}px` } as CSSProperties };
  return (
    <Workspace
      canvasTitle="Chat"
      canvasLead={<ViewLead><ViewFilter label="Width" align="start" value={width} onChange={setWidth} options={WIDTHS} /></ViewLead>}
      canvas={
        <div className="studio-sections studio-feed studio-chatkit">
          <CanvasSection id="chat-conversation" title="Conversation"><div {...frame}><Conversation /></div></CanvasSection>
          <CanvasSection id="chat-response" title="Response"><div {...frame}><Response /></div></CanvasSection>
          <CanvasSection id="chat-cards" title="Response with cards"><div {...frame}><CardsReply designs={designs} chart={<Bars />} colors={colors} /></div></CanvasSection>
          <CanvasSection id="chat-agent" title="Agent turn"><div {...frame}><AgentTurn /></div></CanvasSection>
          <CanvasSection id="chat-trackers" title="Trackers"><div {...frame}><Trackers /></div></CanvasSection>
          <CanvasSection id="chat-question" title="Question"><div {...frame}><Question /></div></CanvasSection>
          <CanvasSection id="chat-attachments" title="Attachments"><div {...frame}><Attachments image={image} /></div></CanvasSection>
          <CanvasSection id="chat-add" title="Add menu"><div {...frame}><AddMenu /></div></CanvasSection>
          <CanvasSection id="chat-commands" title="Commands"><div {...frame}><Commands /></div></CanvasSection>
          <CanvasSection id="chat-composers" title="Composer"><div {...frame}><Composers /></div></CanvasSection>
          <CanvasSection id="chat-activity" title="Activity"><div {...frame}><ActivityLog /></div></CanvasSection>
          <CanvasSection id="chat-event-marks" title="Event marks" count={10}><div {...frame}><EventMarks /></div></CanvasSection>
        </div>
      }
      inspector={
        <PanelSection heading="Chat">
          <Facts label="Chat" items={[["Width", chosen.label], ["Column", `${chosen.px}`]]} />
        </PanelSection>
      }
    />
  );
}

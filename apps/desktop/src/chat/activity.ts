/**
 * What each place's chat is doing (owner, 2026-11-10; docs/research/desktop-app-analysis-2026-11-10, T10): working,
 * asking (an approval or a question waits on the person), done or failed (a reply ended while its tab wasn't showing),
 * or nothing. The tab strip marks a tab by it, a macOS notice says it when the window is in the background, and the
 * app asks before quitting while any chat works. Pure but for the shared record at the end: the activity test imports
 * `activityOf` and `noticeOf`.
 */
import { useEffect, useState } from "react";
import { placeKey, type ChatPlace } from "./store.ts";

export type Activity = "working" | "asking" | "done" | "failed";

/** A chat's activity from its session: `shown` is whether its tab is the one showing; `ended` a reply that ended since. */
export function activityOf(state: { running: boolean; approval?: unknown; question?: unknown }, ended: "done" | "failed" | null, shown: boolean): Activity | null {
  if (state.running) return state.approval || state.question ? "asking" : "working";
  return shown ? null : ended;
}

/** What the macOS notice says when a chat moves to `next`, or null when it says nothing. */
export function noticeOf(next: Activity | null, before: Activity | null, where: string, reply: string, settings: { ended: boolean; asking: boolean }): { title: string; body: string } | null {
  if (next === before) return null;
  if (next === "asking" && settings.asking) return { title: where, body: "Claude needs your answer to go on." };
  if ((next === "done" || next === "failed") && before !== null && settings.ended) {
    if (next === "failed") return { title: where, body: "Claude stopped: the reply didn't finish." };
    const line = reply.replace(/<!--\s*more\s*-->[\s\S]*$/i, "").replace(/[`*_#>]/g, "").replace(/\s+/g, " ").trim();
    return { title: where, body: line ? (line.length > 140 ? `${line.slice(0, 139)}…` : line) : "Claude finished." };
  }
  return null;
}

// ---- The record every reader follows ---------------------------------------------------------------------------

const activities = new Map<string, Activity>();
const EVENT = "area-chat-activity";

export function setActivity(place: ChatPlace, activity: Activity | null): void {
  const key = placeKey(place);
  if ((activities.get(key) ?? null) === activity) return;
  if (activity) activities.set(key, activity); else activities.delete(key);
  if (typeof dispatchEvent === "function") dispatchEvent(new Event(EVENT));
  // Main asks before quitting while any chat works (electron/main.cjs).
  const running = [...activities.values()].filter(entry => entry === "working" || entry === "asking").length;
  if (typeof window !== "undefined") window.areaDesktop?.setRunning?.(running);
}

/** Every place's activity by its key ("project:storefront"); every reader follows a change. */
export function useActivities(): ReadonlyMap<string, Activity> {
  const [, bump] = useState(0);
  useEffect(() => {
    const follow = () => bump(count => count + 1);
    addEventListener(EVENT, follow);
    return () => removeEventListener(EVENT, follow);
  }, []);
  return activities;
}

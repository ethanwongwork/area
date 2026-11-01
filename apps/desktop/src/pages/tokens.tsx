/**
 * Tokens, a system's first Foundations page after Themes (owner, 2026-10-31: "build it"; research the same day: Figma's
 * variables, collections and aliases; Penpot's and Tokens Studio's token sets; the design tokens format). Every token in
 * three tiers (src/token-catalog.ts): Raw values, Roles and Component tokens, each a table of its name, its value as the
 * Canvas's theme and settings resolve it, the tokens it refers to and what it is for. The Sidebar's list narrows to one
 * group (Color, Typography, Spacing, Shape, Elevation, Motion); a reference opens the token it names; Copy as design
 * tokens writes the list in the design tokens format (designtokens.org). A row chosen shows its facts in the Inspector.
 *
 * Location: #system/<system>/tokens, #system/<system>/tokens/<group>.
 */
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { Code, ColorSwatch, PanelSection, Table, TableCell, TableHeaderCell } from "@area/react";
import { CopyIcon } from "@area/icons";
import { SidebarList, SidebarTree, useStudio, Workspace } from "../studio.tsx";
import { CanvasSection, FEED_TABLE } from "../tile.tsx";
import { ViewControls } from "../view-controls.tsx";
import { CanvasSettings } from "../canvas-settings.tsx";
import { Facts } from "../facts.tsx";
import { CopyButton } from "../copy.tsx";
import { matches } from "../search.ts";
import { readValues, TIERS, TOKEN_BY_NAME, TOKEN_GROUPS, TOKEN_LIST, toDesignTokens, type Token, type TokenGroup } from "../token-catalog.ts";

/** Each token's live value under the Canvas: read after every render the theme or a setting changes. */
export function useTokenValues(scope: RefObject<HTMLElement | null>, list: readonly Token[]) {
  const { shown, theme } = useStudio();
  const [values, setValues] = useState<ReadonlyMap<string, string>>(new Map());
  useLayoutEffect(() => { if (scope.current) setValues(readValues(scope.current, list)); }, [shown, theme, list]);
  return values;
}

/** A token's name without its prefix, as designers say it ("bg-page"). */
export const shortName = (name: string) => name.replace(/^--area-/, "");

/** A value as a row shows it: a shadow as its layers (the whole value is the Inspector's), anything else as read. */
export function shownValue(token: Token, value: string): string {
  if (token.measure !== "shadow" || !value || value === "none") return value;
  let depth = 0, layers = 1;
  for (const char of value) { if (char === "(") depth++; else if (char === ")") depth--; else if (char === "," && depth === 0) layers++; }
  return `${layers} ${layers === 1 ? "layer" : "layers"}`;
}

/** Rows drawn once they near the view (tile.tsx WhenVisible's way, as a table row): a tier holds hundreds. */
const CHUNK = 40; /* pick */
const ROW_ESTIMATE = 41; /* pick: a md row at type 13 */
function RowsWhenVisible({ rows, children }: { rows: number; children: ReactNode }) {
  const ref = useRef<HTMLTableRowElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (seen || !element) return;
    const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { setSeen(true); observer.disconnect(); } }, { rootMargin: "600px 0px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, [seen]);
  return seen ? <>{children}</> : <tr ref={ref} aria-hidden="true"><td colSpan={4} style={{ blockSize: rows * ROW_ESTIMATE, padding: 0 }} /></tr>;
}

/**
 * The tokens as a table: the name, the value (with a swatch for a color), what it refers to and what it is for. A reference
 * that is listed chooses that token; a row chooses its own.
 */
export function TokenTable({ tokens, values, chosen, onChoose, label }: {
  tokens: readonly Token[]; values: ReadonlyMap<string, string>; chosen: string | null; onChoose: (name: string) => void; label: string;
}) {
  return (
    <Table wrapperProps={FEED_TABLE} size="md" interactive aria-label={label}>
      <thead><tr><TableHeaderCell>Token</TableHeaderCell><TableHeaderCell>Value</TableHeaderCell><TableHeaderCell>Refers to</TableHeaderCell><TableHeaderCell>Used for</TableHeaderCell></tr></thead>
      <tbody>
        {Array.from({ length: Math.ceil(tokens.length / CHUNK) }, (_, chunk) => {
          const rows = tokens.slice(chunk * CHUNK, (chunk + 1) * CHUNK).map(token => {
          const value = values.get(token.name) ?? "";
          return (
            <tr key={token.name} data-token={token.name} data-selected={token.name === chosen ? "" : undefined} onClick={() => onChoose(token.name)}>
              <td><Code>{shortName(token.name)}</Code></td>
              <td>
                <span className="studio-tokens__value">
                  {token.measure === "color" && value ? <ColorSwatch color={value} size="sm" aria-hidden="true" /> : null}
                  <span className="studio-tokens__text" data-long={shownValue(token, value).length > 24 ? "" : undefined}>{shownValue(token, value) || "—"}</span>
                </span>
              </td>
              <td>
                {token.refs.length ? (
                  <span className="studio-tokens__refs">
                    {token.refs.slice(0, 3).map(ref => TOKEN_BY_NAME.has(ref)
                      ? <button key={ref} type="button" className="studio-tokens__ref" onClick={event => { event.stopPropagation(); onChoose(ref); }}><Code>{shortName(ref)}</Code></button>
                      : <Code key={ref}>{shortName(ref)}</Code>)}
                    {token.refs.length > 3 ? <span className="studio-muted">+{token.refs.length - 3}</span> : null}
                  </span>
                ) : <span className="studio-muted">—</span>}
              </td>
              <TableCell className="studio-muted">{token.usedFor}</TableCell>
            </tr>
          );
          });
          return chunk === 0 ? rows : <RowsWhenVisible key={chunk} rows={rows.length}>{rows}</RowsWhenVisible>;
        })}
      </tbody>
    </Table>
  );
}

/** The chosen token's facts, for the Inspector. */
export function TokenFacts({ token, value }: { token: Token; value: string }) {
  const used = TOKEN_LIST.filter(other => other.refs.includes(token.name)).length;
  return (
    <PanelSection heading={shortName(token.name)}>
      <Facts label="Token" items={[
        ["Tier", TIERS.find(tier => tier.id === token.tier)!.label],
        ["Group", TOKEN_GROUPS.find(group => group.id === token.group)!.label],
        ["Used for", token.usedFor],
        ["Value", value ? <Code>{value}</Code> : "—"],
        token.setting ? ["Set by", token.setting] : null,
        ["Refers to", token.refs.length ? token.refs.map(shortName).join(", ") : "Nothing"],
        ["Referred to by", used ? `${used} ${used === 1 ? "token" : "tokens"}` : "Nothing"],
        ["CSS", <Code>{`var(${token.name})`}</Code>],
      ]} note={token.definition.length < 160 ? token.definition : undefined} />
    </PanelSection>
  );
}

export function TokensPage() {
  const { item, select, query } = useStudio();
  const group = TOKEN_GROUPS.find(entry => entry.id === item)?.id as TokenGroup | undefined;
  const [chosen, setChosen] = useState<string | null>(null);
  const scope = useRef<HTMLDivElement>(null);
  const listed = useMemo(() => TOKEN_LIST.filter(token => (!group || token.group === group)
    && (!query.trim() || matches(query, `${token.name} ${token.usedFor} ${token.setting ?? ""}`))), [group, query]);
  const values = useTokenValues(scope, TOKEN_LIST);
  const chosenToken = chosen ? TOKEN_BY_NAME.get(chosen) ?? null : null;
  // Choosing a token in another group (a reference) shows that group, so its row is on the Canvas.
  const choose = (name: string) => {
    const token = TOKEN_BY_NAME.get(name);
    if (token && group && token.group !== group) select(token.group);
    setChosen(name);
    requestAnimationFrame(() => document.querySelector(`[data-token="${CSS.escape(name)}"]`)?.scrollIntoView({ block: "nearest" }));
  };
  const counts = (id: TokenGroup) => TOKEN_LIST.filter(token => token.group === id).length;
  return (
    <Workspace
      canvasTitle={group ? TOKEN_GROUPS.find(entry => entry.id === group)!.label : "Tokens"}
      sidebar={<SidebarList>
        <SidebarTree label="Token groups" count={TOKEN_LIST.length} current={group} onSelect={id => select(id)}
          groups={[{ id: "groups", label: "Groups", items: TOKEN_GROUPS.map(entry => ({ id: entry.id, label: entry.label, trailing: <span className="studio-muted studio-tabular">{counts(entry.id)}</span> })) }]} />
      </SidebarList>}
      canvasActions={
        <ViewControls>
          <CopyButton label="Copy as design tokens" icon={<CopyIcon />} value={() => toDesignTokens(listed, values)} />
        </ViewControls>
      }
      canvas={
        <div ref={scope} className="studio-sections studio-tokens">
          {TIERS.map(tier => {
            const tokens = listed.filter(token => token.tier === tier.id);
            return tokens.length ? (
              <CanvasSection key={tier.id} id={`tokens-${tier.id}`} title={tier.label} count={tokens.length} lede={tier.lede}>
                <TokenTable tokens={tokens} values={values} chosen={chosen} onChoose={choose} label={tier.label} />
              </CanvasSection>
            ) : null;
          })}
        </div>
      }
      inspector={{
        theme: <CanvasSettings />,
        design: chosenToken ? <TokenFacts token={chosenToken} value={values.get(chosenToken.name) ?? ""} /> : (
          <PanelSection heading="Tokens">
            <Facts label="Tokens" items={[
              ...TIERS.map(tier => [tier.label, TOKEN_LIST.filter(token => token.tier === tier.id).length] as [string, number]),
              ["Format", "CSS custom properties; copies as design tokens"],
            ]} />
          </PanelSection>
        ),
      }}
    />
  );
}

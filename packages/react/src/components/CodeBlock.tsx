import type { VariantProps } from "../variants.ts";
import { MANIFESTS } from "../variants.ts";
import { CopyButton } from "./CopyButton.tsx";
import { Select } from "./Select.tsx";
import { forwardRef, useId, useRef, useState } from "react";
import type { ReactNode, SyntheticEvent } from "react";
import { cx, createVariants } from "../variants.ts";
import type { Div } from "./shared.ts";
import { useTabIndicator } from "./tab-indicator.ts";
const codeBlockVariants = /* @__PURE__ */ createVariants(MANIFESTS.codeBlock);

/** A line's change, in the shared change words (components audit D6); `removed` is the deprecated spelling of `deleted`. */
export type CodeLineMark = "added" | "deleted" | "removed";

/** `"3, 5-7"` or `[3, 5, 6, 7]` into the set of line numbers to emphasise. */
function parseLineNumbers(value: number[] | string | undefined): Set<number> | undefined {
  if (value === undefined) return undefined;
  if (Array.isArray(value)) return new Set(value.filter(line => Number.isInteger(line) && line > 0));

  const lines = new Set<number>();
  for (const part of value.split(",")) {
    const range = part.trim().match(/^(\d+)\s*-\s*(\d+)$/);
    if (!range) {
      const single = Number(part.trim());
      if (Number.isInteger(single) && single > 0) lines.add(single);
      continue;
    }
    const start = Number(range[1]);
    const end = Number(range[2]);
    // The range is authored by hand, but a runaway bound must not spin the renderer.
    for (let line = Math.min(start, end); line <= Math.max(start, end) && lines.size < 10000; line += 1) lines.add(line);
  }
  return lines;
}

export interface CodeBlockProps extends Omit<Div, "title"> {
  /** Plain code. One grid row is rendered per line. */
  code?: string;
  /**
   * Trusted, pre-highlighted HTML from a highlighter that emits one line of markup per line
   * of code. Use `code` for plain text.
   */
  html?: string;
  /** Filename, or whatever else names the snippet. Adds the header row. */
  title?: ReactNode;
  /** Language shown beside the title. */
  language?: string;
  /** More than one language turns the label into a picker. */
  languages?: string[];
  /** Renders the picker as tabs rather than a Select. */
  languageTabs?: boolean;
  /** Controlled active language. Omit for an uncontrolled picker. */
  value?: string;
  /** Called with the chosen language and the click, key or change that chose it. */
  onValueChange?: (language: string, event: SyntheticEvent) => void;
  /** @deprecated Use `onValueChange`. */
  onLanguageChange?: (language: string) => void;
  /** Line numbers. On by default; turn them off for a short excerpt. */
  lineNumbers?: boolean;
  /** Lines to emphasise, as numbers or a range string such as `"3, 5-7"`. */
  highlightLines?: number[] | string;
  /** Added and deleted lines, keyed by line number. */
  marks?: Record<number, CodeLineMark>;
  /** Makes each line number a link to its own line, so a reference can be shared. */
  linkLines?: boolean;
  /** Shows the show/hide control over an excerpt. */
  collapsible?: boolean;
  /** Starts collapsed. Only meaningful with `collapsible`. */
  defaultCollapsed?: boolean;
  /** How many lines a collapsed block shows. Default 8. */
  collapsedLines?: number;
  /**
   * A prompt shown before the first line, muted and left out of the copy, for a command (`"$"`). Continued lines hang
   * under the command's first character.
   */
  prompt?: string;
  /** `soft` is a fill with no edge, the soft fields' look, for code in a panel whose fields are soft. */
  variant?: VariantProps<typeof MANIFESTS.codeBlock>["variant"];
  /** The floating copy and actions show only while the block is hovered or holds focus (always on touch). */
  revealActions?: boolean;
  /** Built-in copy control. On by default. */
  copyable?: boolean;
  /** The copy control's accessible name. */
  copyLabel?: string;
  /** Names the language switcher (tabs or Select), to translate it. */
  languageLabel?: string;
  /** Extra actions beside the copy control. Adds the header row when there is no title. */
  actions?: ReactNode;
  /** Remove the surrounding border when embedded in another framed surface. */
  flush?: boolean;
  /** Wrap long code lines instead of scrolling horizontally. */
  wrap?: boolean;
  /** `sm` is the inspector's code well: 12px code on 18px lines with 8px insets. */
  size?: VariantProps<typeof MANIFESTS.codeBlock>["size"];
}

export const CodeBlock = /* @__PURE__ */ forwardRef<HTMLDivElement, CodeBlockProps>(function CodeBlock(
  {
    flush,
    wrap,
    size = "md",
    title,
    language,
    languages,
    languageTabs,
    value,
    onValueChange,
    onLanguageChange,
    lineNumbers = true,
    highlightLines,
    marks,
    linkLines,
    collapsible,
    defaultCollapsed,
    collapsedLines,
    prompt,
    variant,
    revealActions,
    copyable = true,
    copyLabel = "Copy code",
    languageLabel = "Language",
    actions,
    html,
    code,
    className,
    style,
    ...rest
  },
  ref,
) {
  if (collapsedLines !== undefined && (!Number.isFinite(collapsedLines) || collapsedLines < 1)) throw new RangeError("CodeBlock: collapsedLines must be a finite number of at least 1.");
  // A fragment has to be a plain token, so punctuation from useId is dropped rather than
  // escaped; uniqueness survives because nothing else about the id changes.
  const id = useId().replace(/[^A-Za-z0-9_-]/g, "");
  const source = useRef<HTMLElement>(null);
  const tabButtons = useRef(new Map<string, HTMLButtonElement>());
  const tabList = useRef<HTMLDivElement>(null);
  const [localLanguage, setLocalLanguage] = useState(() => value ?? languages?.[0]);
  const [collapsed, setCollapsed] = useState(Boolean(defaultCollapsed));

  const activeLanguage = value ?? localLanguage ?? languages?.[0];
  useTabIndicator(tabList, tabButtons, languageTabs ? activeLanguage : undefined, languages);
  const highlighted = parseLineNumbers(highlightLines);
  const lines = (html ?? code ?? "").split("\n");

  const selectLanguage = (next: string, event: SyntheticEvent) => {
    if (value === undefined) setLocalLanguage(next);
    onValueChange?.(next, event);
    onLanguageChange?.(next);
  };

  /*
   * Pre-highlighted HTML has no plain-text twin, so the copy reads it back off the rendered
   * text cells -- which is also what keeps the gutter out of the clipboard.
   */
  const read = () => {
    if (code !== undefined && html === undefined) return code;
    const node = source.current;
    if (!node) return code ?? "";
    const cells = node.querySelectorAll<HTMLElement>(".area-code-block__text");
    return cells.length ? Array.from(cells, cell => cell.textContent ?? "").join("\n") : node.textContent ?? "";
  };

  const picker = languages?.length ? (
    languageTabs ? (
      // The language switcher is Tabs sm (audit G-6 A, owner 2026-09-30): one tab language, its
      // indicator, hover, inset focus and forced-colours rule; the code body is the tab panel.
      <div className="area-tabs area-tabs--sm area-code-block__languages">
        <div ref={tabList} className="area-tabs__list" role="tablist" aria-label={languageLabel}>
        {languages.map((item, index) => {
          const selected = item === activeLanguage;
          return (
            <button
              key={item}
              type="button"
              role="tab"
              /* Language names are the author's text, so the id is the index. */
              id={`${id}-tab-${index}`}
              className="area-tabs__tab"
              {...(selected ? { "data-selected": "" } : {})}
              ref={node => { if (node) tabButtons.current.set(item, node); else tabButtons.current.delete(item); }}
              aria-selected={selected}
              aria-controls={`${id}-panel`}
              /* Only the selected tab is in the tab order; arrows move between them. */
              tabIndex={selected ? 0 : -1}
              onKeyDown={event => {
                if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
                event.preventDefault();
                const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
                const step = (event.key === "ArrowRight" ? 1 : -1) * (rtl ? -1 : 1);
                const next = languages[event.key === "Home" ? 0 : event.key === "End" ? languages.length - 1 : (index + step + languages.length) % languages.length]!;
                selectLanguage(next, event);
                tabButtons.current.get(next)?.focus();
              }}
              onClick={event => selectLanguage(item, event)}
            >
              <span className="area-tabs__label"><span className="area-tabs__text">{item}</span><span className="area-tabs__reserve" aria-hidden="true">{item}</span></span>
            </button>
          );
        })}
        </div>
      </div>
    ) : (
      <span className="area-code-block__languages">
        <Select
          className="area-code-block__select"
          size="sm"
          aria-label={languageLabel}
          value={activeLanguage}
          onChange={event => selectLanguage(event.currentTarget.value, event)}
        >
          {languages.map(item => <option key={item} value={item}>{item}</option>)}
        </Select>
      </span>
    )
  ) : language ? <span className="area-code-block__language">{language}</span> : null;

  const tools = copyable || actions ? (
    <span className="area-code-block__actions">
      {actions}
      {copyable ? (
        // CopyButton (docs/specs/copy-button.md): one fixed name, the result said once through its live region
        // (audit G-21), the check shown by the glyph and `data-copy-state` as the paint hook.
        <CopyButton value={read} label={copyLabel} />
      ) : null}
    </span>
  ) : null;

  const header = title || language || languages?.length ? (
    <div className="area-code-block__header">
      {title ? <span className="area-code-block__title">{title}</span> : null}
      {picker}
      {tools}
    </div>
  ) : tools;

  const panel = languageTabs && languages?.length
    ? { role: "tabpanel", id: `${id}-panel`, "aria-labelledby": `${id}-tab-${languages.indexOf(activeLanguage ?? "")}`, tabIndex: 0 }
    : {};

  return (
    <div ref={ref} className={codeBlockVariants({ size, variant, flush, wrap, unnumbered: !lineNumbers, revealActions }, className)} {...(collapsed ? { "data-collapsed": "" } : {})}
      style={collapsedLines === undefined ? style : { ...style, ["--area-code-block-lines" as string]: Math.floor(collapsedLines) }} {...rest}>
      {header}
      <div className="area-code-block__body" {...panel}>
        {/* Without the tab panel, the scrolling block itself takes focus so a keyboard can scroll it (audit G-21). */}
        <pre className="area-code-block__pre" id={`${id}-code`} {...(panel.role ? {} : { tabIndex: 0, "aria-label": typeof title === "string" ? title : "Code" })}>
          <code className="area-code-block__code" ref={source}>
          {lines.map((text, index) => {
            const number = index + 1;
            const given = marks?.[number];
            const mark = given === "removed" ? "deleted" : given;
            // Hiding the numbers hides the gutter too, unless a diff marker needs its column.
            const gutter = lineNumbers || mark;
            return (
                <span
                  key={number}
                  id={linkLines ? `${id}-L${number}` : undefined}
                  className={cx(
                    "area-code-block__line",
                    mark && `area-code-block__line--${mark}`,
                    highlighted?.has(number) && "area-code-block__line--highlighted",
                  )}
                >
                {gutter ? (
                  <span className="area-code-block__gutter">
                    {mark ? <span className="area-code-block__marker">{mark === "added" ? "+" : "-"}</span> : null}
                    {linkLines
                      // Out of the tab order, so a long block isn't a tab stop per line (audit G-21).
                      ? <a className="area-code-block__linenumber" href={`#${id}-L${number}`} aria-label={`Line ${number}`} tabIndex={-1}>{number}</a>
                      : lineNumbers ? <span className="area-code-block__linenumber" aria-hidden="true">{number}</span> : null}
                  </span>
                ) : null}
                  {/* Outside the text cell, so the copy (which reads the text cells) leaves it out. */}
                  {prompt ? <span className="area-code-block__prompt" aria-hidden="true">{prompt}</span> : null}
                  {html
                    ? <span className="area-code-block__text" dangerouslySetInnerHTML={{ __html: text }} />
                    : <span className="area-code-block__text">{text}</span>}
                </span>
              );
            })}
          </code>
        </pre>
        {collapsible ? (
          <button
            type="button"
            className="area-code-block__toggle"
            // The visible label carries the state; aria-expanded on top of it said it twice (audit G-21).
            aria-controls={`${id}-code`}
            onClick={() => setCollapsed(current => !current)}
          >
            {collapsed ? "Show code" : "Hide code"}
          </button>
        ) : null}
      </div>
    </div>
  );
});


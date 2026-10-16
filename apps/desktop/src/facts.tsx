/**
 * The Inspector's information as an Area Table (owner, 2026-10-11: facts as Tables; 2026-10-12: styled
 * as the real Table component, not a look-alike): term / value rows in Table's frame and rules.
 *
 * Terms are plain cells, not row headers: Table's header cell paints the subtle header ground and
 * keeps the rule under the last row, both meant for a column header.
 */
import type { ReactNode } from "react";
import { Code, Table } from "@area/react";

export type Fact = readonly [term: ReactNode, value: ReactNode];

export function Facts({ items, label }: { items: ReadonlyArray<Fact | null | false | undefined>; label: string }) {
  return (
    // Flush: rows on the panel's own column, no frame round them, as Figma's and Framer's
    // inspectors draw their properties (owner, 2026-10-14).
    <Table size="md" flush aria-label={label}>
      <tbody>
        {items.filter((item): item is Fact => Boolean(item)).map(([term, value], index) => (
          <tr key={index}>
            {/* Table's shrink-to-fit cell: the term column is as wide as its longest term. */}
            <td className="area-table__cell--fit"><span className="studio-muted">{term}</span></td>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

/**
 * A family's props on the Canvas, under its tiles: prop, type and default in their own columns. The
 * prop and default columns shrink to their longest entry, one name per line ("open / defaultOpen /
 * onOpenChange"), so the type gets the rest of the width.
 */
export function PropsTable({ api }: { api: ReadonlyArray<ReadonlyArray<string>> }) {
  return (
    <Table size="md" flush aria-label="Props">
      <thead>
        <tr><th scope="col">Prop</th><th scope="col">Type</th><th scope="col">Default</th></tr>
      </thead>
      <tbody>
        {api.map(([prop = "", type, fallback]) => (
          <tr key={prop}>
            <td className="area-table__cell--fit">
              {prop.split(/ \/ |(?<=:) /).map((name, index) => <Code key={index} className="studio-prop">{name}</Code>)}
            </td>
            <td>{type}</td>
            <td className="area-table__cell--fit">{fallback && fallback !== "—" ? <Code>{fallback}</Code> : <span className="studio-muted">—</span>}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

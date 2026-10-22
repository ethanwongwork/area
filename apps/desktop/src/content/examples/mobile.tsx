/**
 * Mobile: a phone-sized Today screen built only from Area (owner, 2026-10-21, after a journal app's Today: times down a
 * dashed line, notes and tasks under each, chips for when, a composer at the foot). The Theme setup's stage draws it as
 * its mobile sample, so text, checkboxes, chips, a card and the composer all show a pick at a phone's width (390).
 * People: David Tee.
 */
import { useState } from "react";
import { Avatar, Badge, Button, Card, CardContent, CardDescription, CardTitle, Checkbox, Chip, Composer, Segmented } from "@area/react";
import { AddIcon, MenuIcon } from "@area/icons";

const TASKS = [
  { label: "Finish the wireframe", chip: "2 days", done: false },
  { label: "Email the design team", chip: undefined, done: true },
  { label: "Check the release notes", chip: "Next Mon", done: false },
];

export function MobileScreen() {
  const [draft, setDraft] = useState("");
  return (
    <div className="ex-phone">
      <header className="ex-phone__head">
        <div className="ex-phone__date"><span>Oct 21</span><strong>Today</strong></div>
        <Button variant="ghost" tone="neutral" iconOnly icon={<MenuIcon />} aria-label="Menu" />
      </header>
      <Segmented aria-label="View" size="sm" defaultValue="day" fullWidth items={[{ value: "day", label: "Day" }, { value: "week", label: "Week" }, { value: "month", label: "Month" }]} />
      <ol className="ex-phone__day">
        <li className="ex-phone__slot">
          <span className="ex-phone__time">10:30 AM</span>
          <p>Had a good review with the team. The new layout reads better on small screens.</p>
        </li>
        <li className="ex-phone__slot">
          <span className="ex-phone__time">12:30 PM</span>
          <div className="ex-phone__tasks">
            {TASKS.map(task => (
              <div key={task.label} className="ex-phone__task">
                <Checkbox label={task.label} defaultChecked={task.done} />
                {task.chip ? <Chip size="sm">{task.chip}</Chip> : null}
              </div>
            ))}
          </div>
        </li>
        <li className="ex-phone__slot">
          <span className="ex-phone__time">2:00 PM</span>
          <Card size="sm"><CardContent>
            <div className="ex-phone__card-head"><Avatar size="sm" fallback="DT" alt="David Tee" /><CardTitle>Design review</CardTitle><Badge>New</Badge></div>
            <CardDescription>David Tee shared notes on the onboarding flow.</CardDescription>
          </CardContent></Card>
        </li>
      </ol>
      <div className="ex-phone__composer">
        <Composer value={draft} onValueChange={setDraft} placeholder="Start typing…"
          leadingActions={<Button variant="ghost" iconOnly icon={<AddIcon />} aria-label="Add" />} />
      </div>
    </div>
  );
}

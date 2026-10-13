/** Spinner with a value: the ring stopped at how far along something is. docs/specs/spinner.md, "Value". */
import { useEffect, useState } from "react";
import { Button, Spinner } from "@area/react";

export const GallerySpinnerValue = () => <Spinner value={62} label="Uploading" />;
export const GallerySpinnerValueSm = () => <Spinner size="sm" value={62} label="Uploading" />;
export const GallerySpinnerValueLg = () => <Spinner size="lg" value={62} label="Uploading" />;
export const GallerySpinnerValueEmpty = () => <Spinner value={0} label="Uploading" />;
export const GallerySpinnerValueLow = () => <Spinner value={4} label="Uploading" />;
export const GallerySpinnerValueFull = () => <Spinner value={100} label="Uploaded" />;
/* Cursor's context ring: how much of a quantity is used, so a meter. */
export const GallerySpinnerValueMeter = () => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--area-space-4)", color: "var(--area-fg-muted)", fontSize: "var(--area-text-xs-size)" }}>
    <Spinner role="meter" value={48} valueText="48% of context used" label="Context used" />
    48%
  </span>
);
/* Cursor's review run: in a Button the ring takes the label's ink and the icon box, as the turning one does. */
export const GallerySpinnerValueButton = () => {
  // A run that reports often, as a review or an upload does; it holds at 100 for a moment, then starts again.
  const [value, setValue] = useState(35);
  useEffect(() => {
    let held = 0;
    const timer = setInterval(() => setValue(v => {
      if (v < 100) return Math.min(100, v + 1);
      held += 1;
      if (held < 8) return v;
      held = 0;
      return 0;
    }), 120);
    return () => clearInterval(timer);
  }, []);
  return <Button variant="outline" icon={<Spinner value={value} label="Review progress" />}>Reviewing</Button>;
};

# Captures

Raw `area-capture` measurements, one folder per component (`<slug>/`) plus `baseline/`
for the shared cross-product elements. File names follow
`<source>--<variant>--<state>--<theme>.json`. Files are saved verbatim from the capture
script; `scripts/capture-compare.mjs` checks each file's checksum, so never hand-edit one.
Re-capture instead. Read each file for personal content before committing it.

import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString as render } from "react-dom/server";
import { FileUpload, FileUploadItem, FileUploadList, fileMatchesAccept, formatFileSize } from "../dist/modules/index.js";

test("the zone is a picker button described by its hint, over a hidden file input", () => {
  const html = render(h(FileUpload, { accept: ".pdf", multiple: true, name: "files", hint: "PDF, up to 10 MB" }));
  assert.match(html, /^<div class="area-file-upload">/);
  assert.match(html, /<button type="button" class="area-link area-link--inline area-link--action area-file-upload__action" aria-describedby="([^"]+)">Click to upload<\/button> or drag and drop/);
  const hint = html.match(/aria-describedby="([^"]+)"/)[1];
  assert.match(html, new RegExp(`<p id="${hint}" class="area-file-upload__hint">PDF, up to 10 MB</p>`));
  assert.match(html, /<input type="file" class="area-file-upload__input" tabindex="-1" aria-hidden="true" accept=".pdf" multiple="" name="files"\/>/);
});

test("invalid and disabled reach the zone, the button and the input", () => {
  const html = render(h(FileUpload, { invalid: true, disabled: true }));
  assert.match(html, /class="area-file-upload" data-invalid="" data-disabled=""/);
  assert.match(html, /disabled="" aria-invalid="true">Click to upload/);
  assert.match(html, /type="file"[^>]*disabled=""/);
});

test("a row shows name, size and status; uploading adds a named progress bar and a cancel", () => {
  const html = render(h(FileUploadList, null, h(FileUploadItem, { name: "Brand guidelines.pdf", size: 2_400_000, progress: 40, onRemove() {} })));
  assert.match(html, /^<ul class="area-file-upload-list"><li class="area-file-upload-item area-file-upload-item--uploading">/);
  assert.match(html, /<p class="area-file-upload-item__name">Brand guidelines.pdf<\/p>/);
  assert.match(html, /<span>2.4 MB<\/span><span class="area-file-upload-item__separator" aria-hidden="true"><\/span><span class="area-file-upload-item__status">Uploading…<\/span>/);
  assert.doesNotMatch(html, /role="status"/, 'a change is said through the shared announcer, with the file name (components audit D1)');
  assert.match(html, /role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="40" aria-label="Uploading Brand guidelines.pdf"/);
  assert.match(html, /<span class="area-sr-only">Cancel upload of Brand guidelines.pdf<\/span>/);
});

test("complete shows the check and Remove; error shows the message, Retry and Remove, and no bar", () => {
  const done = render(h(FileUploadItem, { name: "Hero.png", status: "complete", onRemove() {} }));
  assert.match(done, /area-file-upload-item--complete/);
  assert.match(done, /data-area-glyph="check"[^]*Complete<\/span>/);
  assert.match(done, />Remove Hero.png</);
  const failed = render(h(FileUploadItem, { name: "Report.pdf", status: "error", error: "Over 10 MB", onRetry() {}, onRemove() {} }));
  assert.match(failed, /area-file-upload-item__status">Over 10 MB<\/span>/);
  assert.match(failed, />Retry Report.pdf</);
  assert.doesNotMatch(failed, /progressbar/);
});

test("accept matching and size formatting follow the browser's picker and how people read sizes", () => {
  const file = (name, type) => ({ name, type });
  assert.ok(fileMatchesAccept(file("a.PDF", "application/pdf"), ".pdf"));
  assert.ok(fileMatchesAccept(file("a.png", "image/png"), "image/*"));
  assert.ok(!fileMatchesAccept(file("a.txt", "text/plain"), ".pdf, image/*"));
  assert.ok(fileMatchesAccept(file("a.txt", "text/plain")));
  assert.deepEqual([999, 720_000, 2_400_000, 14_200_000, 1_500_000_000].map(formatFileSize), ["999 B", "720 KB", "2.4 MB", "14 MB", "1.5 GB"]);
});

/** Write to folder's words (src/output.ts): design words, never git's (PRODUCT_UI.md rule 24). */
import assert from "node:assert/strict";
import { test } from "node:test";
import { choicesIn, describeWrite, folderName } from "../src/output.ts";

test("a write is said in a sentence, in design words", () => {
  assert.equal(describeWrite({ added: 220 }), "220 files: 220 new.");
  assert.equal(describeWrite({ unchanged: 200, updated: 8, merged: 2, "kept-edits": 1 }), "11 files: 8 updated, 2 updated around your edits, 1 keeps your edits.");
  assert.equal(describeWrite({ unchanged: 5 }), "Nothing to write: the folder already has this version.");
  const clash = describeWrite({ conflict: 1, exists: 1, removed: 3 });
  assert.equal(clash, "5 files: 2 with two changes side by side for you to choose, 3 removed.");
  for (const word of ["merge", "conflict", "commit", "branch", "repo", "diff"]) assert.ok(!clash.toLowerCase().includes(word), word);
  assert.equal(choicesIn({ conflict: 2, exists: 1 }), 3);
  assert.equal(folderName("/Users/me/code/shop/"), "shop");
});

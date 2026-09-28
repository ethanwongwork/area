# Landscape research

Checked **2026-09-28**. **34 tools**, **476 required field cells**, plus **6 Figma feature records**. Every cell contains dated source URLs or an explicit “not found” with the pages searched. Full facts are in [tools.json](tools.json).

## Scope and provenance

- Task branch: `astra/landscape`; worktree: `/Users/ethanwong/Desktop/area-astra/landscape`.
- Area starting commit: `c585f8c5f38705a7efa79bf05148a8c6989b142a`. No component code or shared-checkout files changed.
- `docs/BRIEF.md` is absent from that commit. Reviewed the owner-supplied read-only fallback: `/Users/ethanwong/Desktop/area/.claude/worktrees/astra-6-usage-tasks-17a367/docs/BRIEF.md`.
- Fallback SHA-256 on 2026-09-28: `3bd0d87904420da7aa4bee52093206737f7bb4b822539dc1fc323d984f1ac1af`. Line numbers/quotes below refer to that working-file snapshot, not to a claimed committed version.
- Four layers follow fallback lines 109–121; proposed differentiation follows lines 393–405. The fallback itself lists the generator/studio/GitHub/MCP/publishing work as missing at lines 375–391. **Area’s scope below is proposed, not shipped.**

## Read this first

- The old category-level claims are too broad. Existing-system maintenance, live code editing, persistent reusable systems, review workflows and interactive publishing all have documented competitors. See the sourced comparisons below.
- A useful Area hypothesis is a constrained, inspectable customization model spanning foundations, inventory and anatomy, applied consistently to product screens, with reversible updates and conformance evidence. This is a proposed positioning and test plan, not a verified market monopoly.
- Public pages were examined; products were not exercised behind a login. “Documented” records a source statement. “Not found” never means “does not exist.” A general-purpose agent’s ability to edit code does not establish a guarded design-system option model.
- Native GitHub delivery, agent-mediated changes, local export and read-only repository access are recorded separately. Funding events are historical observations, not rankings or exhaustive totals. Prices retain the observed currency and billing caveats.

## Comparison against every Differentiation row

All competitor links in this table were checked on **2026-09-28**. The rightmost column is a proposed proof obligation for Area.

| Brief line / proposed Area capability | Current competitive evidence and assessment | What Area must demonstrate |
| --- | --- | --- |
| 397: Customization in four layers, including structure and material, with guardrails so every combination holds up | Overlap is substantial: shadcn/create transforms structure as well as theme values; Plasmic has variants/slots; Lovable releases reusable systems. No examined source establishes Area’s exact all-combination guardrail contract. [ui.shadcn.com: 12 shadcn create](https://ui.shadcn.com/docs/changelog/2025-12-shadcn-create) [plasmic.app: for developers](https://www.plasmic.app/for-developers) [docs.lovable.dev: design systems](https://docs.lovable.dev/features/design-systems) | Demonstrate enumerated anatomy/material options, disjoint axes and tests across supported combinations; publish the actual limits. |
| 398: A live library that renders in the viewer's own system and adopts in one action | Live code and easy installation already exist in 21st.dev and shadcn registries. 21st also supports themes/editing; “fixed look” is inaccurate. User-system adaptation with verified semantics across arbitrary library items remains unconfirmed. [npmjs.com: cli](https://www.npmjs.com/package/%4021st-dev/cli) [mcp.21st.dev: changelog](https://mcp.21st.dev/changelog) | Show an unfamiliar live pattern adopting the viewer’s tokens, components and anatomy, including failures and compatibility requirements. |
| 399: Test a system change live on real shipped screens and explorations, then ship it after review | Subframe previews real code and creates PRs; v0 uses working branches and PR publishing; Figma has code-backed canvas workflows. Direct unreviewed modification is not a fair general description of code tools. [subframe.com: homepage](https://www.subframe.com/) [v0.app: github](https://v0.app/docs/github) [figma.com: code on the figma canvas](https://www.figma.com/blog/code-on-the-figma-canvas/) | Preview a proposed system release across representative shipped screens and lab examples before applying it, with a clear review boundary. |
| 400: Writes the system to the user's repository and keeps it current | Lovable system releases/consumer updates, token-delivery PRs and Plasmic codegen all overlap. Code ownership, update boundaries and preservation of local edits are more useful comparison criteria than whether a tool writes code. [docs.lovable.dev: design systems](https://docs.lovable.dev/features/design-systems) [docs.plasmic.app: github action](https://docs.plasmic.app/learn/github-action/) [docs.specifyapp.com: github](https://docs.specifyapp.com/distribute/available-destinations/github) | Show repeatable regeneration, lock/config history, meaningful diffs and preservation or explicit conflict handling of user edits. |
| 401: One place for System, Product and Lab, with explicit states | Figma explicitly records ready-for-dev/completed status; Dessn supports alternative flows/states; Subframe supports prototyping and PRs. None of these sources establishes exactly Area’s three-zone lifecycle. [help.figma.com: Dev Mode ready for dev view](https://help.figma.com/hc/en-us/articles/23918228264855-Dev-Mode-ready-for-dev-view) [dessn.com: homepage](https://www.dessn.com/) [subframe.com: homepage](https://www.subframe.com/) | Define the transitions and provenance between experiments, approved system releases and shipped product snapshots. |
| 402: Choices instead of code, on real code | Cursor already exposes visual layout/property/React-prop editing; Subframe and Onlook target designers on real code. Figma Code Layers make “Figma is not the code” too categorical. [cursor.com: browser visual editor](https://cursor.com/blog/browser-visual-editor) [subframe.com: homepage](https://www.subframe.com/) [onlook.com: homepage](https://www.onlook.com/) [figma.com: code on the figma canvas](https://www.figma.com/blog/code-on-the-figma-canvas/) | Demonstrate that a non-programmer can change system-level choices consistently without manually finding and editing component files. |
| 403: One-action publishing of live, interactive work | Interactive publishing is established in Framer and Plasmic; Storybook has static/cloud publishing. It is a baseline capability, not an exclusive differentiator. [framer.com: pricing](https://www.framer.com/pricing) [plasmic.app: homepage](https://www.plasmic.app/) [storybook.js.org: publish storybook](https://storybook.js.org/docs/sharing/publish-storybook) | Differentiate preservation of the exact system version, interactivity and review state in a shareable artifact. |
| 404: One definition, many frameworks, checked by a conformance suite | Several systems deliver multi-platform token outputs, and Knapsack renders many frameworks. Those capabilities do not prove one executable component definition with cross-framework behavioral/visual parity. This remains a plausible, unproven Area differentiator. [learn.supernova.io: homepage](https://learn.supernova.io/) [docs.knapsack.cloud: knapsack config](https://docs.knapsack.cloud/get-started/knapsack-config) [tokens.studio: help center](https://tokens.studio/help-center) | Generate the same component for multiple frameworks and run a published accessibility, behavior and visual conformance suite. |
| 405: The same contract for people and their agents | Machine-facing system context is already productized through Figma MCP/Code Connect, v0 reusable system skills and Supernova. An explicit validated change protocol could differ from context retrieval alone. [developers.figma.com: figma mcp server](https://developers.figma.com/docs/figma-mcp-server/) [developers.figma.com: code connect](https://developers.figma.com/docs/code-connect/) [v0.app: design systems 2](https://v0.app/docs/design-systems-2) [supernova.io: homepage](https://www.supernova.io/) | Expose the same typed options, constraints, preview, diff and acceptance operations in the UI and agent API. |

## Brief claims requiring revision

Exact quotes are from the fallback snapshot identified above. These findings do not edit the brief.

### Lines 397 — Overbroad

> | Customization in four layers, including structure and material, with guardrails so every combination holds up | Theme generators and customizable systems expose a few global settings, and the output looks like the template |

shadcn/create explicitly changes component structure and base libraries; Plasmic supports deep composition. Keep the guardrail claim as a proposed proof obligation, not a conclusion about competitors.
[ui.shadcn.com: 12 shadcn create](https://ui.shadcn.com/docs/changelog/2025-12-shadcn-create) (checked 2026-09-28); [plasmic.app: for developers](https://www.plasmic.app/for-developers) (checked 2026-09-28)

### Lines 398 — Partly wrong

> | A live library that renders in the viewer's own system and adopts in one action | Inspiration sites show screenshots and videos; component registries such as 21st.dev ship a fixed look |

21st.dev distributes themes as well as component source and has a live editor. Captured inspiration and executable registries need separate treatment. Universal viewer-system adaptation was not verified.
[npmjs.com: cli](https://www.npmjs.com/package/%4021st-dev/cli) (checked 2026-09-28); [mcp.21st.dev: changelog](https://mcp.21st.dev/changelog) (checked 2026-09-28)

### Lines 399 — Outdated

> | Test a system change live on real shipped screens and explorations, then ship it after review | Figma previews library changes in design files, not in shipped code; code tools change the code directly |

Code-backed Figma workflows exist, while v0 and Subframe support preview/review boundaries before merging.
[figma.com: code on the figma canvas](https://www.figma.com/blog/code-on-the-figma-canvas/) (checked 2026-09-28); [v0.app: github](https://v0.app/docs/github) (checked 2026-09-28); [subframe.com: homepage](https://www.subframe.com/) (checked 2026-09-28)

### Lines 400 — Wrong as a category claim

> | Writes the system to the user's repository and keeps it current | Figma keeps a second representation; prompt-first generators produce one-off projects |

Lovable documents versioned design-system releases and consumer updates; v0 maintains reusable system context and existing repositories.
[docs.lovable.dev: design systems](https://docs.lovable.dev/features/design-systems) (checked 2026-09-28); [v0.app: design systems 2](https://v0.app/docs/design-systems-2) (checked 2026-09-28); [v0.app: github](https://v0.app/docs/github) (checked 2026-09-28)

### Lines 401 — Wrong as written

> | One place for System, Product and Lab, with explicit states | Figma files carry no approval state; code tools have no concept of exploration |

Figma has explicit handoff statuses, although status is not proof of a production merge. Dessn and Subframe have exploration workflows.
[help.figma.com: Dev Mode ready for dev view](https://help.figma.com/hc/en-us/articles/23918228264855-Dev-Mode-ready-for-dev-view) (checked 2026-09-28); [dessn.com: homepage](https://www.dessn.com/) (checked 2026-09-28); [subframe.com: homepage](https://www.subframe.com/) (checked 2026-09-28)

### Lines 402 — Outdated/generalized audience claim

> | Choices instead of code, on real code | GitHub, StackBlitz and Cursor are for engineers; Figma is not the code |

Cursor exposes visual controls; Bolt and Subframe target people beyond engineers; Figma supports code layers. Specific usability gaps need task-based comparison.
[cursor.com: browser visual editor](https://cursor.com/blog/browser-visual-editor) (checked 2026-09-28); [support.bolt.new: intro bolt](https://support.bolt.new/building/intro-bolt) (checked 2026-09-28); [subframe.com: homepage](https://www.subframe.com/) (checked 2026-09-28); [figma.com: code on the figma canvas](https://www.figma.com/blog/code-on-the-figma-canvas/) (checked 2026-09-28)

### Lines 403 — Not a general differentiator

> | One-action publishing of live, interactive work | Recording, exporting and posting to several sites |

Framer and Plasmic already publish interactive work. State-preserving system review could be a narrower distinction.
[framer.com: pricing](https://www.framer.com/pricing) (checked 2026-09-28); [plasmic.app: homepage](https://www.plasmic.app/) (checked 2026-09-28)

### Lines 404 — Separate the claims

> | One definition, many frameworks, checked by a conformance suite | Most libraries are one framework, most often React |

The “most” frequency claim was not measured by this tool survey. Multi-framework rendering and token export exist; neither establishes a shared component definition with conformance.
[docs.knapsack.cloud: knapsack config](https://docs.knapsack.cloud/get-started/knapsack-config) (checked 2026-09-28); [learn.supernova.io: homepage](https://learn.supernova.io/) (checked 2026-09-28)

### Lines 405 — Overbroad

> | The same contract for people and their agents | Agents reach a system through hand-maintained glue: Figma MCP, Code Connect, rules files |

Official MCP integrations and reusable system skills are maintained product surfaces. Code Connect mappings may still need setup; context retrieval and validated mutation are different capabilities.
[developers.figma.com: code connect](https://developers.figma.com/docs/code-connect/) (checked 2026-09-28); [developers.figma.com: figma mcp server](https://developers.figma.com/docs/figma-mcp-server/) (checked 2026-09-28); [v0.app: design systems 2](https://v0.app/docs/design-systems-2) (checked 2026-09-28)

### Lines 409, 410, 411 — Features confirmed; adoption metric not found; representation claim needs nuance

> - Figma is moving toward code: Code Layers, Make on production codebases, Skills for team
>   rules, and an agent used weekly by most larger customers. Its canvas stays a second
>   representation that must be reconciled with code.

Code Layers, Make code workflows and Skills are documented. The specific weekly-adoption claim was not found in the launch/workflow pages or targeted public search. Native design layers still differ from code, but code can also inhabit the canvas.
[figma.com: code on the figma canvas](https://www.figma.com/blog/code-on-the-figma-canvas/) (checked 2026-09-28); [figma.com: config 2026 recap](https://www.figma.com/blog/config-2026-recap/) (checked 2026-09-28); [figma.com: workflow lab deploying designs directly with figma make](https://www.figma.com/blog/workflow-lab-deploying-designs-directly-with-figma-make/) (checked 2026-09-28)

### Lines 412, 413 — Wrong

> - Running-code design tools (Paper, Subframe, Dessn, Onlook, Cursor Design Mode) edit real
>   code. None creates or manages a design system.

Subframe explicitly creates/imports systems and synchronizes components/tokens; Paper advertises token/component workflows. Dessn is read-only against the repo and exports proposed edits.
[subframe.com: homepage](https://www.subframe.com/) (checked 2026-09-28); [subframe.com: design systems](https://www.subframe.com/design-systems) (checked 2026-09-28); [paper.design: homepage](https://paper.design/) (checked 2026-09-28); [dessn.com: homepage](https://www.dessn.com/) (checked 2026-09-28)

### Lines 414, 415 — Wrong

> - Prompt-first generators (Claude Design, v0, Lovable, Framer) are fast and built for new
>   projects, not for a system that persists.

Claude Design has reusable organization systems; v0 has persistent system skills; Lovable has versioned system projects; Framer shares component libraries across projects.
[support.claude.com: set up your design system in claude design](https://support.claude.com/en/articles/14604397-set-up-your-design-system-in-claude-design) (checked 2026-09-28); [v0.app: design systems 2](https://v0.app/docs/design-systems-2) (checked 2026-09-28); [docs.lovable.dev: design systems](https://docs.lovable.dev/features/design-systems) (checked 2026-09-28); [framer.com: sharing components](https://www.framer.com/help/articles/sharing-components/) (checked 2026-09-28)

### Lines 416, 417 — Broadly supported but incomplete

> - Libraries and inspiration: Mobbin offers screenshots of shipped apps; 21st.dev offers
>   React components with live previews and one-command install.

Retain the distinction; add flows/research services for Mobbin and theme/template/editor distribution for 21st.dev.
[mobbin.com: homepage](https://mobbin.com/) (checked 2026-09-28); [npmjs.com: cli](https://www.npmjs.com/package/%4021st-dev/cli) (checked 2026-09-28); [mcp.21st.dev: changelog](https://mcp.21st.dev/changelog) (checked 2026-09-28)

### Lines 418, 419, 420 — Review completed here; category labels undersell scope

> - Not reviewed: Supernova, Knapsack and zeroheight (documentation platforms), Tokens Studio
>   (token sync with Git), and shadcn theme editors. Check their current capabilities before
>   relying on this table.

Supernova delivers code through PRs, Knapsack runs production components, zeroheight delivers tokens, and shadcn/create transforms structure. These are material overlaps.
[learn.supernova-docs.io: git hub jPO6p0St](https://learn.supernova-docs.io/latest/code-integration/code-delivery/open-a-pull-request/git-hub-jPO6p0St) (checked 2026-09-28); [docs.knapsack.cloud: knapsack config](https://docs.knapsack.cloud/get-started/knapsack-config) (checked 2026-09-28); [zeroheight.com: integrations](https://zeroheight.com/integrations/) (checked 2026-09-28); [ui.shadcn.com: 12 shadcn create](https://ui.shadcn.com/docs/changelog/2025-12-shadcn-create) (checked 2026-09-28)

## Three closest competitors to the proposed scope

Selection is a qualitative assessment of end-to-end overlap: creating/reusing a system, editing its real implementations, composing product screens, and maintaining changes. It is not a market-share or feature-count ranking.

### 1. Subframe

Closest interaction/workflow overlap: designer-facing visual choices over existing production code, reusable tokens/components, prototyping, local files and PRs.
[subframe.com: homepage](https://www.subframe.com/) (checked 2026-09-28); [subframe.com: design systems](https://www.subframe.com/design-systems) (checked 2026-09-28)

**Comparison to test:** Area should prove system-wide parameter/structure consistency and regeneration guarantees beyond general canvas/source editing.

### 2. Lovable

Closest persistent-system distribution overlap: dedicated system projects, source import, extracted schema, versioned releases, consumer updates and app generation.
[docs.lovable.dev: design systems](https://docs.lovable.dev/features/design-systems) (checked 2026-09-28)

**Comparison to test:** Compare source ownership and local-edit preservation, breadth of structural options, and independently tested cross-framework conformance.

### 3. Plasmic

Closest mature visual system/composition overlap: existing React components, tokens, variants/slots, editable anatomy and codegen through push or PR.
[plasmic.app: for developers](https://www.plasmic.app/for-developers) (checked 2026-09-28); [plasmic.app: features](https://www.plasmic.app/features) (checked 2026-09-28); [docs.plasmic.app: github action](https://docs.plasmic.app/learn/github-action/) (checked 2026-09-28)

**Comparison to test:** Compare Area’s proposed single definition across frameworks and explicit System/Product/Lab lifecycle with Plasmic’s component registration/codegen model.

Builder Code is a close alternative for repository-driven enterprise workflows; Knapsack is especially relevant to live system governance; Figma and Claude Design have broad design/agent surfaces. Their fit depends on which part of Area’s scope the owner prioritizes. This is an editorial assessment based on the corresponding tool records, not a claim that they lack the other capabilities.

[Builder evidence](https://www.builder.io/c/docs/fusion-projects-overview), [Knapsack evidence](https://docs.knapsack.cloud/), [Figma evidence](https://www.figma.com/blog/code-on-the-figma-canvas/), [Claude Design evidence](https://support.claude.com/en/articles/14604416-get-started-with-claude-design); checked 2026-09-28.

## Coverage index

Each row links to evidence. Status labels summarize documentation certainty, **not capability scores**. Detailed GitHub artifacts/review mechanics, audience, content/live-code distinction, sharing, frameworks, execution, pricing and funding are in each JSON record. Every linked page below was checked on **2026-09-28**.

| Tool / JSON id | Foundations | Inventory | Structure | Patterns |
| --- | --- | --- | --- | --- |
| Figma — `figma` | documented ([evidence](https://www.figma.com/blog/config-2026-recap/)) | documented ([evidence](https://www.figma.com/blog/code-on-the-figma-canvas/)) | documented ([evidence](https://www.figma.com/blog/code-on-the-figma-canvas/)) | documented ([evidence](https://www.figma.com/blog/code-on-the-figma-canvas/)) |
| Claude Design — `claude-design` | documented ([evidence](https://support.claude.com/en/articles/14604397-set-up-your-design-system-in-claude-design)) | documented ([evidence](https://support.claude.com/en/articles/14604397-set-up-your-design-system-in-claude-design)) | partial ([evidence](https://support.claude.com/en/articles/14604397-set-up-your-design-system-in-claude-design)) | documented ([evidence](https://support.claude.com/en/articles/14604416-get-started-with-claude-design)) |
| v0 — `v0` | documented ([evidence](https://v0.app/docs/design-systems-2)) | documented ([evidence](https://v0.app/docs/design-systems-2)) | partial ([evidence](https://v0.app/docs/design-systems-2)) | documented ([evidence](https://v0.app/docs/design-systems-2)) |
| Lovable — `lovable` | documented ([evidence](https://docs.lovable.dev/features/design-systems)) | documented ([evidence](https://docs.lovable.dev/features/design-systems)) | partial ([evidence](https://docs.lovable.dev/features/design-systems)) | documented ([evidence](https://docs.lovable.dev/features/design-systems)) |
| Bolt — `bolt` | vendor claim ([evidence](https://bolt.new/blog/bolt-design-system-agents)) | vendor claim ([evidence](https://bolt.new/blog/bolt-design-system-agents)) | partial ([evidence](https://support.bolt.new/building/intro-bolt)) | documented ([evidence](https://support.bolt.new/building/intro-bolt)) |
| Framer — `framer` | documented ([evidence](https://www.framer.com/help/articles/sharing-components/)) | documented ([evidence](https://www.framer.com/help/articles/sharing-components/)) | documented ([evidence](https://www.framer.com/help/articles/sharing-components/)) | documented ([evidence](https://www.framer.com/pricing)) |
| Paper — `paper` | vendor claim ([evidence](https://paper.design/)) | vendor claim ([evidence](https://paper.design/)) | documented ([evidence](https://paper.design/)) | documented ([evidence](https://paper.design/)) |
| Pencil (pen.dev) — `pencil` | documented ([evidence](https://www.pen.dev/)) | documented ([evidence](https://www.pen.dev/)) | documented ([evidence](https://www.pen.dev/)) | documented ([evidence](https://docs.pencil.dev/design-and-code/design-to-code)) |
| Subframe — `subframe` | documented ([evidence](https://www.subframe.com/)) | documented ([evidence](https://www.subframe.com/)) | documented ([evidence](https://www.subframe.com/)) | documented ([evidence](https://www.subframe.com/)) |
| Dessn — `dessn` | documented ([evidence](https://www.dessn.com/)) | documented ([evidence](https://www.dessn.com/)) | documented ([evidence](https://www.dessn.com/)) | documented ([evidence](https://www.dessn.com/)) |
| Onlook — `onlook` | documented ([evidence](https://www.onlook.com/)) | documented ([evidence](https://www.onlook.com/)) | documented ([evidence](https://www.onlook.com/)) | documented ([evidence](https://www.onlook.com/)) |
| Noon — `noon` | not found ([evidence](https://noon.design/)) | not found ([evidence](https://noon.design/)) | partial ([evidence](https://noon.design/)) | vendor claim ([evidence](https://noon.design/)) |
| Cursor Design Mode / browser visual editor — `cursor-design` | partial ([evidence](https://cursor.com/blog/browser-visual-editor)) | documented ([evidence](https://cursor.com/blog/browser-visual-editor)) | documented ([evidence](https://cursor.com/blog/browser-visual-editor)) | documented ([evidence](https://cursor.com/blog/browser-visual-editor)) |
| Builder.io (Builder Code / Content) — `builder` | documented ([evidence](https://www.builder.io/updates)) | documented ([evidence](https://www.builder.io/c/docs/fusion-projects-overview)) | documented ([evidence](https://www.builder.io/c/docs/fusion-projects-overview)) | documented ([evidence](https://www.builder.io/c/docs/fusion-projects-overview)) |
| Plasmic — `plasmic` | documented ([evidence](https://github.com/elasticpath/plasmic)) | documented ([evidence](https://github.com/elasticpath/plasmic)) | documented ([evidence](https://github.com/elasticpath/plasmic)) | documented ([evidence](https://www.plasmic.app/)) |
| Penpot — `penpot` | documented ([evidence](https://help.penpot.app/user-guide/design-systems/design-tokens/)) | documented ([evidence](https://github.com/penpot/penpot/blob/develop/README.md)) | documented ([evidence](https://penpot.app/)) | partial ([evidence](https://penpot.app/)) |
| Mobbin — `mobbin` | inference ([evidence](https://mobbin.com/)) | inference ([evidence](https://mobbin.com/)) | partial ([evidence](https://mobbin.com/)) | documented ([evidence](https://mobbin.com/)) |
| 21st.dev — `21st` | documented ([evidence](https://www.npmjs.com/package/%4021st-dev/cli)) | documented ([evidence](https://www.npmjs.com/package/%4021st-dev/cli)) | partial ([evidence](https://www.npmjs.com/package/%4021st-dev/cli)) | documented ([evidence](https://www.npmjs.com/package/%4021st-dev/cli)) |
| Supernova — `supernova` | documented ([evidence](https://www.supernova.io/)) | documented ([evidence](https://www.supernova.io/)) | partial ([evidence](https://www.supernova.io/)) | partial ([evidence](https://www.supernova.io/)) |
| Knapsack — `knapsack` | documented ([evidence](https://docs.knapsack.cloud/)) | documented ([evidence](https://docs.knapsack.cloud/)) | partial ([evidence](https://docs.knapsack.cloud/)) | documented ([evidence](https://docs.knapsack.cloud/)) |
| zeroheight — `zeroheight` | documented ([evidence](https://zeroheight.com/integrations/)) | documented ([evidence](https://zeroheight.com/integrations/)) | partial ([evidence](https://zeroheight.com/integrations/)) | documented ([evidence](https://zeroheight.com/integrations/)) |
| Tokens Studio — `tokens-studio` | documented ([evidence](https://tokens.studio/)) | partial ([evidence](https://tokens.studio/)) | not found ([evidence](https://tokens.studio/)) | not found ([evidence](https://tokens.studio/)) |
| Specify — `specify` | documented ([evidence](https://specifyapp.com/)) | partial ([evidence](https://specifyapp.com/)) | not found ([evidence](https://specifyapp.com/)) | not found ([evidence](https://specifyapp.com/)) |
| Storybook — `storybook` | inference ([evidence](https://storybook.js.org/)) | documented ([evidence](https://storybook.js.org/)) | documented ([evidence](https://storybook.js.org/)) | documented ([evidence](https://storybook.js.org/)) |
| tweakcn — `tweakcn` | documented ([evidence](https://tweakcn.com/)) | not found ([evidence](https://github.com/jnsahaj/tweakcn)) | not found ([evidence](https://github.com/jnsahaj/tweakcn)) | partial ([evidence](https://tweakcn.com/)) |
| shadcn/create — `shadcn-create` | documented ([evidence](https://ui.shadcn.com/docs/changelog/2025-12-shadcn-create)) | documented ([evidence](https://ui.shadcn.com/docs/changelog/2025-12-shadcn-create)) | documented ([evidence](https://ui.shadcn.com/docs/changelog/2025-12-shadcn-create)) | documented ([evidence](https://ui.shadcn.com/docs/registry/examples)) |
| Shadcn Studio — `shadcn-studio` | documented ([evidence](https://shadcnstudio.com/docs/getting-started/theme-generator)) | partial ([evidence](https://shadcnstudio.com/pricing)) | partial ([evidence](https://shadcnstudio.com/pricing)) | documented ([evidence](https://shadcnstudio.com/pricing)) |
| Realtime Colors — `realtime-colors` | documented ([evidence](https://www.realtimecolors.com/)) | not found ([evidence](https://www.realtimecolors.com/)) | not found ([evidence](https://www.realtimecolors.com/)) | documented ([evidence](https://www.realtimecolors.com/)) |
| Radix Themes — `radix-themes` | documented ([evidence](https://www.radix-ui.com/themes/docs/theme/overview)) | documented ([evidence](https://www.radix-ui.com/themes/docs/theme/overview)) | partial ([evidence](https://www.radix-ui.com/themes/docs/theme/overview)) | documented ([evidence](https://www.radix-ui.com/themes/docs/theme/overview)) |
| Untitled UI — `untitled-ui` | documented ([evidence](https://www.untitledui.com/react)) | documented ([evidence](https://www.untitledui.com/react)) | partial ([evidence](https://www.untitledui.com/react)) | documented ([evidence](https://www.untitledui.com/react)) |
| Dribbble — `dribbble` | partial ([evidence](https://dribbble.com/pro)) | inference ([evidence](https://dribbble.com/pro)) | partial ([evidence](https://dribbble.com/pro)) | inference ([evidence](https://dribbble.com/pro)) |
| Godly (redirects to Recent) — `godly` | partial ([evidence](https://recent.design/?ref=godly)) | partial ([evidence](https://recent.design/?ref=godly)) | not found ([evidence](https://recent.design/?ref=godly)) | documented ([evidence](https://recent.design/?ref=godly)) |
| Refero — `refero` | inference ([evidence](https://refero.design/mcp)) | partial ([evidence](https://refero.design/mcp)) | partial ([evidence](https://refero.design/mcp)) | documented ([evidence](https://refero.design/mcp)) |
| Awwwards — `awwwards` | partial ([evidence](https://www.awwwards.com/)) | inference ([evidence](https://www.awwwards.com/)) | partial ([evidence](https://www.awwwards.com/inspiration/pricing-system-one)) | documented ([evidence](https://www.awwwards.com/)) |

## Material caveats and open questions

- **Figma:** distinguish Design Code Layers from Sites Code Layers, launch rollout from availability, and native Make pushes from agent-assisted PR workflows. Weekly use by “most larger customers” was not confirmed. [Launch](https://www.figma.com/blog/code-on-the-figma-canvas/) / [Make push help](https://help.figma.com/hc/en-us/articles/35463818346647-Push-from-Figma-Make-to-GitHub), checked 2026-09-28.

- **Framer:** official export pages disagree. Treat portable site export as unresolved until tested on the relevant plan. [Porting](https://www.framer.com/help/articles/porting-your-data-from-framer/) / [self-hosting help](https://www.framer.com/ja/help/articles/can-i-export-my-website-to-html-and-self-host-it/), checked 2026-09-28.

- **Subframe:** use the current canonical homepage for the macOS/source workflow and price; older export docs describe React/Tailwind CLI/copy workflows. [Current](https://www.subframe.com/) / [older export docs](https://help.subframe.com/en/articles/9407221-exporting-code-from-page-designs), checked 2026-09-28.

- **Noon:** detailed technical support, repo mechanics, pricing and execution are not found in the public early-access material. [Public page](https://noon.design/), checked 2026-09-28.

- **Godly:** direct HTTP reading of [godly.website](https://godly.website/) redirected to [Recent](https://recent.design/?ref=godly). A similarly named godly.design site was not treated as the same product. Checked 2026-09-28.

- **Pricing gaps:** Read-only public browser inspection resolved the initially empty tweakcn/21st.dev/Lovable pricing pages. Several other products quote custom prices or retain explicit gaps. Mobbin returned a JPY locale. See the dated pricing sources in each JSON record.

- **Owner decisions:** prioritize system creation versus existing-system governance; choose the first frameworks for conformance; define which local edits regeneration must preserve; decide whether publishing must preserve an approved system version. These decisions can change the closest-competitor ranking.

## Data and reproducibility

- [observations.mjs](observations.mjs): curated field-level facts, statuses and dated URLs.
- [review.mjs](review.mjs): exact brief quotes and editorial assessments.
- [build.mjs](build.mjs): dependency-free schema/coverage checks and deterministic output generation.
- [tools.json](tools.json): complete machine-readable tool records.
- [README.md](README.md): generated interpretation, comparison and research handoff.

```sh
node docs/research/landscape/build.mjs
node docs/research/landscape/build.mjs --check
git diff --check
```

`--check` regenerates in memory and fails if either checked-in output differs. The generator performs no network requests; re-running it does not refresh source checks. Update the observations and checked dates after new research.

Current generated counts: 34 tools; 14 required fields each; 476 tool-field cells; 6 additional Figma feature cells; 482 dated claims; 131 distinct tool-source URLs. These counts are derived from the same records as tools.json.

### Verification and DONE

- [x] Every named tool is covered; additional shadcn editors and an additional inspiration site are included.
- [x] Every required field is filled or explicitly says “not found”; every claim has dated URLs, including the searched pages for gaps.
- [x] All Figma subfeatures are separately identified.
- [x] All nine Differentiation rows are assessed; exact brief lines are quoted for corrections.
- [x] Three closest competitors are selected with sourced reasons and limits.
- [x] `npm ci` and `npm run build` succeeded in the isolated worktree before research writing.
- [x] Scope is restricted to this output folder; no CSS or brief edits.
- [x] Deterministic regeneration and JSON/README count agreement are enforced by the build/check command.

Commit/push/PR identity is reported in the task’s final handoff; no merge is authorized.


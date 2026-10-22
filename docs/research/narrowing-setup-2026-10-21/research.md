# Narrowing setup: choosing many settings simply, 2026-10-21

For the Theme tab's Setup. The owner: "rather than asking simply straight up, choose your corner radius and then
presenting 8 different values with little context, i want the entire process to be about narrowing down different
options ... presenting a few simple options at first. round, sharp, or regular? then showing a few options from that
choice, then reaffirming the choice by comparing it to other options from before ... the choices that are constantly
made inform the next question, and you can see your design system being built in real time", with Lemonade's
onboarding as the reference (goodux.appcues.com/blog/lemonade-user-onboarding).

Builds on `onboarding-setup-2026-10-21.md` (the current Setup: a stage, a panel of choice cards per category, a
Stepper rail). That work is uncommitted in the `electron-app-reload-verify-893bea` worktree at the time of writing.

This folder:

- `research.md` (this file): what the reference products do and what the research says.
- `plan.md`: the flow for every setting, its rules and the contract with the Setup's layout. Start there to build.
- `visible-steps.md`: which steps of each colour, stroke, fill and shadow setting can be told apart, measured from
  the built CSS by `measure-steps.mjs`.
- `corner-pairs.html`: the radius judgement sheet, published at
  https://claude.ai/artifact/CboQUWnjuVqkYgVUAAwxi8, with answers in its database.
- `prototype.html`: the clickable prototype (Shape, Size, Depth and Colour on a stand-in stage, Area's real radius
  formula and values), also published at https://claude.ai/artifact/V9zWEnPKdvQJmE68BGTNHk. Open it in a browser;
  it needs nothing else.

The owner is designing the Setup's visuals and layout in another session (2026-10-21). This research and plan cover
the flow (what is asked, in what order, with which options) and stay independent of that layout.

## Sources

Two research passes, 2026-10-21. Product mechanics come mostly from third-party teardowns; none of the products were
opened live. Papers marked "read" were read in full; the rest from abstracts or summaries.

**Products.** Lemonade (Appcues teardown 2017; destroytoday.com; Heyflow and Prototypr snippets). Typeform help centre.
Stitch Fix engineering blog (2016, style sphere). Duolingo (Appcues; uxdesign.cc; Duolingo blog on the placement test).
Headspace (Appcues). Spotify newsroom (taste onboarding). Squarespace Blueprint (Squarespace blog and three reviews).
Wix ADI and Wix AI builder (reviews). Material Theme Builder codelab. Radix Themes docs. shadcn create changelog
(2025-12). tweakcn (GitHub). Realtime Colors docs. Khroma, Huemint, Coolors, Framer AI, Canva Brand Kit. Apple's Mac
build flow (2026-01, search summaries only). Smashing Magazine, "Designing a perfect responsive configurator" (2018).

**Research.** Koyama et al. 2017, Sequential Line Search (read). Koyama, Sato & Goto 2020, Sequential Gallery (read).
Brochu, Brochu & de Freitas 2010, Bayesian interactive optimisation for animation design (read). Chernev, Böckenholt &
Goodman 2015 and Scheibehenne et al. 2010 (choice-overload meta-analyses). Cowan 2001 (about 4 chunks). NN/g,
progressive disclosure. Tversky 1972, elimination by aspects. Sawtooth ACBC docs. University of Iowa EyeRounds,
subjective refraction. Levitt 1971 (staircases). Hsee 1996 (joint vs separate evaluation). Rensink et al. 1997
(change blindness). Simonson & Tversky 1992 (compromise effect). Gilbert & Ebert 2002 (reversible decisions).
Jachimowicz et al. 2019 (defaults meta-analysis). Wilson & Schooler 1991. Lindgaard et al. 2006. Chan et al. 2022 and
Koyama & Goto 2022 (agency with optimiser-led tools).

## What the references do

- **Lemonade.** One question per screen, asked by one persona; tappable chips; each question builds on the last
  answer; notices appear only when an answer makes them relevant (roommates); no progress bar, because the flow
  branches; a short "crunching" moment, then the result front and centre with a small report of what was decided.
- **Squarespace Blueprint**, the closest product to the request. Name, then a *personality* (seven, each one line),
  then sections, pages, palette and font pairing. The personality filters the palettes and fonts offered next, but
  other personalities' options stay browsable. Picking a palette re-renders the homepage preview at once. Custom values
  only come after, in the editor.
- **shadcn create.** Five named styles, each one line ("boxy and sharp", "soft and rounded, with generous spacing"),
  then colour, icons and fonts separately. A character first, values after.
- **Radix Themes.** Five named radius steps rather than numbers; the accent picks a matching grey unless overridden
  (one choice informs another); ThemePanel previews live in the real app.
- **Stitch Fix.** Rate concrete outfits (24, yes or no, shuffled) and infer the abstract dimension (tailored vs
  relaxed). A 2-column grid beat one-up cards: "felt faster and easier".
- **Duolingo.** A self-assessed level branches: beginners skip the placement test; the test itself is adaptive,
  re-estimating after every answer.
- **Configurators (Smashing).** The preview takes 45–75% of the space; every step has a sensible default and none
  forces a choice ("half-full"); every Next has a Previous; a summary lists all changes; avoid abstract tier names.
  Apple's Mac flow opens each section after the one it depends on (size, then colour, then chip).
- **Memoji.** Seventeen skin swatches, then a slider on the chosen one: coarse then fine on one screen.

## What the research says

- **How many options.** Overload is not about count alone. It appears with uncertain preferences, hard comparisons
  and a wish to spend little effort (Chernev 2015), which is exactly a person choosing a radius for a new system.
  Working memory holds about 4 (Cowan). Fine visual comparisons worked best at 3–5 per screen: Brochu's 4-up gallery
  had the lowest error (0.22 against 0.36 for pairs), and Koyama 2020 dropped from 5×5 to 3×3 cells when detail had to
  be seen. → **Three per screen; four where the setting has four natural members (a colour family).**
- **Coarse to fine.** Elimination by aspects (Tversky) is how people already narrow: discard whole regions, then
  choose. NN/g: two levels of disclosure work, more than two "often have low usability". → **Direction, then values.
  No third level of narrowing.**
- **Re-centre and let the edges extend.** Sequential Gallery zooms in on the chosen cell, and an edge pick
  extrapolates past the edge, so nobody is trapped by the first range. Staircases shrink the step after each reversal.
  → **The check step adds the next value past the range shown when the pick sits at its edge.**
- **The eye test.** Start from an objective estimate (Area's measured default); compare two views at a time; "no
  difference" is an accepted answer and an endpoint; prefer the least correction that gives the best result; re-check
  coupled values after a large change; finish by comparing against the current glasses. → **"They look alike" keeps
  the value nearest the default. Coupled settings are re-checked. The review compares with Area's defaults.**
- **Compare side by side, flip instantly.** Small differences only register side by side (Hsee); a blank or fade
  between two views hides even large changes (Rensink). → **Hover previews and hold-to-compare switch with no
  transition. Only a landed pick animates.**
- **Show it in context, at true scale.** People judge appearance whole and fast (Lindgaard: 50 ms ratings track 500 ms
  ones). → **Every option's picture is drawn over the picks so far, and the stage shows the whole system.**
- **Ask which looks right, never why** (Wilson & Schooler: analysing reasons made choices worse).
- **Defaults pull** (Jachimowicz: d = 0.68, through endorsement and endowment) and **the middle option wins by being
  in the middle** (Simonson & Tversky). Area's defaults are measured, so the middle direction is the default and it is
  marked; this is a deliberate nudge, not a neutral one.
- **Commit at the end.** People who could change a choice later liked it less (Gilbert & Ebert). → **End on "Use this
  system", not "you can always change this"**; the Inspector still changes anything, as an ordinary setting.
- **Keep experts in control.** Experts asked for direct parameter control in every gallery study; optimiser-led tools
  lowered agency (Chan 2022). → **An exact row of every value under the fine and check steps.**
- **Length.** People were satisfied after about 4–7 picks per dimension (Koyama 2017, 2020; Brochu). Three screens per
  setting is the ceiling.

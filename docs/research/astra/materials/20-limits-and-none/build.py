"""Generate task-20 research from immutable git sources; --check is read-only."""
from pathlib import Path
import hashlib,json,re,subprocess,sys
H=Path(__file__).resolve().parent;ROOT=next(p for p in H.parents if (p/'.git').exists())
AREA='d455567e5b264a768f42dc853476f1622ed6dd9f';RESEARCH='dbd57a9067e3d927b2bfb7a061db074eeaf48db9'
cache={};pins=[]
def source(file,sha=AREA):
 if (sha,file) not in cache:cache[sha,file]=subprocess.check_output(['git','show',sha+':'+file],cwd=ROOT,text=True)
 return cache[sha,file]
def cite(file,lo,hi=None,sha=AREA):
 hi=hi or lo;assert 1<=lo<=hi<=len(source(file,sha).splitlines()),(file,lo,hi)
 pins.append(dict(commit=sha,file=file,line=lo,end=hi))
 return f'[{file}:{lo}–{hi}](https://github.com/ethanwongwork/area/blob/{sha}/{file}#L{lo}-L{hi})'
def review(lo,hi):return cite('docs/research/astra/materials/REVIEW.md',lo,hi,RESEARCH)
def emit(name,value):
 text=value if isinstance(value,str) else json.dumps(value,indent=2,ensure_ascii=False)+'\n'
 assert len(text.encode())<1_000_000,name
 if '--check' in sys.argv:assert (H/name).read_text()==text,name
 else:(H/name).write_text(text)
C='docs/CONTRAST.md';T='packages/tokens/src/contrast/';R='packages/react/tests/';S='packages/styles/src/';E='packages/tokens/src/emit/'
rows=[]
def limit(title,rule,enforcement,gap,refs):
 rows.append(dict(id=f'H{len(rows)+1:02}',title=title,rule=rule,enforcement_today=enforcement,missing_test=gap,evidence=refs))
limit('Normal text contrast, including its real ground',
 'Labels, placeholders, code and normal text retain at least 4.5:1 on composed paint in every applicable state. Hover is not a large-text exemption. Keep existing assertion-specific thresholds and no rounding allowance.',
 'Token gate measures declared opaque pairs across shipped theme/neutral/accent combinations; it explicitly rejects alpha tokens. Syntax and solid-hover pairings are enumerated.',
 'Production material compositor gate: alpha + every gradient interior + allowed scene colors/spatial positions, nested paint and actual text pixels/grounds. Token-only success cannot certify glass.',
 [cite(C,7,17),cite(T+'assertions.ts',69,79),cite(T+'assertions.ts',102,127),cite(T+'contrast.test.ts',21,63)])
limit('Retain supplementary dark APCA floors',
 'Preserve the existing per-pair dark APCA floor in addition to WCAG: body-copy pairs use Lc 75 and content/placeholder/syntax pairs Lc 60 where those constants are assigned. APCA is supplementary Area policy, not WCAG certification.',
 'Dark-only APCA assertions are executed for each declared token pair; constants and assignments are explicit.',
 'Apply those same pair-specific floors to resolved material grounds. Do not claim every glyph or line needs the text APCA floor.',
 [cite(C,9,11),cite(T+'contrast.test.ts',66,89),cite('packages/tokens/src/color/contrast.ts',68,94),cite(T+'assertions.ts',74,78)])
limit('Required edges remain independent of decorative strokes',
 'Required control/state boundaries must remain discernible; strong/increased-contrast endpoints retain 3:1. Turning off a material rim or Surface border must not remove required stroke-width paint. Decorative 1.1/1.2/1.3 design floors are not substitutes.',
 'Token strong-state assertions and compiled-CSS cohesion checks protect roles and required-line ownership. Standard soft presentation has acknowledged shortfalls: this is not evidence that every current boundary passes 3:1.',
 'Rendered required-edge checks against both adjacent grounds for each material/state; D7 failing glass edges must use opaque fallback. Do not waive existing soft failures or call identity conformance.',
 [cite(C,13,32),cite(T+'assertions.ts',152,176),cite(T+'assertions.ts',206,228),cite(R+'cohesion.test.mjs',101,132),review(136,140)])
limit('Focus survives decoration and simultaneous states',
 'Keep a visible keyboard focus replacement, independent of cast depth; preserve field edge/halo policy, invalid context and selection simultaneously. Test the painted opaque edge, not the source color of a translucent halo. List focus can be a row plate, with forced-colors ring fallback.',
 'Focus token pair assertions exist; CSS restores Menu focus in forced colors. Cohesion checks the normal row highlight plate, not its rendered contrast.',
 'Real keyboard traversal with focused+selected, focused+invalid, clipping, top-layer and glass/glow backgrounds; pixel/contrast tests for the actual outline and both sides. Static CSS assertions do not prove visibility.',
 [cite(C,48,57),cite(T+'assertions.ts',170,176),cite(S+'forced-colors.css',10,14),cite(R+'cohesion.test.mjs',25,44)])
limit('Foreground stays fixed on hover',
 'Material hover may alter backing, highlight, edge or depth, but must not change foreground ink or fade the content as a workaround. A genuinely revealed control is distinct from dimming an existing label.',
 'The compiled-CSS lexical check rejects hover/highlight color/opacity changes except documented inheritance/system-color/reveal cases.',
 'Computed color, fill, stroke, opacity and ancestor filter checks through actual hover, including aliases and Material gate selectors. A lexical color check does not catch parent filters or variable rewrites.',
 [cite(C,39,42),cite(R+'cohesion.test.mjs',11,23)])
limit('Semantic meaning and required state paint are retained',
 'Action/selection and tone continue to own semantic backing/ink. Selected, checked, invalid, progress and literal color data remain truthful; meaningful marks have positioned geometry and non-color/native/ARIA cues. Required plate/mark paint is not scaled by decorative strength.',
 'Action-versus-selection CSS tests, row selection precedence and markup assertions for checked/disabled/loading exist.',
 'All materials × role/state integration tests including quantitative fill extents, simultaneous states, contrast and screen-reader output. Material-specific masking must not erase a mark.',
 [cite(C,61,68),cite(R+'tone.test.mjs',41,48),cite(R+'cohesion.test.mjs',25,44),cite(R+'audit-rules.test.mjs',30,48)])
limit('Behavior, naming and targets survive optical layers',
 'Keep native props, accessible names, focus order, keyboard/pointer operation, hit targets and overlay relationships. Decorative overlays must not intercept events, obscure required content, alter scroll or break portal positioning.',
 'Existing component tests cover representative ARIA markup and overlay positioning. Theme defines a complete React attribute boundary, including portals.',
 'Material-on versus baseline real-event and accessibility-tree comparisons, RTL/touch/zoom, screen-reader and native forced-colors execution. SSR tests are partial enforcement.',
 [cite('AGENTS.md',40,49),cite(R+'overlay.test.mjs',11,43),cite(R+'overlay.test.mjs',46,63),cite('packages/react/src/components/Theme.tsx',19,32),cite('docs/DEVELOPMENT.md',142,147)])
limit('Disabled, read-only and loading remain distinct',
 'Do not double-apply disabled opacity or fade an already disabled group again. Preserve fields that use disabled color rather than group opacity; loading keeps its existing focus/Stop semantics.',
 'Cohesion protects disabled field paint; audit tests protect native-disabled versus loading and read-only field paint.',
 'Composed alpha checks on disabled parent+child+material, and state interaction tests for every role. Disabled exemptions do not authorize invisible required context.',
 [cite(R+'cohesion.test.mjs',70,80),cite(R+'audit-rules.test.mjs',37,59),cite(R+'audit-rules.test.mjs',121,125),cite(T+'assertions.ts',190,192)])
limit('Contrast preferences and local scopes keep working',
 'Honor increased contrast, explicit local standard reset and root OS preference rules. Re-derive colors at each axis/preference boundary; nested Material must not bake parent contrast or theme into a child.',
 'Emitter tests assert contrast preference selectors and re-emission, plus non-registration of derived edge/fill/token colors.',
 'Actual nested Material × contrast × light/dark tests including portals, mode flips and raw DOM scopes. Extend rather than replace current emitter tests.',
 [cite(C,33,38),cite(E+'colors.test.ts',39,55),cite(E+'css.ts',166,184)])
limit('Unknown backdrops require composition and a safe fallback',
 'D7: floating shells assume any backdrop; required edges that fail use an opaque fallback. Test all allowed backdrop colors/positions and gradient interiors, not only black/white endpoints. A bounded gray ramp is not the whole RGB/image domain.',
 'Binding owner rule; current production token gate explicitly cannot composite alpha. Task 18 is a research prototype on old seeds, not a shipping material test.',
 'Production worst-case sampler matched to interpolation/color space, image/spatial adversaries and fallback validation on real receivers. For unbounded or unproved scenes, resolve to the opaque safety path rather than infer a pass from samples.',
 [review(136,140),cite(T+'contrast.test.ts',21,29),cite(C,73,79)])
limit('Transparency reduction is both app-level and OS-driven',
 'D7 requires an app-level setting beside the OS query. Reduction disables material acquisition/transmission and supplies an opaque readable ground while retaining semantic state and focus. An unavailable query is not evidence the user permits transparency.',
 'Owner rule only for the new material layer. The source search below finds no production prefers-reduced-transparency hook or Material setting.',
 'Preference resolution, app override plus OS reduction, unsupported-query engines, nested scopes, portals, and no-alpha/no-backdrop-filter assertions under reduction. API naming and precedence details belong to the later design/safety tasks.',
 [review(136,140),cite(C,76,79)])
limit('Forced colors supplies opaque functional paint',
 'D7: explicitly opaque Canvas and backdrop-filter:none, including the prefixed path where used; remove material gradient/grain/filter overlays and preserve system focus, marks, selection and invalid indication. A broad forced-color-adjust:none is not a fallback.',
 'Current forced-colors stylesheet supplies system edges, outlines, native Select arrow, marks and selected rows. It does not supply a general material opacity/backdrop-filter reset.',
 'Native Windows forced-colors plus browser preference tests of every new optical layer: inspect alpha, pseudo-elements, filters and functional markers. Do not rely on automatic forced colors to remove background alpha or backdrop filtering.',
 [review(136,140),cite(S+'forced-colors.css',1,14),cite(S+'forced-colors.css',23,45),cite(S+'forced-colors.css',50,78),cite(S+'forced-colors.css',92,106),cite(C,65,68)])
limit('Motion preferences retain meaning without unnecessary motion',
 'OS reduced motion must override local motion scopes and stop decorative loops; loading/progress still communicates its state. Never delay focus for an animation. None also preserves current normal-motion behavior.',
 'Emitter re-emits motion-none for root and motion scopes under the media query; MOTION documents stopped loops and immediate keyboard focus.',
 'New material light/gloss/refraction/grain animation preference tests, interrupted transitions and settled geometry. Existing duration generation is not a test of every new animation.',
 [cite(E+'css.ts',186,193),cite('docs/MOTION.md',61,64),cite('docs/MOTION.md',85,97),cite(C,68,68)])
limit('No automatic decoration of glyphs or small text',
 'D13 prohibits automatic inherited glyph/small-text effects. Display text and button labels may explicitly opt in; duotone remains a separate later pilot. Opt-in does not relax contrast, geometry or foreground ownership.',
 'Owner rule, with current plain Field label/semantic ink CSS as baseline. No production opt-in Material gate is present.',
 'Automatic-host effect leakage tests, 12–16px legibility review and opt-in scope tests. A whole-parent filter also decorates descendants and must be detected.',
 [review(147,148),cite(S+'components/field.css',20,28),cite(S+'base.css',5,14)])
limit('Geometry, typography and ink belong to their existing axes',
 'D16: a material changes optical surface paint, not dimensions, layout, radius, stroke geometry, glyph drawings, type metrics or semantic foreground values. Separate geometry/type/ink settings may be bundled with material, but the bundle is not the Material axis. Required focus geometry survives.',
 'Owner rule; component contract/geometry CSS and manifest parity enforce baseline structures, not equivalence under an absent new axis.',
 'Material-on/off computed rects, box model, font metrics, wrapping, SVG geometry, content ink, targets and overflow comparisons. Additional optical extents may change; use them without changing layout or hiding content.',
 [review(153,154),cite('AGENTS.md',40,54),cite('docs/DEVELOPMENT.md',10,16),cite(S+'components/surface.css',93,110)])
limit('Disjoint token ownership, local derivation and canonical colors',
 'Keep axis namespaces disjoint and palette values verbatim. Derive interactions in base and re-emit at boundaries; never register derived/paired semantic colors. D2 requires Material beside Surface and inherited recipe gates, with pixel-identical Surface decomposition first.',
 'Registry tests catch duplicate ownership/namespace errors; color tests protect polarity, paired registrations and selected derived outputs. D2 migration itself has not shipped.',
 'New Material namespace/gate/reset tests and emitter-wide single-writer checks, full derived-color registration coverage and None identity tests through the Surface migration.',
 [cite('AGENTS.md',48,54),cite('packages/tokens/src/axes/registry.test.ts',42,75),cite(E+'colors.test.ts',15,33),cite(E+'colors.test.ts',39,46),review(124,127)])
limit('Decorative colors derive from the theme',
 'D5: derive decorative colors from accent, neutral and tones rather than hardcoded preset hex palettes; do not recolor semantic data or change foreground ink.',
 'Owner rule; current Action/Selection tests enforce representative semantic consumers, not every future gradient stop.',
 'Recipe-schema/source validation forbidding literal decorative palettes plus accent/neutral/tonal switching tests across all material outputs.',
 [review(133,133),cite(R+'tone.test.mjs',41,48)])
limit('Near-black page stays within an explicitly bounded distance',
 'D10 permits page tint/texture only within a fixed distance of neutral 975 / #020202. This is a constraint requiring calibration, not permission for an arbitrary dark material background.',
 'Owner rule; base body consumes bg-page. No agreed distance metric or numeric bound is present in the review.',
 'Owner/calibration definition of the bound, then resolved-page pixel/color checks at control extremes and texture peaks. Do not invent a Delta-E or alpha threshold in this task.',
 [review(144,144),cite(S+'base.css',5,14)])
limit('Inner rims obey the radius floor',
 'D11 applies the radius floor to inner rims at every setting except Sharp. D16 keeps the actual receiver shape from its geometry axis; Material may not square an inner rim by blindly clamping radius minus inset at zero.',
 'Owner rule; current Card radius and media radius explicitly use radius-floor.',
 'Every generated material rim × radius/density/size, including Sharp and pill, needs geometry tests; current Card CSS alone is not a global optical-rim proof.',
 [review(145,145),cite(S+'components/surface.css',79,85)])
limit('Cutout rings and fixed-color fades use real gaps',
 'D12 requires masks for cutout rings and fixed-color fades when adapting them to materials. A page-colored imitation cannot reveal the real host. Preserve separately necessary occlusion, focus and status marks. None must retain baseline pixels while this migration is introduced.',
 'Owner rule only for the general material-aware gap conversion; current required-stroke checks guard related lines, not actual alpha transmission.',
 'Arbitrary host/backdrop and nested None/material mask tests, including Card/Code fades and Avatar/Indicator/Presence gaps; verify both pixel identity on original plain grounds and truthful transmission on material hosts.',
 [review(146,146),cite(R+'cohesion.test.mjs',101,132)])
limit('Unsupported optics never remove the usable fallback',
 'D8 defines frost plus rim now and SVG refraction only as a later Chromium enhancement. Unsupported filter paths must still satisfy hard limits and D7 opaque fallback when contrast cannot be established.',
 'Binding review; production Material/refraction path not found in the surveyed package sources.',
 'Feature/path fallback tests in target engines, plus app-level reduction and forced colors. A generic backdrop-filter supports test is not proof of SVG URL displacement.',
 [review(136,142)])
limit('Validation is additive and claims match evidence',
 'Do not lower floors, add a waiver to hide a failure, discard inconvenient scenes or weaken existing checks. D14 measured performance rules need an owner-named 60Hz minimum device, not invented universal blur/lobe bans. Passing identity/builds never means owner approval.',
 'Contrast report exits nonzero on unwaived failures; exceptions list is empty. Negative contrast test proves a bad foreground fails. Review binds performance and approval remains owner-set.',
 'Material adversarial negative controls, image/AT/cross-engine coverage and the named-device benchmark. No justified universal performance cap is available yet.',
 [cite(C,40,44),cite(T+'exceptions.ts',21,22),cite(T+'contrast.test.ts',94,127),cite(T+'report.ts',90,92),review(149,150),cite('AGENTS.md',61,63)])
emit('hard-limits.json',dict(checked='2026-10-12',areaCommit=AREA,reviewCommit=RESEARCH,limits=rows))
md=['# Hard limits and enforcement','', 'These are the complete material-facing invariants extracted from the brief, CONTRAST, current implementation/tests and binding D1–D16. They do not claim an exhaustive accessibility certification of Area. “Today” means the pinned source, not a fresh full test run. Each record distinguishes a real check from a rule awaiting a material-specific test.','']
for x in rows:
 md += [f'## {x["id"]} — {x["title"]}','',x['rule'],'','**Enforcement today:** '+x['enforcement_today'],'','**Missing test / limit of enforcement:** '+x['missing_test'],'','**Evidence:** '+'; '.join(x['evidence'])+'.','']
emit('hard-limits.md','\n'.join(md))
# Record reproducible negative evidence, scoped to production packages (not prose or old research).
queries={
 'automatic-text-effects':r'text-shadow\s*:',
 'backdrop-acquisition':r'backdrop-filter\s*:',
 'transparency-query':r'prefers-reduced-transparency',
 'material-api':r'data-area-material|--area-material-|MATERIAL_AXIS',
}
files=subprocess.check_output(['git','ls-tree','-r','--name-only',AREA,'packages/styles/src','packages/tokens/src','packages/react/src'],cwd=ROOT,text=True).splitlines()
scans=[]
for key,pat in queries.items():
 matches=[]
 for f in files:
  if not f.endswith(('.css','.ts','.tsx')):continue
  for n,line in enumerate(source(f).splitlines(),1):
   if re.search(pat,line):matches.append(dict(file=f,line=n,text=line.strip()))
 scans.append(dict(id=key,pattern=pat,roots=['packages/styles/src','packages/tokens/src','packages/react/src'],matches=matches))
emit('source-search.json',dict(commit=AREA,checked='2026-10-12',searches=scans,meaning='No match is a bounded source observation, not a computed-style guarantee or future API implementation.'))
emit('source-pins.json',dict(areaCommit=AREA,reviewCommit=RESEARCH,pins=sorted({(p['commit'],p['file'],p['line'],p['end']):p for p in pins}.values(),key=lambda x:(x['commit'],x['file'],x['line'])),files=[dict(commit=sha,file=f,lines=len(s.splitlines()),sha256=hashlib.sha256(s.encode()).hexdigest()) for (sha,f),s in sorted(cache.items())]))
print(f'PASS: {len(rows)} hard-limit records, source bounds and deterministic outputs; '+', '.join(f'{x["id"]}={len(x["matches"])}' for x in scans))

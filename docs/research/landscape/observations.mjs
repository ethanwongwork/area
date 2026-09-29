// Curated public-source observations. Regenerate with node docs/research/landscape/build.mjs.
export const checked = '2026-09-28';
export const base = 'c585f8c5f38705a7efa79bf05148a8c6989b142a';
export const brief = {
  path: '.claude/worktrees/astra-6-usage-tasks-17a367/docs/BRIEF.md',
  sha256: '3bd0d87904420da7aa4bee52093206737f7bb4b822539dc1fc323d984f1ac1af',
  checked, note: 'Read-only fallback supplied by owner; absent from starting main. This working-file snapshot is not claimed to be at the Area starting commit.'
};
export const fields = ['identity','github','foundations','inventory','structure','patterns','existingSystem','content','liveCode','publishing','frameworks','execution','pricing','funding'];
const c = (value, urls, status='documented') => ({status,value,sources:[urls].flat().map(url=>({url,checked}))});
const nf = (scope, urls) => c(`not found: ${scope}; searched the linked public pages. Absence of documentation is not proof of absence.`,urls,'not found');
const tools = [];
function add(id,name,urls,data){
  const x={id,name,fields:{}};
  for(const f of fields) x.fields[f]=data[f] ?? nf(f,urls);
  tools.push(x); return x;
}
{
const h='https://www.figma.com/blog/code-on-the-figma-canvas/',g='https://help.figma.com/hc/en-us/articles/35463818346647-Push-from-Figma-Make-to-GitHub',d='https://developers.figma.com/docs/code-connect/',m='https://developers.figma.com/docs/figma-mcp-server/',p='https://www.figma.com/pricing/',s='https://www.figma.com/blog/config-2026-recap/';
const t=add('figma','Figma',h,{
identity:c('Design, prototyping, code generation and developer handoff suite for product teams.',h),
github:c('Make creates a repository and pushes generated app changes. Native PR mechanics are not confirmed by this help page; broader “prompt to PR” marketing also involves agents.',[g,'https://www.figma.com/build-ship/'],'partial'),
foundations:c('Design variables/styles and reusable team Skills; Code Connect maps implementations to design components.',[s,d]),
inventory:c('Reusable design libraries and linked code components; Code Layers can place real code on the canvas.',[h,d]),
structure:c('Editable design anatomy; Code Layers add live code alongside native layers. These are distinct representations.',h),
patterns:c('Make builds interactive app prototypes; Code Layers support code-backed canvas exploration.',[h,g]),
existingSystem:c('Code Connect and MCP expose existing component implementations and design context; repository import is advertised for code workflows.',[d,m,h]),
content:c('Design libraries plus reusable code layers; maturity and availability vary by product.',h),
liveCode:c('Code Layers and Make run code. Ordinary design components remain native Figma objects.',h),
publishing:c('Make supports app sharing/publishing and GitHub delivery; Dev Mode has ready-for-dev/completed statuses.',[g,'https://help.figma.com/hc/en-us/articles/23918228264855-Dev-Mode-ready-for-dev-view']),
frameworks:c('Code Connect integrations include React/React Native, HTML-based frameworks, SwiftUI and Jetpack Compose. Mapping support is not multi-framework app generation.',d),
execution:c('Cloud design/Make services; MCP has remote and desktop connection options.',m),
pricing:c('Free Starter; Professional Full seat displayed at $16/month. Billing-toggle basis not confirmed in extracted page; seat type and AI allowances matter.',p,'partial'),
funding:c('Public company: IPO announced July 2025. This is corporate financing, not funding for an individual feature.','https://investor.figma.com/news-events/news/news-details/2025/Figma-Announces-Pricing-of-Initial-Public-Offering/default.aspx')
});
t.features={
Make:c('Prompted app creation, production-code workflows and repository push. Import/sync behavior differs across older help and newer launch material.',[g,'https://www.figma.com/blog/workflow-lab-deploying-designs-directly-with-figma-make/'],'partial'),
'Code Layers':c('Figma Design announcement introduces live code and GitHub/local-folder import; Sites also has a separately documented Code Layers feature. Announcement rollout is not proof every account has access.',[h,'https://help.figma.com/hc/en-us/articles/32641332638999-Add-a-code-layer-to-a-site'],'vendor claim'),
Skills:c('Reusable agent workflows and team conventions announced at Config 2026.',s),
'Code Connect':c('Maps Figma components to production implementations; provides code examples/context.',d),
'Dev Mode':c('Inspection and handoff with explicit ready-for-dev and completed states. These do not establish that code was merged.','https://help.figma.com/hc/en-us/articles/23918228264855-Dev-Mode-ready-for-dev-view'),
MCP:c('Remote/desktop context for agents; remote server can also write native canvas content.',[m,'https://developers.figma.com/docs/figma-mcp-server/write-to-canvas/'])
};
}
{
const h='https://support.claude.com/en/articles/14604416-get-started-with-claude-design',d='https://support.claude.com/en/articles/14604397-set-up-your-design-system-in-claude-design';
add('claude-design','Claude Design',[h,d],{
identity:c('Beta design creation workspace for prototypes, presentations and other visual artifacts; available on paid Claude plans.',h),
github:c('Imports a system from a repository through /design-sync; hands designs to Claude Code via /design. Native Design PR/direct-push behavior: not found.',h,'partial'),
foundations:c('Reusable brand fonts, colors and system rules, extracted from code or supplied references.',d),
inventory:c('Reusable system components; organizations can keep multiple systems.',d),
structure:c('Components and layouts can be generated/edited; a guarded anatomy-option schema is not documented.',d,'partial'),
patterns:c('Generate prototypes and presentations using the selected organization system.',h),
existingSystem:c('Imports existing code assets and updates reusable design-system context.',d),
content:c('Organization systems and generated artifacts; not evidence of a public, universally re-themed component catalog.',[d,h]),
liveCode:c('Interactive prototypes execute in sandboxed artifacts; PDF/PPTX exports are different output types.',h),
publishing:c('Shared links with viewing/commenting/editing; exports include HTML/ZIP/PDF/PPTX and Claude Code handoff.',h),
frameworks:c('React codebase design-sync workflow documented; general guaranteed framework-output matrix: not found.',d,'partial'),
execution:c('Cloud artifact sandbox plus local or web Claude Code handoff.',[h,'https://support.claude.com/en/articles/14604406-claude-design-admin-guide-for-team-and-enterprise-plans']),
pricing:c('Included subject to usage allowances on eligible paid plans. Claude Pro $20/month monthly or $200/year; current help describes shared Claude usage.',[h,'https://claude.com/pricing']),
funding:c('Parent Anthropic announced $65B Series H on May 28, 2026; not a Claude Design-specific round.','https://www.anthropic.com/news/series-h')
});
}
{
const h='https://v0.app/docs/design-systems-2',g='https://v0.app/docs/github';
add('v0','v0',[h,g],{
identity:c('AI app/UI builder with reusable team design-system context.',h),
github:c('Imports existing repos; automatically commits/pushes a working branch. Publish creates/reuses a PR and merges subject to protection rules. Artifacts: application source, including UI.',g),
foundations:c('Imports tokens and conventions from repository, Figma, Storybook or attachments into reusable system skills.',h),
inventory:c('Reuses imported components; validates system context through a starter app.',h),
structure:c('Edits generated application/component source; fixed validated structural option coverage: not found.',h,'partial'),
patterns:c('Generates apps under a saved personal/team system.',h),
existingSystem:c('Explicit repository/system import and persistent team reuse.',[h,g]),
content:c('Imported systems and generated starter applications.',h),
liveCode:c('Source-backed app previews and CI checks before publishing.',g),
publishing:c('Preview and GitHub PR publishing; Vercel deployment workflow.',g),
frameworks:c('Framework-specific guarantees: not found in the system/GitHub pages examined. Do not infer universal support from arbitrary repo import.',[h,g],'not found'),
execution:c('Cloud app-generation and preview service; repository code remains available to local development.',g),
pricing:c('Free tier; Plus displayed $30/user/month with a promotional crossed-out price; Business $100/user/month; Enterprise custom. Promotion duration not confirmed.','https://v0.app/pricing','partial'),
funding:c('Parent Vercel announced Series F at a $9.3B valuation in September 2025; not a v0-specific financing.','https://vercel.com/blog/series-f')
});
}
{
const d='https://docs.lovable.dev/features/design-systems',g='https://docs.lovable.dev/integrations/github';
add('lovable','Lovable',[d,g],{
identity:c('AI app builder with dedicated reusable design-system projects for teams.',d),
github:c('Full application source syncs both ways on the active branch. Design-system releases commit versioned system source/metadata; GitHub workflow includes branches and PRs.',[d,g]),
foundations:c('Tokens captured in .lovable/design-system.json and system rules.',d),
inventory:c('Extracts component props, variants and examples; releases reusable inventories.',d),
structure:c('Author/edit component implementations in the system project; schema captures their API. Universal guarded anatomy choices: not found.',d,'partial'),
patterns:c('Consumer projects build screens against an attached system.',d),
existingSystem:c('Imports repository/package systems. Consumer updates replace system-owned copied files and merge dependencies; this is not a promise to preserve manual edits inside those files.',d),
content:c('Private team systems with documented components and examples.',d),
liveCode:c('Consumers receive real component source; adherence scanning is a vendor capability, not an independently tested conformance guarantee.',d,'vendor claim'),
publishing:c('Versioned system releases and consumer update acceptance; app repository delivery.',[d,g]),
frameworks:c('Native React system path; Enterprise package integration. Do not assume arbitrary framework parity.',d),
execution:c('Cloud builder with GitHub source available for local development.',g),
pricing:c('Free; Pro $25/workspace/month and Business $50/workspace/month at the displayed 100-credit setting, monthly billing, unlimited users. Enterprise custom. Design systems are included in paid plans.',[d,'https://lovable.dev/pricing']),
funding:c('Announced $400M Series C at $13.3B valuation, August 12, 2026.','https://lovable.dev/blog/series-c')
});
}
{
const h='https://support.bolt.new/building/intro-bolt',g='https://support.bolt.new/integrations/git',d='https://bolt.new/blog/bolt-design-system-agents';
add('bolt','Bolt',[h,d],{
identity:c('AI website/web-app/mobile-app builder for developers and non-developers.',h),
github:c('Imports/creates full app repositories and automatically commits/syncs branch changes. PR merging takes place on GitHub, not inside Bolt.',g),
foundations:c('Design-system agents learn existing tokens and style standards.',d,'vendor claim'),
inventory:c('Agents reuse existing components rather than requiring only generated replacements.',d,'vendor claim'),
structure:c('General component-source editing; constrained anatomy configurator not found.',h,'partial'),
patterns:c('Generates complete app screens and flows.',h),
existingSystem:c('Design-system agent workflow explicitly targets existing systems.',d,'vendor claim'),
content:c('Generated apps and imported design-system assets.',[h,d]),
liveCode:c('Runnable application previews with source delivery.',[h,g]),
publishing:c('Application publishing plus GitHub branch workflow.',[h,g]),
frameworks:c('JavaScript web stacks and Expo mobile workflow.',h),
execution:c('Browser builder with managed services; fully offline execution not confirmed.',h,'partial'),
pricing:c('Free; Pro starts at $25/month billed monthly; token usage limits apply.','https://bolt.new/pricing'),
funding:c('Parent StackBlitz: reported $105.5M Series B, January 2025; not a Bolt-only round.','https://www.cbinsights.com/company/stackblitz/financials','reported')
});
}
{
const h='https://www.framer.com/help/articles/sharing-components/',p='https://www.framer.com/pricing',e='https://www.framer.com/help/articles/porting-your-data-from-framer/';
add('framer','Framer',[h,p],{
identity:c('Visual website builder and publishing platform for designers and web teams.',p),
github:nf('native GitHub source push/PR; code-component reuse does not establish repo synchronization',[h,e]),
foundations:c('Reusable styles within shared design/component libraries.',h),
inventory:c('Reusable components shared across projects.',h),
structure:c('Component variants and editable website layouts.',h),
patterns:c('Websites and templates assembled in the visual editor.',p),
existingSystem:c('Manages Framer component libraries; arbitrary existing application-repo management not confirmed.',h,'partial'),
content:c('Shared Framer components; code components can be distributed via import URLs.','https://www.framer.com/developers/component-sharing'),
liveCode:c('Published websites and code components run; not every canvas asset is portable application source.','https://www.framer.com/developers/component-sharing'),
publishing:c('Hosted sites/custom domains/staging. Official export pages conflict: porting guidance says HTML/CSS/JS download, while self-hosting help says no HTML export.',[p,e,'https://www.framer.com/ja/help/articles/can-i-export-my-website-to-html-and-self-host-it/'],'conflicting'),
frameworks:c('React code components inside Framer; framework-neutral whole-app export not established.','https://www.framer.com/developers/component-sharing','partial'),
execution:c('Cloud editor/publishing service.',p),
pricing:c('Free; Basic $10/month and Pro $30/month on yearly billing; Enterprise custom.',p),
funding:c('Announced $100M Series D at $2B valuation, August 2025.','https://www.framer.com/blog/series-d/')
});
}
{
const h='https://paper.design/',p='https://paper.design/pricing';
add('paper','Paper',h,{
identity:c('HTML/CSS design canvas for designers and coding agents.',h),
github:c('MCP agents can bridge design and repository code. Native GitHub push/PR mechanism: not found.',h,'partial'),
foundations:c('Tokens and style synchronization advertised.',h,'vendor claim'),
inventory:c('Reusable components and repository-aware agent workflows advertised.',h,'vendor claim'),
structure:c('HTML/CSS canvas editing exposes real layout structure.',h),
patterns:c('Compose screens and explorations on a code-based canvas.',h),
existingSystem:c('Agent-assisted token/style/component synchronization; merge ownership and release governance not confirmed.',h,'partial'),
content:c('Code-based designs, shader/media resources.',h),
liveCode:c('HTML/CSS canvas is live code; full imported application behavior is not guaranteed.',h,'partial'),
publishing:c('Shared collaborative design work and exports.',h),
frameworks:c('HTML/CSS native canvas; MCP-mediated output is agent-dependent.',h),
execution:c('Desktop and web surfaces; model/agent execution depends on connected services.',h),
pricing:c('Free; Pro $20/editor/month monthly or $16/editor/month annually; Organization custom.',p),
funding:c('Homepage announces $34M Series A with Accel and ICONIQ.',h)
});
}
{
const h='https://www.pen.dev/',d='https://docs.pencil.dev/design-and-code/design-to-code';
add('pencil','Pencil (pen.dev)',[h,d],{
identity:c('Design canvas integrated with desktop/code-editor workflows.',h),
github:c('Agents edit local source and .pen files, which can live in Git. Native GitHub PR/direct-push control: not found.',d,'partial'),
foundations:c('Variables for colors, spacing and typography; agent can sync CSS tokens on request.',[h,d]),
inventory:c('Reusable symbols, slots and component libraries.',h),
structure:c('Editable component/layout anatomy and slot composition.',h),
patterns:c('Screen design and agent-assisted implementation.',d),
existingSystem:c('Reads existing workspace code; token synchronization is requested, not automatic.',d),
content:c('Design libraries and built-in icons; .pen is a design document, separate from application source.',h),
liveCode:c('HTML import/export and code generation; do not equate all design nodes with running product components.',[h,d],'partial'),
publishing:c('Link sharing and design/code export.',h),
frameworks:c('Docs describe React, Next.js, Vue, Svelte and HTML agent targets; not deterministic cross-framework conformance.',d),
execution:c('Desktop/editor integration; connected AI agents may use cloud models.',[h,d]),
pricing:c('Currently free; bring-your-own agent subscriptions/keys may cost extra.',[h,'https://www.pen.dev/pricing']),
funding:c('Lists a16z speedrun backing; round amount not found.',h,'partial')
});
}
{
const h='https://www.subframe.com/',d='https://www.subframe.com/design-systems';
add('subframe','Subframe',[h,d],{
identity:c('Designer-focused macOS canvas, coding agent and browser for existing product code.',h),
github:c('Works on local source files, creates branches and PRs. Changes can include tokens, components and application pages.',h),
foundations:c('Imports and edits existing design tokens.',[h,d]),
inventory:c('Imports components and synchronizes props, slots and variants.',h),
structure:c('Canvas component/layout editing plus source changes.',h),
patterns:c('Builds product screens and prototypes with the system.',h),
existingSystem:c('Explicit import and ongoing reuse of production components/tokens.',h),
content:c('Built-in component library plus imported team components.',d),
liveCode:c('Edits code files and previews them in a browser.',h),
publishing:c('Share prototypes and make PRs; hosting a full production app remains a separate workflow.',h),
frameworks:c('Advertises web stacks, with React the best-supported experience.',h),
execution:c('Local macOS source/agent workflow with a cloud canvas.',h),
pricing:c('Canonical homepage: Free one-project plan; Pro $20/editor/month. Agent subscription or credits may be additional. Older indexed pages show different prices.',h,'partial'),
funding:nf('primary-source round amount or complete funding disclosure',[h,d])
});
}
{
const h='https://www.dessn.com/';
add('dessn','Dessn',h,{
identity:c('Production-code design exploration for designers, PMs and engineers.',h),
github:c('Explicitly read-only GitHub/GitLab access: does not modify or push repository code. Exports code for handoff or opening in Cursor.',h),
foundations:c('Learns and reuses the connected product’s styles/system.',h),
inventory:c('Works with existing components and routes.',h),
structure:c('Explores component/layout changes on the canvas.',h),
patterns:c('Flow canvas for alternative screens/states.',h),
existingSystem:c('Uses an existing system; authoritative system-source maintenance is handed off.',h),
content:c('The connected product’s components, screens and explorations.',h),
liveCode:c('Compiles existing product code into the design environment.',h),
publishing:c('Share/comment on explorations and export proposed code.',h),
frameworks:c('Lists React, Vue.js, Electron and React Native.',h),
execution:c('Remote repository compilation without local setup is advertised; full runtime architecture not found.',h,'partial'),
pricing:c('Free; Starter $39/user/month; Teams $139/user/month; Enterprise custom.','https://www.dessn.ai/pricing'),
funding:c('Reported $6M funding, May 12, 2026.','https://techcrunch.com/2026/05/12/dessn-raises-6m-for-its-production-focused-design-tool/','reported')
});
}
{
const h='https://www.onlook.com/';
add('onlook','Onlook',h,{
identity:c('Open-source visual editor for designers working on real application code.',h),
github:c('GitHub/local code delivery advertised; exact native PR versus direct-push behavior not found.',h,'partial'),
foundations:c('Visual style edits and existing-system import.',h),
inventory:c('Uses existing components, including shadcn/Storybook workflows.',h),
structure:c('Visual layout and component-source editing.',h),
patterns:c('Build and edit application screens.',h),
existingSystem:c('Imports existing application/system code.',h),
content:c('Team code and component previews.',h),
liveCode:c('Visual editing of the actual application.',h),
publishing:c('GitHub/local export and hosted link/custom-domain options advertised.',h),
frameworks:c('Lists React, Next.js, Vite and Tailwind workflows.',h),
execution:c('Local-first editor; hosted service also advertised.',h),
pricing:c('Free local/open-source offering; hosted/cloud pricing by inquiry.',h),
funding:c('Y Combinator Winter 2025 company; round amount not found on its YC profile.','https://www.ycombinator.com/companies/onlook','partial')
});
}
{
const h='https://noon.design/';
add('noon','Noon',h,{
identity:c('Early-access product design environment joining appearance and behavior on a canvas.',h,'vendor claim'),
structure:c('Code-oriented canvas editing advertised; detailed anatomy controls not found.',h,'partial'),
patterns:c('Advertises building and testing product flows.',h,'vendor claim'),
liveCode:c('Running product behavior is advertised; supported runtime details not found.',h,'partial'),
funding:c('Founder announcement reports $44M funding, April 1, 2026.','https://noon.design/announcing-noon')
});
}
{
const h='https://cursor.com/blog/browser-visual-editor';
add('cursor-design','Cursor Design Mode / browser visual editor',h,{
identity:c('Browser visual editing inside Cursor for people working with application code.',h),
github:c('Agent applies visual edits to underlying workspace files. Design-mode-specific GitHub push/PR mechanism: not found.',h,'partial'),
foundations:c('Visual property edits can update styles; dedicated system-wide parameter management not documented.',h,'partial'),
inventory:c('Exposes existing React component props and variants.',h),
structure:c('Rearranges elements/layouts; agent locates and edits source.',h),
patterns:c('Iterates on real app screens and component states.',h),
existingSystem:c('Edits existing code; a separate design-system lifecycle manager is not documented.',h,'partial'),
content:c('User’s app/components, not a first-party universal inspiration library.',h),
liveCode:c('Browser shows the running application.',h),
publishing:nf('Design Mode-specific public publishing workflow',h),
frameworks:c('Web apps; React-specific prop inspection documented.',h),
execution:c('Editor/browser workspace with agent inference; fully offline operation not established.',h,'partial'),
pricing:c('Hobby free; Pro $20/month; higher and team plans available.','https://cursor.com/pricing'),
funding:c('Parent Cursor announced $2.3B Series D at $29.3B valuation, November 2025.','https://cursor.com/blog/series-d')
});
}
{
const h='https://www.builder.io/c/docs/fusion-projects-overview',d='https://www.builder.io/updates',p='https://site.builder.io/m/pricing';
add('builder','Builder.io (Builder Code / Content)',[h,d],{
identity:c('Visual/AI code generation plus a separate visual content platform. Fusion renamed Builder Code; Publish renamed Builder Content.','https://site.builder.io/blog/builder-product-name-change'),
github:c('Connects existing application and system repos; proposes production source changes through PRs.',h),
foundations:c('Indexes existing design tokens for agent/visual use.',d),
inventory:c('Design-system intelligence indexes components and standards.',[h,d]),
structure:c('Visual and AI edits to production component/layout code.',h),
patterns:c('Builds pages and product experiences using existing systems.',h),
existingSystem:c('Explicit system-repo indexing and component reuse.',h),
content:c('Existing code components; content models/templates in the separate Content product.',[h,'https://site.builder.io/fusion']),
liveCode:c('Repository-backed application previews; content runtime is a separate integration.',[h,'https://site.builder.io/fusion']),
publishing:c('Preview URLs, review branches, PRs and local export.',[d,'https://site.builder.io/fusion']),
frameworks:c('React/Next.js, Vue, Svelte and Angular advertised.','https://site.builder.io/fusion'),
execution:c('Cloud project environments; local code/agent integration via MCP.',[p,d]),
pricing:c('Free, Pro, Team and Enterprise tiers; current paid amounts not found in extracted page. Design-system intelligence listed for Enterprise.',p,'partial'),
funding:c('Announced $20M funding led by M12 in May 2024; a confirmed historical event, not a latest-total claim.','https://www.builder.io/blog/builder-closes-20-million-funding-m12-microsoft')
});
}
{
const h='https://www.plasmic.app/',g='https://docs.plasmic.app/learn/github-action/',d='https://github.com/plasmicapp/plasmic';
add('plasmic','Plasmic',[h,g,d],{
identity:c('Visual app/page builder integrating developers’ existing code components.',h),
github:c('GitHub app/action can generate a new app or run plasmic sync in an existing repo. Codegen supports direct pushes or PRs.',g),
foundations:c('Reusable style tokens and mixins.',d),
inventory:c('Registered React components, props, variants and reusable Plasmic components.',d),
structure:c('Slots and editable anatomy, including headless component composition.',d),
patterns:c('Compose complete pages/apps using registered components.',h),
existingSystem:c('Register existing React components and maintain generated components through codegen.',[d,g]),
content:c('Code-component integrations and reusable visual components/templates.',[h,d]),
liveCode:c('Registered React components run in the editor; generated UI runs in the target app.',d),
publishing:c('Hosted/headless publishing or repository codegen delivery.',[h,g]),
frameworks:c('GitHub workflow documents Next.js, Gatsby and plain React, JS/TS; not a shared native-platform conformance contract.',g),
execution:c('Cloud studio with local/hosted application integration; codegen or runtime loader.','https://docs.plasmic.app/learn/codegen-guide/'),
pricing:c('Free; Starter $39/month, Pro $103/month, Scale $399/month on annual billing; Enterprise custom.','https://www.plasmic.app/pricing'),
funding:nf('verified public round amount; funding queries also returned unrelated Plasmapp',[h,'https://www.plasmic.app/blog'])
});
}
{
const h='https://penpot.app/',d='https://help.penpot.app/user-guide/design-systems/design-tokens/';
add('penpot','Penpot',[h,d],{
identity:c('Open-source collaborative design/prototyping for designers and developers.',h),
github:c('Design/token export and integrations; native application-repo push/PR not found. MCP canvas editing is separate.','https://penpot.app/integrations-api','partial'),
foundations:c('Design tokens, aliases and themes.',d),
inventory:c('Reusable components, variants and libraries.','https://github.com/penpot/penpot/blob/develop/README.md'),
structure:c('Editable design anatomy and web-oriented layout.',h),
patterns:c('Design screens and prototypes; production app source equivalence not established.',h,'partial'),
existingSystem:c('Manages design libraries/tokens; external code integrations require a separate pipeline.',[d,'https://penpot.app/integrations-api']),
content:c('Reusable design libraries/templates.',h),
liveCode:c('Web-oriented design assets and inspectable output; not every design component is an imported production runtime.',h,'partial'),
publishing:c('Shared design/prototype links and asset exports.',h),
frameworks:c('Web standards and token/API export; no guaranteed multi-framework app generator identified.','https://penpot.app/integrations-api','partial'),
execution:c('Hosted cloud or self-hosted open-source web application.',h),
pricing:c('Professional free; Unlimited $7/editor/month capped at $175/month; Enterprise $25/member/month; Private Server from $50,000/year.','https://penpot.app/pricing'),
funding:c('Official history reports $8M Series A in 2022 and $12M Series A+ in 2023.','https://community.penpot.app/t/faq-penpots-journey-so-far-timeline/2961')
});
}
{
const h='https://mobbin.com/',p='https://mobbin.com/pricing';
add('mobbin','Mobbin',[h,p],{
identity:c('Shipped-product screenshot and flow research library for product designers.',h),
foundations:c('Visual references; not a token-authoring system.',h,'inference'),
inventory:c('Screen/pattern research taxonomy, not a maintained code-component inventory.',h,'inference'),
structure:c('Reference screen anatomy; code editing not documented.',h,'partial'),
patterns:c('Browse product screens and flows.',h),
existingSystem:nf('existing design-system source management',[h,p]),
content:c('Screenshots, flow videos and navigable references; collections and Figma workflows.',h),
liveCode:c('References are captured screens/flows, not installable production component implementations.',h),
publishing:c('Share collections and collaborate on references.',h),
frameworks:c('Framework-neutral reference material; executable framework output not found.',h,'partial'),
execution:c('Cloud web library.',h),
pricing:c('Free access plus paid plans. Retrieved locale: Pro ¥1,500/month and Team ¥2,400/member/month with annual billing (JPY); USD price not confirmed. MCP/API availability depends on plan.',p,'partial'),
funding:c('CB Insights reports a November 2020 grant; amount not found. This does not establish current total funding.','https://www.cbinsights.com/company/mobbin/financials','reported')
});
}
{
const h='https://docs.21st.dev/',d='https://www.npmjs.com/package/%4021st-dev/cli',t='https://mcp.21st.dev/changelog';
add('21st','21st.dev',[h,d,t],{
identity:c('Component/theme/template registry and agent UI ecosystem for developers.',[h,d]),
github:c('CLI installs source locally and publishes registry items. Native GitHub push/PR for that install workflow: not found.',d,'partial'),
foundations:c('Theme CSS, theme editor and installable themes.',[d,t]),
inventory:c('Discover/install components and their dependencies; publish registry items.',d),
structure:c('Editable component source; registry-wide guarded anatomy configuration not established.',[d,t],'partial'),
patterns:c('Templates and composed UI examples.',d),
existingSystem:c('Theme/design context can be supplied; release governance for an arbitrary external system not confirmed.',[h,t],'partial'),
content:c('React components, themes, templates and live previews.',[h,d]),
liveCode:c('Installable code; Studio includes live editing. “Fixed look” is too broad.',[d,t]),
publishing:c('CLI/Studio publication and registry distribution.',[d,t]),
frameworks:c('React component ecosystem; agent SDK has additional targets distinct from the component registry.','https://www.ycombinator.com/companies/21st'),
execution:c('Cloud catalog/editor and local CLI installation.',[h,d]),
pricing:c('Public page on annual billing: Builder $6/month; Builder + AI $15/month at the selected 500-credit setting; Team $7.50/seat/month. Author-sold templates can cost extra.','https://21st.dev/pricing'),
funding:c('Y Combinator Winter 2026; round amount not found on the YC profile.','https://www.ycombinator.com/companies/21st','partial')
});
}
{
const h='https://www.supernova.io/',g='https://learn.supernova-docs.io/latest/code-integration/code-delivery/open-a-pull-request/git-hub-jPO6p0St';
add('supernova','Supernova',[h,g],{
identity:c('Design-system data, documentation and code-delivery platform.',h),
github:c('Unverified: the previously cited delivery documentation redirects to login; exporter opening/updating GitHub PRs and the exact delivered artifacts were not verified from public evidence.',g,'partial'),
foundations:c('Token management, themes and multibrand organization.',h),
inventory:c('Component documentation, status/health and adoption tracking.',h),
structure:c('Documents existing anatomy; arbitrary component-structure authoring not confirmed.',h,'partial'),
patterns:c('Documents patterns; interactive generation across all patterns not confirmed.',h,'partial'),
existingSystem:c('Imports and manages system data, documentation and delivery.',h),
content:c('Team system documentation, tokens and components.',h),
liveCode:c('Code delivery/embeds and machine-readable context; not all documented content is executable.',h,'partial'),
publishing:c('Public/private documentation and exporter PR delivery.',[h,g]),
frameworks:c('Exporter targets include web/React, iOS, Android, React Native and Flutter; export formats are not component behavior parity.','https://learn.supernova.io/'),
execution:c('Cloud platform with code/export integrations.',h),
pricing:c('Free; Pro displayed at $35/editor/month; Enterprise custom. Billing-toggle basis not confirmed.','https://www.supernova.io/pricing','partial'),
funding:c('Announced $4.8M seed in November 2022; historical event, not latest total.','https://www.supernova.io/blog/supernovas-seed-round-and-our-new-design-token-manager')
});
}
{
const h='https://docs.knapsack.cloud/',g='https://docs.knapsack.cloud/get-started/storage-options',f='https://docs.knapsack.cloud/get-started/knapsack-config';
add('knapsack','Knapsack',[h,g],{
identity:c('Design-system workspace connecting documentation, tokens and production components.',h),
github:c('Git storage mode versions YAML/JSON docs, tokens, pattern definitions and demos with PR/CI workflows. Database storage is an alternative; do not assume every installation stores content in Git.',g),
foundations:c('Token import/management from design and token tooling.',h),
inventory:c('Managed component/pattern inventory and documentation.',h),
structure:c('Compose production component props/slots; arbitrary anatomy changes remain implementation work.',h,'partial'),
patterns:c('Live component composition and prototyping.',h),
existingSystem:c('Connects existing component libraries and token pipelines.',[h,f]),
content:c('Organization-owned system documentation and production component demos.',h),
liveCode:c('Framework renderers execute connected production components.',f),
publishing:c('Deployed shared workspace, Git review/CI or database-backed content.',g),
frameworks:c('React, Vue, Twig, Web Components, Angular, HTML and Handlebars renderers.',f),
execution:c('Local build/dev workflow and deployed cloud workspace.',[f,'https://docs.knapsack.cloud/get-started/install']),
pricing:c('Contact sales; public numeric pricing not found.','https://www.knapsack.cloud/','partial'),
funding:c('Reported $10M Series A, October 9, 2025.','https://techcrunch.com/2025/10/09/knapsack-picks-up-10m-to-help-bridge-the-gap-between-design-and-engineering-teams/','reported')
});
}
export {tools,c,nf,add};
{
const h='https://zeroheight.com/integrations/',g='https://help.zeroheight.com/hc/en-us/articles/35886880695707';
add('zeroheight','zeroheight',[h,g],{
identity:c('Design-system documentation, token delivery and governance for teams.',h),
github:c('GitHub markdown synchronization and token PR automation; output is documentation/tokens, not a generated whole app.',[h,g]),
foundations:c('Token sets and theme documentation/delivery.',[h,'https://zeroheight.com/pricing/']),
inventory:c('Managed component documentation with embedded Storybook.',h),
structure:c('Documents anatomy; direct production-component anatomy authoring not confirmed.',h,'partial'),
patterns:c('Documents patterns/guidelines and embeds examples.',h),
existingSystem:c('Connects existing Figma/Storybook/GitHub systems and tracks adoption.',h),
content:c('Organization documentation, tokens and component examples.',h),
liveCode:c('Live Storybook embeds; an MCP page response does not itself execute embedded components.',[h,'https://help.zeroheight.com/hc/en-us/articles/43737291730331-Set-up-the-remote-MCP-server']),
publishing:c('Shared documentation sites and GitHub token delivery.',[h,g]),
frameworks:c('Documentation and embeds are framework-neutral; supported output depends on the connected code/token pipeline.',h,'inference'),
execution:c('Cloud documentation service with remote MCP.','https://help.zeroheight.com/hc/en-us/articles/43737291730331-Set-up-the-remote-MCP-server'),
pricing:c('Free; Starter displayed at $49/editor/month; Enterprise custom. Billing-toggle basis not confirmed.','https://zeroheight.com/pricing/','partial'),
funding:c('Reported $10M Series A, August 2021.','https://www.cbinsights.com/company/zeroheight/financials','reported')
});
}
{
const h='https://tokens.studio/',g='https://docs.tokens.studio/token-storage/remote/sync-git-github',p='https://tokens.studio/pricing';
add('tokens-studio','Tokens Studio',[h,p],{
identity:c('Token authoring, theming and distribution platform with a Figma plugin.',h),
github:c('Plugin pushes/pulls token JSON on a selected GitHub branch. Native PR orchestration not confirmed in this observation; users can review branches through GitHub.',g,'partial'),
foundations:c('Aliases, conditions, inheritance and multibrand themes.',h),
inventory:c('Token inventory; component inclusion/variant inventory tooling not confirmed.',h,'partial'),
structure:nf('component anatomy authoring',[h,p]),
patterns:nf('screen/flow builder',[h,p]),
existingSystem:c('Imports/manages existing tokens and synchronizes repositories.',g),
content:c('Token sets, themes and transformation definitions.',h),
liveCode:c('Tokens become consumable code outputs; this is not a live UI component catalog.','https://tokens.studio/help-center'),
publishing:c('Versioned token releases/export pipelines and Git delivery.','https://tokens.studio/variables'),
frameworks:c('Transforms to CSS/SCSS/JS and native-platform formats; not full component generation.','https://tokens.studio/help-center'),
execution:c('Figma plugin plus cloud Studio; consumers run generated outputs locally.',[g,h]),
pricing:c('Variables displayed at €17/month on annual billing; other Studio/plugin tiers differ. A single price does not cover every product.',p,'partial'),
funding:nf('confirmed public venture round amount',[h,p])
});
}
{
const h='https://specifyapp.com/',g='https://docs.specifyapp.com/distribute/available-destinations/github';
add('specify','Specify',[h,g],{
identity:c('Design-token/asset collection, transformation and distribution service.',h),
github:c('Automated GitHub PRs deliver configured token/asset outputs. CLI/Actions can implement additional pipelines.',[g,'https://docs.specifyapp.com/v1/apps-and-tools/github']),
foundations:c('Collects tokens and transforms them through configured parsers.',h),
inventory:c('Token and asset inventory; component-variant inventory not confirmed.',h,'partial'),
structure:nf('component anatomy editing',h),
patterns:nf('screen/flow creation',h),
existingSystem:c('Synchronizes existing design data from sources to code destinations.',h),
content:c('Design tokens and assets; not a screen-inspiration catalog.',h),
liveCode:c('Generated token code/assets, not runnable component behavior.',h,'inference'),
publishing:c('GitHub delivery and API/CLI distribution.',[h,g]),
frameworks:c('Configurable output parsers for consuming platforms; no whole-component framework conformance claim.',h,'partial'),
execution:c('Cloud token service plus CLI/CI consumers.',[h,g]),
pricing:c('Public page lists Essentials $69/month and Teams $134/month; Enterprise quote. Search copy is old; present purchase availability was not tested.','https://specifyapp.com/pricing','partial'),
funding:c('Company announced €4M seed on January 24, 2022.','https://specifyapp.com/blog/seed')
});
}
{
const h='https://storybook.js.org/',p='https://storybook.js.org/docs/sharing/publish-storybook',f='https://storybook.js.org/docs/configure/integration/frameworks';
add('storybook','Storybook',[h,p],{
identity:c('Open-source component workbench, documentation and testing for frontend teams.',h),
github:c('Stories/config/tests live in the developer’s repo and are committed through ordinary Git/CI. Native automatic source push/PR creation is not established by publishing docs.',p,'partial'),
foundations:c('Preview themes can exercise system values; token authoring requires application/addon code.',h,'inference'),
inventory:c('Stories expose components, props/args and states.',h),
structure:c('Developers author anatomy in component code; interactive controls expose configured props.',h),
patterns:c('Composed stories can cover screens and flows.',h),
existingSystem:c('Documents/tests existing framework components.',h),
content:c('The team’s executable stories and documentation.',h),
liveCode:c('Real components render in stories.',h),
publishing:c('Build a static Storybook for any web host; optional Chromatic publishing/versioning is a separate service.',p),
frameworks:c('Framework adapters include React, Vue, Angular, Svelte and Web Components; check the support matrix for capability differences.',f),
execution:c('Local development/builds and static/cloud hosting.',p),
pricing:c('Storybook is free/open-source. Hosted Chromatic testing has a separate pricing model.',[h,p]),
funding:c('Public sponsorship evidence exists, including Chromatic contributions. A Storybook-specific venture round was not found.','https://opencollective.com/chromatic','partial')
});
}
{
const h='https://github.com/jnsahaj/tweakcn',p='https://tweakcn.com/pricing';
add('tweakcn','tweakcn',[h,p],{
identity:c('Open-source visual theme editor for Tailwind and shadcn/ui.',h),
github:c('Exports CSS variables or a shadcn registry install command for local use. Native GitHub push/PR not found; the public source repo is not that service.',p,'partial'),
foundations:c('Color, typography, radius, spacing and shadow controls; presets, AI generation and contrast checking.','https://tweakcn.com/'),
inventory:nf('component/variant inclusion policy builder',h),
structure:nf('component anatomy authoring',h),
patterns:c('Component/page previews demonstrate themes; arbitrary product-flow builder not confirmed.','https://tweakcn.com/','partial'),
existingSystem:c('Imports CSS variables and exports themes for shadcn/Tailwind consumers; whole-system lifecycle governance not confirmed.',p,'partial'),
content:c('Theme presets, community themes and component previews.','https://tweakcn.com/'),
liveCode:c('Live component previews and executable theme/configuration output; not whole-app generation.','https://tweakcn.com/'),
publishing:c('Save/share themes and export CSS variables or a shadcn registry command.',p),
frameworks:c('Tailwind CSS and shadcn/ui.',h),
execution:c('Hosted web tool or local development from source.',h),
pricing:c('Free editor; Pro $8/month billed monthly, adding unlimited saved/shared themes and AI generation. Source is Apache-2.0.',[h,p]),
funding:nf('public funding disclosure',[h,p])
});
}
{
const h='https://ui.shadcn.com/docs/changelog/2025-12-shadcn-create',d='https://ui.shadcn.com/docs/registry/examples';
add('shadcn-create','shadcn/create',[h,d],{
identity:c('Visual configuration and CLI for creating a customized shadcn/ui codebase.',h),
github:c('CLI writes component/style/config files locally. Native hosted GitHub push/PR from the configurator: not found.',h,'partial'),
foundations:c('Choose colors, fonts, icons and visual styles including density differences.',h),
inventory:c('Select Radix or Base UI implementation and install registry components.',h),
structure:c('Configuration transforms component code, including spacing and structure. This exceeds color-only theming.',h),
patterns:c('Registry can distribute blocks and composed UI.','https://ui.shadcn.com/docs/registry/examples'),
existingSystem:c('CLI adapts installed registry components to the chosen library; arbitrary upstream-change preservation is not established.',h,'partial'),
content:c('Components, blocks, styles and third-party registries.',d),
liveCode:c('Installed source runs in the consumer app.',h),
publishing:c('Local code generation; registry distribution. Application hosting remains separate.',[h,d]),
frameworks:c('Create announcement lists Next.js, Vite, TanStack Start and v0; React component ecosystem.',h),
execution:c('Browser configuration plus local CLI.',h),
pricing:c('Open-source tool; separately hosted registries/services may set their own terms.','https://github.com/shadcn-ui/ui'),
funding:nf('standalone shadcn/create financing; Vercel affiliation is not a separate funding round',h)
});
}
{
const h='https://shadcnstudio.com/docs/getting-started/theme-generator',p='https://shadcnstudio.com/pricing';
add('shadcn-studio','Shadcn Studio',[h,p],{
identity:c('shadcn component/block library and visual/AI theme generator.',[h,p]),
github:c('Theme registry install command delivers local files; native GitHub push/PR not found.',h,'partial'),
foundations:c('Color, typography, radius/style theme controls and optional AI generation.',h),
inventory:c('Component and block catalog; project-wide inclusion policy not confirmed.',p,'partial'),
structure:c('Editable purchased/downloaded code; guided arbitrary anatomy authoring not confirmed.',p,'partial'),
patterns:c('Blocks and templates for application/site composition.',p),
existingSystem:c('Can apply themes to shadcn consumers; full external system governance not confirmed.',h,'partial'),
content:c('Theme presets, component code, blocks, templates and Figma assets.',[h,p]),
liveCode:c('Code components/blocks and live theme previews.',[h,p]),
publishing:c('Theme registry URLs and installation; app deployment handled separately.',h),
frameworks:c('shadcn/React and Tailwind ecosystem; base-library selection is separate from cross-framework support.',h),
execution:c('Cloud/browser generator and locally installed source; optional AI provider integration.',h),
pricing:c('Free community resources; Pro displayed $199 one-time, Team $449 one-time. Promotional pricing and license scope need checkout confirmation.',p,'partial'),
funding:nf('public round amount',[h,p])
});
}
{
const h='https://www.realtimecolors.com/';
add('realtime-colors','Realtime Colors',h,{
identity:c('Live palette/type preview and export tool for designers/developers.',h),
github:c('Exports CSS/SCSS/Tailwind and custom-format values; native GitHub push/PR not found.',h,'partial'),
foundations:c('Palette/font selection with live previews and export presets.',h),
inventory:nf('component inventory management',h),
structure:nf('component anatomy editor',h),
patterns:c('Example page/dashboard layouts preview palette choices.',h),
existingSystem:c('Can supply theme values; external system lifecycle management not confirmed.',h,'partial'),
content:c('Preview layouts and export-format presets, including shadcn.',h),
liveCode:c('Interactive preview website; outputs are theme values, not an arbitrary app implementation.',h),
publishing:c('Exports and shareable color references/QR codes.',h),
frameworks:c('CSS/SCSS/Tailwind/custom export presets; framework component generation not established.',h,'partial'),
execution:c('Browser tool.',h),
pricing:c('Official page says the tool is free.',h),
funding:nf('public financing disclosure',h)
});
}
{
const h='https://www.radix-ui.com/themes/docs/theme/overview',g='https://www.radix-ui.com/themes/docs/overview/getting-started';
add('radix-themes','Radix Themes',[h,g],{
identity:c('Styled React component system for application developers.',g),
github:c('Install package/CSS in a local app; no native GitHub push/PR service documented.',g,'partial'),
foundations:c('Accent/neutral color, radius, scaling, panel background and exposed tokens.',h),
inventory:c('Component variants and sizes through APIs; use the imports needed by the app.',h),
structure:c('Compose component anatomy in React; an end-user anatomy generator is not documented.',[h,g],'partial'),
patterns:c('Layout utilities/examples compose application screens.',h),
existingSystem:c('Custom tokens and themed components can extend the library; arbitrary external system import not documented.',h,'partial'),
content:c('Executable components, examples and theme playground.',h),
liveCode:c('Real React components and CSS tokens.',g),
publishing:c('Ship with the consumer app; docs/playground are reference surfaces.',[h,g]),
frameworks:c('React; underlying CSS does not itself provide equivalent framework adapters.',g),
execution:c('Local/package-based integration; hosted documentation/playground.',[h,g]),
pricing:c('Open-source package; no usage subscription specified.','https://github.com/radix-ui/themes'),
funding:c('WorkOS attribution is documented; standalone Radix Themes financing not found.',h,'partial')
});
}
{
const h='https://www.untitledui.com/react';
add('untitled-ui','Untitled UI',h,{
identity:c('Figma UI kit and React component/block products for designers/developers.',h),
github:c('Copy/install component source into a project; native hosted GitHub PR/push not found.',h,'partial'),
foundations:c('Tailwind-styled source can be customized; corresponding Figma system is a separate asset.',h),
inventory:c('Component and block catalog with exposed source.',h),
structure:c('Owned component source can be edited; universal guarded anatomy controls not confirmed.',h,'partial'),
patterns:c('Application/marketing blocks and templates.',h),
existingSystem:c('Code can be adapted to an existing app; automated maintenance of an arbitrary imported system not found.',h,'partial'),
content:c('React code, live component examples, Figma kits and icons.',h),
liveCode:c('React components run; Figma assets are not those runtime components.',h),
publishing:c('Install/copy code and ship through the consumer app.',h),
frameworks:c('React, TypeScript, Tailwind CSS and React Aria.',h),
execution:c('Hosted catalog plus local source integration.',h),
pricing:c('Free/open-source components and paid product bundles; current exact bundle amounts not confirmed in the extracted section.',h,'partial'),
funding:nf('public funding disclosure',h)
});
}
{
const h='https://dribbble.com/pro';
add('dribbble','Dribbble',h,{
identity:c('Design portfolio/discovery and client marketplace for designers.',h),
foundations:c('Visual inspiration only; token editing not documented.',h,'partial'),
inventory:c('Portfolio shots/projects, not managed component inventory.',h,'inference'),
structure:c('Reference designs; editable component anatomy not documented.',h,'partial'),
patterns:c('Published design work can inspire screens/layouts.',h,'inference'),
content:c('Portfolio media and projects; external linked products may have separate code.',h),
liveCode:c('No general installable/live component contract established for portfolio shots.',h,'partial'),
publishing:c('Public shots, portfolios and promotional/client discovery tools.',h),
frameworks:c('Framework-neutral media/reference content.',h,'inference'),
execution:c('Cloud web platform.',h),
pricing:c('Pro tiers displayed: Lite $4/month, Standard $8/month, Plus $99/month, billed annually.',h),
funding:c('Announced acquisition by Tiny in January 2017; transaction amount not found. This is ownership history, not a venture-round total.','https://dribbble.com/stories/2017/01/17/transition-game','partial')
});
}
{
const h='https://godly.website/',r='https://recent.design/?ref=godly';
add('godly','Godly (redirects to Recent)',[h,r],{
identity:c('Godly URL redirected to Recent’s design-inspiration directory during direct public HTTP inspection.',[h,r]),
foundations:c('Visual reference categories, not documented token tooling.',r,'partial'),
inventory:c('Browse categories/resources; component-system inventory management not found.',r,'partial'),
structure:nf('component anatomy editing',r),
patterns:c('Web/interface/product inspiration categories.',r),
existingSystem:nf('existing-system maintenance',r),
content:c('Design imagery and directories for websites, app screenshots, icons and resources.',r),
liveCode:nf('general executable/reusable component contract for the inspiration feed',r),
publishing:c('Public browsing and sponsorship; author publishing controls not confirmed in extracted homepage.',r,'partial'),
frameworks:c('Framework-neutral reference material; generated framework output not found.',r,'partial'),
execution:c('Cloud website.',r),
pricing:nf('paid-plan or submission amounts',r),
funding:nf('public financing disclosure',r)
});
}
{
const h='https://refero.design/mcp',p='https://refero.design/pricing';
add('refero','Refero',[h,p],{
identity:c('Product screen/flow inspiration and structured design research for people and AI agents.',h),
foundations:c('Reference design metadata; not a token-authoring system.',h,'inference'),
inventory:c('Searchable reference library; maintained code inventory not documented.',h,'partial'),
structure:c('Research screen anatomy; editing source anatomy not documented.',h,'partial'),
patterns:c('Search product screens and flows.',h),
existingSystem:nf('authoritative design-system source management',h),
content:c('Screenshots/flows and structured metadata exposed through MCP.',h),
liveCode:c('Reference data for an agent to build from; not the original production component source.',h),
publishing:c('Research references can be supplied through MCP; app publishing capability not found.',h,'partial'),
frameworks:c('Framework-neutral reference data; agent implementation stack is separate.',h),
execution:c('Cloud library and remote MCP access.',h),
pricing:c('MCP included with Pro; exact current price not found in the extracted pricing page.',[h,p],'partial'),
funding:nf('public funding disclosure',[h,p])
});
}
{
const h='https://www.awwwards.com/',e='https://www.awwwards.com/inspiration/pricing-system-one';
add('awwwards','Awwwards',[h,e],{
identity:c('Website awards, inspiration and professional directory for web designers/agencies.',h),
foundations:c('Visual reference; token editing not documented.',h,'partial'),
inventory:c('Curated websites/elements, not code-component system management.',[h,e],'inference'),
structure:c('Reference layouts/interactions; anatomy editor not documented.',e,'partial'),
patterns:c('Website/interaction examples and collections.',[h,e]),
existingSystem:nf('existing design-system source management',h),
content:c('Website nominations, captured elements, linked sites, courses and a separate template marketplace.',[h,e]),
liveCode:c('Linked websites are live; captured elements are references. Marketplace templates have separate product terms.',[h,e],'partial'),
publishing:c('Submit websites for recognition and create collections; this does not deploy the submitted app.',h),
frameworks:c('Technology categories include React, WordPress, Shopify, Framer and Webflow; these classify references rather than supported generators.',h),
execution:c('Cloud directory/marketplace.',h),
pricing:c('Public browsing plus Pro/submission and marketplace offerings; exact plan/submission prices not found.',h,'partial'),
funding:nf('public funding disclosure',h)
});
}
// Supplemental primary pages found while resolving gaps.
tools.find(t=>t.id==='v0').fields.frameworks=c('Next.js is the default/recommended full-stack target; other frameworks can be used with less predictable results.','https://v0.app/docs/full-stack-apps');

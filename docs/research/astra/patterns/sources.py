"""Reviewed public references; no upstream code or assets are copied."""
DATE = '2026-09-28'
SOURCES = {}
def S(key, system, title, url, finding, kind='guidance', readable_url=None):
    SOURCES[key] = dict(system=system, title=title, url=url, checked_on=DATE,
                        kind=kind, finding=finding)
    if readable_url: SOURCES[key]['readable_url'] = readable_url
S('primer-layout','Primer','Layout','https://primer.style/product/getting-started/foundations/layout/',
  'Defines header, content, supporting panes and footer; narrow list-detail views can become separate pages, auxiliary panes can become sheets, and summaries can stack.')
S('primer-navigation','Primer','Navigation','https://primer.style/product/ui-patterns/navigation/',
  'Navigation guidance complements layout guidance; use the responsive sidebar section for narrow navigation.')
S('primer-onboarding','Primer','Feature onboarding','https://primer.style/product/ui-patterns/feature-onboarding/',
  'Product feature education is distinct from marketing; use it as guidance for introducing a feature.')
S('primer-empty','Primer','Empty states','https://primer.style/product/ui-patterns/empty-states/',
  'Covers spaces without content, including initial use and temporarily empty results.')
S('primer-degraded','Primer','Degraded experiences','https://primer.style/product/ui-patterns/degraded-experiences/',
  'Keep primary experiences available when optional service dependencies fail.')
S('primer-loading','Primer','Loading','https://primer.style/product/ui-patterns/loading/',
  'Guidance for communicating loading and choosing placeholder or busy feedback.')
S('carbon-filter','Carbon','Filtering','https://carbondesignsystem.com/patterns/filtering/',
  'Separates single and multiple selection, categories, instant and applied filters; active filters need a visible indication and a reset path.')
S('carbon-login','Carbon','Login','https://carbondesignsystem.com/patterns/login-pattern/',
  'Documents identification, password or alternate authentication, recovery, continuation and optional help; progressive authentication can route by identifier.')
S('carbon-notifications','Carbon','Notifications','https://carbondesignsystem.com/patterns/notification-pattern/',
  'Classifies notification channels and urgency; distinguish contextual feedback from a persistent notification destination.')
S('carbon-search','Carbon','Search','https://carbondesignsystem.com/patterns/search-pattern/',
  'Search guidance covers scoped discovery and results; a search surface is distinct from its data retrieval service.')
S('carbon-toolbar','Carbon','Text toolbar','https://carbondesignsystem.com/patterns/text-toolbar-pattern/',
  'Formatting commands can be grouped into text toolbars; this guidance does not supply a document editing engine.')
S('carbon-table','Carbon','Data table usage','https://carbondesignsystem.com/components/data-table/usage/',
  'Table compositions include toolbar search, sorting, selection, batch actions and pagination.', 'component-guidance')
S('polaris-settings','Polaris','Settings template','https://shopify.dev/docs/api/app-home/latest/patterns/templates/settings',
  'A full settings page template composes sections and controls for configuring an app.', 'template')
S('polaris-home','Polaris','Homepage template','https://shopify.dev/docs/api/app-home/latest/patterns/templates/homepage',
  'Combines actionable status, metrics and onboarding guidance at the app entry point.', 'template')
S('polaris-details','Polaris','Details template','https://shopify.dev/docs/api/app-home/latest/patterns/templates/details',
  'Individual resource viewing and editing uses a primary content column and supporting column.', 'template')
S('polaris-index','Polaris','Index table','https://shopify.dev/docs/api/app-home/latest/patterns/compositions/index-table',
  'Resource collection composition with search, filters, sort and bulk actions.', 'composition')
S('polaris-resources','Polaris','Resource list','https://shopify.dev/docs/api/app-home/latest/patterns/compositions/resource-list',
  'A collection of same-type resources is presented as repeatable rows.', 'composition')
S('polaris-setup','Polaris','Setup guide','https://shopify.dev/docs/api/app-home/latest/patterns/compositions/setup-guide',
  'Interactive onboarding checklist with progress tracking and expandable steps.', 'composition')
S('polaris-connect','Polaris','Account connection','https://shopify.dev/docs/api/app-home/latest/patterns/compositions/account-connection',
  'Connect or disconnect an external account or service.', 'composition')
S('atlassian-form','Atlassian','Form examples','https://atlassian.design/components/form/examples',
  'Header, sections, fields and footer compose a form; state includes dirty, disabled and submitting, with field validation.', 'component-examples')
S('atlassian-comments','Atlassian','Comment examples','https://atlassian.design/components/comment/examples',
  'Author/avatar, time, edited marker, body and actions; examples include nested replies and saving feedback.', 'component-examples')
S('atlassian-ai','Atlassian','AI interaction guidelines','https://atlassian.design/rovo-ui/ai-interaction-guidelines',
  'Keep AI controls in the working surface, carry task state across transitions and expose system state and ways to course-correct.')
S('gov-question','GOV.UK','Question pages','https://design-system.service.gov.uk/patterns/question-pages/',
  'Task questions provide a model for focused multi-page form flows.')
S('gov-review','GOV.UK','Check answers','https://design-system.service.gov.uk/patterns/check-answers/',
  'Review collected answers and offer a way to change them before submitting.')
S('gov-validation','GOV.UK','Recover from validation errors','https://design-system.service.gov.uk/patterns/validation/',
  'Retain entered answers; link a focused error summary to errors at fields; distinguish invalid input from service or permission problems.')
S('gov-confirm','GOV.UK','Confirmation pages','https://design-system.service.gov.uk/patterns/confirmation-pages/',
  'Confirm completion and explain what happens next.')
S('gov-account','GOV.UK','Create accounts','https://design-system.service.gov.uk/patterns/create-accounts/',
  'Account creation is a task with justification and recovery needs, rather than a mandatory screen for every service.')
S('gov-email','GOV.UK','Confirm an email address','https://design-system.service.gov.uk/patterns/confirm-an-email-address/',
  'Email confirmation supports checking an address and recovery when the message does not arrive.')
S('gov-unavailable','GOV.UK','Service unavailable pages','https://design-system.service.gov.uk/patterns/service-unavailable-pages/',
  'Service interruption needs a dedicated explanation and next steps, distinct from field validation.')
S('gov-not-found','GOV.UK','Page not found pages','https://design-system.service.gov.uk/patterns/page-not-found-pages/',
  'Missing destinations need a comprehensible explanation and a route to continue.')
S('gov-upload','GOV.UK','File upload','https://design-system.service.gov.uk/components/file-upload/',
  'Labeled file selection with help and error treatment is the foundation of a file-submission flow.', 'component-guidance')
S('fluent-layout','Fluent','Layout','https://fluent2.microsoft.design/layout',
  'Distinguishes fluid responsive layouts and adaptive changes in arrangement; Area recommendations use no copied breakpoint values.')
S('fluent-nav','Fluent','Nav usage','https://fluent2.microsoft.design/components/web/react/core/nav/usage',
  'Navigation sits beside content and becomes an overlay at narrow widths; this Nav explicitly does not support an icon-only layout.', 'component-guidance')
S('fluent-drawer','Fluent','Drawer usage','https://fluent2.microsoft.design/components/web/react/core/drawer/usage',
  'Inline and overlay drawers differ; drawers provide supplemental context or short related tasks, with local status feedback.', 'component-guidance')
S('material-layout','Material','Canonical layouts (official Android guidance)','https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts',
  'Material-derived list-detail, feed and supporting-pane layouts preserve state as panes change visibility; editor tools and document comments are supporting-pane examples.', 'platform-guidance')
S('apple-panels','Apple HIG','Panels','https://developer.apple.com/design/human-interface-guidelines/panels',
  'Inspector content follows the selection; panels or split panes can expose adjustments. This is native platform guidance, not a web component contract.', 'platform-guidance',
  'https://developer.apple.com/tutorials/data/design/human-interface-guidelines/panels.json')
S('apple-sidebar','Apple HIG','Sidebars','https://developer.apple.com/design/human-interface-guidelines/sidebars',
  'Sidebars consume space; support hiding and adaptive navigation while keeping the hierarchy understandable.', 'platform-guidance',
  'https://developer.apple.com/tutorials/data/design/human-interface-guidelines/sidebars.json')
S('apple-onboarding','Apple HIG','Onboarding','https://developer.apple.com/design/human-interface-guidelines/onboarding',
  'Favor brief interactive education, optional tutorials and context-specific tips; postpone nonessential setup.', 'platform-guidance',
  'https://developer.apple.com/tutorials/data/design/human-interface-guidelines/onboarding.json')
S('untitled-settings','Untitled UI','Settings page examples','https://www.untitledui.com/react/components/settings-pages',
  'Public catalogue labels profile, team, password, appearance, billing, notifications and integrations pages; paid source was not accessed.', 'public-examples')
S('untitled-header-settings','Untitled UI','Settings with header navigation','https://www.untitledui.com/react/components/settings-pages-02',
  'Offers a horizontal app-header alternative for the settings page collection.', 'public-examples')
S('untitled-billing','Untitled UI','Billing settings example 12','https://www.untitledui.com/react/components/settings-pages/settings-12',
  'Public description covers subscription plan, billing history and invoices; exact interaction behavior was not tested.', 'public-example')
S('untitled-payment','Untitled UI','Billing settings example 14','https://www.untitledui.com/react/components/settings-pages/settings-14',
  'Public description covers payment method and billing address updates; payment processing is outside this visual example.', 'public-example')
S('untitled-messaging','Untitled UI','Messaging','https://www.untitledui.com/react/components/messaging',
  'Public examples name minimal, textarea and advanced message actions, reactions and image messages.', 'public-examples')
S('untitled-upload','Untitled UI','File uploaders','https://www.untitledui.com/react/components/file-uploaders',
  'File selection/drop areas and file-state rows offer the visual basis for an upload queue.', 'public-examples')
S('untitled-command','Untitled UI','Command menus','https://www.untitledui.com/react/components/command-menus',
  'Command search examples support grouped discovery of actions.', 'public-examples')
S('untitled-editor','Untitled UI','Text editors','https://www.untitledui.com/react/components/text-editors',
  'Text-editing controls and examples are a reference for a formatted document surface, not evidence of an Area editing engine.', 'public-examples')
S('untitled-hero','Untitled UI','Hero header sections','https://www.untitledui.com/react/marketing/hero-header-sections',
  'Public hero catalogue supplies alternative landing-page introductions.', 'public-examples')
S('untitled-pricing','Untitled UI','Pricing sections','https://www.untitledui.com/react/marketing/pricing-sections',
  'Public example names include simple/featured cards, banners and large comparison tables.', 'public-examples')
S('untitled-faq','Untitled UI','FAQ sections','https://www.untitledui.com/react/marketing/faq-sections',
  'Public FAQ catalogue provides question-and-answer layouts; accordion example documents disclosure.', 'public-examples')
S('untitled-faq-accordion','Untitled UI','Accordion FAQ example','https://www.untitledui.com/react/marketing/faq-sections/faq-accordion-02-brand',
  'Explicit accordion FAQ example uses disclosure for expandable answers.', 'public-example')
S('shadcn-blocks','shadcn','Blocks','https://ui.shadcn.com/blocks',
  'Featured examples include dashboard-01 (sidebar, summary cards, chart and table) and collapsible/sidebar submenu layouts.', 'public-code-example')
S('shadcn-login','shadcn','Login blocks','https://ui.shadcn.com/blocks/login',
  'Examples include centered, muted-background, email-only and image-split login; split page source hides decorative media on narrow layouts.', 'public-code-example')

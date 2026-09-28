# Toast — library range

Baseline `c585f8c5f38705a7efa79bf05148a8c6989b142a` · public references checked 2026-09-28. Counts and scope rules: [README-2](README-2.md).

## Job

Reports the outcome of an action without interrupting. [Area manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L576-L582).

Boundary: Neutral/info/danger/warning/success surface with title, description, action and dismiss. role=status and atomic announcements. Placement, lifetime, stacking and focus return are consumer-owned; no global queue/timer. [Area spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/toast.md#L1).

## Variant axes

- **Untitled UI** (example): icon: default, gray, brand, error. [Source](https://www.untitledui.com/react/components/notifications) (checked 2026-09-28).
- **shadcn/ui** (component): type: default, success, info, warning, error, loading. [Source](https://ui.shadcn.com/docs/components/toast) (checked 2026-09-28).
- **Base UI** (component): type: loading, success, error. [Source](https://base-ui.com/react/components/toast) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): tone: neutral, positive, negative, info. [Source](https://react-spectrum.adobe.com/Toast) (checked 2026-09-28).
- **Fluent 2** (component): intent: success, error, warning, info, progress. [Source](https://fluent2.microsoft.design/components/web/react/core/toast/usage) (checked 2026-09-28).
- **Carbon** (component): status: error, info, success, warning; contrast: low, high. [Source](https://carbondesignsystem.com/components/notification/usage/) (checked 2026-09-28).
- **Material 3** (component): duration: short, long, indefinite. [Source](https://developer.android.com/develop/ui/compose/components/snackbar) (checked 2026-09-28).
- **Mantine** (component): state: loading. [Source](https://mantine.dev/core/notification) (checked 2026-09-28).
- **Mantine** (component): position: top-left, top-center, top-right, bottom-left, bottom-center, bottom-right. [Source](https://mantine.dev/x/notifications/) (checked 2026-09-28).
- **Ant Design** (component): type: success, info, warning, error; placement: topLeft, topRight, bottomLeft, bottomRight, top, bottom. [Source](https://ant.design/components/notification) (checked 2026-09-28).
- **Ant Design** (component): type: info, success, error, warning, loading. [Source](https://ant.design/components/message/) (checked 2026-09-28).
- **Chakra/Ark** (component): type: info, warning, success, error, loading; placement: top-start, top, top-end, bottom-start, bottom, bottom-end. [Source](https://chakra-ui.com/docs/components/toast) (checked 2026-09-28).
- **Atlassian** (component): appearance: normal, bold. [Source](https://atlassian.design/components/flag/examples) (checked 2026-09-28).
- **Polaris** (platform-component): tone: default, error. [Source](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/toast-api) (checked 2026-09-28).

## Structural alternatives

- **Untitled UI** (example): title-description, avatar, actions, close-button. [Source](https://www.untitledui.com/react/components/notifications) (checked 2026-09-28).
- **shadcn/ui** (component): title-description, actions, close-button. [Source](https://ui.shadcn.com/docs/components/toast) (checked 2026-09-28).
- **Base UI** (component): title-description, actions, close-button, stack. [Source](https://base-ui.com/react/components/toast) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): actions, close-button. [Source](https://react-spectrum.adobe.com/Toast) (checked 2026-09-28).
- **Fluent 2** (component): title-description, actions, close-button, progress-content. [Source](https://fluent2.microsoft.design/components/web/react/core/toast/usage) (checked 2026-09-28).
- **Carbon** (component): title-description, actions, close-button, timestamp. [Source](https://carbondesignsystem.com/components/notification/usage/) (checked 2026-09-28).
- **Material 3** (component): actions, close-button. [Source](https://developer.android.com/develop/ui/compose/components/snackbar) (checked 2026-09-28).
- **Mantine** (component): title-description, icon, close-button. [Source](https://mantine.dev/core/notification) (checked 2026-09-28).
- **Mantine** (component): stack. [Source](https://mantine.dev/x/notifications/) (checked 2026-09-28).
- **Ant Design** (component): title-description, actions, close-button, stack. [Source](https://ant.design/components/notification) (checked 2026-09-28).
- **Ant Design** (component): compact-message, stack. [Source](https://ant.design/components/message/) (checked 2026-09-28).
- **Chakra/Ark** (component): title-description, actions, close-button, stack. [Source](https://chakra-ui.com/docs/components/toast) (checked 2026-09-28).
- **Atlassian** (component): title-description, actions, close-button. [Source](https://atlassian.design/components/flag/examples) (checked 2026-09-28).
- **Polaris** (platform-component): actions, close-button. [Source](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/toast-api) (checked 2026-09-28).

## Interaction patterns

- **Untitled UI** (example): dismiss. [Source](https://www.untitledui.com/react/components/notifications) (checked 2026-09-28).
- **shadcn/ui** (component): queue, auto-dismiss, promise-state. [Source](https://ui.shadcn.com/docs/components/toast) (checked 2026-09-28).
- **Base UI** (component): queue, auto-dismiss, pause-on-hover-focus, swipe-dismiss, promise-state. [Source](https://base-ui.com/react/components/toast) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): queue, auto-dismiss, pause-on-hover-focus, persistent-actionable, focus-shortcut. [Source](https://react-spectrum.adobe.com/Toast) (checked 2026-09-28).
- **Fluent 2** (component): queue, auto-dismiss, persistent, pause-on-hover-focus. [Source](https://fluent2.microsoft.design/components/web/react/core/toast/usage) (checked 2026-09-28).
- **Carbon** (component): dismiss. [Source](https://carbondesignsystem.com/components/notification/usage/) (checked 2026-09-28).
- **Material 3** (component): auto-dismiss. [Source](https://developer.android.com/develop/ui/compose/components/snackbar) (checked 2026-09-28).
- **Mantine** (component): swipe-dismiss. [Source](https://mantine.dev/core/notification) (checked 2026-09-28).
- **Mantine** (component): queue, auto-dismiss, pause-on-hover, update-toast. [Source](https://mantine.dev/x/notifications/) (checked 2026-09-28).
- **Ant Design** (component): queue, auto-dismiss, pause-on-hover, progress-timer. [Source](https://ant.design/components/notification) (checked 2026-09-28).
- **Ant Design** (component): queue, auto-dismiss, promise-state, update-toast. [Source](https://ant.design/components/message/) (checked 2026-09-28).
- **Chakra/Ark** (component): queue, auto-dismiss, pause-resume, promise-state. [Source](https://chakra-ui.com/docs/components/toast) (checked 2026-09-28).
- **Atlassian** (component): auto-dismiss. [Source](https://atlassian.design/components/flag/examples) (checked 2026-09-28).
- **Polaris** (platform-component): auto-dismiss, programmatic-dismiss. [Source](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/toast-api) (checked 2026-09-28).

## Area today

Neutral/info/danger/warning/success surface with title, description, action and dismiss. role=status and atomic announcements. Placement, lifetime, stacking and focus return are consumer-owned; no global queue/timer. [Baseline spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/toast.md#L1).

- Exact manifest axes: tone = neutral, info, danger, warning, success. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L576-L582).
- Boolean modifiers: none declared. Runtime state hooks: none declared. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L576-L582).
- Slots: icon, content, title, description, action, dismiss. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L576-L582).

Per-option Area results (all at the baseline; “not found” is scoped to the manifest and spec):

- **not found**: `appearance:bold`, `appearance:normal`, `duration:indefinite`, `duration:long`, `duration:short`, `icon:brand`, `icon:default`, `icon:error`, `icon:gray`, `intent:error`, `intent:info`, `intent:progress`, `intent:success`, `intent:warning`, `interaction:auto-dismiss`, `interaction:focus-shortcut`, `interaction:pause-on-hover`, `interaction:pause-on-hover-focus`, `interaction:pause-resume`, `interaction:persistent`, `interaction:persistent-actionable`, `interaction:progress-timer`, `interaction:promise-state`, `interaction:queue`, `interaction:swipe-dismiss`, `interaction:update-toast`, `placement:bottom`, `placement:bottom-end`, `placement:bottom-start`, `placement:bottomLeft`, `placement:bottomRight`, `placement:top`, `placement:top-end`, `placement:top-start`, `placement:topLeft`, `placement:topRight`, `position:bottom-center`, `position:bottom-left`, `position:bottom-right`, `position:top-center`, `position:top-left`, `position:top-right`, `state:loading`, `status:error`, `status:info`, `status:success`, `status:warning`, `structure:avatar`, `structure:compact-message`, `structure:icon`, `structure:progress-content`, `structure:stack`, `structure:timestamp`, `tone:default`, `tone:error`, `tone:negative`, `tone:positive`, `type:default`, `type:error`, `type:info`, `type:loading`, `type:success`, `type:warning`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L576-L582); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/toast.md#L1-L128).
- **yes**: `interaction:dismiss`, `structure:actions`, `structure:close-button`, `structure:title-description`, `tone:danger`, `tone:info`, `tone:neutral`, `tone:success`, `tone:warning`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L576-L582); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/toast.md#L1-L128).
- **system-level / not this exact option**: `contrast:high`, `contrast:low`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L576-L582); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/toast.md#L1-L128).
- **composition**: `interaction:programmatic-dismiss`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L576-L582); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/toast.md#L1-L128).

## Proposed range

Recommendations for owner selection, not implementation commitments. Direct counts include official components/examples/recipes; experimental, adjacent and guidance counts are separate. Each bundle count is a union (at least one listed alternative); exact individual counts are in [index-2.json](index-2.json).

- **Layer 2 · Retain the documented baseline inventory** — 1 direct systems. Direct: React Aria / Spectrum 2. Retain the current size/tone/state inventory while the owner selects additions below. No removal is inferred from a zero exact-spelling external count. Evidence: [1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L576-L582), [2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/toast.md#L1).
  - Individual options: `tone:neutral` (1 direct; Area: yes); `tone:info` (1 direct; Area: yes); `tone:danger` (0 direct; Area: yes); `tone:warning` (0 direct; Area: yes); `tone:success` (0 direct; Area: yes).
- **Layer 2 · Queue, timed/persistent and pause behavior** — 10 direct systems. Direct: Ant Design, Atlassian, Base UI, Chakra/Ark, Fluent 2, Mantine, Material 3, Polaris, React Aria / Spectrum 2, shadcn/ui. Close the largest Toast behavior gap without conflating surface tone with queue ownership. Evidence: [1](https://ant.design/components/message/), [2](https://ant.design/components/notification), [3](https://atlassian.design/components/flag/examples), [4](https://base-ui.com/react/components/toast), [5](https://chakra-ui.com/docs/components/toast), [6](https://developer.android.com/develop/ui/compose/components/snackbar), [7](https://fluent2.microsoft.design/components/web/react/core/toast/usage), [8](https://mantine.dev/x/notifications/), [9](https://react-spectrum.adobe.com/Toast), [10](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/toast-api), [11](https://ui.shadcn.com/docs/components/toast).
  - Individual options: `interaction:queue` (7 direct; Area: not found); `interaction:auto-dismiss` (10 direct; Area: not found); `interaction:persistent` (1 direct; Area: not found); `interaction:persistent-actionable` (1 direct; Area: not found); `interaction:pause-on-hover-focus` (3 direct; Area: not found).
- **Layer 2 · Loading-to-success/error updates** — 5 direct systems. Direct: Ant Design, Base UI, Chakra/Ark, Mantine, shadcn/ui. Update one notification instead of appending a new message for every state change. Evidence: [1](https://ant.design/components/message/), [2](https://base-ui.com/react/components/toast), [3](https://chakra-ui.com/docs/components/toast), [4](https://mantine.dev/x/notifications/), [5](https://ui.shadcn.com/docs/components/toast).
  - Individual options: `interaction:promise-state` (4 direct; Area: not found); `interaction:update-toast` (2 direct; Area: not found).
- **Layer 3 · Compact text, rich actions and stacked presentation** — 12 direct systems. Direct: Ant Design, Atlassian, Base UI, Carbon, Chakra/Ark, Fluent 2, Mantine, Material 3, Polaris, React Aria / Spectrum 2, Untitled UI, shadcn/ui. Keep the action and dismiss targets independent; prefer nonexpiring actionable toasts. Evidence: [1](https://ant.design/components/message/), [2](https://ant.design/components/notification), [3](https://atlassian.design/components/flag/examples), [4](https://base-ui.com/react/components/toast), [5](https://carbondesignsystem.com/components/notification/usage/), [6](https://chakra-ui.com/docs/components/toast), [7](https://developer.android.com/develop/ui/compose/components/snackbar), [8](https://fluent2.microsoft.design/components/web/react/core/toast/usage), [9](https://mantine.dev/x/notifications/), [10](https://react-spectrum.adobe.com/Toast), [11](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/toast-api), [12](https://ui.shadcn.com/docs/components/toast), [13](https://www.untitledui.com/react/components/notifications).
  - Individual options: `structure:compact-message` (1 direct; Area: not found); `structure:actions` (11 direct; Area: yes); `structure:stack` (4 direct; Area: not found).

## Sources

- Area: [manifest, lines 576–582](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L576-L582); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/toast.md#L1). All Area judgments refer to starting commit `c585f8c5f38705a7efa79bf05148a8c6989b142a`, not concurrent work.
- Research method and version boundaries: [README-2.md](README-2.md). URL check log: [source-audit-2.json](source-audit-2.json).

Searched terms: toast, notification, snackbar, flag, status message. The following list accounts for all 16 requested systems. “Not found” never counts as a missing component proved absent.

- **Untitled UI**: [source 1](https://www.untitledui.com/react/components/notifications); checked 2026-09-28.
- **shadcn/ui**: [source 1](https://ui.shadcn.com/docs/components/toast); checked 2026-09-28.
- **Radix Themes — not found**: checked [catalogue](https://www.radix-ui.com/themes/docs/overview/getting-started) on 2026-09-28 for toast, notification, snackbar, flag, status message. No independently verified option recorded; see the audit for lookup limitations.
- **Base UI**: [source 1](https://base-ui.com/react/components/toast); checked 2026-09-28.
- **React Aria / Spectrum 2**: [source 1](https://react-spectrum.adobe.com/Toast); checked 2026-09-28.
- **Fluent 2**: [source 1](https://fluent2.microsoft.design/components/web/react/core/toast/usage); checked 2026-09-28.
- **Primer — not found**: checked [catalogue](https://primer.style/product/components/) on 2026-09-28 for toast, notification, snackbar, flag, status message. No independently verified option recorded; see the audit for lookup limitations.
- **Carbon**: [source 1](https://carbondesignsystem.com/components/notification/usage/); checked 2026-09-28.
- **Material 3**: [source 1](https://developer.android.com/develop/ui/compose/components/snackbar); checked 2026-09-28.
- **Mantine**: [source 1](https://mantine.dev/core/notification), [source 2](https://mantine.dev/x/notifications/); checked 2026-09-28.
- **Ant Design**: [source 1](https://ant.design/components/message/), [source 2](https://ant.design/components/notification); checked 2026-09-28.
- **Chakra/Ark**: [source 1](https://chakra-ui.com/docs/components/toast); checked 2026-09-28.
- **Atlassian**: [source 1](https://atlassian.design/components/flag/examples); checked 2026-09-28.
- **Polaris**: [source 1](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/toast-api); checked 2026-09-28.
- **GOV.UK — not found**: checked [catalogue](https://design-system.service.gov.uk/components/) on 2026-09-28 for toast, notification, snackbar, flag, status message. No independently verified option recorded; see the audit for lookup limitations.
- **Apple HIG — not found**: checked [catalogue](https://developer.apple.com/design/human-interface-guidelines/components) on 2026-09-28 for toast, notification, snackbar, flag, status message. No independently verified option recorded; see the audit for lookup limitations.

Not found at option level (therefore omitted from counts): Material 3: queue; Atlassian: queue. Looked in the corresponding component pages linked above; these omissions are evidence limits, not assertions of absent behavior.

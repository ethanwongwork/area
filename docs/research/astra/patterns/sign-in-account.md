# Sign-in and account

Checked 2026-09-28. [Method, status meanings and priorities](README.md).

These are proposed Area recipes informed by the cited public examples and guidance. Anatomy is the proposed reading order; variations are candidates to offer, not a claim that every source implements them. Responsive behavior is an Area recommendation unless a source observation explicitly says otherwise. No dimensions are inferred from images.

Component availability is pinned to `18b86465d542f620d532fee351c4f28d50c8ac3a`. `recipe` means reusable packaging is absent but the baseline is composable; `partial` and `missing` identify additional shared behavior or adapters. Native headings, paragraphs, links, lists, forms and layout CSS remain valid building blocks.

<a id="sign-in"></a>
## Sign-in entry

**Purpose.** Identify the person and route them into the appropriate authentication step.

**Anatomy, in order (proposal).**

1. Product identity
2. Sign-in heading
3. Identifier and credential fields
4. Recovery or alternate method
5. Continue action
6. Account creation and help links

**Required components → Area families.**

- Card: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L520); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/card.md#L235).
- Field: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L133); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/field.md#L245).
- Input: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L143); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/input.md#L245).
- Button: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L35); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/button.md#L303).
- Checkbox: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L224); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/checkbox.md#L315).
- Separator: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L389); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/separator.md#L48).
- Alert: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L532); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/alert.md#L189).
- Spinner: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L407); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/spinner.md#L58).
- PasswordField recipe → Input, Field, Button: **recipe**. Native password entry is available through Input; a reusable reveal and announcement wrapper is not found. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L114); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/password-field.md#L113).

**What Area lacks for this baseline.** No additional primitive or adapter is identified. Any recipe entries above still need composition and application state; this is not a shipped screen.

**Common variations to catalogue.**

- Centered form.
- Split form and image.
- Email-first or email-only.

**Responsive proposal.** Make the form the primary column; remove decorative side media at narrow widths, as shown in the shadcn split login source. General layout basis: [Fluent — Layout](https://fluent2.microsoft.design/layout).

**Behavior boundary.** Input can render a native password field; a reveal control is recipe work. Authentication, SSO, rate limiting and session security are outside Area.

**Source observations.**

- [shadcn — Login blocks](https://ui.shadcn.com/blocks/login) (public-code-example; checked 2026-09-28). Examples include centered, muted-background, email-only and image-split login; split page source hides decorative media on narrow layouts.
- [Carbon — Login](https://carbondesignsystem.com/patterns/login-pattern/) (guidance; checked 2026-09-28). Documents identification, password or alternate authentication, recovery, continuation and optional help; progressive authentication can route by identifier.

<a id="create-account"></a>
## Account creation

**Purpose.** Collect the minimum identity needed to establish an account.

**Anatomy, in order (proposal).**

1. Reason to create an account
2. Identity fields
3. Credential choice
4. Terms/help links
5. Create action
6. Confirmation and next step

**Required components → Area families.**

- Field: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L133); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/field.md#L245).
- Input: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L143); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/input.md#L245).
- Button: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L35); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/button.md#L303).
- Checkbox: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L224); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/checkbox.md#L315).
- Card: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L520); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/card.md#L235).
- Alert: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L532); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/alert.md#L189).
- PasswordField recipe → Input, Field, Button: **recipe**. Native password entry is available through Input; a reusable reveal and announcement wrapper is not found. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L114); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/password-field.md#L113).
- Form validation and error summary → Field, Input, Alert, Button: **partial**. Field provides local help/error association. No aggregate Form/ErrorSummary contract found for linked errors, focus and submission state. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L115); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/form-validation.md#L99).

**What Area lacks for this baseline.** Form validation and error summary. Existing controls cover only the reuses listed above.

**Common variations to catalogue.**

- Standalone signup.
- Progressive account creation.
- Invitation acceptance.

**Responsive proposal.** Use one field sequence and place supporting information adjacent to its decision; preserve values across steps. General layout basis: [Fluent — Layout](https://fluent2.microsoft.design/layout).

**Behavior boundary.** App requirements determine account necessity and credential policy. Validation and confirmation screens must not imply that the account already exists before the server confirms it.

**Source observations.**

- [GOV.UK — Create accounts](https://design-system.service.gov.uk/patterns/create-accounts/) (guidance; checked 2026-09-28). Account creation is a task with justification and recovery needs, rather than a mandatory screen for every service.
- [Carbon — Login](https://carbondesignsystem.com/patterns/login-pattern/) (guidance; checked 2026-09-28). Documents identification, password or alternate authentication, recovery, continuation and optional help; progressive authentication can route by identifier.

<a id="verify-recover"></a>
## Verify identity or recover access

**Purpose.** Help a person confirm an address or regain access without losing their task.

**Anatomy, in order (proposal).**

1. Task heading
2. Destination or account context
3. Code or link instructions
4. Verification input if needed
5. Continue and resend controls
6. Recovery help

**Required components → Area families.**

- Field: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L133); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/field.md#L245).
- Input: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L143); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/input.md#L245).
- Button: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L35); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/button.md#L303).
- Alert: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L532); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/alert.md#L189).
- Spinner: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L407); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/spinner.md#L58).
- OTP input → Input, Field: **missing**. No specialized code-entry, paste and focus contract found; a single native input is a simpler application recipe. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L115); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/otp-input.md#L79).

**What Area lacks for this baseline.** OTP input. Existing controls cover only the reuses listed above.

**Common variations to catalogue.**

- Email link confirmation.
- One code field.
- Segmented code entry (additional component).

**Responsive proposal.** Keep destination, instructions and resend action in one column; allow paste and avoid making narrow code cells the only option. General layout basis: [Fluent — Layout](https://fluent2.microsoft.design/layout).

**Behavior boundary.** The baseline link-confirmation screen needs no OTP component. The catalogued code-entry variant requires an OTP contract; expiry and resend limits are backend-owned.

**Source observations.**

- [GOV.UK — Confirm an email address](https://design-system.service.gov.uk/patterns/confirm-an-email-address/) (guidance; checked 2026-09-28). Email confirmation supports checking an address and recovery when the message does not arrive.
- [Carbon — Login](https://carbondesignsystem.com/patterns/login-pattern/) (guidance; checked 2026-09-28). Documents identification, password or alternate authentication, recovery, continuation and optional help; progressive authentication can route by identifier.

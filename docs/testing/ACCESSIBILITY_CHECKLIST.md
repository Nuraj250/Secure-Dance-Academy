# Accessibility Checklist

This checklist verifies the UI against WCAG 2.2 AA expectations and the approved
UI blueprint. [NFR-06]

## Global Checks

- [ ] Every screen has a single, descriptive page title.
- [ ] Heading order is logical and does not skip levels.
- [ ] Interactive controls have visible labels or accessible names.
- [ ] Colour is not the only indicator for state, status, or meaning.
- [ ] Focus indicators are visible and meet contrast expectations.
- [ ] Zoom at 200 percent does not hide content or disable controls.
- [ ] Text reflows without horizontal scrolling at mobile widths.
- [ ] Motion does not block access to content or actions.

## Keyboard Checks

- [ ] Tab order matches the visual order.
- [ ] Skip links or equivalent shortcuts are available on long layouts.
- [ ] All buttons, links, menus, dialogs, and tabs are keyboard accessible.
- [ ] Escape closes dismissible overlays where appropriate.
- [ ] Focus returns to the triggering control after modal dismissal.

## Forms

- [ ] Each input has a programmatic label.
- [ ] Helper text and error text are associated with the relevant field.
- [ ] Validation errors are announced to assistive technology.
- [ ] Required fields are clearly marked.
- [ ] Password and sensitive fields do not expose values unnecessarily.

## Tables and Lists

- [ ] Table headers are announced correctly.
- [ ] Row actions have accessible names.
- [ ] Empty states communicate next steps.
- [ ] Pagination controls are reachable and labelled.

## Dialogs and Toasts

- [ ] Dialogs trap focus while open.
- [ ] Toasts are readable without requiring hover.
- [ ] Success and error toasts are announced in a non-disruptive way.

## Role-Based Screens

- [ ] Dashboard navigation works at 320px width.
- [ ] Authenticated users can reach their allowed screens without keyboard traps.
- [ ] Forbidden screens explain the failure without exposing sensitive data. [SR-02, SR-09]

## Manual Verification Record

- Screen reader: verify with the browser and system reader used in the release
  environment.
- Colour contrast: verify primary text, muted text, and disabled controls.
- Mobile review: verify login, dashboard, profile, and data tables on a narrow
  viewport.


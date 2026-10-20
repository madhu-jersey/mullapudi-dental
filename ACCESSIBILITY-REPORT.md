# Accessibility and contrast check

Checked on 20 Oct 2026 against WCAG 2.1 AA for the client palette: deep green #183630, cream #E3DAC9 and gold #E5C690 (other tones are derived from these). Contrast ratios come from the WCAG relative-luminance formula.

## Colour contrast (text)

| Text / background | Ratio | AA normal (4.5) | Used for |
|---|---|---|---|
| Dark text #122925 on white | 15.33 | Pass | Headlines, labels |
| Brand green #183630 on white | 13.05 | Pass | Logo, buttons, links, icons |
| Brand green #183630 on light cream #F4EFE6 | 11.39 | Pass | Hero, tinted sections |
| Brand green #183630 on cream #E3DAC9 | 9.41 | Pass | |
| Brand green #183630 on hero gradient #EDE5D6 | 10.43 | Pass | Hero headline |
| Muted green #4A6560 on white | 6.32 | Pass | Subheadings, TBC labels |
| Muted green #4A6560 on light cream | 5.52 | Pass | |
| White on brand green #183630 | 13.05 | Pass | Primary buttons |
| Gold #E5C690 on brand green #183630 | 7.96 | Pass | Hero chip icons, kicker on dark green |
| Gold #E5C690 on darkest green #0F241F | 9.91 | Pass | Footer logo, footer link hover |
| Darkest green #0F241F on gold #E5C690 | 9.91 | Pass | Gold buttons on the footer and closing band |
| Light cream #F4EFE6 on darkest green | 14.19 | Pass | Footer body text |
| Body grey #5B5B5B on white | 6.79 | Pass | Body text |
| Body grey #5B5B5B on light cream | 5.93 | Pass | |
| Body grey #5B5B5B on hero gradient #EDE5D6 | 5.43 | Pass | Hero text |

### Pairs that fail and how they are handled

| Pair | Ratio | Decision |
|---|---|---|
| Gold #E5C690 on white | 1.64 (fail) | Never used for text on light backgrounds. Gold appears on dark green only, and as bar fills. |
| Deeper gold #B08A45 on white | 3.20 | Used only for review stars and the hero dust, which are decorative. Star rows have a text alternative and the rating is also given as text. |
| Cream #E3DAC9 on white | 1.39 | Borders, dividers and dot patterns only. Never used for information. |

## Structure and semantics

- One `<h1>` on each page. On the home page it is the hero headline. The floating service chips beside the arch are decorative (`aria-hidden`). On service pages the `<h1>` is the service name. Headings follow in order (h2 sections, h3 cards).
- Landmarks: `header`, `nav` (Main, Mobile, Breadcrumb, Quick actions), `main#main`, and `footer`. Each section is labelled by its heading.
- A skip-to-content link is the first focusable element.
- Every form field has a `<label>`. Required fields have `aria-required` and a visible marker, and the meaning of the marker is stated in text. Errors are linked to fields with `aria-describedby`, announced through `aria-live`, and fields get `aria-invalid`. On a failed submit, focus moves to the first invalid field.
- Error and "please call" messages: `role="alert"`. Success message (when a backend is connected): `role="status"`, and it receives focus.
- Accordions use `<button aria-expanded aria-controls>` with `role="region"` panels. Collapsed panels are `inert`. The first item is open by default.
- The lightbox is a `role="dialog"` with `aria-modal`. It traps focus, closes with Esc, supports the arrow keys, and returns focus to the photo that opened it.
- The mobile menu traps focus, closes with Esc, and is `inert` while closed.
- Image placeholders use `role="img"` with descriptive labels, and decorative frames are `aria-hidden`. The hero tooth keeps its descriptive `alt`. Real photos must each get descriptive `alt` text.
- External links state "(opens in a new tab)" for screen readers. The hero rating card links to Google reviews and says so.
- The language toggle uses `aria-pressed` and updates `<html lang>`. Telugu text carries `lang="te"`.

## Keyboard and focus

- All interactive elements can be reached by keyboard. Focus rings are a 3px brand-green outline, and gold on dark green backgrounds.
- Touch targets are at least 44px (buttons 44–56px, nav links 44px, carousel dots 28×44px, footer links 44px).

## Motion

- `prefers-reduced-motion: reduce` makes all content appear at once. It also turns off smooth in-page link scrolling, scroll parallax, the hero mouse parallax, the tooth float and lean, sparkle twinkle, badge float, floor-ring glow, eye blinking, carousel auto-advance, count-up and page transitions.
- The hero mouse parallax and the tooth lean run only with a fine pointer (mouse); touch screens are left still.
- Content can be read without JavaScript. Reveal styles apply only when the `js` class is set, and a 3-second fallback removes that class if the script fails to load.
- The reviews carousel does not auto-advance (`autoAdvance` in `src/reviews.json`).

## Responsive

- Checked at 375, 768 and 1440px wide on the home page and all eleven service pages (20 Oct 2026): no horizontal page scroll (`scrollWidth` equals the viewport width). The only sideways scrolling is in the intended carousels (Reviews, and Why Choose Us on phones).

## Still to check

- A run of `prefers-reduced-motion` in a real browser setting (the rules were checked in the code; the preview browser could not emulate it).
- Alt text for each real photo, and the contrast of any text placed over photos.
- A screen reader pass (NVDA + Chrome, TalkBack on Android) and a Lighthouse run on a mid-range Android phone.

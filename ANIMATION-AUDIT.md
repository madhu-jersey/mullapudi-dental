# Animation and effects audit

The original template was audited on 18 Oct 2026 (headless Edge; 360 to 1440px; touch emulation; reduced motion; 4× CPU throttle) and the fixes listed below were made then. This build keeps all of them. Since then the home hero was replaced with the green "arch" hero, the hero particle field was removed, and the fonts changed to Poppins and Inter from Google Fonts. The rows for the new hero were checked in the preview browser at 375, 768 and 1440px. The old frame-rate measurements described the previous hero, so they were dropped; re-measure on a real phone before launch.

## Results by effect

| Effect | File · selector | Desktop | Mobile | Notes |
|---|---|---|---|---|
| Hero entrance: headline lines, arch opens, gold frame draws, tooth rises, copy and chips fade in | site.css "Home hero: the arch" block, `.line > span` | OK, plays once | OK | Transform, opacity and clip-path only |
| Hero loops: tooth float, sparkle twinkle, badge float, floor-ring glow | site.css `mascotFloat`, `shTwinkle`, `shBadge`, `shGlow` | OK | OK | Pause off screen (`data-float-scope`) and in hidden tabs |
| Hero mouse parallax | site.js (sets `--px` / `--py`); site.css `.sh-layer` | OK, one rAF per move, geometry cached | Off (no fine pointer) | New |
| Scroll reveals (rise and fade, stagger) | site.css `[data-reveal]`; site.js reveal observer | OK, once each via IntersectionObserver | OK | — |
| Service title word reveal | site.css `.split .w` | OK | OK | — |
| Services index list: row hover, arrow nudge | site.css `.h-svc*` | OK | Touch reset | Any number of services (11 now) |
| Why Choose Us stage sequence and ripple | site.css `.why__col*`, `whyRipple` | OK | OK, swipe row | — |
| Doctor photo curtain, frame, chip, hover sheen and tilt | site.css `.doc__media*`, `.doc__reveal*` | OK | Touch reset | Alternating layout kept |
| Scroll parallax (hero tooth, doctor photos, dots) | site.js `[data-parallax]` | OK, batched reads and writes | OK | — |
| Tooth lean towards cursor | site.js `[data-mascot-lean]` | OK, cached geometry | Off on touch | — |
| Tooth eyes follow, blink | mascot-eyes.js | OK, stays inside lenses; overlay box matches the image box at every size | Follows tap, recentres after 2 s | — |
| Floating badges (service-page heroes) | site.css `.float` | OK | OK | — |
| Scroll cue | site.css `cue` | OK, fades after first scroll | Hidden under 960px | — |
| Header shadow on scroll | site.css `.header::after` | OK | OK | — |
| Nav underline, scroll spy | site.css `.nav a::after`; site.js scroll spy | OK | — | — |
| Buttons: lift, magnetic pull, hover shadow | site.css `.btn`; site.js magnetic | OK | Lift reset on touch | — |
| Rating overview: count-up, stars, bars | site.css `.rv-*`; site.js count-up | OK (4.8 and 68) | Tap shows bar tooltip | Bars stay empty until the star breakdown is confirmed |
| Reviews carousel: swipe, arrows, dots | site.css `.carousel*`; site.js | Two reviews fit, controls hidden | Swipe and arrows OK | — |
| Gallery: viewer, swipe | gallery.js; site.css `.ggrid`, `.lightbox*` | OK | OK | Five placeholder tiles, so no "view more" |
| Map embed | build.mjs `.map__embed` | Lazy loaded | Lazy loaded | — |
| FAQ accordion | site.css `.acc__panel` | Height animation | Same | Kept, see below |
| Booking: focus underline, label lift, period cards, slot grid, slot pulse, error shake | booking.js; site.css `.bk*` | OK | OK at 375px | Slots listed locally while no backend is connected |
| Booking vs sticky mobile bars | site.css `.fab`, `.mbar` | — | Both step aside at the form | — |
| Page fade between pages | site.css view transitions / `pageFade` | OK | OK | — |

## Fixes from the original audit (kept)

1. **Shadows:** box-shadow no longer animates. Hover shadows live on a pseudo-element that fades in with opacity.
2. **Form controls:** inputs, period cards, slots and accordion borders don't transition box-shadow.
3. **Booking slot pulse:** a ring that scales and fades on `::after`.
4. **Skip link:** slides in with `transform`, not `top`.
5. **Carousel dots:** the active dot stretches with `scaleX`, not `width`.
6. **Touch screens:** lifts, tilts, glows and the spotlight reset under `hover: none`.
7. **Rating tooltip:** tapping a row shows it for 1.6 seconds.
8. **Hidden tabs:** looping CSS animations pause while the tab is hidden (`.is-tab-hidden`).
9. **Tooth lean:** geometry is cached in page coordinates (the new hero mouse parallax does the same).
10. **Gallery viewer:** the next and previous photos preload.
11. **Mobile booking:** the floating "Book" pill hides inside the booking section, and the bottom Call/Directions bar steps aside while the submit button is on screen.

## Left as is, with reasons

- **The FAQ expand and the gallery's "view more"** animate height. Both run only on a click, last under 0.5 s, and were asked for in the original brief.
- **Web fonts** load from Google Fonts with `display=swap`, so there can be a small layout shift as Poppins and Inter arrive. Self-hosting them with `<link rel="preload">` would remove most of it.
- **Safari on iOS and Chrome on Android hardware** weren't available. Real-device checks are still worth doing.

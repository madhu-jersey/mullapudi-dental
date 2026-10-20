# Mullapudi Dental Clinic: website

A static site with no framework. The home page and eleven service pages are generated from one layout and one service template.

```
src/data.mjs      clinic facts, doctors, all service content (draft medical copy)
src/reviews.json  Google rating, reviews and map links
src/gallery.json  clinic photos (placeholders until supplied)
src/icons.mjs     inline SVG icon set
src/build.mjs     templates, writes index.html + services/<slug>/index.html
src/serve.mjs     local preview server (no dependencies)
assets/css/site.css
assets/js/site.js        menu, reveals, parallax, hero mouse parallax, carousel, language toggle, opening hours
assets/js/booking.js     booking form (CONFIG at the top)
assets/js/gallery.js     gallery "view more" and photo viewer
assets/js/mascot-eyes.js the hero tooth's eyes follow the cursor
```

Build: `node src/build.mjs`. Preview: `node src/serve.mjs`, then open http://localhost:4173.

Routes are `/` and `/services/<slug>/` for each service: `dental-implants`, `root-canal-treatment`, `braces`, `paediatric-dentistry`, `oral-surgery`, `laser-gum-therapy`, `invisible-aligners`, `crowns-bridges-veneers`, `complete-dentures`, `dental-radiography` and `cosmetic-dentistry`. Any static host serves these as folder index pages. Upload everything except `src/`.

External resources: Google Fonts (Poppins 700/800 for headings, Inter for text, Noto Sans Telugu for Telugu, `display=swap`) and the Google Maps embed. Scrolling is the browser's native scrolling (no smooth-scroll library), so the wheel responds instantly; in-page links glide to their section.

See `PLACEHOLDERS.md` for what the client must supply, `BOOKING.md` for the booking form, and `ACCESSIBILITY-REPORT.md` for the contrast and accessibility checks.

## Home hero

A deep-green hero lit with gold. On the left: a short kicker, the headline in cream, the subtitle and two buttons (gold "Book Appointment" and a glass "Call" button). On the right the tooth mascot (`assets/img/tooth-mascot.png` / `.webp`) stands in a lit green arch with a fine gold frame around it and two glass chips naming services. Styles: the "Home hero: the arch" block in `site.css`.

- **Backdrop** (CSS and inline SVG, no image): two slowly drifting light glows (green and gold), faint gold rings, rising gold dust and fine film grain.
- **Entrance (one sequence):** the headline reveals line by line, the arch opens upward, the gold frame draws itself, the tooth rises, then the text, buttons and chips appear.
- **Loops:** the tooth floats, the glows drift, dust rises and the chips bob gently. All pause when the hero is off screen or the tab is hidden.
- **Mouse (desktop only):** the arch tilts in 3D towards the cursor, a gold spotlight inside the arch follows it, and the tooth leans and its eyes follow (`mascot-eyes.js`). `site.js` sets `--px` / `--py` on the hero. Touch screens get no tilt; the eyes look at a tap for 2 seconds.
- **Reduced motion:** everything is shown in its final position and nothing moves.

The eye overlay uses the image's own 736 × 736 coordinates, so it stays aligned at any size as long as it sits in the same box as the image (it does: both are inside `.mascot__float`).

## Gallery

Photos are listed in `src/gallery.json` (`src`, `alt`, `caption`, `focus`). Every tile is a fixed 4:3 frame and photos of any shape are cropped evenly with `object-fit: cover`; `focus` (e.g. `top`, `left 30%`) chooses what stays visible. The first `initialCount` (5) show by default, the rest behind "View more photos".

To add photos:

```
node src/optimize-gallery.mjs   # makes 1600px and 800px WebP copies (uses Edge or Chrome)
node src/build.mjs
```

Photos narrower than `minWidth` (800px) are not shown; the tile asks for a larger photo and the build prints a warning. Behaviour lives in `assets/js/gallery.js` (view more/fewer, photo viewer).

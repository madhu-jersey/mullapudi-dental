# Placeholders to resolve before publishing

Every item below is shown on the site with a dashed "To be confirmed" label, or is marked with a comment in the source.
Text content lives in `src/data.mjs`, `src/build.mjs` and `src/reviews.json`. Run `node src/build.mjs` after editing.

| # | Item | Where it appears | What is needed |
|---|------|------------------|----------------|
| 1 | **Logo and tagline** | Header, footer | No logo file supplied, so the site uses a text logo ("MULLAPUDI" / "DENTAL CLINIC", from the clinic name). The line under the logo is to be confirmed. The favicon and home-screen icon (`assets/img/favicon.svg`, `favicon-48.png`, `apple-touch-icon.png`) are a simple gold tooth on green, made for this build. |
| 2 | **Year established and domain** | Footer copyright (`clinic.domain` in `data.mjs`) | Not supplied. No domain is hard-coded. |
| 3 | **Second phone and WhatsApp** | Not shown | Not supplied. No WhatsApp button until the client confirms a WhatsApp number. |
| 4 | **Holiday hours** | Opening hours, live "Open now" status | Hours are Mon to Sat 9 am to 8 pm, Sunday closed. Holiday exceptions are not handled. |
| 5 | **Map pin** | Contact map, directions links | Coordinates (16.7554642, 81.6845425) come from the supplied Google Maps link. Check the pin against the address. |
| 6 | **Second language** | Language toggle | The existing Telugu toggle is kept as a draft (navigation and button labels only). Confirm the language; a native speaker must review the strings in `site.js` (`TE`). |
| 7 | **Hero, about and why-us copy** | Home page | Drafted from the brief and the client's about text, with unverifiable claims ("best treatments", "advanced technology", "high standards") left out. Needs client approval. |
| 8 | **Doctor details** | Doctors section, booking dropdown | Degrees (BDS, FGD; BDS, MDS; BDS, MDS) and titles (Founder; Consultant Paedodontist; Consultant Periodontist) are shown as supplied and labelled "to be verified". Specialty for Dr. Nithisha Mullapudi, services for Dr. Nithisha Mullapudi and Dr. Divya Srujana, photos, registration numbers and quotes are all to be confirmed. No years of experience are shown. |
| 9 | **Google rating** | At-a-glance bar, reviews panel | 4.8 from 68 reviews, as supplied. Verify against the live listing. The star breakdown is not shown (bars empty, "Rating breakdown to be confirmed"). |
| 10 | **Reviews** | Reviews section | Three reviews copied exactly as supplied. Star ratings for each review are not supplied, so each card shows "Star rating to be confirmed" instead of stars. Initials for review 3 are to be confirmed. Confirm permission to use the text and that each review is still on the listing. Statements about painless treatment or modern equipment appear only inside these reviews. |
| 11 | **Gallery** | Gallery (5 placeholder tiles, captions "Clinic photo 1" to "Clinic photo 5") | Real photos of the clinic and their captions. Never use photos of another clinic. |
| 12 | **Booking** | Booking section | No backend: the form asks people to call 9347595030 and sends nothing. Appointment times, slot length and lunch break are not supplied, so the period and time-slot pickers are hidden. The 7-day booking window needs client confirmation. See `BOOKING.md`. |
| 13 | **Emergencies** | Home FAQ | Whether the clinic sees urgent cases. No service page has an emergency first-aid box until the client approves one. |
| 14 | **Insurance and payment** | Home FAQ | Not supplied; the answer says "please call to ask". |
| 15 | **Medical content approval** | All eleven service pages and the FAQ answers | Everything is a conservative draft. The dentists must review each problem, cause, treatment and FAQ. Items marked TBC inside services: implants (bone grafting), braces (options offered), paediatric dentistry (preventive treatments), oral surgery (bone grafting), laser gum therapy (laser treatment card), invisible aligners (systems offered), dental radiography (imaging types), cosmetic dentistry (other options). Recovery times show "To be confirmed by the doctor". |
| 16 | **SEO** | Page titles and descriptions | Home title and description as supplied. Service descriptions are built from each service summary. The site has no structured data; none was added, to avoid publishing unverified rating data. |
| 17 | **Hero image and colours** | Home hero, whole site | The tooth mascot and the green #183630 / cream #E3DAC9 / gold #E5C690 palette are kept from the previous build. Confirm, or supply replacements. |
| 18 | **Tooth mascot rights** | Home hero | Confirm the clinic may use `assets/img/tooth-mascot.png`. |

// Static site generator: builds the home page and the six service pages
// from one shared layout and one service template.
// Run:  node src/build.mjs
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { clinic, doctors, services, TBC, RECOVERY_TBC } from "./data.mjs";
import { sprite, icon } from "./icons.mjs";
import { imageSize } from "./image-size.mjs";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..");
// Google review snapshot + Google Maps links: edit src/reviews.json
const rv = JSON.parse(readFileSync(process.env.REVIEWS_JSON || join(OUT, "src", "reviews.json"), "utf8"));
clinic.reviewsUrl = rv.reviewsUrl;
clinic.directions = rv.directionsUrl;
// Gallery photos: edit src/gallery.json (optimised copies are listed in src/gallery.manifest.json)
const gal = JSON.parse(readFileSync(process.env.GALLERY_JSON || join(OUT, "src", "gallery.json"), "utf8"));
const galManifest = existsSync(join(OUT, "src", "gallery.manifest.json")) ? JSON.parse(readFileSync(join(OUT, "src", "gallery.manifest.json"), "utf8")) : {};
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const tbc = (text = TBC, dark = false) => `<span class="tbc${dark ? " tbc--dark" : ""}">${esc(text)}</span>`;
const DRAFT = "Draft content, pending doctor review. Information is general and not a substitute for consultation.";
const year = new Date().getFullYear();

// Photo placeholder frame. Replace the inner content with
// <picture><source type="image/avif" ...><source type="image/webp" ...><img src="..." alt="..." loading="lazy" decoding="async"></picture>
// when the client supplies photos.
const ph = (label, note = "Photo to be supplied by client", cls = "", ic = "image", { tag = "div", decorative = false } = {}) =>
  `<${tag} class="ph ${cls}" ${decorative ? 'aria-hidden="true"' : `role="img" aria-label="${esc(label)} (placeholder, ${esc(note.toLowerCase())})"`}>${icon(ic)}<span>${esc(label)}<small>${esc(note)}</small></span></${tag}>`;

/* ------------------------------------------------------------------ */
/* Shared layout                                                       */
/* ------------------------------------------------------------------ */
function links(base) {
  const h = base || "";
  return {
    base: h, // prefix for asset paths ("" on the home page, "../../" on service pages)
    home: base ? base : "#top",
    sec: (id) => `${h}#${id}`,
    book: (service, doctor) => {
      if (!base) return `#booking`;
      const q = new URLSearchParams();
      if (service) q.set("service", service);
      if (doctor) q.set("doctor", doctor);
      const qs = q.toString();
      return `${base}${qs ? "?" + qs : ""}#booking`;
    },
    service: (slug) => `${h}services/${slug}/`,
  };
}

function bookAttrs(L, service, doctor) {
  const href = L.book(service, doctor);
  let a = `href="${href}"`;
  if (href.startsWith("#")) {
    if (service) a += ` data-book-service="${service}"`;
    if (doctor) a += ` data-book-doctor="${doctor}"`;
  }
  return a;
}

// Clinic logo: a text logo (no logo file has been supplied). Clinic name in brand green, the rest of the name below.
const logo = () => `
  <span class="logo__text logo__text--word">
    <span class="logo__name">${esc(clinic.logoName)}</span>
    <span class="logo__tag">${esc(clinic.logoTag)}</span>
  </span>`;

function header(L, current) {
  const nav = [
    ["home", "Home", L.home],
    ["about", "About", L.sec("about")],
    ["services", "Services", L.sec("services")],
    ["doctors", "Doctors", L.sec("doctors")],
    ["gallery", "Gallery", L.sec("gallery")],
    ["reviews", "Reviews", L.sec("reviews")],
    ["contact", "Contact", L.sec("contact")],
  ];
  const navLinks = nav.map(([k, t, h]) => `<a href="${h}"${current === k ? ' aria-current="page"' : ""} data-i18n="${k}">${t}</a>`).join("");
  const mLinks = nav.map(([k, t, h], i) => `<li style="--i:${i + 1}"><a href="${h}"><span data-i18n="${k}">${t}</span>${icon("arrow")}</a></li>`).join("");
  return `
<a class="skip-link" href="#main">Skip to content</a>
<div class="topbar">
  <div class="container topbar__inner">
    <div class="topbar__group">
      <span class="topbar__loc">${icon("pin")}<span data-i18n="location">Tanuku, Andhra Pradesh</span></span>
      <span class="topbar__sep" aria-hidden="true"></span>
      <a class="topbar__dir" href="${clinic.directions}" target="_blank" rel="noopener"><span data-i18n="directions">Get Directions</span><span class="sr-only"> (opens Google Maps in a new tab)</span></a>
    </div>
    <div class="topbar__group">
      <div class="lang" role="group" aria-label="Language">
        <button type="button" data-lang="en" aria-pressed="true">English</button>
        <button type="button" data-lang="te" aria-pressed="false" lang="te">తెలుగు</button>
      </div>
      <span class="topbar__sep" aria-hidden="true"></span>
      <a href="${clinic.phoneHref}">${icon("phone")}<span><span class="sr-only">Call the clinic on </span>${clinic.phoneDisplay}</span></a>
    </div>
  </div>
</div>
<header class="header">
  <div class="container header__inner">
    <a class="logo" href="${L.home}" aria-label="${esc(clinic.name)}, home">
      ${logo(L.base)}
    </a>
    <nav class="nav" aria-label="Main">${navLinks}</nav>
    <div class="header__cta">
      <a class="call-link" href="${clinic.phoneHref}">${icon("phone")}<span><span class="sr-only">Call the clinic on </span>${clinic.phoneDisplay}</span></a>
      <a class="btn btn--primary btn--sm header__book" ${bookAttrs(L)}><span data-i18n="book">Book Appointment</span></a>
      <button class="burger" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>
<div class="mmenu" id="mobile-menu" inert>
  <nav aria-label="Mobile">
    <ul class="mmenu__list">
      <li style="--i:0"><a class="btn btn--primary" ${bookAttrs(L)}><span data-i18n="book">Book Appointment</span>${icon("arrow")}</a></li>
      ${mLinks}
    </ul>
  </nav>
  <div class="mmenu__foot">
    <a href="${clinic.phoneHref}">Call ${clinic.phoneDisplay}</a>
    <a href="${clinic.directions}" target="_blank" rel="noopener">Get Directions<span class="sr-only"> (opens in a new tab)</span></a>
    <span>${clinic.hours.weekText} · ${clinic.hours.sunText}</span>
  </div>
</div>`;
}

function footer(L) {
  return `
<footer class="footer">
  <div class="container">
    <div class="footer__grid">
      <div>
        <a class="logo" href="${L.home}" aria-label="${esc(clinic.name)}, home">${logo(L.base)}</a>
        <p class="footer__tag">${esc(clinic.name)}, Tanuku</p>
        <address style="margin-top:12px">${clinic.addressLines.join("<br>")}</address>
      </div>
      <div>
        <h2>Explore</h2>
        <ul>
          <li><a href="${L.home}">Home</a></li>
          <li><a href="${L.sec("about")}">About</a></li>
          <li><a href="${L.sec("services")}">Services</a></li>
          <li><a href="${L.sec("doctors")}">Doctors</a></li>
          <li><a href="${L.sec("gallery")}">Gallery</a></li>
          <li><a href="${L.sec("reviews")}">Reviews</a></li>
          <li><a href="${L.sec("contact")}">Contact</a></li>
        </ul>
      </div>
      <div>
        <h2>Services</h2>
        <ul>${services.map((s) => `<li><a href="${L.service(s.slug)}">${s.name}</a></li>`).join("")}</ul>
      </div>
      <div>
        <h2>Contact</h2>
        <a class="tel" href="${clinic.phoneHref}">${clinic.phoneDisplay}</a>
        <p><a class="footer__mail" href="mailto:${clinic.email}">${clinic.email}</a></p>
        <p>Mon to Sat: ${clinic.hours.week}<br>Sun: ${clinic.hours.sun}</p>
        <div class="btn-row">
          <a class="btn btn--yellow" ${bookAttrs(L)}>Book Appointment${icon("arrow")}</a>
          <a class="btn btn--ghost-light" href="${clinic.directions}" target="_blank" rel="noopener">Get Directions${icon("external")}<span class="sr-only"> (opens in a new tab)</span></a>
        </div>
      </div>
    </div>
    <div class="footer__bottom">
      <p>© ${year} ${esc(clinic.name)}. ${esc(clinic.domain)}</p>
      <p>Tanuku, Andhra Pradesh</p>
    </div>
  </div>
</footer>
<a class="btn btn--primary fab" ${bookAttrs(L)}>Book${icon("calendar")}</a>
<nav class="mbar" aria-label="Quick actions">
  <a href="${clinic.phoneHref}">${icon("phone")}Call</a>
  <a href="${clinic.directions}" target="_blank" rel="noopener">${icon("pin")}Directions<span class="sr-only"> (opens in a new tab)</span></a>
</nav>`;
}

function layout({ title, description, base, current, body, extra = "" }) {
  const L = links(base);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#183630">
<script>document.documentElement.classList.add("js");if(window.CSSViewTransitionRule)document.documentElement.classList.add("vt");setTimeout(function(){if(!window.__mdReady)document.documentElement.classList.remove("js")},3000);</script>
<!-- Browsers that support it load a service page in the background once the pointer rests on its link,
     so opening it is near instant. Other pages are only fetched ahead. -->
<script type="speculationrules">{"prerender":[{"where":{"selector_matches":"a[href*='services/']"},"eagerness":"moderate"}],"prefetch":[{"where":{"selector_matches":"a.logo, .nav a, .crumbs a"},"eagerness":"moderate"}]}</script>
<!-- Type: Poppins 700/800 (headings) + Inter (text), Google Fonts.
     Noto Sans Telugu covers Telugu text; Google only downloads it when Telugu characters appear. -->
<link rel="icon" type="image/svg+xml" href="${base}assets/img/favicon.svg">
<link rel="icon" type="image/png" sizes="48x48" href="${base}assets/img/favicon-48.png">
<link rel="apple-touch-icon" href="${base}assets/img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Poppins:wght@700;800&amp;display=swap" media="print" onload="this.media='all'">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu:wght@500;700&amp;display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Poppins:wght@700;800&amp;display=swap"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu:wght@500;700&amp;display=swap"></noscript>
<link rel="stylesheet" href="${base}assets/css/site.css">
</head>
<body id="top">
${sprite()}
${header(L, current)}
<main id="main">
${body(L)}
</main>
${footer(L)}
${extra}
<script src="${base}assets/js/site.js" defer></script>
</body>
</html>
`;
}

/* ------------------------------------------------------------------ */
/* Reusable blocks                                                     */
/* ------------------------------------------------------------------ */
const head = (eyebrow, title, intro = "", cls = "") => `
  <div class="section-head ${cls}">
    <div>
      <p class="eyebrow" data-reveal>${eyebrow}</p>
      <h2 class="section-title" data-reveal>${title}</h2>
      ${intro ? `<p class="section-intro" data-reveal>${intro}</p>` : ""}
    </div>
  </div>`;

function accordion(id, items, firstOpen = true) {
  return `<div class="acc" data-stagger="80">${items
    .map((it, i) => {
      const open = firstOpen && i === 0;
      return `
    <div class="acc__item${open ? " is-open" : ""}" data-reveal>
      <h3 class="acc__q"><button class="acc__btn" type="button" id="${id}-b${i}" aria-expanded="${open}" aria-controls="${id}-p${i}">${esc(it.q)}<span class="acc__chev">${icon("chevron")}</span></button></h3>
      <div class="acc__panel" id="${id}-p${i}" role="region" aria-labelledby="${id}-b${i}"${open ? "" : " inert"}><div><p>${it.html || esc(it.a)}${it.tbc ? " " + tbc() : ""}</p></div></div>
    </div>`;
    })
    .join("")}
  </div>`;
}

function closingBand(L, s) {
  return `
<section class="band" aria-labelledby="band-title">
  <div class="dots" aria-hidden="true"></div>
  <div class="container band__inner">
    <div>
      <h2 id="band-title" data-reveal>Talk to our dental team</h2>
      <p data-reveal>Call the clinic on <a href="${clinic.phoneHref}">${clinic.phoneDisplay}</a> or request an appointment online.</p>
    </div>
    <div class="btn-row" data-reveal>
      <a class="btn btn--yellow" ${bookAttrs(L, s && s.slug)}>Book Appointment${icon("arrow")}</a>
      <a class="btn btn--ghost-light" href="${clinic.phoneHref}">${icon("phone")}Call Clinic</a>
    </div>
  </div>
</section>`;
}

const LIGHTBOX = `
  <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-labelledby="lightbox-title" hidden>
    <h2 class="sr-only" id="lightbox-title">Clinic photo viewer</h2>
    <div class="lightbox__backdrop" data-lb-close></div>
    <figure class="lightbox__stage">
      <div class="lightbox__media" data-lb-media></div>
      <figcaption class="lightbox__cap"><span class="lightbox__text" data-lb-caption></span><span class="lightbox__count" data-lb-count aria-live="polite"></span></figcaption>
    </figure>
    <button class="lightbox__btn lightbox__prev" type="button" aria-label="Previous photo" data-lb-prev>${icon("arrow-left")}</button>
    <button class="lightbox__btn lightbox__next" type="button" aria-label="Next photo" data-lb-next>${icon("arrow")}</button>
    <button class="lightbox__btn lightbox__close" type="button" aria-label="Close photo viewer" data-lb-close>${icon("close")}</button>
  </div>`;

/* ------------------------------------------------------------------ */
/* Home page                                                           */
/* ------------------------------------------------------------------ */
function home(L) {
  // Services: an index list. The whole row opens the service page; "Book" keeps its own action.
  const serviceRows = services
    .map(
      (s) => `
      <li class="h-svc__row">
        <span class="h-svc__icon" aria-hidden="true">${icon(s.icon)}</span>
        <div class="h-svc__text">
          <h3 class="h-svc__name"><a class="h-svc__link" href="${L.service(s.slug)}">${s.name}</a></h3>
          <p class="h-svc__sub">${esc(s.sub)}</p>
          <p class="h-svc__points">${s.points.map(esc).join(", ")}</p>
        </div>
        <a class="h-svc__book" ${bookAttrs(L, s.slug)} aria-label="Book an appointment for ${s.name}">Book</a>
        <span class="h-svc__go" aria-hidden="true">${icon("arrow")}</span>
      </li>`
    )
    .join("");

  const why = [
    ["tooth", "Eleven listed services", "From root canal treatment and braces to implants and dentures."],
    ["pin", "On Rashtrapathi Road", "1st Floor, Veerabhadra Towers, opposite Boys' High School Main Gate, Tanuku."],
    ["clock", "Open Monday to Saturday", "9 am to 8 pm. The clinic is closed on Sundays."],
    ["users", "A team of three dentists", "Including consultants in children's dentistry and gum care (details to be confirmed)."],
  ]
    .map(
      ([ic, t, d]) => `
      <li class="h-why__item">
        <span class="h-why__icon" aria-hidden="true">${icon(ic)}</span>
        <h3>${t}</h3>
        <p>${d}</p>
      </li>`
    )
    .join("");

  const docCards = doctors
    .map(
      (d, i) => `
      <article class="doc" aria-labelledby="doc-${d.id}">
        <div class="doc__media" data-reveal="scale">
          <div class="doc__photo" data-parallax="16">
            <!-- PHOTO PLACEHOLDER: ${d.name}. Check the photo matches this name before publishing. -->
            <div class="doc__reveal">${ph(`Photo of ${d.name}`, "Photo to be supplied by client", "", "user")}</div>
          </div>
          <p class="doc__chip" aria-hidden="true">${icon("steth")}${d.degree ? esc(d.degree) : "Degrees to be confirmed"}</p>
        </div>
        <div class="doc__body">
          <p class="doc__role" data-reveal>${[d.role, d.specialty].filter(Boolean).map(esc).join(", ")}${d.specialty ? " " + tbc("Title to be confirmed") : " " + tbc("Specialty to be confirmed")}</p>
          <h3 class="doc__name" id="doc-${d.id}" data-reveal>${d.name}</h3>
          <p class="doc__deg" data-reveal>${d.degree ? esc(d.degree) + " " : ""}${tbc(d.degree ? "Degrees as supplied, to be verified" : "Degrees to be confirmed")}</p>
          <blockquote class="quote" data-reveal>A short message from ${d.name} to patients will appear here. ${tbc("Quote to be supplied")}</blockquote>
          <p class="doc__meta" data-reveal><span>Registration number:</span> ${tbc()}</p>
          <p class="doc__list-title" data-reveal>Key services</p>
          ${d.services.length ? `<ul class="doc__list" data-stagger="80">${d.services.map((s) => `<li data-reveal>${icon("check")}${esc(s)}</li>`).join("")}</ul>` : ""}
          <p class="doc__meta" data-reveal>${d.services.length ? "Key services list" : "Services for this doctor"} ${tbc()}</p>
          <a class="btn btn--primary" ${bookAttrs(L, null, d.id)} data-reveal>Book with this doctor${icon("arrow")}</a>
        </div>
      </article>`
    )
    .join("");

  // Gallery tiles: one fixed 4:3 frame each; photos are cropped to fit with object-fit: cover.
  const galPhotos = gal.photos.map((p) => {
    if (!p.src) return { ...p, state: "placeholder" };
    const file = join(OUT, p.src);
    if (!existsSync(file)) { console.warn("gallery: missing file " + p.src); return { ...p, state: "placeholder" }; }
    const size = imageSize(file);
    if (!size) { console.warn("gallery: not a JPG, PNG or WebP " + p.src); return { ...p, state: "rejected", reason: "This file is not a JPG, PNG or WebP image." }; }
    if (size.width < gal.minWidth) {
      console.warn(`gallery: ${p.src} is ${size.width}px wide; photos must be at least ${gal.minWidth}px wide`);
      return { ...p, state: "rejected", reason: `This photo is ${size.width}px wide. Please supply a larger photo, at least ${gal.minWidth}px wide, so it stays sharp.` };
    }
    const m = galManifest[p.src];
    const fresh = m && m.mtime === statSync(file).mtimeMs;
    return { ...p, state: "photo", size, opt: fresh ? m : null };
  });
  const galReal = galPhotos.filter((p) => p.state === "photo").length;
  const galInitial = gal.initialCount || 5;
  const gallery = galPhotos
    .map((p, i) => {
      const extra = i >= galInitial ? " is-extra" : "";
      if (p.state === "rejected") {
        return `
        <li class="gtile${extra}" data-index="${i}">
          <div class="gitem gitem--rejected" role="note"><span class="gitem__frame"><span class="gitem__msg">${icon("alert")}<strong>${esc(p.caption)}</strong>${esc(p.reason)}</span></span></div>
        </li>`;
      }
      let media, full = "", dims = "";
      if (p.state === "photo") {
        const focus = esc(p.focus || "center");
        const o = p.opt;
        const src = o ? o.small.src : p.src;
        const srcset = o ? ` srcset="${o.small.src} ${o.small.w}w, ${o.large.src} ${o.large.w}w" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"` : "";
        full = ` data-full="${o ? o.large.src : p.src}"`;
        dims = ` data-w="${p.size.width}" data-h="${p.size.height}"`;
        media = `<img class="gitem__img" src="${src}"${srcset} width="${p.size.width}" height="${p.size.height}" alt="${esc(p.alt)}" loading="lazy" decoding="async" style="object-position:${focus}">`;
      } else {
        media = ph(p.caption, "Photo to be supplied", "", "image", { tag: "span", decorative: true });
      }
      return `
        <li class="gtile${extra}" data-index="${i}">
          <button type="button" class="gitem" data-caption="${esc(p.caption)}"${full}${dims} aria-label="Open photo: ${esc(p.caption)}">
            <span class="gitem__frame${p.state === "photo" ? " is-loading" : ""}">${media}</span>
            <span class="gitem__cap">${esc(p.caption)}${icon("expand")}</span>
          </button>
        </li>`;
    })
    .join("");

  const reviews = rv.reviews
    .map(
      (r, i) => `
      <article class="rcard" style="--ci:${i}" aria-label="Review ${i + 1} of ${rv.reviews.length}${r.stars ? `, ${r.stars} stars` : ""}">
        <div class="rcard__top">
          ${r.stars ? `<div class="stars" role="img" aria-label="${r.stars} out of 5 stars">${icon("star").repeat(r.stars)}</div>` : tbc("Star rating to be confirmed")}
          <span class="rcard__time">${esc(r.time)}</span>
        </div>
        <p class="rcard__text" id="rv-text-${i}">${esc(r.text)}</p>
        <button class="rcard__more" type="button" aria-expanded="false" aria-controls="rv-text-${i}" hidden>Read more</button>
        <div class="rcard__who">
          <span class="avatar" aria-hidden="true">${r.initials ? esc(r.initials.charAt(0)) : icon("user")}</span>
          <p class="rcard__name">${r.initials ? `${esc(r.initials)}<span class="sr-only">, Google reviewer</span>` : `Google reviewer ${tbc("Initials to be confirmed")}`}</p>
          <a class="rcard__g" href="${rv.reviewsUrl}" target="_blank" rel="noopener">Google${icon("external")}<span class="sr-only"> (view this review on Google, opens in a new tab)</span></a>
        </div>
      </article>`
    )
    .join("");
  // Rating breakdown. Bar width = count / max(counts), so the largest row is full width.
  const bd = rv.breakdown;
  const counts = bd.counts;
  const known = [5, 4, 3, 2, 1].filter((n) => counts[n] != null);
  const allKnown = known.length === 5;
  const fmtNum = (n) => Number(n).toLocaleString("en-IN");
  const maxCount = Math.max(1, ...known.map((n) => counts[n]));
  const bars = [5, 4, 3, 2, 1]
    .map((n, i) => {
      const count = counts[n];
      const has = count != null;
      const w = has ? count / maxCount : 0;
      // Share of the listing total, shown on hover only once every count is confirmed
      const share = allKnown && bd.total ? Math.round((count / bd.total) * 100) : null;
      const label = has
        ? `${n} star${n > 1 ? "s" : ""}: ${count} review${count === 1 ? "" : "s"}${share != null ? ` (${share}%)` : ""}`
        : `${n} star${n > 1 ? "s" : ""}: count not available`;
      return `
          <li class="rv-bar rv-bar--${n}${has ? "" : " is-empty"}" style="--i:${i}">
            <div class="rv-bar__link"><span class="sr-only">${label}</span>
              <span class="rv-bar__label" aria-hidden="true">${n}${icon("star")}</span>
              <span class="rv-bar__track" aria-hidden="true">
                <span class="rv-bar__fill" style="--w:${w.toFixed(4)}"></span>
                ${has ? `<span class="rv-bar__glow" style="--w:${w.toFixed(4)}"></span>` : ""}
              </span>
              <span class="rv-bar__count" aria-hidden="true"${has ? ` data-rv-n="${count}"` : ""}>${has ? count : "–"}</span>
              ${share != null ? `<span class="rv-bar__tip" aria-hidden="true">${n} star${n > 1 ? "s" : ""} · ${share}%</span>` : ""}
            </div>
          </li>`;
    })
    .join("");

  const faqs = [
    { q: "What services does Mullapudi Dental Clinic provide?", a: services.map((s) => s.name).join(", ") + "." },
    { q: "What are the clinic hours?", a: "Monday to Saturday, 9 am to 8 pm. The clinic is closed on Sundays." },
    { q: "How do I request an appointment?", html: `Please call the clinic on <a class="hl" href="${clinic.phoneHref}">${clinic.phoneDisplay}</a>, or email <a class="hl" href="mailto:${clinic.email}">${clinic.email}</a>. Appointment times are confirmed by the clinic.` },
    { q: "Where is the clinic located?", html: `1st Floor, Veerabhadra Towers, opposite Boys' High School Main Gate, Rashtrapathi Road, Tanuku, Andhra Pradesh 534211. <a class="hl" href="${clinic.directions}" target="_blank" rel="noopener">Get directions<span class="sr-only"> (opens Google Maps in a new tab)</span></a>.` },
    { q: "What if my dental symptoms need urgent attention?", a: "Please call the clinic on " + clinic.phoneDisplay + " for advice. For heavy bleeding, swelling that affects breathing or swallowing, or a head injury, go to the nearest hospital emergency department.", tbc: true },
    { q: "Do you accept insurance, and how can I pay?", a: "Please call the clinic to ask.", tbc: true },
  ];

  return `
<!-- Home hero: a deep-green room lit with gold. The tooth stands in a lit arch (the arch echoes the
     pillars in the clinic's monogram) and steps slightly out of it; a gold frame draws itself around it.
     One entrance sequence (site.css "Home hero: the arch"); afterwards only slow ambient light, rising
     gold dust and film grain move. On desktop the arch tilts with the mouse (--px / --py from site.js)
     and a spotlight follows the cursor. Everything is still for prefers-reduced-motion. -->
<section class="hero hero--arch" aria-labelledby="hero-title" data-float-scope data-hero-stage>
  <div class="ha-bg" aria-hidden="true">
    <div class="ha-glow ha-glow--a"></div>
    <div class="ha-glow ha-glow--b"></div>
    <svg class="ha-arcs" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" focusable="false">
      ${[180, 260, 340, 420, 500, 580].map((r) => `<circle cx="760" cy="520" r="${r}"/>`).join("")}
    </svg>
    <div class="ha-dust">${[
      [56, 8, 3, 0], [62, 13, 2, 3.2], [70, 10, 4, 6.1], [78, 15, 2, 1.7], [84, 9, 3, 4.4], [90, 12, 2, 7.3],
      [66, 11, 2, 9.1], [74, 14, 3, 2.6], [88, 16, 2, 5.5], [95, 10, 3, 8.2], [48, 12, 2, 10.4], [58, 15, 2, 11.8],
    ].map(([x, d, s, t]) => `<i style="--x:${x}%;--dur:${d}s;--sz:${s}px;--t:-${t}s"></i>`).join("")}</div>
    <div class="ha-grain"></div>
  </div>

  <div class="container ha">
    <div class="ha-copy">
      <p class="ha-kicker" data-hero style="--d:80ms"><span class="ha-kicker__rule" aria-hidden="true"></span>${esc(clinic.name)}, Tanuku</p>
      <!-- Draft hero copy, for client approval -->
      <h1 class="hero__title ha-title" id="hero-title">
        <span class="line"><span style="--d:180ms">Dental care</span></span>
        <span class="line"><span style="--d:300ms">for your family,</span></span>
        <span class="line"><span style="--d:420ms">in Tanuku.</span></span>
      </h1>
      <p class="hero__sub ha-sub" data-hero style="--d:900ms">From root canal treatment and braces to implants, dentures and children's dentistry, at our clinic on Rashtrapathi Road.</p>
      <div class="btn-row hero__actions ha-actions" data-hero style="--d:1020ms">
        <a class="btn btn--gold" href="#booking"><span data-i18n="book">Book Appointment</span>${icon("arrow")}</a>
        <a class="btn btn--glass" href="${clinic.phoneHref}">${icon("phone")}<span><span class="sr-only">Call the clinic on </span>${clinic.phoneDisplay}</span></a>
      </div>
    </div>

    <div class="ha-stage">
      <div class="ha-tilt">
        <svg class="ha-frame" viewBox="0 0 100 130" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path pathLength="1" d="M1 129 V50 A49 49 0 0 1 99 50 V129 Z"/>
        </svg>
        <div class="ha-arch" aria-hidden="true">
          <div class="ha-arch__light"></div>
          <div class="ha-arch__floor"></div>
        </div>
        <!-- Hero mascot. Layers: halo (backdrop), parallax wrapper, cursor-lean wrapper,
             idle float, image; the floor shadow breathes in time with the float. -->
        <div class="mascot" data-hero="mascot">
          <div class="mascot__halo" aria-hidden="true"></div>
          <div class="mascot__parallax" data-parallax="14">
            <div class="mascot__lean" data-mascot-lean>
              <div class="mascot__float float-mascot">
                <picture>
                  <source type="image/webp" srcset="assets/img/tooth-mascot.webp">
                  <img class="mascot__img" src="assets/img/tooth-mascot.png" width="736" height="736" fetchpriority="high" decoding="async"
                       alt="Smiling tooth character in a white doctor's coat, with round glasses, a clipboard and a stethoscope">
                </picture>
                <!-- Eyes that follow the cursor. Coordinates are in the image's own 736 x 736 pixels,
                     so the layer scales with it. Each eye: a soft lens-coloured cover over the drawn
                     eyeball, then a new eyeball that moves (assets/js/mascot-eyes.js). -->
                <svg class="mascot__eyes" viewBox="0 0 736 736" aria-hidden="true" focusable="false">
                  <defs>
                    <radialGradient id="eyeLens" cx="50%" cy="45%" r="50%">
                      <stop offset="0" stop-color="#d2cdd6"/>
                      <stop offset=".6" stop-color="#bebac3"/>
                      <stop offset=".8" stop-color="#aba7b0" stop-opacity=".96"/>
                      <stop offset="1" stop-color="#a4a1aa" stop-opacity="0"/>
                    </radialGradient>
                    <radialGradient id="eyeBall" cx="42%" cy="38%" r="62%">
                      <stop offset="0" stop-color="#16302f"/>
                      <stop offset=".55" stop-color="#061614"/>
                      <stop offset=".85" stop-color="#1b3337"/>
                      <stop offset="1" stop-color="#2b4549"/>
                    </radialGradient>
                  </defs>
                  <g class="mascot__eye" data-eye data-cx="312" data-cy="242.8" data-lens-cx="290" data-lens-cy="236" data-lens-r="50">
                    <circle class="mascot__lens" cx="312" cy="242.8" r="27" fill="url(#eyeLens)"/>
                    <g class="mascot__ball" data-ball>
                      <g class="mascot__blink" data-blink>
                        <circle cx="312" cy="242.8" r="21.5" fill="url(#eyeBall)"/>
                        <ellipse cx="304.5" cy="234.5" rx="7.2" ry="6" fill="#fff" opacity=".92"/>
                        <circle cx="318.5" cy="250" r="2.4" fill="#fff" opacity=".55"/>
                      </g>
                    </g>
                  </g>
                  <g class="mascot__eye" data-eye data-cx="428.5" data-cy="242.7" data-lens-cx="444" data-lens-cy="235" data-lens-r="49">
                    <circle class="mascot__lens" cx="428.5" cy="242.7" r="27" fill="url(#eyeLens)"/>
                    <g class="mascot__ball" data-ball>
                      <g class="mascot__blink" data-blink>
                        <circle cx="428.5" cy="242.7" r="21.5" fill="url(#eyeBall)"/>
                        <ellipse cx="421" cy="234.4" rx="7.2" ry="6" fill="#fff" opacity=".92"/>
                        <circle cx="435" cy="250" r="2.4" fill="#fff" opacity=".55"/>
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
            </div>
          </div>
          <div class="mascot__shadow" aria-hidden="true"></div>
        </div>
        <p class="ha-chip ha-chip--a" aria-hidden="true"><span class="ha-chip__icon">${icon("smile")}</span>Braces and aligners</p>
        <p class="ha-chip ha-chip--b" aria-hidden="true"><span class="ha-chip__icon">${icon("implant")}</span>Dental implants</p>
      </div>
    </div>
  </div>
</section>

<!-- At a glance: rating, opening status, phone and location, overlapping the hero's lower edge -->
<section class="h-facts" aria-label="Clinic at a glance">
  <div class="container">
    <ul class="h-facts__bar" data-reveal>
      <li>
        <a class="h-facts__item" href="${rv.reviewsUrl}" target="_blank" rel="noopener">
          <span class="h-facts__icon h-facts__icon--star" aria-hidden="true">${icon("star")}</span>
          <span><strong>${bd.average.toFixed(1)} on Google</strong><span>${fmtNum(bd.total)} reviews<span class="sr-only"> (opens Google reviews in a new tab)</span></span></span>
        </a>
      </li>
      <li>
        <div class="h-facts__item">
          <span class="h-facts__icon" aria-hidden="true">${icon("clock")}</span>
          <span><strong class="h-facts__now" data-open-status>Open Monday to Saturday</strong><span>Mon to Sat ${clinic.hours.week}<br>${clinic.hours.sunText}</span></span>
        </div>
      </li>
      <li>
        <a class="h-facts__item" href="${clinic.phoneHref}">
          <span class="h-facts__icon" aria-hidden="true">${icon("phone")}</span>
          <span><strong>${clinic.phoneDisplay}</strong><span>Call to book a visit</span></span>
        </a>
      </li>
      <li>
        <a class="h-facts__item" href="${clinic.directions}" target="_blank" rel="noopener">
          <span class="h-facts__icon" aria-hidden="true">${icon("pin")}</span>
          <span><strong>${esc(clinic.locationLabel)}</strong><span>Veerabhadra Towers, 1st Floor<span class="sr-only"> (opens Google Maps in a new tab)</span></span></span>
        </a>
      </li>
    </ul>
  </div>
</section>

<section class="section home-sec h-services" id="services" aria-labelledby="services-title">
  <div class="container h-split">
    <div class="h-split__aside">
      <h2 class="h-title" id="services-title" data-reveal>Complete dental care, under one roof.</h2>
      <p class="h-lead" data-reveal>Eleven listed services for adults and children. The right option for you depends on an examination by the dentist.</p>
      <div class="btn-row" data-reveal>
        <a class="btn btn--primary" href="#booking">Book Appointment${icon("arrow")}</a>
      </div>
    </div>
    <ul class="h-svc" data-reveal>${serviceRows}</ul>
  </div>
</section>

<section class="section home-sec h-about" id="about" aria-labelledby="about-title">
  <div class="container">
    <div class="h-about__top">
      <!-- Draft about copy, rewritten from the client's text for approval -->
      <h2 class="h-title h-title--xl" id="about-title" data-reveal>Helping you smile with confidence.</h2>
      <div class="h-about__text" data-reveal>
        <p class="h-lead">Mullapudi Dental Clinic is a dental clinic on Rashtrapathi Road in Tanuku, offering a range of dental services under one roof.</p>
        <p>Our team aims to make every visit comfortable. Each treatment plan starts with an examination, because the right option depends on your teeth, gums and general health.</p>
      </div>
    </div>
    <dl class="h-stats" data-reveal>
      <div><dt>Listed services</dt><dd>${services.length}</dd></div>
      <div><dt>Dentists</dt><dd>${doctors.length}</dd></div>
      <div><dt>Days open each week (Mon to Sat)</dt><dd>6</dd></div>
    </dl>
    <ul class="h-points" data-reveal>
      <li><span class="h-points__icon" aria-hidden="true">${icon("tooth")}</span><div><strong>Treating and restoring teeth</strong><span>Root canal treatment, crowns, bridges and veneers.</span></div></li>
      <li><span class="h-points__icon" aria-hidden="true">${icon("smile")}</span><div><strong>Straightening teeth</strong><span>Braces and invisible aligners.</span></div></li>
      <li><span class="h-points__icon" aria-hidden="true">${icon("heart")}</span><div><strong>Care for children</strong><span>Paediatric dentistry for infants, children and teenagers.</span></div></li>
    </ul>
  </div>
</section>

<section class="section home-sec h-why" id="why" aria-labelledby="why-title">
  <div class="container">
    <div class="h-head">
      <h2 class="h-title" id="why-title" data-reveal>Why patients choose Mullapudi Dental</h2>
    </div>
    <ul class="h-why__grid" data-reveal>${why}</ul>
  </div>
</section>

<section class="section home-sec h-doctors" id="doctors" aria-labelledby="doctors-title">
  <div class="container">
    <div class="h-head h-head--split">
      <h2 class="h-title" id="doctors-title" data-reveal>Meet our doctors</h2>
      <p class="h-lead" data-reveal>Book with a doctor of your choice, or let us suggest one when you call.</p>
    </div>
    <div class="doctors">${docCards}</div>
  </div>
</section>

<section class="section home-sec h-reviews-sec" id="reviews" aria-labelledby="reviews-title">
  <div class="container">
    <div class="h-head h-head--split">
      <h2 class="h-title" id="reviews-title" data-reveal>What our patients say</h2>
      <div class="btn-row" data-reveal>
        <a class="btn btn--outline" href="${rv.reviewsUrl}" target="_blank" rel="noopener">View all Google reviews${icon("external")}<span class="sr-only"> (opens in a new tab)</span></a>
      </div>
    </div>
    <div class="h-reviews">
      <!-- Figures come from src/reviews.json (snapshot of the Google listing) -->
      <div class="rv-overview" data-reveal>
        <div class="rv-summary">
          <p class="rv-score"><span class="rv-score__num" data-rv-rating="${bd.average}">${String(bd.average.toFixed(1)).slice(0, -1)}<span class="rv-score__last">${String(bd.average.toFixed(1)).slice(-1)}</span></span><span class="sr-only"> out of 5</span></p>
          <div class="stars rv-stars" role="img" aria-label="Rated ${bd.average} out of 5 on Google">${icon("star").repeat(5)}</div>
          <p class="rv-count"><span data-rv-count="${bd.total}">${fmtNum(bd.total)}</span> Google reviews</p>
          <a class="btn btn--outline btn--sm" href="${rv.reviewsUrl}" target="_blank" rel="noopener">Write a review${icon("external")}<span class="sr-only"> (opens Google in a new tab)</span></a>
          <p class="rv-updated">Based on Google reviews. Updated ${esc(rv.capturedOnLabel)}.</p>
        </div>
        <div class="rv-divider" aria-hidden="true"></div>
        <div class="rv-dist">
          <h3 class="sr-only">Rating breakdown</h3>
          <ul class="rv-bars">${bars}</ul>
          ${allKnown ? "" : `<p class="rv-dist__tbc">${tbc("Rating breakdown to be confirmed")}</p>`}
        </div>
      </div>
      <div class="h-quotes" data-reveal>${reviews}</div>
    </div>
  </div>
</section>

<section class="section home-sec h-gallery" id="gallery" aria-labelledby="gallery-title">
  <div class="container">
    <div class="h-head h-head--split">
      <div>
        <h2 class="h-title" id="gallery-title" data-reveal>Inside the clinic</h2>
        <p class="h-lead" data-reveal>Photos of Mullapudi Dental Clinic will appear here once supplied.</p>
      </div>
      <p class="h-gallery__count" data-reveal>${galReal ? `${galReal} photograph${galReal === 1 ? "" : "s"} of the clinic` : tbc("Photos to be supplied")}</p>
    </div>
    <div class="gallery__wrap">
      <ul class="ggrid" id="gallery-grid" data-gallery data-initial="${galInitial}">${gallery}</ul>
    </div>
    ${galPhotos.length > galInitial ? `<div class="gallery__more">
      <button class="btn btn--outline gallery__toggle" type="button" aria-expanded="false" aria-controls="gallery-grid" data-gallery-toggle hidden>
        <span data-gallery-label>View more photos</span>${icon("chevron")}
      </button>
    </div>` : ""}
  </div>
</section>

<section class="section bk h-booking" id="booking" aria-labelledby="booking-title">
  <div class="container">
    <div class="bk__shell" data-reveal="scale">
      <!-- Left: light brand panel -->
      <div class="bk__panel">
        <h2 class="bk__title" id="booking-title">Book your appointment</h2>
        <p class="bk__lede">Tell us the care you need and a preferred date, then call the clinic to arrange your visit.</p>

        <ol class="bk__steps" data-stagger="110">
          <li data-reveal><span class="bk__n">1</span><p><strong>Choose a date</strong>The care you need and a preferred day.</p></li>
          <li data-reveal><span class="bk__n">2</span><p><strong>Call to confirm</strong>We agree the date and time with you.</p></li>
          <li data-reveal><span class="bk__n">3</span><p><strong>Visit the clinic</strong>${esc(clinic.addressShort)}.</p></li>
        </ol>

        <div class="bk__call">
          <a class="bk__tel" href="${clinic.phoneHref}"><span class="bk__tel-icon">${icon("phone")}</span><span><small>Prefer to talk?</small>${clinic.phoneDisplay}</span></a>
          <p class="bk__hours">${clinic.hours.weekText}<br>${clinic.hours.sunText}</p>
        </div>
      </div>

      <!-- Right: form -->
      <div class="bk__formwrap">
        <!-- Booking form: four steps revealed in turn. Slot times and the submission
             destination are configured at the top of assets/js/booking.js -->
        <form id="booking-form" action="#" method="post" novalidate aria-describedby="form-req-note">
          <div class="bk__formhead">
            <p class="bk__formtitle">Request an appointment</p>
            <p id="form-req-note" class="bk__req"><span class="req" aria-hidden="true">*</span> Required<span class="sr-only">: fields marked with an asterisk are required</span></p>
          </div>
          <!-- Shown by booking.js while no booking backend is connected (CONFIG.apiUrl is empty) -->
          <p class="bk-note bk-note--offline" data-bk-offline hidden>${icon("info")}<span>Please call the clinic on <a href="${clinic.phoneHref}">${clinic.phoneDisplay}</a> to book. Online requests are not switched on yet, so your details are not sent anywhere.</span></p>

          <fieldset class="bk-step" data-step="1">
            <legend class="bk-step__title"><span class="bk-step__n" aria-hidden="true">1</span>Your details</legend>
            <div class="bk__grid bk__grid--3">
              <div class="field">
                <label for="bk-name">Full name<span class="req" aria-hidden="true">*</span></label>
                <div class="bk__input">${icon("user")}<input class="input" id="bk-name" name="name" type="text" autocomplete="name" placeholder="Your name" required aria-required="true" aria-describedby="bk-name-err"></div>
                <p class="field__error" id="bk-name-err">${icon("info")}<span></span></p>
              </div>
              <div class="field">
                <label for="bk-phone">Mobile number<span class="req" aria-hidden="true">*</span></label>
                <div class="bk__input bk__input--prefix"><span class="bk__prefix" aria-hidden="true">+91</span><input class="input" id="bk-phone" name="phone" type="tel" inputmode="numeric" autocomplete="tel-national" placeholder="98765 43210" maxlength="14" required aria-required="true" aria-describedby="bk-phone-err"></div>
                <p class="field__error" id="bk-phone-err">${icon("info")}<span></span></p>
              </div>
              <div class="field">
                <label for="bk-email">Email<span class="req" aria-hidden="true">*</span></label>
                <div class="bk__input">${icon("mail")}<input class="input" id="bk-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required aria-required="true" aria-describedby="bk-email-err"></div>
                <p class="field__error" id="bk-email-err">${icon("info")}<span></span></p>
              </div>
            </div>
            <!-- Spam trap: hidden from people with CSS (not display:none); must stay empty -->
            <div class="bk-hp" aria-hidden="true"><label for="bk-website">Website</label><input id="bk-website" name="website" type="text" tabindex="-1" autocomplete="off" value=""></div>
          </fieldset>

          <fieldset class="bk-step" data-step="2">
            <legend class="bk-step__title"><span class="bk-step__n" aria-hidden="true">2</span>Choose your visit</legend>
            <div class="bk-visit">
              <div class="field bk-visit__date">
                <label for="bk-date">Preferred date<span class="req" aria-hidden="true">*</span></label>
                <div class="bk__input">${icon("calendar")}<input class="input" id="bk-date" name="date" type="date" required aria-required="true" aria-describedby="bk-date-err"></div>
                <p class="field__error" id="bk-date-err">${icon("info")}<span></span></p>
              </div>
              <fieldset class="field bk-periods" aria-describedby="bk-period-err">
                <legend class="label">Period<span class="req" aria-hidden="true">*</span></legend>
                <div class="bk-periods__row">
                  <label class="bk-period"><input type="radio" name="period" value="morning" required><span class="bk-period__card"><span class="bk-period__icon">${icon("sun")}</span><span class="bk-period__text"><strong>Morning</strong><small data-period-range="morning">10:00 AM to 2:00 PM</small></span><span class="bk-period__check" aria-hidden="true">${icon("check")}</span></span></label>
                  <label class="bk-period"><input type="radio" name="period" value="evening"><span class="bk-period__card"><span class="bk-period__icon">${icon("moon")}</span><span class="bk-period__text"><strong>Afternoon &amp; evening</strong><small data-period-range="evening">2:00 PM to 8:00 PM</small></span><span class="bk-period__check" aria-hidden="true">${icon("check")}</span></span></label>
                </div>
                <p class="field__error" id="bk-period-err">${icon("info")}<span></span></p>
              </fieldset>
            </div>
            <p class="bk-note" data-bk-sunday hidden>${icon("info")}The clinic is closed on Sundays. Please choose another date.</p>
            <!-- Shown by booking.js while appointment times are not configured (CONFIG.periods is null) -->
            <p class="bk-note" data-bk-times-tbc hidden>${icon("info")}<span>Appointment times are to be confirmed. Please call the clinic on <a href="${clinic.phoneHref}">${clinic.phoneDisplay}</a> to arrange a time.</span></p>
            <fieldset class="field bk-slots" data-bk-slots aria-describedby="bk-slot-err">
              <legend class="label">Time slot<span class="req" aria-hidden="true">*</span> <span class="opt" data-bk-slot-hint></span></legend>
              <p class="bk-slots__empty" data-bk-slot-empty>${icon("clock")}Choose a date and a period to see available times.</p>
              <p class="bk-slots__empty bk-slots__loading" data-bk-slot-loading hidden><span class="bk-mini-spin" aria-hidden="true"></span>Loading available times…</p>
              <p class="bk-note bk-note--alert" data-bk-slotfail hidden>${icon("alert")}<span>Could not load times. Please call <a href="${clinic.phoneHref}">${clinic.phoneDisplay}</a>.</span></p>
              <div class="bk-slots__grid" data-bk-slot-grid></div>
              <p class="bk-note" data-bk-noslots hidden>${icon("info")}No appointments are available on this date. Please choose another date.</p>
              <p class="field__error" id="bk-slot-err">${icon("info")}<span></span></p>
            </fieldset>
          </fieldset>

          <fieldset class="bk-step" data-step="3">
            <legend class="bk-step__title"><span class="bk-step__n" aria-hidden="true">3</span>Visit details</legend>
            <fieldset class="field bk-service" aria-describedby="bk-service-err">
              <legend class="label">Service<span class="req" aria-hidden="true">*</span></legend>
              <div class="bk__chips">
                ${services.map((s) => `<label class="bk__chip"><input type="radio" name="service" value="${s.slug}" required><span>${icon(s.icon)}${s.name}</span></label>`).join("")}
                <label class="bk__chip"><input type="radio" name="service" value="general"><span>${icon("info")}General enquiry</span></label>
              </div>
              <p class="field__error" id="bk-service-err">${icon("info")}<span></span></p>
            </fieldset>
            <div class="bk__grid">
              <div class="field">
                <label for="bk-doctor">Preferred doctor <span class="opt">(optional)</span></label>
                <div class="bk__input bk__input--select">${icon("steth")}<select class="input" id="bk-doctor" name="doctor">
                  <option value="none" selected>No preference</option>
                  ${doctors.map((d) => `<option value="${d.id}">${d.name}</option>`).join("")}
                </select></div>
              </div>
              <div class="field">
                <label for="bk-msg">Message <span class="opt">(optional)</span></label>
                <textarea class="input" id="bk-msg" name="message" rows="2" maxlength="200" placeholder="For example, tooth pain on the lower left" aria-describedby="bk-msg-count"></textarea>
                <p class="bk-count" id="bk-msg-count" aria-live="polite"><span data-bk-count>0</span> / 200</p>
              </div>
            </div>
          </fieldset>

          <div class="bk-step bk-step--confirm" data-step="4">
            <div class="field">
              <label class="consent"><input id="bk-consent" name="consent" type="checkbox" required aria-required="true" aria-describedby="bk-consent-err"><span>I agree to be contacted about my appointment.<span class="req" aria-hidden="true">*</span></span></label>
              <p class="field__error" id="bk-consent-err">${icon("info")}<span></span></p>
              <p class="bk-privacy">${icon("shield")}Your details are used only to arrange this appointment.</p>
            </div>
            <div class="bk-step__submit">
              <button class="btn btn--primary bk__btn" id="bk-submit" type="submit" aria-disabled="true"><span class="btn__label">Request Appointment</span><span class="spinner" aria-hidden="true"></span><span class="bk-done" aria-hidden="true">${icon("check")}</span>${icon("arrow")}</button>
              <p class="bk__assure">We will call you to confirm. Nothing is booked until then.</p>
            </div>
          </div>
          <div class="form-msg form-msg--err bk-alert" id="bk-error" role="alert" tabindex="-1">
            ${icon("alert")}<p data-bk-error-text></p>
          </div>
        </form>
        <div class="form-msg form-msg--ok bk-success" id="bk-success" tabindex="-1" role="status" aria-live="polite">
          <div class="form-msg__icon" aria-hidden="true">${icon("check")}</div>
          <h3>Request received</h3>
          <p class="bk-success__id">Booking ID <strong data-bk-id></strong></p>
          <p data-bk-summary></p>
          <p>It is not confirmed yet. We will confirm by phone or message shortly.</p>
          <p data-bk-email-note hidden>We have also sent the details to your email. Please check your inbox, and your spam folder.</p>
          <div class="btn-row" style="justify-content:center">
            <a class="btn btn--primary" href="${clinic.phoneHref}">${icon("phone")}Call Clinic ${clinic.phoneDisplay}</a>
            <button class="btn btn--outline" type="button" id="bk-again">New request</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section home-sec h-contact" id="contact" aria-labelledby="contact-title">
  <div class="container">
    <div class="section-head">
      <h2 class="h-title" id="contact-title" data-reveal>Visit or call us</h2>
    </div>
    <div class="contact">
      <div class="ccard ccard--rich" data-reveal>
        <a class="ccard__call" href="${clinic.phoneHref}">
          <span class="ccard__call-text"><span class="ccard__call-label">Call the clinic</span><span class="ccard__call-num">${clinic.phoneDisplay}</span></span>
          <span class="ccard__call-icon" aria-hidden="true">${icon("phone")}</span>
        </a>
        <div class="ccard__body">
          <div class="ccard__row">
            <span class="ccard__icon">${icon("pin")}</span>
            <div>
              <h3 class="ccard__label">Address</h3>
              <address class="ccard__addr">${clinic.addressLines.join("<br>")}</address>
            </div>
          </div>
          <div class="ccard__row">
            <span class="ccard__icon">${icon("mail")}</span>
            <div class="ccard__grow">
              <h3 class="ccard__label">Email</h3>
              <p class="ccard__addr"><a class="ccard__link" href="mailto:${clinic.email}">${clinic.email}</a></p>
            </div>
          </div>
          <div class="ccard__row">
            <span class="ccard__icon">${icon("clock")}</span>
            <div class="ccard__grow">
              <h3 class="ccard__label">Opening hours <span class="ccard__status" data-open-status hidden></span></h3>
              <dl class="ccard__hours">
                <div data-days="1,2,3,4,5,6"><dt>Mon to Sat</dt><dd>${clinic.hours.week}</dd></div>
                <div data-days="0"><dt>Sunday</dt><dd>${clinic.hours.sun}</dd></div>
              </dl>
            </div>
          </div>
          <div class="ccard__actions">
            <a class="btn btn--primary" href="#booking">Book Appointment${icon("arrow")}</a>
            <a class="btn btn--outline" href="${clinic.directions}" target="_blank" rel="noopener">Get Directions${icon("external")}<span class="sr-only"> (opens in a new tab)</span></a>
          </div>
        </div>
      </div>
      <div class="map" data-reveal>
        <div class="map__frame">
          <!-- Map: embed URL lives in src/reviews.json (mapEmbedUrl) -->
          <iframe class="map__embed" src="${rv.mapEmbedUrl}" title="Map showing ${esc(clinic.name)}, Rashtrapathi Road, Tanuku" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
          <a class="map__open" href="${rv.mapPlaceUrl}" target="_blank" rel="noopener">${icon("external")}Open in Google Maps<span class="sr-only"> (opens in a new tab)</span></a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section home-sec h-faq" id="faq" aria-labelledby="faq-title">
  <div class="container faq">
    <div class="faq__aside">
      <h2 class="h-title" id="faq-title" data-reveal>Questions patients ask</h2>
      <p data-reveal>Still have questions? Call the clinic on <a href="${clinic.phoneHref}">${clinic.phoneDisplay}</a>.</p>
    </div>
    ${accordion("faq", faqs)}
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
/* Service detail template                                             */
/* ------------------------------------------------------------------ */
function servicePage(s) {
  return (L) => `
<nav class="crumbs" aria-label="Breadcrumb">
  <div class="container">
    <ol>
      <li><a href="${L.home}">Home</a></li>
      <li><a href="${L.sec("services")}">Services</a></li>
      <li><span aria-current="page">${s.name}</span></li>
    </ol>
  </div>
</nav>

<section class="hero shero" aria-labelledby="hero-title" data-float-scope>
  <div class="hero__bg" aria-hidden="true"></div>
  <div class="dots" aria-hidden="true"></div>
  <div class="container hero__grid">
    <div class="hero__copy">
      <p class="eyebrow" data-hero style="--d:0ms">${esc(clinic.short)}, Tanuku</p>
      <h1 class="hero__title" id="hero-title" style="margin-top:4px"><span class="line line--2"><span style="--d:40ms">${s.name}</span></span></h1>
      <p class="hero__sub" data-hero style="--d:110ms">${esc(s.sub)} ${esc(s.summary)}</p>
      <div class="btn-row hero__actions" data-hero style="--d:170ms">
        <a class="btn btn--primary" ${bookAttrs(L, s.slug)}>Book Appointment${icon("arrow")}</a>
        <a class="btn btn--outline" href="${clinic.phoneHref}">${icon("phone")}Call Clinic</a>
      </div>
      <p class="disclaimer" data-hero style="--d:230ms">${icon("info")}<span><strong>Draft content, pending doctor review.</strong> Information is general and not a substitute for consultation.</span></p>
    </div>
    <div class="hero__visual">
      <div class="frame-parallax" data-parallax="22">
        <div class="frame" data-hero="frame" style="--d:90ms">
          ${ph(`${s.name} at ${clinic.name}`, "Photo to be supplied by client", "ph--shero", s.icon)}
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="problems-title">
  <div class="container">
    ${head("Common problems", `Common <span class="hl">problems</span>`, "Signs that it may be time to see a dentist.").replace('class="section-title"', 'class="section-title" id="problems-title"')}
    <div class="problems" data-stagger="80">
      ${s.problems.map((p) => `<article class="pcard" data-reveal><div class="icon-box">${icon(p.icon)}</div><h3>${esc(p.t)}</h3><p>${esc(p.d)}</p></article>`).join("")}
    </div>
  </div>
</section>

<section class="section section--off" aria-labelledby="why-title">
  <div class="container">
    ${head("Understanding the problem", `Why they <span class="hl">occur</span>`).replace('class="section-title"', 'class="section-title" id="why-title"')}
    <div class="alt">
      ${s.why
        .map(
          (w, i) => `
      <div class="alt__row">
        <div class="alt__media" data-reveal="scale">${ph(`Illustration: ${w.t}`, "Illustration to be supplied", "", s.icon, { decorative: true })}</div>
        <div>
          <span class="alt__label" aria-hidden="true">0${i + 1}</span>
          <h3 data-reveal>${esc(w.t)}</h3>
          <p data-reveal>${esc(w.d)}</p>
        </div>
      </div>`
        )
        .join("")}
    </div>
  </div>
</section>

<section class="section" aria-labelledby="causes-title">
  <div class="container causes-wrap">
    <div>
      <p class="eyebrow" data-reveal>Risk factors</p>
      <h2 class="section-title" id="causes-title" data-reveal><span class="hl">Causes</span></h2>
      <p class="section-intro" data-reveal>Common reasons these problems develop. Your doctor will look at what applies to you.</p>
    </div>
    <ol class="causes" data-stagger="80">${s.causes.map((c) => `<li data-reveal><span>${esc(c)}</span></li>`).join("")}</ol>
  </div>
</section>

<section class="section section--blush" aria-labelledby="solutions-title">
  <div class="container">
    ${head("Treatment", `Solutions and <span class="hl">treatment options</span>`, "The right option depends on your examination. Recovery times are confirmed by the doctor for each patient.").replace('class="section-title"', 'class="section-title" id="solutions-title"')}
    <div class="solutions" data-stagger="80">
      ${s.solutions
        .map(
          (o) => `
      <article class="solcard" data-reveal>
        <h3>${esc(o.t)}</h3>
        ${o.tbc ? tbc() : ""}
        <dl>
          <div><dt>What it involves</dt><dd>${esc(o.involves)}</dd></div>
          <div><dt>Who it suits</dt><dd>${esc(o.suits)}</dd></div>
          <div><dt>Recovery time</dt><dd>${esc(RECOVERY_TBC)}</dd></div>
        </dl>
      </article>`
        )
        .join("")}
    </div>
  </div>
</section>

<section class="section" aria-labelledby="expect-title">
  <div class="container">
    ${head("Your visit", `What to <span class="hl">expect</span>`, "", "section-head--center").replace('class="section-title"', 'class="section-title" id="expect-title"')}
    <ol class="expect">
      ${["Consultation", "Treatment", "Follow-up"].map((t, i) => `<li class="expect__step" data-reveal style="--d:${i * 150}ms"><span class="expect__n">0${i + 1}</span><h3>${t}</h3><p>${esc(s.expect[i])}</p></li>`).join("")}
    </ol>
    ${
      s.firstSteps
        ? `
    <aside class="firststeps" data-reveal aria-labelledby="first-steps-title">
      <h3 id="first-steps-title">${icon("alert")}${esc(s.firstStepsTitle || "First steps")} ${tbc("Draft: verify with dentists before publishing")}</h3>
      <ol>${s.firstSteps.map((f) => `<li>${esc(f)}</li>`).join("")}</ol>
    </aside>`
        : ""
    }
  </div>
</section>

<section class="section section--off" aria-labelledby="sfaq-title">
  <div class="container faq">
    <div class="faq__aside">
      <p class="eyebrow" data-reveal>${s.name} FAQ</p>
      <h2 class="section-title" id="sfaq-title" data-reveal>Common <span class="hl">questions</span></h2>
      <p data-reveal>Answers are general and in draft. Call <a href="${clinic.phoneHref}">${clinic.phoneDisplay}</a> to ask about your own case.</p>
      <p data-reveal style="margin-top:28px;font-weight:600;color:var(--maroon-900)">Other services</p>
      <ul class="other-services" data-reveal>${services.filter((x) => x.slug !== s.slug).map((x) => `<li><a class="chip" href="${L.service(x.slug)}">${x.name}</a></li>`).join("")}</ul>
    </div>
    ${accordion("sfaq", s.faq)}
  </div>
  <div class="container" style="margin-top:48px">
    <p class="disclaimer" data-reveal>${icon("info")}<span><strong>Medical disclaimer:</strong> ${DRAFT}</span></p>
  </div>
</section>
${closingBand(L, s)}`;
}

/* ------------------------------------------------------------------ */
/* Write files                                                         */
/* ------------------------------------------------------------------ */
// Service meta description: the summary plus the clinic name, trimmed to 155 characters at a sentence or word break
function metaDesc(s) {
  const tail = ` ${clinic.name}, Tanuku.`;
  let d = s.summary;
  if ((d + tail).length > 155) d = d.split(". ")[0].replace(/\.$/, "") + ".";
  if ((d + tail).length > 155) d = d.slice(0, 150 - tail.length).replace(/\s+\S*$/, "") + "…";
  return d + tail;
}

function write(rel, html) {
  const p = join(OUT, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, html);
  console.log("wrote", rel);
}

write(
  "index.html",
  layout({
    title: "Mullapudi Dental Clinic | Dental Clinic in Tanuku",
    description: "Mullapudi Dental Clinic in Tanuku, Andhra Pradesh, offers dental services including implants, root canal treatment, braces and dentures.",
    base: "",
    current: "home",
    body: home,
    extra: LIGHTBOX + `
<script src="assets/js/mascot-eyes.js" defer></script>
<script src="assets/js/gallery.js" defer></script>
<script src="assets/js/booking.js" defer></script>`,
  })
);

for (const s of services) {
  write(
    `services/${s.slug}/index.html`,
    layout({
      title: `${s.name} | ${clinic.name}, Tanuku`,
      description: metaDesc(s),
      base: "../../",
      current: "services",
      body: servicePage(s),
    })
  );
}

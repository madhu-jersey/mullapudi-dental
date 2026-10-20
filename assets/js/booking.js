/* Mullapudi Dental — booking form.
   Four steps shown together. When a booking backend is connected (CONFIG.apiUrl), free
   slots come from it and requests are posted to it, and it re-checks everything.
   With no backend (apiUrl empty) the form asks the patient to call the clinic: nothing is
   sent anywhere. While CONFIG.periods is null (appointment times not supplied), the period
   and time-slot pickers are hidden and a "please call" note is shown instead, so no
   availability is invented. */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     CONFIG
  ------------------------------------------------------------------ */
  var CONFIG = {
    apiUrl: "",                          // no booking backend yet: the form shows the "call the clinic" fallback
    timeZone: "Asia/Kolkata",
    windowDays: 7,                       // bookable: today through 7 days ahead
    // APPOINTMENT TIMES TO BE CONFIRMED WITH CLIENT (slot length, availability, lunch break).
    // The clinic is open Mon-Sat 9:00-20:00. When confirmed, set e.g.
    // periods: { morning: { label: "Morning", start: "09:00", end: "13:00", slotMinutes: 30 }, evening: { ... } }
    // and the period cards and slot grid appear again.
    periods: null,
    closedDays: [0],                     // 0 = Sunday: the clinic is closed
    // form value -> name the backend expects
    services: {
      "dental-implants": "Dental Implants", "root-canal-treatment": "Root Canal Treatment", braces: "Braces",
      "paediatric-dentistry": "Paediatric Dentistry", "oral-surgery": "Oral Surgery", "laser-gum-therapy": "Laser Gum Therapy",
      "invisible-aligners": "Invisible Aligners", "crowns-bridges-veneers": "Crowns, Bridges and Veneers",
      "complete-dentures": "Complete Dentures", "dental-radiography": "Dental Radiography", "cosmetic-dentistry": "Cosmetic Dentistry",
      general: "General enquiry"
    },
    doctors: { none: "No preference", nithisha: "Dr. Nithisha Mullapudi", prudhvi: "Dr. Prudhvi Kumar", divya: "Dr. Divya Srujana" },
    phone: { display: "9347595030", href: "tel:+919347595030" },
    messageMax: 200,
    draftKey: "md-booking-draft"         // form draft only, kept in this browser (removed after a successful request)
  };

  var EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
  var form = document.getElementById("booking-form");
  if (!form) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("animate" in Element.prototype);
  var $ = function (s, c) { return (c || form).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || form).querySelectorAll(s)); };

  var el = {
    name: $("#bk-name"), phone: $("#bk-phone"), email: $("#bk-email"), date: $("#bk-date"),
    doctor: $("#bk-doctor"), msg: $("#bk-msg"), consent: $("#bk-consent"), submit: $("#bk-submit"), website: $("#bk-website"),
    sunday: $("[data-bk-sunday]"), slots: $("[data-bk-slots]"), grid: $("[data-bk-slot-grid]"),
    slotEmpty: $("[data-bk-slot-empty]"), slotLoading: $("[data-bk-slot-loading]"), slotFail: $("[data-bk-slotfail]"),
    noSlots: $("[data-bk-noslots]"), slotHint: $("[data-bk-slot-hint]"), count: $("[data-bk-count]"),
    alert: document.getElementById("bk-error"), alertText: document.querySelector("[data-bk-error-text]"),
    ok: document.getElementById("bk-success"), again: document.getElementById("bk-again"),
    okId: document.querySelector("[data-bk-id]"), okSummary: document.querySelector("[data-bk-summary]"), okEmail: document.querySelector("[data-bk-email-note]"),
    offline: document.querySelector("[data-bk-offline]")
  };
  var online = !!CONFIG.apiUrl;
  if (!online && el.offline) el.offline.hidden = false;
  // No appointment times configured: hide the period cards and the slot grid, ask people to call
  var timesTbc = !online && !CONFIG.periods;
  if (timesTbc) {
    var periodsBox = $(".bk-periods"), timesNote = $("[data-bk-times-tbc]");
    if (periodsBox) periodsBox.hidden = true;
    if (el.slots) el.slots.hidden = true;
    if (timesNote) timesNote.hidden = false;
    $$('input[name="period"]').forEach(function (r) { r.required = false; });
    var visit = $(".bk-visit"); if (visit) visit.classList.add("bk-visit--date-only");
  }
  var isClosed = function (iso) { return (CONFIG.closedDays || []).indexOf(weekday(iso)) > -1; };

  /* ---------- Clinic-time helpers ---------- */
  function clinicToday() {
    var p = new Intl.DateTimeFormat("en-GB", { timeZone: CONFIG.timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
    var g = function (t) { return (p.filter(function (x) { return x.type === t; })[0] || {}).value; };
    return g("year") + "-" + g("month") + "-" + g("day");
  }
  var addDays = function (iso, n) { var d = new Date(iso + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
  var weekday = function (iso) { return new Date(iso + "T12:00:00Z").getUTCDay(); };
  var longDate = function (iso) { return new Date(iso + "T12:00:00Z").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }); };
  var toMin = function (hhmm) { var x = hhmm.split(":"); return +x[0] * 60 + +x[1]; };
  var label12 = function (m) { var h = Math.floor(m / 60), mm = m % 60; return (h % 12 || 12) + ":" + ("0" + mm).slice(-2) + " " + (h >= 12 ? "PM" : "AM"); };
  var hhmm = function (m) { return ("0" + Math.floor(m / 60)).slice(-2) + ":" + ("0" + m % 60).slice(-2); };
  function clinicNowMin() {
    var p = new Intl.DateTimeFormat("en-GB", { timeZone: CONFIG.timeZone, hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
    var g = function (t) { return +((p.filter(function (x) { return x.type === t; })[0] || {}).value || 0); };
    return (g("hour") % 24) * 60 + g("minute");
  }
  // Times listed from CONFIG.periods when no backend is connected (same shape as the backend reply)
  function localSlots(date) {
    var res = { status: "ok" }, sunday = weekday(date) === 0, now = date === clinicToday() ? clinicNowMin() : -1;
    if (isClosed(date)) return res;
    Object.keys(CONFIG.periods || {}).forEach(function (k) {
      var p = CONFIG.periods[k], end = toMin(sunday && p.sundayEnd ? p.sundayEnd : p.end), list = [];
      for (var m = toMin(p.start); m + p.slotMinutes <= end; m += p.slotMinutes) {
        if (m > now) list.push({ start: hhmm(m), end: hhmm(m + p.slotMinutes), label: label12(m) + " to " + label12(m + p.slotMinutes) });
      }
      res[k] = list;
    });
    return res;
  }

  var today = clinicToday(), maxDate = addDays(today, CONFIG.windowDays);
  el.date.min = today;
  el.date.max = maxDate;
  Object.keys(CONFIG.periods || {}).forEach(function (k) {
    var p = CONFIG.periods[k], r = form.querySelector('[data-period-range="' + k + '"]');
    if (r) r.textContent = label12(toMin(p.start)) + " to " + label12(toMin(p.end));
  });
  el.msg.maxLength = CONFIG.messageMax;

  /* ---------- Validation ---------- */
  var digits = function (v) {
    var d = String(v).replace(/\D/g, "");
    if (d.length === 12 && d.indexOf("91") === 0) d = d.slice(2);
    if (d.length === 11 && d.charAt(0) === "0") d = d.slice(1);
    return d;
  };
  var checked = function (name) { var c = form.querySelector('input[name="' + name + '"]:checked'); return c ? c.value : ""; };
  var rules = {
    name: function () { return (el.name.value.match(/\p{L}/gu) || []).length >= 2 ? "" : "Please enter your full name."; },
    phone: function () { return /^[6-9]\d{9}$/.test(digits(el.phone.value)) ? "" : "Enter a valid 10-digit mobile number."; },
    email: function () {
      var v = el.email.value.trim();
      if (!v) return "Please enter your email address.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "Enter a valid email address.";
    },
    date: function () {
      var v = el.date.value;
      if (!(v && v >= today && v <= maxDate)) return "Please choose a date within the next 7 days.";
      return isClosed(v) ? "The clinic is closed on Sundays. Please choose another date." : "";
    },
    period: function () { return checked("period") ? "" : "Please choose a time of day."; },
    slot: function () { return checked("slot") ? "" : "Please choose a time slot."; },
    service: function () { return checked("service") ? "" : "Please choose a service."; },
    consent: function () { return el.consent.checked ? "" : "Please confirm that we may contact you about your appointment."; }
  };
  var order = timesTbc ? ["name", "phone", "email", "date", "service", "consent"] : ["name", "phone", "email", "date", "period", "slot", "service", "consent"];
  var group = { name: el.name, phone: el.phone, email: el.email, date: el.date, consent: el.consent,
    period: $(".bk-periods"), slot: el.slots, service: $(".bk-service") };
  var focusTarget = function (k) {
    var g = group[k];
    if (g.tagName === "INPUT") return g;
    return g.querySelector("input:checked") || g.querySelector("input:not(:disabled)") || g;
  };
  function showError(k, msg, shake) {
    var g = group[k], f = g.classList.contains("field") ? g : g.closest(".field");
    var span = f.querySelector(".field__error span");
    f.classList.toggle("has-error", !!msg);
    if (span) span.textContent = msg;
    if (g.tagName === "INPUT") g.setAttribute("aria-invalid", msg ? "true" : "false");
    else g.setAttribute("aria-invalid", msg ? "true" : "false");
    if (msg && shake && !reduce) {
      var t = f.querySelector(".bk__input, .bk-periods__row, .bk-slots__grid, .bk__chips, .consent") || f;
      t.animate([{ transform: "translateX(0)" }, { transform: "translateX(-2px)" }, { transform: "translateX(2px)" }, { transform: "translateX(0)" }], { duration: 240, easing: "ease-in-out" });
    }
  }
  function check(k, show, shake) {
    var msg = rules[k]();
    if (show) showError(k, msg, shake);
    else if (!msg) showError(k, "", false);
    return !msg;
  }
  function updateSubmit() {
    el.submit.setAttribute("aria-disabled", String(!order.every(function (k) { return !rules[k](); })));
  }

  /* ---------- Slots (from the backend) ---------- */
  var cache = {};               // date -> Promise of the backend response
  var renderToken = 0;
  function fetchSlots(date, fresh) {
    if (!online) return Promise.resolve(localSlots(date));
    if (!fresh && cache[date]) return cache[date];
    var url = CONFIG.apiUrl + "?action=slots&date=" + encodeURIComponent(date);
    cache[date] = fetch(url, { method: "GET", cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error("http"); return r.json(); })
      .catch(function (e) { delete cache[date]; throw e; });
    return cache[date];
  }
  function setSlotState(state, text) {
    el.slotEmpty.hidden = state !== "empty";
    el.slotLoading.hidden = state !== "loading";
    el.slotFail.hidden = state !== "fail";
    el.noSlots.hidden = state !== "none";
    el.sunday.hidden = state !== "sunday";
    if (state !== "list") el.grid.innerHTML = "";
    if (text !== undefined) el.slotHint.textContent = text;
  }
  function renderSlots(fresh) {
    var period = checked("period"), date = el.date.value;
    var token = ++renderToken;
    if (!period || !date || rules.date()) { setSlotState("empty", ""); updateSubmit(); return Promise.resolve(); }
    var keep = checked("slot");
    setSlotState("loading", "");
    return fetchSlots(date, fresh).then(function (res) {
      if (token !== renderToken) return;
      if (!res || res.status !== "ok") {
        if (res && res.message && /7 days/.test(res.message)) { showError("date", res.message, true); setSlotState("empty", ""); }
        else setSlotState("fail");
        updateSubmit(); return;
      }
      var list = res[period] || [];
      if (!list.length) {
        var sundayEvening = period === "evening" && weekday(date) === 0;
        setSlotState(sundayEvening ? "sunday" : "none", "");
        updateSubmit(); return;
      }
      setSlotState("list", "(" + list.length + " available)");
      el.grid.innerHTML = "";
      list.forEach(function (s, i) {
        var lab = document.createElement("label");
        lab.className = "bk-slot";
        var input = document.createElement("input");
        input.type = "radio"; input.name = "slot"; input.value = s.start;
        input.setAttribute("data-label", s.label || (label12(toMin(s.start)) + " to " + label12(toMin(s.end))));
        if (s.start === keep) input.checked = true;
        var btn = document.createElement("span");
        btn.className = "bk-slot__btn";
        var txt = document.createElement("span");
        txt.className = "bk-slot__time";
        txt.textContent = input.getAttribute("data-label");
        btn.appendChild(txt);
        btn.insertAdjacentHTML("beforeend", '<span class="bk-slot__check" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>');
        lab.appendChild(input); lab.appendChild(btn);
        el.grid.appendChild(lab);
        if (!reduce) lab.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 300, delay: i * 30, easing: EASE, fill: "backwards" });
      });
      // a previously chosen slot that is no longer free is dropped
      if (keep && !checked("slot")) showError("slot", "That time is no longer available. Please choose another time slot.", true);
      updateSubmit();
    }).catch(function () {
      if (token !== renderToken) return;
      setSlotState("fail"); updateSubmit();
    });
  }

  // Arrow keys move between slots without selecting; Space or Enter selects
  el.grid.addEventListener("keydown", function (e) {
    var inputs = $$('input[name="slot"]', el.grid);
    var i = inputs.indexOf(document.activeElement);
    if (i < 0) return;
    var cols = Math.max(1, Math.round(el.grid.clientWidth / (inputs[0].parentElement.offsetWidth || 1)));
    var to = null;
    if (e.key === "ArrowRight") to = i + 1; else if (e.key === "ArrowLeft") to = i - 1;
    else if (e.key === "ArrowDown") to = i + cols; else if (e.key === "ArrowUp") to = i - cols;
    else if (e.key === "Home") to = 0; else if (e.key === "End") to = inputs.length - 1;
    else if (e.key === "Enter") { e.preventDefault(); inputs[i].checked = true; inputs[i].dispatchEvent(new Event("change", { bubbles: true })); return; }
    if (to === null) return;
    e.preventDefault();
    to = Math.max(0, Math.min(inputs.length - 1, to));
    inputs.forEach(function (inp, k) { inp.tabIndex = k === to ? 0 : -1; });
    inputs[to].focus();
  });
  el.grid.addEventListener("change", function (e) {
    if (e.target.name !== "slot") return;
    check("slot", false);
    showError("slot", "", false);
    if (!reduce) {
      // one soft red pulse: a ring on ::after that scales and fades (transform + opacity only)
      var btn = e.target.nextElementSibling;
      btn.classList.remove("is-pulse"); void btn.offsetWidth; btn.classList.add("is-pulse");
      setTimeout(function () { btn.classList.remove("is-pulse"); }, 350);
    }
    updateSubmit();
  });

  /* ---------- Draft (localStorage, form draft only) ---------- */
  var submitted = false;
  function saveDraft() {
    if (submitted) return;
    try {
      localStorage.setItem(CONFIG.draftKey, JSON.stringify({
        name: el.name.value, phone: el.phone.value, email: el.email.value,
        service: checked("service"), doctor: el.doctor.value, message: el.msg.value
      }));
    } catch (e) { /* storage unavailable */ }
  }
  function clearDraft() { try { localStorage.removeItem(CONFIG.draftKey); } catch (e) {} }
  (function restoreDraft() {
    var d; try { d = JSON.parse(localStorage.getItem(CONFIG.draftKey) || "null"); } catch (e) { d = null; }
    if (!d) return;
    if (!el.name.value) el.name.value = d.name || "";
    if (!el.phone.value) el.phone.value = d.phone || "";
    if (!el.email.value) el.email.value = d.email || "";
    if (!el.msg.value) el.msg.value = (d.message || "").slice(0, CONFIG.messageMax);
    // a service or doctor chosen from a "Book" link elsewhere on the site wins over the draft
    if (!checked("service") && d.service) { var s = form.querySelector('input[name="service"][value="' + d.service + '"]'); if (s) s.checked = true; }
    if (el.doctor.value === "none" && d.doctor && CONFIG.doctors[d.doctor]) el.doctor.value = d.doctor;
  })();
  var draftTimer = 0;
  form.addEventListener("input", function () { clearTimeout(draftTimer); draftTimer = setTimeout(saveDraft, 300); });
  form.addEventListener("change", saveDraft);

  /* ---------- Field events ---------- */
  ["name", "phone", "email"].forEach(function (k) {
    group[k].addEventListener("blur", function () { check(k, true, true); });
    group[k].addEventListener("input", function () { check(k, false); updateSubmit(); });
  });
  el.date.addEventListener("change", function () {
    var s = form.querySelector('input[name="slot"]:checked'); if (s) s.checked = false;  // a new date clears the slot
    showError("slot", "", false);
    check("date", true, false);
    if (el.date.value && !rules.date()) fetchSlots(el.date.value).catch(function () {});  // prefetch
    renderSlots();
  });
  el.date.addEventListener("blur", function () { if (el.date.value) check("date", true, true); });
  $$('input[name="period"]').forEach(function (r) {
    r.addEventListener("change", function () {
      var s = form.querySelector('input[name="slot"]:checked'); if (s) s.checked = false;  // a new period clears the slot
      showError("slot", "", false);
      check("period", false);
      renderSlots();
    });
  });
  $$('input[name="service"]').forEach(function (r) { r.addEventListener("change", function () { check("service", false); updateSubmit(); }); });
  el.consent.addEventListener("change", function () { check("consent", !el.consent.checked, false); updateSubmit(); });
  var updateCount = function () { el.count.textContent = String(el.msg.value.length); };
  el.msg.addEventListener("input", updateCount);
  form.addEventListener("change", updateSubmit);

  /* ---------- Submit ---------- */
  var controls = function () { return $$("input, select, textarea, button"); };
  // While sending, every field is disabled; the button stays enabled but shows a spinner
  function setBusy(busy) {
    controls().forEach(function (c) { if (c !== el.submit) c.disabled = busy; });
    if (busy) el.submit.setAttribute("aria-busy", "true"); else el.submit.removeAttribute("aria-busy");
    el.submit.querySelector(".btn__label").textContent = busy ? "Sending..." : "Request Appointment";
  }
  function showAlert(text) {
    el.alertText.textContent = text;   // text only: never inject server markup
    el.alert.classList.add("is-shown");
    el.alert.focus();
  }

  var sending = false;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (sending) return;
    el.alert.classList.remove("is-shown");
    var first = null;
    order.forEach(function (k) { if (!check(k, true, true) && !first) first = k; });
    if (first) { var t = focusTarget(first); if (t && t.focus) t.focus(); return; }

    var slotInput = form.querySelector('input[name="slot"]:checked');
    // No backend connected: nothing leaves the browser; ask the patient to call instead
    if (!online) {
      showAlert("Please call the clinic on " + CONFIG.phone.display + " to book your appointment for " + longDate(el.date.value) +
        (slotInput ? ", " + slotInput.getAttribute("data-label") : "") + ". Online requests are not switched on yet, so your details have not been sent.");
      return;
    }
    var payload = {
      name: el.name.value.trim(),
      mobile: digits(el.phone.value),
      email: el.email.value.trim(),
      service: CONFIG.services[checked("service")] || "General enquiry",
      doctor: CONFIG.doctors[el.doctor.value] || "No preference",
      date: el.date.value,
      period: checked("period"),
      slotStart: slotInput.value,
      message: el.msg.value.trim().slice(0, CONFIG.messageMax),
      consent: true,
      website: el.website.value
    };
    var slotLabel = slotInput.getAttribute("data-label");
    sending = true;
    setBusy(true);

    fetch(CONFIG.apiUrl, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        sending = false;
        if (res && res.status === "pending") return success(res, payload, slotLabel);
        setBusy(false);
        showAlert((res && typeof res.message === "string" && res.message) || "Could not send your request. Please call " + CONFIG.phone.display + ".");
        renderSlots(true);   // the slot may have just been taken
      })
      .catch(function () {
        sending = false;
        setBusy(false);
        showAlert("Could not send your request. Please call " + CONFIG.phone.display + ".");
      });
  });

  function success(res, payload, slotLabel) {
    submitted = true;
    clearDraft();
    el.submit.removeAttribute("aria-busy");
    el.submit.classList.add("is-done");
    el.submit.querySelector(".btn__label").textContent = "Sent";
    el.okId.textContent = String(res.bookingId || "");
    el.okSummary.textContent = "Your request is for " + longDate(payload.date) + ", " + slotLabel + ".";
    el.okEmail.hidden = !payload.email;
    setTimeout(function () {
      form.hidden = true;
      el.ok.classList.add("is-shown");
      if (!reduce) el.ok.animate([{ opacity: 0, transform: "scale(0.94)" }, { opacity: 1, transform: "none" }], { duration: 500, easing: EASE });
      el.ok.focus();
    }, reduce ? 0 : 700);
  }

  el.again.addEventListener("click", function () {
    submitted = false;
    form.reset();
    controls().forEach(function (c) { c.disabled = false; });
    el.submit.classList.remove("is-done");
    el.submit.querySelector(".btn__label").textContent = "Request Appointment";
    $$(".has-error").forEach(function (f) { f.classList.remove("has-error"); });
    setSlotState("empty", "");
    updateCount();
    el.ok.classList.remove("is-shown");
    form.hidden = false;
    updateSubmit();
    el.name.focus();
  });

  updateCount();
  updateSubmit();
  window.MullapudiDentalBooking = { config: CONFIG };
})();

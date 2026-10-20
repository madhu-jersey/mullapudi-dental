# Booking section

The "Book your appointment" section on the home page.

- Markup: the `#booking` section in `src/build.mjs` (run `node src/build.mjs` after editing)
- Behaviour: `assets/js/booking.js`, with every setting in the `CONFIG` block at the top (API URL, time zone, 7-day window, appointment periods, closed days, service names, doctor names, clinic phone, message limit, draft key)
- Styles: the "Booking" blocks in `assets/css/site.css`

## Current state: no backend, no appointment times

- `CONFIG.apiUrl` is empty. A notice at the top of the form says "Please call the clinic on 9347595030 to book", and nothing is ever sent.
- `CONFIG.periods` is `null` because appointment times, slot length and the lunch break have not been supplied. The period cards and the time-slot grid are hidden, and a note says appointment times are to be confirmed and asks people to call. No availability is shown or invented.
- `CONFIG.closedDays` is `[0]`: choosing a Sunday gives "The clinic is closed on Sundays. Please choose another date."
- Pressing "Request Appointment" checks the form, then shows: "Please call the clinic on 9347595030 to book your appointment for [date]. Online requests are not switched on yet, so your details have not been sent."
- The form draft (name, mobile, email, service, doctor, message) is kept only in the visitor's own browser, under `md-booking-draft`.
- **Booking window:** today through 7 days ahead, in Asia/Kolkata time. To be confirmed with the client.

## When appointment times are confirmed

Set `CONFIG.periods` in `booking.js`, for example:

```js
periods: {
  morning: { label: "Morning", start: "09:00", end: "13:00", slotMinutes: 30 },
  evening: { label: "Afternoon & evening", start: "14:00", end: "20:00", slotMinutes: 30 }
}
```

The period cards and slot grid then appear again, listing times from this setting (still with the "please call" fallback until a backend is connected). Update the period card labels in `build.mjs` to match.

## Connecting a backend later

Set `CONFIG.apiUrl` to the backend URL. The form then works as follows:

- **Slots:** `GET ?action=slots&date=YYYY-MM-DD`. Only the free slots the server returns are shown.
- **Request:** `POST` with a JSON body sent as `text/plain;charset=utf-8`, which avoids a CORS preflight. Fields sent: `name`, `mobile` (10 digits), `email`, `service`, `doctor`, `date`, `period`, `slotStart`, `message` (200 characters at most), `consent`, and `website` (the honeypot).
- **Replies:** `pending` shows the success panel with the booking ID; `error` shows the server's message; a network failure asks the patient to call 9347595030.
- **Privacy:** patient details are only sent in the POST body, never in a URL. The draft is deleted after a successful request.

Before connecting, confirm the final submit wording and whether the backend emails patients.

## Checked (20 Oct 2026, in the preview browser)

- [x] With no backend and no times: period cards and slot grid hidden, "please call" notes shown.
- [x] A Sunday date is rejected with the closed message.
- [x] A complete form shows the "Please call the clinic on 9347595030" message; no request leaves the page.
- [x] Layout at 375px: one column, no horizontal scroll.

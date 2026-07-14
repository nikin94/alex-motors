# Approved copy bank

Source: Content manager package (2026-07-07), facts confirmed by the owner.
Copy for the Services screen (subtitle, Pre-NCT highlight, six cards) and the
meta tags already lives in code — this file banks what is not built yet.

## Positioning

Not a VAG specialist. All makes and models, including sports cars; Pre-NCT
preparation is the lead offer (highlight block). Breadth goes in the section
subtitle, not in a card.

## Facts

- Address (published, footer + JSON-LD): Altaghaderry, Killea, Co. Donegal, F93 P768
- Town in meta/copy is **Derry** ("near Derry") since PR #15 — the workshop sits
  on the border minutes from Derry city, the largest population centre nearby.
  The Services subtitle also names Donegal, so both markets are covered.
  (Supersedes the earlier "stays Letterkenny" decision.)
- Cross-border nuance (from the Content manager review, 2026-07-14): Derry is in
  Northern Ireland, where cars take the **MOT**, not the NCT. NCT copy targets
  Donegal (ROI) plates; a phrase like "NCT prep for Donegal cars, MOT &
  servicing for cross-border drivers" would close both markets — final wording
  to come from the Content manager with the trust-block package.
- Hours: Mon–Fri 09:00–17:00, Sat 09:00–13:00, Sun closed
- Footer line: `Mon–Fri 9:00–17:00 · Sat 9:00–13:00`
- Call-outs available
- No Google Business Profile yet (Content manager is walking the owner through it)

## About block / footer (future)

> Alex Motors is an independent garage in Letterkenny, Co. Donegal. We work on
> all makes and models — daily drivers, vans and sports cars — with a focus on
> honest diagnostics and NCT preparation. Open Monday to Saturday, with call-outs
> available if your car won't make it to us. Call or WhatsApp Alex to book.

(The hours sentence was "Open 9am to 9pm" in the original package; reworded to
"Open Monday to Saturday" after the owner corrected the hours — signed off by
the Content manager. Exact hours live in the JSON-LD and the future footer line,
not in the copy, since hours change more often than copy gets recached.)

## Gallery alt-text template (future)

`[job] on a [make model] at Alex Motors, Letterkenny`
e.g. `Timing belt replacement on a VW Golf at Alex Motors, Letterkenny`

Final alt texts arrive from the Content manager once the 6–8 photos are picked.
Gallery acceptance criteria: photos chosen as "proof of work" (engine apart,
diagnostic screen, before/after), text CTA "See more of our work on Instagram",
photos stored as files in the repo so swapping a couple is a five-minute edit.

## Open items (not blocking)

- ~~Add `url` to the LocalBusiness JSON-LD~~ — done: `url`, `image` and
  `public/og-image.jpg` shipped with the SEO pack (PR #14), keyed on the planned
  `alex-motors.ie`. Remaining piece is buying the domain itself — until then the
  absolute URLs (and link previews) do not resolve.
- The About draft above and the alt-text template still say "Letterkenny" —
  they predate the Derry retarget; the Content manager refreshes them with the
  final trust-block texts.
- Gallery package: 6–8 photos picked, then final alt texts from the Content
  manager

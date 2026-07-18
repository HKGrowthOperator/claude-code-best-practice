# Living Charity e. V. — Website-Vorabversion (v2 „Editorial Humanitarian Premium")

WordPress-fertige Vorabversion der neuen Vereinswebsite. Statisch gebaut,
abhängigkeitsfrei (nur Node ≥ 18), vollständig lokal lauffähig, mit
Beweis-/Quellensystem und interner Freigabeliste statt sichtbarer Platzhalter.

## Schnellstart

```bash
npm run build      # baut 17 Seiten nach public/
npm run check      # QA: Links, Überschriften, verbotene Altdaten, KI-Bild-Sperre …
npm run preview    # eine selbst-enthaltene Review-Datei (public/preview/index.html)
npm run export:wp  # Gutenberg-Export (wordpress-export/)
npm run push:wp    # Seiten als Entwürfe per REST-API (mit Zielinstanz-Sicherheitsbremse)
npx serve public   # lokal ansehen
```

## Wichtig: Vorabversion, kein Livegang

- `robots.txt` blockiert Indexierung absichtlich.
- **Im Frontend erscheinen keine Warnhinweise** (Briefing-Regel). Unbestätigte
  Angaben werden intern geführt: [docs/launch-blockers.md](docs/launch-blockers.md)
  (LB-01 … LB-20), [content/content-status.md](content/content-status.md) und
  `status`-Felder in `src/data/*.json`.
- Verbotene Altdaten (13.000/5.000/400 … + Demo-Veranstaltungen) und
  KI-Bildquellen sind technisch gesperrt (`npm run check` schlägt fehl).
- Plant Ceylon erscheint als vorgestelltes Projekt **mit Prüfstatus** —
  Klärungsliste: [content/plant-ceylon-verification.md](content/plant-ceylon-verification.md).
- Der 5-Euro-Claim ist eine zitierte fremde Aussage mit Quellenlink —
  Formulierungsregeln: [content/confirmed-data.md](content/confirmed-data.md).

## Struktur

```
src/pages/       17 Seiten inkl. dynamischer Vorlagen, Danke, Suche, 404
src/layouts/     Basis-Layout · src/components/ Header (mit Trust-Strip), Footer
src/styles/      tokens.css (Briefing-Palette, Manrope/Source Sans 3/Newsreader),
                 base.css, components.css
src/data/        site.json (Vereinsdaten + Status), navigation, projects,
                 posts, events, team  →  spiegeln das WordPress-Datenmodell
src/utils/       build.mjs · check.mjs · preview.mjs · export-wp.mjs ·
                 push-wp.mjs · main.js
public/          gebaute Seiten, lokale Fonts, Suchindex, sitemap.xml,
                 assets/projects|documents|team (Beweis-Struktur)
content/         confirmed-data · content-status · client-checklist ·
                 image-requirements · plant-ceylon-verification · source-register
docs/            audit-report · information-architecture · design-system ·
                 wordpress-blueprint · migration-guide · seo-plan ·
                 accessibility-report · qa-report · launch-blockers ·
                 donation-provider · plugins-security
wordpress-export/  Gutenberg-Export (Schnellweg in eine WP-Instanz)
```

## Kerneigenschaften

- **Designrichtung „Editorial Humanitarian Premium":** Briefing-Palette
  (Ivory/Forest/Sand/Terracotta), Manrope + Source Sans 3 + Newsreader-Akzent,
  feine Linien, Radien 4–12 px, keine Pill-Buttons, Hover max. 2 px.
- **Beweissystem:** sichtbare Quellen-Badges (Originalaufnahme /
  Projektbericht / Externe Quelle / Illustration), Quellenregister,
  Asset-Struktur mit Pflicht-Metadaten.
- **Kein einziges externes Byte,** Fonts lokal (SIL OFL) — DSGVO-freundlich.
- **Barrierefreiheit:** WCAG-2.2-AA-Grundlage, alle 22 Farbpaarungen geprüft
  (Protokoll: docs/accessibility-report.md), Skip-Link, Tastatur, Reduced
  Motion, No-JS-Fallback.
- **Responsive:** überlauffrei auf 10 Breakpoints × 17 Seiten (320–1728 px).
- **Spendenbereich:** IBAN/BIC-Kopierknöpfe, Betragsauswahl, Girocode-Slot,
  5-€-Modul; keine simulierten Zahlungsanbieter.

## Nächste Schritte

1. Launch-Blocker abarbeiten ([docs/launch-blockers.md](docs/launch-blockers.md)),
   Inhalte gemäß [content/client-checklist.md](content/client-checklist.md).
2. WordPress-Integration: [docs/migration-guide.md](docs/migration-guide.md)
   (Schnellweg: wordpress-export/README.md).
3. Vor Livegang: `npm run check` grün, robots.txt freischalten,
   QA-Restpunkte aus docs/qa-report.md.

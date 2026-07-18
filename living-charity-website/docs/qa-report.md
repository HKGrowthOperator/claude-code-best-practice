# QA-Bericht — Vorabversion Living Charity e. V.

Stand: 18.07.2026 · Prüfumgebung: Chromium (Playwright, echte Viewport-Emulation),
Node-Prüfskript `src/utils/check.mjs`, rechnerische Kontrastprüfung (WCAG-Formel).

## 1. Automatisierte Prüfungen (alle 14 Seiten)

| Geprüfter Bereich | Methode | Ergebnis | Gefundener Fehler | Korrektur |
| --- | --- | --- | --- | --- |
| Interne Links & Assets | check.mjs (alle href/src gegen Dateisystem) | ✅ 0 kaputte Verweise | — | — |
| Bilder ohne Alt-Text | check.mjs | ✅ 0 | — | — |
| Überschriften-Hierarchie | check.mjs (genau 1×h1, keine Sprünge) | ✅ | 4 Seiten mit h1→h3-Sprung | Leerzustände/Infokarten auf h2 umgestellt (gleiche Optik) |
| Tonalitäts-Denyliste (verbotene Floskeln) | check.mjs | ✅ 0 Treffer | — | — |
| Horizontaler Überlauf 320/375/390/430/768/820/1024/1280/1440/1728 px | Playwright, scrollWidth-Messung je Seite × Breite | ✅ 0 px auf allen 14 Seiten | /datenschutz/ lief bei 320 px um 51 px über (lange Komposita) | `hyphens: auto` + `overflow-wrap` für Fließtext ergänzt |
| Konsolen-Fehler (JS/Netz) | Playwright console/pageerror-Listener | ✅ 0 auf allen Seiten | — | — |
| HTTP-Status aller Seiten | Playwright | ✅ 200 (404-Seite absichtlich vorhanden) | — | — |
| Mobile Navigation | Playwright-Klicktest | ✅ öffnet, `aria-expanded` korrekt, Escape schließt + Fokus zurück auf Button | — | — |
| Kontaktformular leer absenden | Playwright | ✅ Fehlermeldung, Fokus springt aufs erste Fehlerfeld, `aria-invalid` gesetzt | — | — |
| Kontaktformular gültig absenden | Playwright | ✅ Erfolgsmeldung mit ehrlichem Vorabversion-Hinweis (kein Backend) | — | — |
| Honeypot-Spamschutz | Code-Review + Verhalten | ✅ gefülltes Honeypot-Feld → stilles Verwerfen | — | — |
| IBAN-Kopierknopf | Playwright + Clipboard-Read | ✅ kopiert `DE18384500001000214963` (ohne Leerzeichen) | — | — |
| IBAN-Prüfsumme | mod-97-Berechnung | ✅ gültig (Rest 1) — ersetzt nicht die Bestätigung durch den Verein | — | — |
| Tastatur/Skip-Link | Playwright (erstes Tab-Ziel) | ✅ „Zum Inhalt springen" | — | — |
| Farbkontraste (18 Token-Paare) | WCAG-Kontrastformel | ✅ alle ≥ 4.5:1 (min. 4.90:1) | — | — |
| Reveal-Animationen bei `prefers-reduced-motion` | CSS-Review + Playwright `reducedMotion:'reduce'` | ✅ Inhalte sofort sichtbar, keine Transitionen | — | — |
| Ohne JavaScript | `no-js`-Klasse im Layout | ✅ alle Inhalte sichtbar (Reveals opt-in via JS) | — | — |
| Platzhalter-Konsistenz | check.mjs Marker-Report | ✅ 61 offene Marker, alle absichtlich und gelistet | — | vor Livegang → 0 (Skript erzwingt Übersicht) |

## 2. Performance-Bewertung (statisch belegbar)

Lighthouse-Messungen benötigen die spätere Hosting-Umgebung; diese Eigenschaften
sind bereits im Code sichergestellt:

- **Kein externes Byte:** 0 Third-Party-Requests (Fonts lokal, keine Tracker, keine CDNs).
- **Gewichte:** CSS ~30 KB unkomprimiert, JS ~5 KB, Fonts 3 × ~30–44 KB WOFF2 (variable, Latin-Subset), Bilder derzeit ausschließlich Inline-SVG.
- **Kein Layout-Shift:** Bildflächen haben feste `aspect-ratio`; Fonts mit `font-display: swap` + `preload`.
- **Hero priorisiert:** Above-the-fold-Grafik ist Inline-SVG (0 Requests); echte Hero-Fotos später mit `fetchpriority="high"` + `loading="eager"` einbinden, alle übrigen `loading="lazy"` (in image-requirements.md vermerkt).
- **Animationen GPU-schonend:** ausschließlich `opacity`/`transform`, IntersectionObserver statt Scroll-Handler.

## 3. Browser-Matrix

| Browser | Status |
| --- | --- |
| Chromium (Desktop + Android-Viewports) | ✅ getestet (Playwright) |
| Firefox, Safari (macOS/iOS), Edge | ⚠ offen — in dieser Umgebung nicht verfügbar. Risikoarm, da nur breit unterstützte Features verwendet werden (CSS Grid, clamp, aspect-ratio, IntersectionObserver, `<details>`); `color-mix()` und `overflow-x: clip` haben harmlose Fallbacks. Vor Livegang einmal manuell prüfen (Checkliste unten). |

## 4. Offene Punkte (vor Livegang)

1. **61 Inhalts-Marker auflösen** — `node src/utils/check.mjs` listet alle; Livegang erst bei 0.
2. **robots.txt umstellen** — Vorabversion blockiert Indexierung absichtlich; Umstellung siehe Dateikommentar/seo-plan.
3. **Safari/Firefox/Edge-Smoke-Test** — Startseite, Spenden, Kontakt (Formular), mobile Navigation.
4. **Lighthouse-Lauf auf dem Zielhosting** — Zielwerte: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95. Die Voraussetzungen (Punkt 2) sind geschaffen.
5. **Screenreader-Stichprobe** (NVDA oder VoiceOver): Formular-Fehlermeldungen, Navigation, Spendenbox.
6. **OG-Bild als PNG exportieren** (1200×630) — SVG wird nicht von allen Plattformen gerendert.
7. **Altseiten-Audit-Lücken** — die Live-Altseite war aus der Entwicklungsumgebung netzwerkbedingt nicht abrufbar (Policy-403); falls dort weitere Inhalte existieren (z. B. Texte, die übernommen werden sollen), bitte als Export bereitstellen. Für den Neuaufbau nicht blockierend.

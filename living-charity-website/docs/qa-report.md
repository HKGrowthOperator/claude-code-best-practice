# QA-Bericht — Vorabversion Living Charity e. V. (v2)

Stand: 18.07.2026 · Prüfumgebung: Chromium (Playwright, echte
Viewport-Emulation), Node-Prüfskript `src/utils/check.mjs`, rechnerische
Kontrastprüfung. Barrierefreiheit im Detail: docs/accessibility-report.md.

## 1. Automatisierte Prüfungen (alle 17 Seiten)

| Geprüfter Bereich | Methode | Ergebnis | Gefundener Fehler | Korrektur |
| --- | --- | --- | --- | --- |
| Verbotene Altdaten (34 Projekte, 13.000, 348, 5.000+, 8/400 Veranstaltungen, 4 Demo-Events) | check.mjs Denyliste (sichtbar + versteckt) | ✅ 0 Treffer | — | Denyliste verhindert Wiedereinschleppen dauerhaft |
| Sichtbare Platzhalter-Marker im Frontend | check.mjs (Kommentare ausgenommen) | ✅ 0 sichtbar (2 interne Kommentar-Notizen zu LB-01/02) | — | — |
| KI-Bild-Schutz (ChatGPT_Image / plantceylon-CDN) | check.mjs | ✅ 0 Treffer | — | technisch gesperrt |
| Externe Links (Kennzeichnung, target, noopener) | check.mjs | ✅ | — | — |
| Interne Links & Assets | check.mjs | ✅ 0 kaputte Verweise | — | — |
| Überschriften-Hierarchie | check.mjs | ✅ | 1 Sprung (/projekte/) | visually-hidden h2 ergänzt |
| Floskel-/Tonalitäts-Denyliste (inkl. „garantiert eine Familie") | check.mjs | ✅ 0 | — | — |
| Horizontaler Überlauf, 10 Breakpoints × 17 Seiten (320–1728 px) | Playwright scrollWidth | ✅ 0 px überall | /spenden/ bei 320/375 px (Grid-Min-Content durch „Spendenbescheinigung") | `min-width: 0` für Grid-Kinder |
| Konsolen-/Seitenfehler | Playwright Listener | ✅ 0 | — | — |
| Farbkontraste (22 Paare, neue Palette) | WCAG-Formel | ✅ alle Textpaare ≥ 4.5:1 | 2 Paare unter AA (Muted auf Sand 3.91; Pausiert-Badge 3.67) | Töne abgedunkelt (5.11 / 5.3) |
| Mobile Navigation | Playwright | ✅ öffnet, `aria-expanded`, Escape schließt | — | — |
| Kontaktformular leer/gültig | Playwright | ✅ Fehlerfokus + Meldung; gültig → Weiterleitung /danke/ | — | — |
| Themen-Vorbelegung `?thema=plant-ceylon` | Playwright | ✅ Select vorausgewählt | — | — |
| IBAN-/BIC-Kopierknöpfe | Playwright + Clipboard | ✅ IBAN `DE18384500001000214963` | — | — |
| Betragsauswahl | Playwright | ✅ aria-pressed + Verwendungszweck-Update („Orientierungsbetrag 25 €") | — | — |
| Suche (Index, Treffer, Leere-Treffer-Text) | Playwright `?q=Sri Lanka` | ✅ 10 Treffer mit Auszügen | — | — |
| Skip-Link / erstes Tab-Ziel | Playwright | ✅ | — | — |
| Reduced Motion / No-JS | Playwright + Code | ✅ | — | — |

## 2. Visuelle Prüfung (Screenshots 390 / 768 / 1440, Briefing Abschnitt 23)

Bewertet auf Typografie, Weißraum, Bildverhältnisse, Hierarchie,
Glaubwürdigkeit, Wiederholungen, KI-Template-Wirkung:

- **1440 px (Startseite, Spenden):** Editorial-Rhythmus trägt — Wechsel aus
  Ivory/Forest/Sand/Paper-Flächen statt Kartenwüste; 5-€-Ziffer in
  Newsreader-Kursive ist die eine typografische Geste; Terrakotta bleibt
  selten. Keine Pill-Buttons, kaum Schatten, feine Linien.
- **768 px (Plant Ceylon):** Schritte und Baumraster brechen kontrolliert um;
  Prüfstatus-Badge bleibt sichtbar.
- **390 px (Startseite):** Mobile ist keine Zweitseite — Trust-Strip, Hero,
  Impact-Modul und Donation Panel bleiben vollwertig; IBAN bricht sauber um.
- Wiederholungsprüfung: „Möglichkeiten zu helfen" ist das einzige
  6er-Kartenraster; alle übrigen Sektionen haben eigene Layout-Formen.

## 3. Performance (statisch belegbar)

- 0 Third-Party-Requests (Fonts lokal: Manrope 25 KB, Source Sans 3 29 KB,
  Newsreader Italic 147 KB — Newsreader lädt ohne Preload, nur Akzent).
- CSS ~34 KB, JS ~9 KB unkomprimiert; Bilder ausschließlich Inline-SVG.
- Kein Layout-Shift: feste `aspect-ratio` auf Bildflächen, `font-display: swap`
  + Preload der zwei Hauptfonts.
- Animationen nur `opacity`/`transform` via IntersectionObserver.
- Lighthouse-Ziele (≥ 90/95/95/95) sind auf dem Zielhosting zu messen —
  Voraussetzungen sind geschaffen (siehe Offene Punkte).

## 4. Browser-Matrix

| Browser | Status |
| --- | --- |
| Chromium (Desktop + Mobile-Viewports) | ✅ getestet |
| Safari (macOS/iOS), Firefox, Edge, Android Chrome | ⚠ offen — in dieser Umgebung nicht verfügbar; verwendete Features breit unterstützt (Grid, clamp, aspect-ratio, `<details>`, IntersectionObserver). Vor Livegang Smoke-Test lt. Checkliste. |

## 5. Offene Punkte (vor Livegang)

1. Launch-Blocker LB-01 … LB-11 auflösen (docs/launch-blockers.md).
2. Browser-Smoke-Test Safari/Firefox/Edge/iOS/Android: Startseite, Spenden
   (Kopierknöpfe!), Kontakt (Formular), Suche, mobile Navigation.
3. Lighthouse-Lauf auf Zielhosting; ggf. Newsreader subsetten (nur kursive
   Ziffern/Grundzeichen), falls Performance-Budget gerissen wird.
4. Screenreader-Stichprobe (siehe accessibility-report.md).
5. OG-Bild als PNG exportieren (LB-19).
6. `robots.txt` freischalten (LB-10).

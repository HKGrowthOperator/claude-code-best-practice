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

---

## Nachtrag v3 (18.07.2026): Logo-Farbwelt + Multi-Agenten-Review

**Änderungen:** Echtes Vereinslogo (Herz aus zwei Händen) integriert; Farbwelt
auf Logo-Palette pivotiert (Rot #B50000 / Schwarz #161616, geprüft: 20 Paare
≥ 4.5:1); heller Header, schwarzer Trust-Strip, Ink-Dunkelsektionen.

**Fünf parallele Spezialisten-Agenten** (Reports in docs/reviews/):

| Agent | Ergebnis | Integriert |
| --- | --- | --- |
| Design-Kritik (Screenshot-basiert, 21 Aufnahmen) | 5×P1, 8×P2, 5×P3 | alle P1 (Logo-Freisteller korrigiert, Nav-Nowrap, Spenden-Hierarchie, Trust-Strip mobil, Badge/Hero-Ratio) + Kartenwüsten-P2 (Hilfe-Liste, Proof-Linien) |
| A11y/Code-Review (WCAG 2.2 AA, Playwright-verifiziert) | 2×P1, 6×P2, 7×P3 | beide P1 (Fokusring auf Dunkelflächen, Datenschutz-Checkbox-Fehler) + Kopier-Live-Region, No-JS-Formularpfad, Suchindex-Entities, DOM-sichere Suche |
| SEO-Review | 1×P1, 4×P2, 9×P3 | P1 (Preview-noindex + robots-Disallow) + Titles ≤60, og:image-Maße/alt, twitter:card, 3-Ebenen-Breadcrumbs |
| WP-Blueprint-Prüfung | 2×P1, 3×P2 | alle (CPT-Name events, tote Links, Weg-C-Instanzcheck, Excerpt-Hinweis, showEvents-Flag) |
| Girocode-Engineer | Modul + 31/31 Tests grün | src/utils/girocode.mjs (EPC-QR, byte-exakter Decode-Roundtrip mit echten Bankdaten); Aktivierung gated hinter LB-03/LB-16 |

**Re-Verifikation nach Integration:** 170 Viewport-Prüfungen (17 Seiten ×
10 Breakpoints) überlauffrei, 0 Konsolen-/Seitenfehler, 0 zweizeilige
Nav-Links bei 1440 px, Datenschutz-Fehlermeldung sichtbar + verknüpft,
Kopier-Live-Region meldet korrekt, check.mjs 0 harte Fehler.
Verbleibende P2/P3-Punkte der Reviews: in docs/reviews/ dokumentiert,
bewusst nicht alle umgesetzt (Aufwand/Nutzen-Abwägung, keine Blocker).

---

## Nachtrag v4 (18.07.2026): Restliche Design-P2s + plantceylon.com-Anbindung

**Anbindung Plant Ceylon:** Prominente externe CTAs zu plantceylon.com im
Seitenkopf und Abschluss von /plant-ceylon/ sowie im Startseiten-Teaser
(gekennzeichnet, neuer Tab, Preis als Projektangabe eingeordnet).

**Design-Review P2 (Rest) umgesetzt:**

| Punkt | Fix |
| --- | --- |
| P2.3 Markenrot-Inflation | `.card__link` auf Ink, nur Pfeil rot; rote Volltextlinks bleiben singulären Sektions-CTAs vorbehalten |
| P2.4 Overline-Strich auf Dunkelflächen | neues Token `--brand-on-dark` (#e2b3b0, 9.7:1 auf Ink) für Strich und Links in `.section-dark` |
| P2.5 /spenden/-Hero zu schmal | `page-head--wide` (H1 28ch, Lead 60ch) |
| P2.6 Achtfache Preiswiederholung Baumarten | Preis einmal als Satz („nach Angaben der Projektseite"), Arten als zweispaltige Linienliste; rechte H2 demotiert |
| P2.7 Doppelter Empty-State Startseite | „Berichte aus der Vereinsarbeit"-Sektion entfernt; einzeilige Notiz mit Link zu /aktuelles/ in der Hilfsaktions-Sektion |
| P2.8 Rotes „Externe Quelle"-Badge | auf neutralen Hinweiston #6d6046 (≈5.7:1 auf Ivory) gestellt — Rot bleibt dem Quellenlink |

**Re-Verifikation:** 25 Viewport-Prüfungen (5 Kernseiten × 5 Breakpoints)
überlauffrei, 0 Konsolenfehler, check.mjs 0 harte Fehler; Dunkel-Overline
rendert `rgb(226, 179, 176)`, Baumarten-Liste 8 Einträge.
Offen bleiben nur P3-Ideen (docs/reviews/) und die Client-Launch-Blocker.

---

## Nachtrag v5 (18.07.2026): Header-Regression behoben (Kundenscreenshot)

**Befund (vom Auftraggeber gemeldet):** In der Artifact-Vorschau war das Logo
kaputt und der „Jetzt helfen"-Button brach dreizeilig mit Trennstrich um.

**Ursachenanalyse (reproduziert auf dem echten Build, alle Desktop-Breiten):**

1. Die globale Regel `ul { max-width: var(--container-text) }` deckelte die
   Hauptnavigation auf 680 px, ihr Inhalt braucht aber 767 px. Der CTA war das
   einzige schrumpffähige Flex-Kind und wurde auf 96 px gequetscht; das
   geerbte `hyphens: auto` des `<li>` trennte „hel-fen".
2. Die Einzeldatei-Vorschau bettete Bilder nicht ein — `/assets/…`-Pfade sind
   im Artifact-iframe nicht auflösbar, das Logo erschien als kaputtes Icon.

**Fixes:** `.site-nav__list { max-width: none }`; Nav-`li` `flex: none`; CTA
`white-space: nowrap`; global `.btn { hyphens: manual }`; Nav-Links minimal
verschlankt (0.92 rem, engeres Padding); Burger-Breakpoint von 62 rem auf
71 rem angehoben (Messwert: Header braucht ≥ 1140 px); preview.mjs bettet
Seitenbilder jetzt als Data-URIs ein.

**Re-Verifikation:** 119 Prüfungen (17 Seiten × 7 Breakpoints inkl. 1140 px)
überlauffrei und fehlerfrei; CTA einzeilig ab 1140 px, darunter Burger-Menü;
Logo rendert in Build und Vorschau; check.mjs 0 harte Fehler.
**Lehre:** Der bisherige 1440-px-Check prüfte Nav-Links, nicht den CTA —
der Sweep prüft jetzt zusätzlich die Header-Geometrie nahe der Umbruchkante.

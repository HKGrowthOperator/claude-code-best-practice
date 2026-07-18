# Migrationsanleitung: Vorabversion → WordPress (v2)

Zielbild und Datenmodell: [wordpress-blueprint.md](wordpress-blueprint.md).
Aufwandsschätzung: 2–4 Entwicklertage (Design, Inhalte, Datenmodell und
Blöcke sind fertig spezifiziert).

## Schritt 0 — Voraussetzungen

1. Zugänge gemäß `/content/client-checklist.md` (Hosting, Domain, WP-Admin).
2. Staging-Umgebung (nie direkt in Produktion), HTTP-Auth + noindex.
3. **Zielinstanz verifizieren:** Es muss die Living-Charity-Instanz sein.
   In der Entwicklungsumgebung war zeitweise eine fremde Instanz
   („SPD – Roshani Thanapalasingham") angebunden — dorthin darf nichts.
   `src/utils/push-wp.mjs` prüft den Site-Namen automatisch.

## Schritt 1 — Theme-Gerüst

1. Block-Theme `living-charity` anlegen (`style.css`, `theme.json`,
   `templates/`, `parts/`, `patterns/`).
2. `theme.json` aus `src/styles/tokens.css` erzeugen:
   - Palette: `ink`, `forest`, `forest-soft`, `sage`, `sand`, `ivory`,
     `paper`, `terracotta`, `text`, `text-muted`, `line`, `success`,
     `warning`, `error` (Briefing-Palette, exakte Hexwerte in tokens.css)
   - Schriften: Manrope (Headlines), Source Sans 3 (Fließtext), Newsreader
     Italic (redaktioneller Akzent) — WOFF2 aus `public/assets/fonts/` ins
     Theme kopieren, lokal hosten, Lizenzdatei mitnehmen
   - `fontSizes` inkl. `clamp()`-Werten, `spacingSizes`,
     `layout.contentSize: 42.5rem`, `wideSize: 80rem`
3. `public/assets/css/main.css` als Theme-Stylesheet einbinden;
   `src/utils/main.js` als Skript (`defer`).

## Schritt 2 — Datenmodell

CPTs, Taxonomien, Felder, Options-Seite laut Blueprint in einem kleinen
Plugin `living-charity-core` registrieren (Datenmodell gehört ins Plugin,
nicht ins Theme). Optionen mit Werten aus `src/data/site.json` füllen —
inklusive der `status`-Felder als interne Freigabeliste.

## Schritt 3 — Templates, Patterns, Blöcke

1. Template Parts `header`/`footer` aus `src/components/` übertragen
   (Trust-Strip gehört zum Header-Part).
2. Patterns aus den gebauten Seiten (`public/`) übernehmen.
3. Dynamische Blöcke (Impact-5, Projektkarten, Team, Donation Panel,
   Breadcrumbs): Render-Logik inkl. Leerlösungen ist in `src/utils/build.mjs`
   (Renderer-Funktionen) vorformuliert — nach PHP übertragen.
4. Templates laut Zuordnungstabelle im Blueprint zusammensetzen.
5. Menüs laut `src/data/navigation.json` anlegen.

## Schritt 4 — Formular

Feldstruktur aus `/kontakt/` exakt übernehmen: Name, E-Mail, Telefon
(optional), Thema (6 Optionen: Spende, Sri-Lanka-Hilfe, Plant Ceylon,
Ehrenamtliche Unterstützung, Kooperation, Allgemeine Anfrage), Nachricht,
Einwilligungscheckbox (nicht vorangekreuzt). Serverseitige Validierung,
Honeypot/Zeitfalle, SMTP-Versand an info@livingcharity.de, Weiterleitung auf
die Danke-Seite. Speicherung nur mit Löschkonzept (Datenschutz).
Themen-Vorbelegung per `?thema=` beibehalten.

## Schritt 5 — SEO & Meta

Titles/Descriptions aus den META-Blöcken der Seitendateien übernehmen;
NGO-Schema liefert das Theme aus den Optionen (Duplikat im SEO-Plugin
deaktivieren); Sitemap dem Plugin überlassen; Permalinks `/%postname%/`;
Redirects: keine Altpfade nötig (Neuaufbau), aber alte Vorschau-Domain
stilllegen/301. `noindex` für /danke/, /suche/, Impressum, Datenschutz.

## Schritt 6 — Inhalte

1. Nur Inhalte gemäß `content/confirmed-data.md` + `content-status.md`
   übernehmen; Launch-Blocker (docs/launch-blockers.md) abarbeiten.
2. Schnellweg: `npm run export:wp` erzeugt `wordpress-export/` (Gutenberg-HTML
   je Seite + Manifest); `npm run push:wp` legt alles als Entwürfe an
   (REST-API, mit Zielinstanz-Sicherheitsbremse). Details:
   `wordpress-export/README.md`.
3. Bilder nur mit Beleg-Metadaten (Blueprint Abschnitt 6).

## Schritt 7 — Livegang

1. Domain aufschalten (LB-11), SSL erzwingen (HSTS).
2. robots.txt freischalten (LB-10), Search Console einrichten.
3. Abschluss-QA laut `docs/qa-report.md` („Offene Punkte") inkl.
   Lighthouse-Zielwerte und Browser-Matrix.
4. Alle Launch-Blocker LB-01 … LB-11 aufgelöst? Erst dann veröffentlichen.

## Redaktionshandbuch (Kurzfassung)

- Neues Projekt: „Projekte → Erstellen" — Pflichtfelder führen durch die
  Struktur; `verification_status` setzen; ohne Originalbilder bleibt die
  neutrale Bildlösung aktiv.
- Neuer Bericht: Kategorie wählen, echtes Datum, Quellen-Badges für Zitate.
- Vereinsdaten nur unter „Vereinsdaten" ändern — wirkt überall.
- Plant Ceylon: Prüfliste abarbeiten, dann Badge via `verification_status`
  umstellen.

# Migrationsanleitung: Vorabversion → WordPress

Zielbild: Block-Theme (FSE) auf aktuellem WordPress (≥ 6.5), PHP ≥ 8.1.
Aufwandsschätzung: 2–4 Arbeitstage für eine erfahrene WP-Entwicklung, da Design,
Inhalte, Datenmodell und Blöcke fertig spezifiziert sind.

## Schritt 0 — Voraussetzungen

1. Zugänge gemäß `/content/client-checklist.md` (Hosting, Domain, WP-Admin).
2. Staging-Umgebung anlegen (nie direkt in Produktion bauen).
3. Backup-Plugin und Mail-Versand (SMTP) klären.

## Schritt 1 — Theme-Gerüst

1. Neues Block-Theme `living-charity` anlegen (`style.css`, `theme.json`, `templates/`, `parts/`, `patterns/`).
2. `theme.json` aus den Tokens erzeugen:
   - `settings.color.palette` ← alle `--color-*` aus `src/styles/tokens.css`
     (gleiche Slugs: `primary`, `primary-dark`, `accent`, `bg-warm`, `surface`, `text-strong`, `text-muted`, `border`, `success`, `warning`, `error`, `ink`)
   - `settings.typography.fontFamilies` ← Alegreya (display) + Source Sans 3 (text);
     WOFF2-Dateien aus `public/assets/fonts/` in `assets/fonts/` des Themes kopieren
     (lokal hosten, Lizenzdatei mitnehmen)
   - `settings.typography.fontSizes` ← `--text-*`-Skala inkl. `clamp()`-Werten
   - `settings.spacing.spacingSizes` ← `--space-*`
   - `settings.layout.contentSize: 44rem`, `wideSize: 72rem`
3. Gesamtes CSS übernehmen: `public/assets/css/main.css` als Theme-Stylesheet
   einbinden (enqueue). Die Klassen sind BEM-artig und kollisionsarm; später
   schrittweise in Block-Styles überführen (optional).
4. `src/utils/main.js` als Theme-Skript einbinden (`defer`). Es ist
   abhängigkeitsfrei und WordPress-kompatibel.

## Schritt 2 — Datenmodell

1. CPTs, Taxonomien, Felder und Options-Seite laut
   [content-model.md](content-model.md) registrieren (eigenes kleines Plugin
   `living-charity-core` — Datenmodell gehört ins Plugin, nicht ins Theme,
   damit ein Theme-Wechsel keine Daten „verliert").
2. Options-Seite „Vereinsdaten" mit den Werten aus `src/data/site.json` füllen.
3. Menü „Hauptmenü" (5 Punkte + CTA-Button-Klasse) und Footer-Menüs laut
   `src/data/navigation.json` anlegen.

## Schritt 3 — Templates & Patterns

1. Template-Parts `header`/`footer` aus `src/components/header.html` /
   `footer.html` übertragen (Markup ist block-kompatibel strukturiert).
2. Patterns laut [blocks.md](blocks.md) anlegen; HTML dafür direkt aus den
   gebauten Seiten in `public/` kopieren (sauberes, klassenbasiertes Markup).
3. Dynamische Blöcke (Projektkarten, Teamkarten, Veranstaltungen, Spendenbox,
   Vertrauensleiste) als serverseitig gerenderte Blöcke im Plugin umsetzen —
   die Render-Logik inklusive Leerzustände ist in `src/utils/build.mjs`
   (Renderer-Funktionen) vollständig vorformuliert und muss nur nach PHP
   übertragen werden.
4. Templates laut Zuordnungstabelle zusammensetzen.

## Schritt 4 — Formular

1. Leichtgewichtiges Formular-Plugin verwenden (Empfehlung in
   [plugins-security.md](plugins-security.md)) und die Feldstruktur aus
   `/kontakt/` exakt übernehmen: Name, E-Mail, Telefon (optional), Anliegen
   (Auswahl), Nachricht, Einwilligungscheckbox (nicht vorangekreuzt).
2. **Serverseitige Validierung aktivieren** (Pflichtfelder, E-Mail-Format),
   Honeypot/Zeitfalle statt Bild-Captcha.
3. Versand an info@livingcharity.de via SMTP; Speicherung im Backend nur, wenn
   Löschkonzept definiert ist (Datenschutz!). Keine ungesicherte Speicherung.
4. Erfolgs-/Fehlermeldungen mit `role="status"` ausgeben (wie Vorabversion).

## Schritt 5 — SEO & Meta

1. SEO-Plugin (Empfehlung siehe plugins-security.md) installieren; Titel/
   Descriptions aus den META-Blöcken der Seitendateien (`src/pages/*.html`)
   übernehmen — sie sind fertig formuliert.
2. `NGO`-Schema: liefert das Theme bereits (aus Optionen generieren, analog
   `headFor()` in build.mjs). Doppelte Organisations-Schemata des SEO-Plugins
   deaktivieren.
3. XML-Sitemap dem Plugin überlassen; Permalinks `/%postname%/`.
4. robots: Staging `noindex`; Livegang: Freigabe + Search Console.

## Schritt 6 — Inhalte

1. `content-status.md` durchgehen: nur Kategorie-A-Inhalte übernehmen.
2. Projekte/Beiträge/Veranstaltungen erst nach Freigabe anlegen — die
   Leerzustände sind repräsentativ.
3. Bilder gemäß `image-requirements.md` (WebP/AVIF-Ableitungen, Alt-Texte,
   Rechtenachweis in der Mediathek).

## Schritt 7 — Domain, SSL, Livegang

1. Wunschdomain aufschalten, SSL erzwingen (HTTPS-Redirect, HSTS).
2. Alte Vorschau-Domain (live-website.com) stilllegen bzw. 301 auf die neue Domain.
3. Abschluss-QA: Checkliste aus `/docs/qa-report.md` Abschnitt „Offene Punkte",
   inkl. Lighthouse-Lauf und Browser-Smoke-Test.
4. Marker-Suche: Es dürfen keine `[INHALT …]`- oder `[RECHTSTEXT …]`-Marker
   mehr im Frontend erscheinen (Volltextsuche im Backend + Sichtprüfung).

## Redaktionshandbuch (Kurzfassung für die Übergabe)

- Neues Projekt: „Projekte → Erstellen" — Pflichtfelder führen durch die Struktur; Status setzen; ohne Bild erscheint die neutrale Bildfläche nicht öffentlich, Projekt erst veröffentlichen, wenn Kartenbild vorhanden.
- Neuer Beitrag: Kategorie wählen (Neuigkeit/Rückblick/Projekt-Update/Pressemitteilung); Datum = echtes Datum.
- Veranstaltung: nach dem Termin nichts tun — Rückblick-Umschaltung ist automatisch.
- Vereinsdaten (Adresse, Bank, CTA-Texte): nur unter „Vereinsdaten" ändern — wirkt überall.

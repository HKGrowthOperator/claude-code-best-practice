# WordPress-Export — Schnellweg in eine WordPress-Instanz

Dieser Ordner wird von `node src/utils/export-wp.mjs` erzeugt und enthält die
Vorabversion in Gutenberg-kompatibler Form. Er ist der **Schnellweg** (Design
1:1 über Custom-HTML-Blöcke + Theme-CSS). Die vollwertige, redaktionsfreundliche
Block-Theme-Migration bleibt in `docs/migration-guide.md`
beschrieben — der Schnellweg ist damit kompatibel und kann schrittweise dorthin
überführt werden.

## Inhalt

- `pages/<slug>.html` — Seiteninhalt je WordPress-Seite (`<!-- wp:html -->`-Block)
- `manifest.json` — Titel, Slugs, Meta-Descriptions, Reihenfolge, Startseiten-Flag
- `theme-assets/main.css` / `main.js` — im Theme einzubinden

## ⚠️ Wichtiger Sicherheitshinweis

Die derzeit an die Entwicklungs-Sitzung angebundene WordPress-Instanz ist
**„SPD – Roshani Thanapalasingham"** (spdroshanithanapalas2338.live-website.com) —
eine **fremde Website**, nicht Living Charity. **Dorthin darf nichts gepusht
werden.** Push-Weg A (Skript) und Weg B (MCP) verifizieren deshalb zuerst den Site-Namen; bei Weg C (manuell) müssen SIE das tun: vor dem Einfügen im WP-Admin oben links den Site-Namen prüfen — er muss zu Living Charity gehören.

## Push-Weg A: per Skript (REST-API, empfohlen)

Voraussetzung: WordPress-Zugang zur **Living-Charity-Instanz** und ein
Application Password (WP-Admin → Benutzer → Profil → Application Passwords).

```bash
node src/utils/export-wp.mjs
WP_URL=https://<living-charity-wordpress> \
WP_USER=<benutzer> \
WP_APP_PASSWORD='<application-password>' \
node src/utils/push-wp.mjs            # legt alle Seiten als ENTWÜRFE an
```

Das Skript bricht ab, wenn der Site-Name nicht zu Living Charity passt
(`--force` überschreibt das bewusst). `--publish` veröffentlicht direkt —
erst verwenden, wenn die Marker-Prüfung (`node src/utils/check.mjs`) leer ist.
Hinweis: Die Meta-Descriptions landen bei Weg A im WordPress-Feld „Auszug"
(excerpt) — nach der Installation des SEO-Plugins einmalig in dessen
Description-Felder übernehmen (Weg B setzt sie direkt via wp_update_seo_meta).

## Push-Weg B: per Claude-Sitzung (WordPress-MCP)

Sobald die **richtige** Living-Charity-WordPress-Instanz als MCP-Server mit
der Sitzung verbunden ist (z. B. über das gleiche Hosting-Panel, das aktuell
die SPD-Instanz anbindet):

1. `wp_get_site_info` aufrufen und prüfen, dass Name/URL zu Living Charity gehören.
2. Je Eintrag in `manifest.json`: `wp_create_page` mit Titel, Slug,
   Inhalt aus `pages/<slug>.html`, Status `draft`.
3. SEO-Descriptions aus dem Manifest via `wp_update_seo_meta` setzen.
4. `theme-assets/main.css` via `wp_update_custom_css` einspielen.
5. Startseite („startseite") als statische Front Page setzen, Menü laut
   `src/data/navigation.json` anlegen (`wp_create_menu_item`).
6. Fonts aus `public/assets/fonts/` ins Theme hochladen (lokal hosten).

## Push-Weg C: manuell (ohne Zugänge)

Zuerst Zielinstanz prüfen (Site-Name im WP-Admin = Living Charity, NICHT
„SPD – Roshani Thanapalasingham"). Dann je Seite: neue Seite → Codeeditor →
Inhalt aus `pages/<slug>.html` einfügen; CSS unter Design → Customizer →
Zusätzliches CSS aus `theme-assets/main.css`; Meta-Descriptions aus
`manifest.json` ins SEO-Plugin übertragen.

## Nach jedem Push (alle Wege)

- Kontaktformular durch Formular-Plugin-Block ersetzen (Feldstruktur:
  `docs/migration-guide.md`, Schritt 4)
- Seiten bleiben Entwürfe, bis die Inhalts-Marker aufgelöst sind
- Permalinks `/%postname%/` aktivieren, damit die internen Links stimmen

# WordPress-Blueprint — Living Charity e. V.

Dieser Ordner enthält alles, um die Vorabversion mit geringem Aufwand in
WordPress zu überführen — als **Block-Theme (Full Site Editing)** mit nativen
Gutenberg-Blöcken und Block Patterns, ohne schweren Page Builder.

| Datei | Inhalt |
| --- | --- |
| [content-model.md](content-model.md) | Custom Post Types, Felddefinitionen, Taxonomien, globale Optionen |
| [blocks.md](blocks.md) | Blockliste, Pattern-Zuordnung, Template-Zuordnung je Seite |
| [migration-guide.md](migration-guide.md) | Schritt-für-Schritt-Anleitung der Integration |
| [donation-provider.md](donation-provider.md) | Abstrakte Spendendienst-Schnittstelle (bewusst ohne Implementierung) |
| [plugins-security.md](plugins-security.md) | Plugin-Empfehlungen und Sicherheitsanforderungen |

## Sitemap (Kurzfassung)

Siehe [/docs/informationsarchitektur.md](../docs/informationsarchitektur.md) —
die dortige Sitemap ist verbindlich. WordPress-Abbildung:

| URL | WordPress-Typ | Template |
| --- | --- | --- |
| `/` | Statische Startseite (page) | `front-page` |
| `/ueber-uns/`, `/spenden/`, `/mitmachen/`, `/kontakt/`, `/impressum/`, `/datenschutz/` | Seiten (page) | `page` + Patterns |
| `/projekte/` | Archiv `lc_project` | `archive-lc_project` |
| `/projekte/<slug>/` | Einzelansicht `lc_project` | `single-lc_project` |
| `/aktuelles/` | Beitragsübersicht (posts page) | `home` |
| `/aktuelles/<slug>/` | Beitrag (post) | `single` |
| `/veranstaltungen/` | Archiv `lc_event` | `archive-lc_event` |
| `/veranstaltungen/<slug>/` | Einzelansicht `lc_event` | `single-lc_event` |
| — | 404 | `404` |

Permalink-Struktur: `/%postname%/`; CPT-Slugs `projekte` und `veranstaltungen`
(`rewrite.slug`), Beiträge unter `/aktuelles/` via Seitenzuordnung „Beitragsseite".

## Grundprinzipien

1. **Design-Tokens → theme.json.** Alle Werte aus `src/styles/tokens.css`
   wandern in `settings.color.palette`, `settings.typography.fontFamilies/fontSizes`,
   `settings.spacing`. Keine Farb-/Größenwerte in Blöcken hart kodieren.
2. **Ein Block = eine Komponente.** Jede CSS-Komponente der Vorabversion hat
   einen benannten Block/Pattern (Tabelle in blocks.md). Redakteure arbeiten
   nur mit diesen benannten Bausteinen — keine verschachtelten Container-Orgien.
3. **Leere Felder verschwinden.** Templates rendern Sektionen nur bei Inhalt
   (identisch zur Vorabversion).
4. **Globale Daten zentral.** Vereins-, Register- und Bankdaten leben in einer
   Options-Seite (siehe content-model.md) und werden per Block/Shortcode
   ausgespielt — nie hart in Seiteninhalte tippen.
5. **Kein Elementor.** Nur falls die bestehende Installation ihn zwingend
   erfordert; das Design ist vollständig mit Core-Blöcken + Patterns abbildbar.

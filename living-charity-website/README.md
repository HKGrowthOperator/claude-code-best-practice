# Living Charity e. V. — Website-Vorabversion

WordPress-fertige Vorabversion der neuen Vereinswebsite. Statisch gebaut,
ohne Abhängigkeiten (nur Node ≥ 18), vollständig lokal lauffähig und für die
Übertragung in ein WordPress-Block-Theme vorbereitet.

## Schnellstart

```bash
node src/utils/build.mjs     # baut alle Seiten nach public/
node src/utils/check.mjs     # QA: Links, Alt-Texte, Überschriften, Marker, Floskeln
npx serve public             # lokal ansehen (oder beliebiger Static-Server)
```

`npm run build` / `npm run check` / `npm run serve` stehen ebenfalls bereit.

## Wichtig: Vorabversion, kein Livegang

- `robots.txt` blockiert Indexierung absichtlich.
- 61 sichtbare Inhalts-Marker (`[INHALT VON LIVING CHARITY ERFORDERLICH]` /
  `[BITTE DURCH DEN AUFTRAGGEBER BESTÄTIGEN]`) kennzeichnen unbestätigte
  Inhalte. **Keine Platzhalterinformation ist als Tatsache dargestellt.**
- Vollständige Inhaltslage: [content/content-status.md](content/content-status.md)
- Was der Verein liefern muss: [content/client-checklist.md](content/client-checklist.md)

## Struktur

```
src/
  pages/        13 Seiten + 404 (mit META-Block je Seite: Titel, Description, Pfad)
  layouts/      Basis-Layout (head, Skip-Link, Header/Footer-Einbindung)
  components/   Header, Footer (Partials)
  styles/       tokens.css (Design-Tokens) · base.css · components.css
  data/         site.json (globale Vereinsdaten) · navigation · projects ·
                posts · events · team  →  spiegeln das WordPress-Datenmodell
  utils/        build.mjs (Build) · check.mjs (QA) · main.js (Frontend-JS)
public/         gebaute Seiten + Assets (Fonts lokal, CSS-Bundle, sitemap.xml)
content/        content-status · client-checklist · image-requirements
docs/           audit-report · informationsarchitektur · design-system ·
                seo-plan · qa-report
wordpress-blueprint/  Content-Modell, Blöcke, Migrationsanleitung,
                      DonationProvider, Plugins & Sicherheit
```

## Kerneigenschaften

- **Kein einziges externes Byte:** Fonts lokal (SIL OFL), keine Tracker, keine CDNs — DSGVO-freundlich per Konstruktion.
- **Barrierefreiheit:** semantisches HTML, Skip-Link, Fokuszustände, geprüfte Kontraste (alle ≥ 4.5:1), `prefers-reduced-motion`, funktioniert ohne JavaScript.
- **Responsive:** überlauffrei getestet von 320 px bis 1728 px (Protokoll: docs/qa-report.md).
- **SEO-Grundlage:** Titel/Descriptions je Seite, Canonicals, Open Graph, NGO- und Breadcrumb-Schema, generierte sitemap.xml.
- **Anti-Halluzination:** dynamische Listen (Projekte, Beiträge, Termine) sind leer und zeigen ehrliche Leerzustände statt erfundener Beispieldaten; die Altseiten-Zahlen (13.000/5.000/400) wurden bewusst nicht übernommen (Begründung: docs/audit-report.md).

## Nächste Schritte

1. Inhalte gemäß client-checklist.md einsammeln (Blocker: Logo, Satzungszweck, Projekte, Rechtstexte).
2. WordPress-Integration nach [wordpress-blueprint/migration-guide.md](wordpress-blueprint/migration-guide.md).
3. Vor Livegang: `node src/utils/check.mjs` → 0 Marker, robots.txt freischalten, QA-Restpunkte aus docs/qa-report.md.

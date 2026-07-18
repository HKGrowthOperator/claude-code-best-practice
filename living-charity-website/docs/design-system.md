# Designsystem — „Editorial Humanitarian Premium" (v2)

Die Seite wirkt wie eine Mischung aus hochwertigem redaktionellem Magazin,
transparenter NGO-Projektseite, ruhiger Premium-Unternehmenswebsite und
dokumentarischer Fotoreportage — nicht wie ein Charity-Template, eine
KI-Landingpage, ein SaaS-Startup oder ein grelles Spendenportal.

Single Source of Truth: `src/styles/tokens.css`. Dieses Dokument erklärt die
Entscheidungen; Werte stehen nur dort.

## Farbwelt (verbindliche Briefing-Palette)

`--ink #17201D` · `--forest #173F35` · `--forest-soft #2E6656` ·
`--sage #AFC2B5` · `--sand #E9E2D5` · `--ivory #F7F5EF` · `--paper #FFFFFF` ·
`--terracotta #B86548` · `--text #202622` · `--text-muted #68716C` ·
`--line #DDE2DD` · `--success #267858` · `--warning #A16A27` · `--error #A63E38`

Verwendung: Ivory als Seitenhintergrund, Forest für Header/Footer/
Schwerpunktbereiche (Sri-Lanka-Sektion, CTA), Paper für redaktionelle
Inhaltsflächen, Sand als warme Abstufung, **Terracotta ausschließlich als
sparsamer Akzent** (Sri-Lanka-Kennzeichnungen, 5-€-Zahl, Spenden-CTA,
Overline-Striche). Keine Neonfarben, keine Verläufe, keine Glow-Effekte.
Ergänzt um `--terracotta-deep #9D4F34` (Akzent mit Textkontrast ≥ 4.5:1 auf
Ivory) und helle Töne für Forest-Flächen (`--on-forest*`) — Kontrastprotokoll
in docs/accessibility-report.md.

## Typografie

- **Headlines: Manrope** (Variable, 200–800) — klar, humanistisch-geometrisch,
  ohne SaaS-Pathos; Skala bewusst kontrolliert (H1 max. ~54 px).
- **Fließtext: Source Sans 3** (Variable) — ruhig, sehr gut lesbar,
  vollständige Umlaut-/ß-Unterstützung.
- **Redaktioneller Akzent: Newsreader Italic** (Variable mit optischer
  Größenachse) — ausschließlich für die 5-€-Zahl und mögliche Zitate.
- Alle Fonts lokal gehostet (WOFF2, SIL OFL, Lizenzdatei in
  public/assets/fonts/), `font-display: swap`, Preload für die zwei
  Hauptschnitte.
- Editorial-Textbreite 680 px (`--container-text`), Inhaltsmaximum 1280 px.
- `hyphens: auto` + `min-width: 0` auf Grid-Kindern verhindern, dass lange
  deutsche Komposita („Spendenbescheinigung") Layouts sprengen.

## Layout

12-Spalten-Denken auf Desktop mit kontrollierter Asymmetrie (Hero 6.5:5.5,
Vorstellungs-Split 7:5); großzügiger Weißraum mit fluiden Sektionsabständen;
feine Linien (`--line`) statt Schatten (nur zwei minimale Schattenstufen);
Radien 4–12 px; **keine Pill-Buttons** (Radius 6 px); Hover-Bewegungen
maximal 2 px. Karten nur, wo sie Affordanz sind — keine „Kartenwüsten":
Sektionen wechseln zwischen Splits, Listen, Proof-Rastern und Forest-Flächen.

## Wiederkehrende Identitätsträger

1. **Trust-Strip** (Ink) mit Registerdaten als oberste Zeile jeder Seite.
2. **Overline mit Terrakotta-Strich** als Sektionsauftakt.
3. **5-€-Ziffer in Newsreader-Kursive** — die eine typografische Geste.
4. **Quellen-Badges** (Originalaufnahme / Projektbericht / Externe Quelle /
   Illustration) als sichtbares Beweissystem — Design und Glaubwürdigkeit
   greifen ineinander.
5. **Dokumentarische Bildflächen** mit Bildzeile (Caption + Badge) statt
   dekorativer Bilder.

## Bildsprache

Große echte dokumentarische Fotografie (Anforderungen:
content/image-requirements.md). Bis Originalmaterial vorliegt: neutrale
Flächen mit ehrlicher Beschriftung „Originale Projektaufnahme wird ergänzt."
und „Platzhalter"-Badge. **Nie** KI-Bilder als Projektfotografie — technisch
erzwungen (check.mjs blockt `ChatGPT_Image` und plantceylon-CDN-Dateien).

## Bewegung

Erlaubt und umgesetzt: dezente Reveal-Fades (10 px, gestaffelt),
Header-Schatten nach Scrollbeginn, 2-px-Hover, Pfeil-Mikrobewegung,
Fortschrittsanimation nur mit echten Daten. Nicht verwendet: Partikel, 3D,
Parallax-Exzesse, Scroll-Jacking, schwebende Karten, Cursor-Effekte,
Glasmorphismus, Neon-Glows. `prefers-reduced-motion` schaltet alles ab;
ohne JavaScript ist alles sofort sichtbar.

## Komponentenkatalog

Trust Bar · Header · Mobile Navigation · Editorial Hero · 5-Euro Impact ·
Project Feature/Card · Project Evidence Gallery (doc-media) · Source Card ·
External Source Badge · Donation Panel · Bank Details (dl) · Copy Buttons
(IBAN/BIC) · Betragsauswahl · Girocode-Slot · Plant Selector (tree-grid) ·
Four-Step Process (steps) · Team Profile · Update Card · Document Download ·
Contact Form · CTA Section · Footer · Breadcrumbs · Empty State ·
Loading State · Error State · Suche.
Zuordnung zu WordPress-Blöcken: docs/wordpress-blueprint.md.

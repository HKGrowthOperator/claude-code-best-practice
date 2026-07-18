# Designsystem — „Editorial Humanitarian Premium" (v3)

Die Seite wirkt wie eine Mischung aus hochwertigem redaktionellem Magazin,
transparenter NGO-Projektseite, ruhiger Premium-Unternehmenswebsite und
dokumentarischer Fotoreportage — nicht wie ein Charity-Template, eine
KI-Landingpage, ein SaaS-Startup oder ein grelles Spendenportal.

Single Source of Truth: `src/styles/tokens.css`. Dieses Dokument erklärt die
Entscheidungen; Werte stehen nur dort.

## Farbwelt (aus dem echten Vereinslogo abgeleitet — v3)

Das Logo (Herz aus zwei ineinandergreifenden Händen + Wortmarke
LIVING CHARITY) definiert die Marke: **Rot #B50000** und **Schwarz ~#161616**
auf Weiß. Gesampelt aus der übergebenen Originaldatei
(`public/assets/img/logo-original.png`).

`--brand #B50000` · `--brand-strong #8F0D12` · `--brand-tint #F7E9E7` ·
`--ink #161616` · `--ivory #F7F4F0` · `--paper #FFFFFF` · `--sand #ECE7E1` ·
`--stone #C9C3BC` · `--text #232120` · `--text-muted #6B6560` ·
`--line #E3DFDA` · `--success #267858` · `--warning #8A5F20` · `--error #A63E38`

Verwendung: heller Header (Paper) mit Vollfarb-Logo; schwarzer Trust-Strip mit
roter Akzentlinie; Ivory als Seitenhintergrund; **Rot gezielt** für CTAs,
Links, Overline-Striche, aktive Zustände und die 5-€-Ziffer; **Schwarz (Ink)**
für Schwerpunkt-Sektionen, Abschluss-CTA und Footer (Logo dort auf weißer
Kachel, damit die schwarze Hand sichtbar bleibt); warme Neutraltöne halten die
Fläche ruhig — kein grelles Spendenportal. Fehlerrot (#A63E38) bleibt sichtbar
vom Markenrot unterschieden und tritt nur in Formularen auf.
Kontrastprotokoll (20 Paare, alle ≥ 4.5:1): docs/accessibility-report.md.

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
Sektionen wechseln zwischen Splits, Listen, Proof-Rastern und Ink-Flächen.

## Wiederkehrende Identitätsträger

1. **Trust-Strip** (Ink) mit Registerdaten als oberste Zeile jeder Seite.
2. **Overline mit rotem Markenstrich** als Sektionsauftakt.
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

# Designsystem — Living Charity e. V.

Gestaltungsziel: menschlich, ruhig, vertrauenswürdig, hochwertig, warm —
keine Bank, keine Behörde, kein Fundraising-Portal, kein Charity-Template.
Markenstimme in drei Worten: **bodenständig · warm · verlässlich.**

Single Source of Truth: `src/styles/tokens.css`. Dieses Dokument erklärt die
Entscheidungen; Werte stehen nur dort.

## Leitmotiv: der Bogen

Wiederkehrendes Formelement ist der **Rundbogen** (`.arch-media`,
Platzhalter-Bildmarke, Favicon): ein stilles Bild für Tür, Obhut und Ankommen —
ohne religiöse Codierung und ohne Kitsch. Er macht die Seite wiedererkennbar,
wo generische Charity-Seiten austauschbare Kartenraster zeigen. Sparsam
einsetzen: Hero, ausgewählte Bildflächen, Bildmarke.

## Farbwelt (vorläufig, an echtes Logo anzupassen)

- **Primary — tiefes Petrol-Grün:** Vertrauen und Ruhe, bewusst kein
  „NGO-Signalrot" und kein Bankenblau.
- **Warm-Weiß statt Steril-Weiß** als Grundfläche; abgesetzte Sektionen in
  einem wärmeren Sandton.
- **Terrakotta-Akzent** nur für den Spenden-CTA, Overline-Linien und kleine
  Signale — der Akzent bleibt selten, damit er führt.
- **Dunkelgrüne „Ink"-Flächen** für Footer und Abschluss-CTA geben der Seite
  einen ruhigen, hochwertigen Rahmen.
- Statusfarben (Erfolg/Warnung/Fehler) sind gedeckt und stets mit Text
  kombiniert — keine Information nur über Farbe.
- Alle Paarungen rechnerisch geprüft: ≥ 4.5:1 (Protokoll in qa-report.md).

## Typografie

- **Alegreya (Variable, Serif)** für Überschriften: humanistisch, literarisch,
  warm — charaktervoll ohne Mode-Font-Reflex. Kursive für betonte Satzteile im Hero.
- **Source Sans 3 (Variable)** für Fließtext: ruhig, sehr gut lesbar,
  vollständige Umlaut-/ß-Unterstützung.
- Beide lokal gehostet (WOFF2, Latin-Subset, zusammen ~117 KB), `font-display: swap`,
  Preload für die zwei Hauptschnitte. Lizenz: SIL OFL (siehe
  `public/assets/fonts/LICENSE.md`).
- Fluide Skala mit `clamp()`; Verhältnis ≥ 1.25 zwischen Stufen; Fließtext
  17–19 px; Zeilenlänge über `--container-text` (~70 Zeichen) begrenzt.
- Versalien nur für kleine Overline-Etiketten mit Sperrung — nie für Fließtext.
- Deutsche Komposita: `hyphens: auto` + `overflow-wrap` verhindern Überlauf.

## Raum & Layout

- Vertikaler Rhythmus über `--space-*`-Stufen; Sektionsabstand fluid
  (`clamp(4rem … 7.5rem)`).
- Container: 72 rem Standard, 44 rem für Lesetexte.
- Layouts sind links ausgerichtet und leicht asymmetrisch (Hero 7:5,
  Text-Bild-Splits) — kein zentrierter Template-Stapel.
- Karten nur, wo Karten die richtige Affordanz sind (verlinkbare Inhalte);
  `auto-fit/minmax` für bruchfreie Responsivität.

## Bewegung

Erlaubt: weiche Reveals (Opacity + 14 px Translate, gestaffelt), Header-Schatten
nach Scrollbeginn, Pfeil-Mikrobewegung in Buttons, sanftes Karten-Lift,
animierter Projektfortschritt (nur echte Daten).
Nicht verwendet (bewusst): Parallax-Übertreibung, Glassmorphism, Partikel,
Scroll-Jacking, 3D, Cursor-Effekte.
`prefers-reduced-motion` schaltet alles ab; ohne JavaScript ist alles sofort
sichtbar (`no-js`-Fallback).

## Komponentenüberblick

Buttons (primary/accent/ghost) · Sticky-Header + mobile Navigation ·
Hero mit Bogen-Bildfläche · Vertrauensleiste · Sektionskopf mit Overline ·
Karten (Projekt/Beitrag/Veranstaltung) mit Status-Badges · Schritt-Liste ·
Text-Bild-Split · Teamkarte · Spendenbox mit IBAN-Kopierknopf · Formularfelder
mit Fehlerzuständen · FAQ-Aufklapper · Abschluss-CTA (Ink) · Footer ·
Breadcrumbs · Leerzustand · Infokarte · Zwei-Klick-Karte · Fortschrittsbalken ·
interne Inhalts-Marker (`.content-todo`, nur Vorabversion).

## Interne Inhalts-Marker

`.content-todo` / `.content-todo-block` (gelb, gestrichelt, Präfix „⚠ intern")
kennzeichnen unbestätigte Inhalte sichtbar, ohne das Layout zu zerstören.
Sie sind Teil des Workflows (content-status.md) und werden vor Livegang
vollständig entfernt — `node src/utils/check.mjs` zählt sie.

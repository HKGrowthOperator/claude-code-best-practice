# Design-Critique — Living Charity e. V. (Vorabversion)

Editorial-Webdesign-Review gegen das Konzept „Editorial Humanitarian Premium"
(docs/design-system.md). Grundlage: eigene Playwright-Full-Page-Screenshots
von `/`, `/spenden/` und `/plant-ceylon/` bei 390, 768 und 1440 px sowie
Detailaufnahmen einzelner Sektionen und der offenen Mobilnavigation.
Stand: 18.07.2026. Priorisierung: **P1 = muss vor Livegang**, **P2 = sollte**,
**P3 = Idee**.

Gesamteindruck vorab: Die Grundhaltung stimmt. Typografieskala (Manrope +
Source Sans 3 + Newsreader-5-€), Overline-System, Quellen-Badges, ehrliche
Platzhalter und die schwarzen Sektionswechsel tragen die dokumentarische
Anmutung; ein grelles Spendenportal ist das nicht. Die Schwächen liegen in
Ausführungsdetails (Logo-Asset, Nav-Umbrüche, mobile Umbrüche) und darin,
dass die untere Hälfte der Startseite in genau die Karten-Monotonie kippt,
die das eigene Designsystem verbietet.

---

## P1 — Muss vor Livegang

### P1.1 Logo-Bildmarke ist im Asset selbst abgeschnitten (Wortmarken-Fragment sichtbar)

- **Seite/Viewport:** alle Seiten, alle Viewports (Header und Footer)
- **Problem:** `public/assets/img/logo-mark.png` (540 × 395) enthält am
  unteren Rand die angeschnittenen Oberkanten des Schriftzugs „LIVING".
  Im Header (`.brand__mark`, 3 rem breit) erscheint dadurch unter dem
  Herz ein roter Pixelstreifen — bei 390, 768 und 1440 px deutlich sichtbar,
  ebenso im Footer und in der offenen Mobilnavigation. Für die wichtigste
  Vertrauensfläche (Marke einer Spendenorganisation) wirkt das wie ein
  Renderfehler und beschädigt genau die Sorgfalts-Anmutung, die die Seite
  sonst aufbaut.
- **Fix:** Bildmarke aus `public/assets/img/logo-original.png`
  (8000 × 7289) neu freistellen — nur das Herz aus zwei Händen, ohne
  Wortmarken-Anschnitt, mit ca. 2–4 % transparentem Sicherheitsrand — und
  als `logo-mark.png` neu exportieren (Zielgröße reicht bei 216 × ~158 für
  3 rem @2x; `width`/`height`-Attribute in
  `src/components/header.html` Zeile 7 und im Footer entsprechend
  anpassen). Kein CSS-Workaround (`object-fit` würde das Fragment nur
  verschieben); das Problem liegt in der Datei. Vektor-Original weiterhin
  anfordern (LB-08).

### P1.2 Desktop-Navigation bricht Menüpunkte zweizeilig um

- **Seite/Viewport:** alle Seiten, 1440 px (Header)
- **Problem:** „Unsere Arbeit", „Sri Lanka" und „Über uns" brechen in der
  Hauptnavigation mitten im Label zweizeilig um („Unsere / Arbeit"), während
  „Projekte", „Aktuelles", „Kontakt" einzeilig bleiben. Zwei Zeilenhöhen
  nebeneinander machen den Header unruhig und lassen das Menü selbst bei
  1440 px — wo Platz im Überfluss vorhanden ist — defekt wirken.
- **Fix:** In `src/styles/components.css` bei `.site-nav__link`
  (Zeile ~113) `white-space: nowrap;` ergänzen. Zusätzlich das sehr enge
  `gap: clamp(0.1rem, 0.8vw, 0.75rem)` der `.site-nav__list` (Zeile 112)
  auf mindestens `clamp(0.25rem, 1vw, 1rem)` anheben; falls der Platz unter
  ~68 rem knapp wird, den Mobile-Breakpoint von `62rem` auf `68rem`
  anheben statt Umbrüche zuzulassen.

### P1.3 Trust-Strip bricht mobil zweizeilig und wirkt defekt

- **Seite/Viewport:** alle Seiten, 390 px
- **Problem:** Der oberste Identitätsträger „Eingetragener Verein seit
  2010 · Amtsgericht Köln · VR 16395" bricht bei 390 px nach „VR" um; die
  zweite Zeile enthält zentriert nur „16395". Ein Registerzeichen, das
  mitten in der Nummer umbricht, unterläuft den Zweck des Streifens
  (Seriosität auf einen Blick) — er liest sich wie ein Layoutfehler, noch
  bevor der Besucher irgendetwas anderes sieht.
- **Fix:** In `src/components/header.html` die Registerangaben in einen
  Span fassen:
  `<strong>Eingetragener Verein seit 2010</strong><span class="trust-strip__detail"> · Amtsgericht Köln · VR 16395</span>`
  und in `components.css`:
  `@media (max-width: 30rem) { .trust-strip__detail { display: none; } }`.
  Alternativ mindestens `white-space: nowrap;` auf die VR-Nummer
  (`<span style>` vermeiden, eigene Klasse). Die vollständigen
  Registerdaten stehen mobil weiterhin im Footer und Impressum.

### P1.4 /spenden/: Nebenspalte erdrückt das Spenden-Panel (invertierte Hierarchie)

- **Seite/Viewport:** /spenden/, 1440 px und 390 px
- **Problem:** Das eigentliche Konversionselement — das Überweisungs-Panel —
  trägt als Überschrift nur eine kleine rote Caps-Zeile („Spenden per
  Überweisung"), während die vier begleitenden Hinweisblöcke rechts
  („Allgemein oder gezielt?", „Spendenbescheinigung", „Was mit Ihrer
  Spende passiert", „Fragen zur Spende?") als volle `<h2>` in
  `--text-2xl` (bis 40 px) gesetzt sind. Auf dem Desktop zieht die
  Nebenspalte damit mehr Aufmerksamkeit als das Panel; mobil entsteht nach
  dem Panel eine Wand aus vier XL-Überschriften mit je zwei Zeilen Text —
  die Fold-Hierarchie der wichtigsten Seite ist auf dem Kopf.
- **Fix:** In `src/pages/spenden.html` (Zeilen 35, 45, 49, 55) die vier
  `<h2>` der Nebenspalte visuell auf H3-Niveau demotieren — z. B. Klasse
  `donation-aside__h` mit
  `font-size: var(--text-lg); margin-top: var(--space-6);` — oder als
  `<h2 class="h3">`-Muster, falls eine Utility existiert. Semantisch können
  sie `<h2>` bleiben (Outline), aber die visuelle Skala muss unter dem
  Panel liegen. Dem Panel umgekehrt eine echte sichtbare Überschrift geben
  (z. B. `<h2>` in `--text-xl` statt nur Caps-Overline).

### P1.5 /plant-ceylon/ mobil: Overline mit hängendem „·" und zweizeilig umbrechendem Badge

- **Seite/Viewport:** /plant-ceylon/, 390 px (Hero)
- **Problem:** Die Overline ist als
  `<p class="overline">Langfristiges Projekt · <span class="badge badge--pruefung" style="vertical-align:middle">In Prüfung</span></p>`
  gebaut (`src/pages/plant-ceylon.html` Zeile 19). Bei 390 px bricht sie zu
  „LANGFRISTIGES / PROJEKT ·" mit einem verwaisten Mittelpunkt am
  Zeilenende, und das Badge selbst bricht rechts zweizeilig zu
  „IN / PRÜFUNG" um. Genau im Auftakt der Projektseite — dort, wo der
  „In Prüfung"-Status rechtlich wichtig ist — sieht das zerfallen aus.
  Dazu kommt ein Inline-Style, den das Designsystem nicht vorsieht.
- **Fix:** Markup umbauen: literales „·" entfernen, Badge aus dem
  Overline-Text lösen:
  `<p class="overline">Langfristiges Projekt <span class="badge badge--pruefung">In Prüfung</span></p>`;
  in `components.css` `.badge { white-space: nowrap; }` ergänzen und für
  die Overline `flex-wrap: wrap; row-gap: 0.35rem;` erlauben (`.overline`
  in `base.css` Zeile 59 ist bereits Flex). Inline-`style` durch
  `align-items: center` der Overline ersetzen.

---

## P2 — Sollte

### P2.1 Hero-Platzhalterfläche bei 4:5 auf Tablet/Mobil überdimensioniert

- **Seite/Viewport:** /, 768 px (auch 390 px)
- **Problem:** `.doc-media__frame` hat fix `aspect-ratio: 4/5`
  (`components.css` Zeile 184). Im einspaltigen Layout wird die leere
  Sand-Fläche bei 768 px ~730 × 910 px groß — mehr als ein voller
  Bildschirm nahezu inhaltsloser Fläche direkt nach dem Hero-Text. Die
  ehrliche Platzhalter-Lösung ist richtig (keine Stock-/KI-Bilder), aber
  ihr Format muss sich dem Viewport beugen: Hochformat ergibt nur neben
  Text Sinn, nicht darunter.
- **Fix:** In `components.css`:
  `@media (max-width: 60rem) { .hero .doc-media__frame { aspect-ratio: 3 / 2; } }`
  (60 rem = Breakpoint, ab dem `.hero__grid` einspaltig ist). Gleiches
  Muster für andere einspaltig gestapelte `doc-media`-Vorkommen prüfen.

### P2.2 Startseite unten: Kartenwüste entgegen dem eigenen Designgesetz

- **Seite/Viewport:** /, 1440 px und 390 px (untere Seitenhälfte)
- **Problem:** Ab „Nicht nur versprechen" reiht die Startseite
  4 Proof-Karten + 3 Team-Karten + 6 „Möglichkeiten zu helfen"-Karten +
  2 Empty-State-Karten — 15 weiße Rundeck-Container in Folge, alle mit
  gleichem Radius, gleicher Border, gleichem Innenaufbau
  (Titel / 2 Zeilen / roter Pfeillink). Das ist exakt die „Kartenwüste",
  die docs/design-system.md ausschließt, und der stärkste
  KI-Template-Marker der ganzen Seite. Mobil erzeugt allein das
  6-Karten-Raster ~1.400 px identischer Stapelung.
- **Fix:** Formen variieren, wie es die oberen Sektionen bereits tun:
  „Möglichkeiten zu helfen" als zweispaltige Liste mit feinen Trennlinien
  statt Karten (`.help-list { display: grid; grid-template-columns: 1fr 1fr; gap: 0 var(--space-7); }`,
  Einträge mit `border-top: 1px solid var(--line); padding-block: var(--space-5);`,
  keine Füllung, kein Radius); die Proof-Reihe („Nachweise") ohne
  Kartenrahmen direkt auf der Fläche setzen (nur Badge + Text, Spalten
  durch Weißraum getrennt). Team darf Karten behalten — dann sind sie
  wieder ein Akzent statt Tapete.

### P2.3 Markenrot-Inflation durch sechsfache rote Pfeillinks in einer Sektion

- **Seite/Viewport:** /, 1440 px („Möglichkeiten zu helfen"), analog weitere Sektionen
- **Problem:** Das Konzept verlangt Rot „gezielt" (CTAs, Akzente, 5-€).
  In „Möglichkeiten zu helfen" stehen jedoch sechs rote Bold-Links
  gleichzeitig im Viewport, plus rote Overline, plus rote Team-Initialen
  eine Sektion weiter. Sechsmal dieselbe rote Handlungsfarbe für sechs
  gleichrangige Optionen bedeutet: nichts davon ist mehr betont, und der
  ruhige dokumentarische Grundton kippt Richtung Spendenportal-Signalrot.
- **Fix:** `.arrow-link` innerhalb von Kartenrastern/Listen auf Ink
  stellen und nur den Pfeil rot lassen:
  `.card .arrow-link, .help-list .arrow-link { color: var(--ink); }`
  `.card .arrow-link span[aria-hidden], .help-list .arrow-link span[aria-hidden] { color: var(--brand); }`
  Rote Volltextlinks reserviert lassen für singuläre Sektions-CTAs
  (ein Link pro Sektion, wie „Mehr zur Sri-Lanka-Hilfe").

### P2.4 Roter Overline-Strich auf schwarzen Sektionen praktisch unsichtbar

- **Seite/Viewport:** /, 1440 px (Sektion „Unterstützung für Menschen in Sri Lanka"), alle dunklen Sektionen
- **Problem:** `.overline::before` behält auch in `.section-dark`
  `background: var(--brand)` (#B50000). Auf `--ink` #161616 hat das Rot
  nur ≈ 2,55 : 1 Kontrast — der Identitätsträger Nr. 2 (Terrakotta-/
  Markenstrich als Sektionsauftakt) verschwindet ausgerechnet dort, wo die
  Sektion am meisten Gewicht haben soll. Der schwarze Sektionswechsel
  selbst funktioniert gut; er verliert nur seinen Markenakzent.
- **Fix:** In `base.css` neben Zeile 72 ergänzen:
  `.section-dark .overline::before { background: #e2b3b0; }`
  (der bereits definierte On-Dark-Linkton, 9,7 : 1 auf Ink — als Token
  z. B. `--brand-on-dark` in tokens.css hinterlegen, damit `.section-dark a`
  denselben Wert nutzt).

### P2.5 /spenden/-Hero: schmale Textspalte in leerer Bühne

- **Seite/Viewport:** /spenden/, 1440 px
- **Problem:** Der Hero der wichtigsten Unterseite besteht aus einer
  ~430 px schmalen Textspalte („Ihre Unterstützung kann direkt helfen.")
  vor ~900 px ungenutzter Fläche. Anders als auf der Startseite (Split mit
  Bildfläche) wirkt die Leere hier nicht komponiert, sondern unfertig —
  H1 und Lead brechen eng um, während rechts nichts passiert.
- **Fix:** Entweder die Textspalte atmen lassen
  (H1 `max-width: 22ch` statt implizit ~14ch, Lead `max-width: 52ch`,
  Hero-Padding unten reduzieren) oder die Bühne asymmetrisch füllen: die
  drei Kernfakten des Spendenwegs (Empfänger / Verwendungszweck /
  „Überweisung über Ihre Bank") als ruhige `dl` rechts im 7:5-Split —
  vorhandenes `.split--asym`-Muster (`components.css` Zeile 338)
  wiederverwenden, keine neue Komponente.

### P2.6 /plant-ceylon/: acht identische Baumarten-Karten mit achtmal „Derzeit 44 €"

- **Seite/Viewport:** /plant-ceylon/, 1440 px und 390 px
- **Problem:** Das Baumarten-Raster wiederholt achtmal exakt dieselbe
  Karte: Name + „Derzeit 44 €". Wenn alle Preise identisch sind, trägt
  die Preiszeile keine Information und die Karten degradieren zur
  Füll-Wiederholung (mobil: acht Mini-Karten in zwei Spalten). Zudem
  konkurrieren „So soll es ablaufen" und „Acht Baumarten zur Auswahl"
  als zwei gleich große H2 nebeneinander mit versetzten Grundlinien.
- **Fix:** Preis aus den Karten ziehen und einmal als Satz über dem Raster
  nennen („Jede Baumart derzeit 44 € — laut Projektseite."), die Arten
  selbst als kompakte zweispaltige Liste mit Trennlinien
  (`.tree-grid` → Listenmuster wie P2.2) oder als Tag-Reihe setzen.
  Die rechte Überschrift eine Stufe demotieren
  (`font-size: var(--text-xl)`) und beide Spaltenköpfe auf eine
  Grundlinie bringen (`align-items: start` + identisches
  `margin-top` der Überschriften).

### P2.7 Zwei nahezu identische Empty-State-Sektionen auf der Startseite

- **Seite/Viewport:** /, alle Viewports („Aktuelle Hilfsaktion" und „Berichte aus der Vereinsarbeit")
- **Problem:** Zwei Sektionen derselben Seite bestehen jeweils nur aus
  einer weißen Karte mit „wird dokumentiert / wird vorbereitet" plus
  Ghost-Button. Einzeln ist die ehrliche Leerlösung stark (und
  briefingkonform); doppelt wirkt sie wie ein nicht fertig befülltes
  Template und streckt die ohnehin sehr lange Startseite (~11.600 px bei
  390 px) um zwei Ankündigungen ohne Inhalt.
- **Fix:** Eine der beiden Sektionen zurückstufen: „Berichte aus der
  Vereinsarbeit" bis zum ersten echten Beitrag von der Startseite nehmen
  (bleibt unter /aktuelles/) oder als einzeilige Notiz an das Ende der
  Hilfsaktions-Sektion hängen (`<p class="text-muted">` mit Link zu
  /aktuelles/), statt ihr eine volle Sektion mit Overline + H2 + Karte zu
  geben.

### P2.8 Rotes „Externe Quelle"-Badge ist das lauteste Element des Beweissystems

- **Seite/Viewport:** /, /spenden/, /plant-ceylon/ (Impact-Modul, Nachweise-Reihe), alle Viewports
- **Problem:** Im Quellen-Badge-System ist ausgerechnet „Externe Quelle" —
  die am wenigsten belastbare Belegart — rot umrandet und damit
  salienter als „Originalaufnahme" (grün). Im 5-€-Modul steht das rote
  Badge zusätzlich unmittelbar neben dem roten Quellenlink, sodass zwei
  rote Elemente konkurrieren. Das Beweissystem soll einordnen, nicht
  alarmieren; Rot codiert hier unbeabsichtigt Wichtigkeit.
- **Fix:** `source-badge--extern` von Markenrot auf einen neutralen
  Hinweiston stellen (z. B. Border/Farbe `#6d6046` wie `.badge--geplant`
  bzw. den Warm-Ton der Illustration-Badges), Rot im Impact-Modul dem
  einen Quellenlink überlassen. Markenrot in Badges nur dort, wo es
  Markenzusammenhang bedeutet (z. B. „In Prüfung" bleibt vertretbar).

---

## P3 — Idee

### P3.1 Spendenbescheinigungs-Hinweis doppelt auf /spenden/

- **Seite/Viewport:** /spenden/, alle Viewports
- **Problem:** Derselbe Satz („Informationen zur Ausstellung einer
  Spendenbescheinigung erhalten Sie auf Anfrage über
  info@livingcharity.de.") steht im Panel unter dem Girocode-Slot und
  erneut in der Nebenspalte unter „Spendenbescheinigung".
- **Fix:** Im Panel streichen; dort genügt der Girocode-Platzhalter. Die
  Nebenspalte (nach P1.4 demotiert) bleibt der eine Ort für den Hinweis.

### P3.2 FAQ-Sektion nutzt bei 1440 px nur die halbe Breite

- **Seite/Viewport:** /spenden/, 1440 px
- **Problem:** Die vier Akkordeon-Zeilen stehen in einer ~540 px-Spalte,
  rechts bleibt eine große weiße Fläche ohne kompositorische Absicht.
- **Fix:** Akkordeon auf `max-width: var(--container-text)` (680 px)
  verbreitern und die Sektion als bewusstes Editorial-Layout setzen
  (Overline + H2 links oben, Fragenblock darunter) — oder zwei Spalten
  Fragen ab `min-width: 64rem`.

### P3.3 Mobilnavigation: Overlay ohne Scrim, Schließ-Icon prüfen

- **Seite/Viewport:** /, 390 px (offenes Menü)
- **Problem:** Das geöffnete Menü hängt als weißes Panel unter dem Header,
  darunter bleibt Seiteninhalt ohne Abdunkelung sichtbar und scrollbar —
  die Ebenen-Hierarchie ist unklar. Im Test wirkte das Toggle-Icon im
  offenen Zustand zudem eher wie ein einzelner Diagonalstrich als wie ein
  eindeutiges „X" (Transform-Werte in `components.css` Zeilen 161–163
  gegen `gap: 5px`/Padding nachrechnen, Ist-Zustand im Browser prüfen).
- **Fix:** Halbtransparenten Scrim unter dem Panel ergänzen
  (`.site-nav.is-open::before` geht nicht als Sibling — eher
  `body.nav-open::after { position: fixed; inset: 0; background: rgb(22 22 22 / .45); z-index: 40; }`)
  plus `overflow: hidden` auf `body.nav-open`; Toggle-Linienabstand so
  setzen, dass die Rotation ein symmetrisches X ergibt
  (Linienabstand = translateY-Betrag, hier je 7 px).

### P3.4 Anker-Scroll unter Sticky-Header absichern

- **Seite/Viewport:** alle Seiten mit In-Page-Links (z. B. „Zur Spendenseite"-Anker), alle Viewports
- **Problem:** Der Header ist `position: sticky; top: 0; z-index: 50` —
  bei Sprüngen zu Ankerzielen verdeckt er die Sektionsüberschrift (im
  Test verdeckte er beim programmatischen Scrollen die Panel-Überschrift
  „Spenden per Überweisung").
- **Fix:** Global in `base.css`:
  `:target, [id] { scroll-margin-top: 5.5rem; }`
  (Headerhöhe + Trust-Strip; alternativ per `--header-height`-Token).

### P3.5 Hero-Overline wiederholt den Vereinsnamen direkt unter dem Logo

- **Seite/Viewport:** /, 390 px am auffälligsten (auch 768/1440)
- **Problem:** Die Overline „Living Charity e. V. · Hilfe für Menschen in
  Not" steht ~80 px unter der Logo-Wortmarke „Living Charity /
  Eingetragener Verein · Bergneustadt" — der Name fällt dreimal in einem
  Fold, mobil bricht die Overline dafür zweizeilig. Redaktionell wäre die
  Overline der Ort für die Einordnung, nicht für die Absenderwiederholung.
- **Fix:** Overline auf die Sache verkürzen („Hilfe für Menschen in Not"
  oder „Sri-Lanka-Hilfe seit 2010") — reine Textänderung in
  `src/pages/index.html`, keine CSS-Änderung nötig.

---

## Was ausdrücklich funktioniert (nicht anfassen)

- **5-€-Modul**: Newsreader-Kursive als einzige typografische Geste,
  sauber attribuiert („laut Spendenaufruf") — glaubwürdig und eigen.
- **Schwarze Sektionswechsel** (Sri-Lanka-Sektion, CTA-Band, Footer):
  richtige Frequenz, klare Rhythmisierung der langen Seiten (nur den
  Overline-Strich fixen, P2.4).
- **Ehrliche Platzhalter & Quellen-Badges**: kein einziges erfundenes
  Bild, keine Fake-Zahlen; „Platzhalter"-Badge und Bildzeilen halten das
  dokumentarische Versprechen (nur Format P2.1 und Badge-Farblogik P2.8).
- **Buttons/Radien/Linienführung**: keine Pills, keine Schatten-Orgien,
  Hover ≤ 2 px — konsistent mit dem Designsystem.

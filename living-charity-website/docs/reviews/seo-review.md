# Technical-SEO-Review — Living Charity e. V. (Vorabversion)

Reviewer: Technical-SEO-Review (automatisiert), Stand: 2026-07-18
Geprüft: 17 gebaute Seiten unter `public/` (+ `public/preview/index.html` als 18. Datei),
`src/utils/build.mjs` (headFor), `public/sitemap.xml`, `public/robots.txt`,
`docs/seo-plan.md`, `src/data/*.json`.

**Gesamturteil:** Solide Grundeinrichtung. Canonicals, noindex-Logik, Sitemap-Inhalt,
NAP-Konsistenz und H1-Keyword-Abdeckung stimmen mit dem SEO-Plan überein.
**Keine erfundenen Bewertungen, Events oder Wirkungszahlen im Markup gefunden**
(`projects`, `posts`, `events` sind leere Listen; der 5-€-Claim erscheint nur als
zugeschriebenes Zitat mit Quellenlink — regelkonform). Es gibt einen P1-Befund
(`/preview/`), vier P2-Befunde und mehrere P3-Hinweise.

---

## P1 — Vor Livegang zwingend

### P1-1: `public/preview/index.html` ohne noindex — Duplikat der gesamten Website

**Datei:** `public/preview/index.html` (527 KB, erzeugt von `src/utils/preview.mjs`)

Die Review-Vorschau enthält **alle 17 Seiten inline** in einem Dokument, liegt im
Deploy-Verzeichnis `public/`, hat **kein `<meta name="robots" content="noindex">`**,
keinen Canonical und steht nicht in der Sitemap. Aktuell schützt nur das globale
`Disallow: /` der Vorabversion. Die im `robots.txt`-Kommentar hinterlegte
Livegang-Vorlage (`Allow: /`) würde `/preview/` **crawlbar machen** — ein
Near-Duplicate der kompletten Website auf einer URL.

**Fix (zwei Ebenen, beide umsetzen):**

1. In `src/utils/preview.mjs` in den erzeugten `<head>` einfügen:

```html
<meta name="robots" content="noindex, nofollow">
```

2. In `src/utils/build.mjs` (Zeile ~331, robots.txt-Writer) die Livegang-Vorlage
   um einen Disallow ergänzen — und idealerweise `/preview/` gar nicht mit
   deployen:

```js
writeFileSync(
  join(OUT, "robots.txt"),
  `# VORABVERSION: Indexierung gesperrt.\n# Vor Livegang ersetzen durch:\n#   User-agent: *\n#   Allow: /\n#   Disallow: /preview/\n#   Sitemap: ${base}/sitemap.xml\nUser-agent: *\nDisallow: /\n`
);
```

---

## P2 — Vor Livegang beheben

### P2-1: Title-Längen über der eigenen 60-Zeichen-Regel (seo-plan.md, Redaktionsregel 1)

| Seite | Title | Länge |
| --- | --- | --- |
| `/spenden/` (`src/pages/spenden.html`) | „Spenden — Living Charity e. V. \| Ihre Unterstützung kann direkt helfen" | **70** |
| `/ueber-uns/` (`src/pages/ueber-uns.html`) | „Über uns — Living Charity e. V. \| Eingetragener Verein seit 2010" | **64** |

Google schneidet nach ~580 px (≈ 60 Zeichen) ab; das transaktionale Nutzenversprechen
auf `/spenden/` geht im Snippet verloren.

**Fix (META-Block der jeweiligen Seitendatei):**

- `/spenden/`: `"Spenden für Sri Lanka — Living Charity e. V."` (44 Zeichen, deckt
  zugleich das Sekundär-Keyword „sri lanka spende" ab)
- `/ueber-uns/`: `"Über uns — Living Charity e. V., Bergneustadt"` (45 Zeichen)

### P2-2: og:image ohne width/height/alt, twitter:card fehlt komplett

**Datei:** `src/utils/build.mjs`, `headFor()`, Zeile ~264

`/assets/img/og-default.png` **existiert** und hat exakt die empfohlenen
1200 × 630 px — aber ohne `og:image:width/height` rendern Facebook/LinkedIn den
ersten Share einer frischen URL oft ohne Bild (asynchrones Nachladen), und ohne
`twitter:card` fällt X/Twitter auf ein kleines Vorschauformat zurück.
`og:image:alt` fehlt für Screenreader in Share-Kontexten.

**Fix (in `headFor()` direkt nach der og:image-Zeile):**

```js
<meta property="og:image" content="${base}/assets/img/og-default.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(org.name)} — Hilfe für Menschen in akuten Notlagen">
<meta name="twitter:card" content="summary_large_image">
```

### P2-3: BreadcrumbList kann nur 2 Ebenen — reicht NICHT für echte Projekt-/Beitragsseiten

**Datei:** `src/utils/build.mjs`, `headFor()`, Zeile ~243–253

Aktuell wird immer nur `Startseite → <breadcrumb>` erzeugt. Für die heutigen
Hauptseiten ist das korrekt. Sobald aber echte Detailseiten unter
`/projekte/<slug>/` bzw. `/aktuelles/<slug>/` gebaut werden (die Vorlagen
`projekt-vorlage.html` / `beitrag-vorlage.html` existieren bereits), fehlt die
Zwischenebene `Projekte` bzw. `Aktuelles` — die strukturierten Daten würden dann
eine falsche Sitehierarchie signalisieren. Zurzeit maskiert das nur der
noindex-Status der Vorlagen.

**Fix (abwärtskompatibel, optionales `breadcrumbParent` im META-Block):**

```js
const breadcrumb =
  page.path !== "/" && page.breadcrumb
    ? (() => {
        const items = [{ "@type": "ListItem", position: 1, name: "Startseite", item: base + "/" }];
        if (page.breadcrumbParent) {
          items.push({
            "@type": "ListItem",
            position: items.length + 1,
            name: page.breadcrumbParent.name,
            item: base + page.breadcrumbParent.path,
          });
        }
        items.push({ "@type": "ListItem", position: items.length + 1, name: page.breadcrumb, item: canonical });
        return `\n<script type="application/ld+json">${JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items,
        })}</script>`;
      })()
    : "";
```

Und in `src/pages/projekt-vorlage.html` bzw. `beitrag-vorlage.html`:

```json
"breadcrumbParent": { "name": "Projekte", "path": "/projekte/" }
```

### P2-4: Description `/aktuelles/` deutlich unter der 140–160-Zeichen-Regel

**Datei:** `src/pages/aktuelles.html` — 108 Zeichen („Berichte, Projekt-Updates und
Rückblicke … klar gekennzeichnet."). Verschenktes Snippet auf einer indexierbaren
Seite. **Fix:** auf 140–160 Zeichen erweitern, z. B. mit Hinweis auf
Sri-Lanka-Hilfsaktionen und Vereinssitz Bergneustadt (Sekundärthema
„projektberichte" aus dem Keyword-Plan aufnehmen).

---

## P3 — Feinschliff / bewusst dokumentieren

### P3-1: Descriptions leicht außerhalb 140–160

Leicht drüber: `/plant-ceylon/` 162, `/spenden/` 165, `/sri-lanka/` 166.
Leicht drunter: `/transparenz/` 135, `/ueber-uns/` 138. Keine Duplikate gefunden
(alle 17 Descriptions sind einzigartig). Kürzen/verlängern bei nächster
Textredaktion; kein Blocker.

### P3-2: noindex-Seiten erhalten trotzdem volles OG-Set + BreadcrumbList

`headFor()` schreibt `og:url`, `og:image` und (bei gesetztem `breadcrumb`)
BreadcrumbList-JSON-LD auch auf `/danke/`, `/suche/`, `/impressum/`,
`/datenschutz/` und die Vorlagen. Nicht schädlich (OG auf noindex-Seiten ist
für Messenger-Shares sogar nützlich), aber die BreadcrumbList auf
noindex-Vorlagen ist totes Markup. Optionaler Fix: `&& !page.noindex` in die
Breadcrumb-Bedingung aufnehmen.

### P3-3: `/danke/` nur per JS erreichbar — in Ordnung, aber dokumentieren

Kein einziger HTML-Link zeigt auf `/danke/`; die Seite wird nur über
`main.js` (Weiterleitung nach Formular-Submit, Zeile 155) erreicht. Da sie
noindex ist und nicht in der Sitemap steht, ist das SEO-seitig korrekt —
kein Handlungsbedarf. `/transparenz/` ist dagegen **nicht verwaist**: sie ist
auf allen 17 Seiten über die Footer-Navigation („Der Verein") verlinkt.
Keine weiteren verwaisten Seiten gefunden (alle indexierbaren Seiten hängen
an Haupt- oder Footer-Navigation).

### P3-4: hreflang fehlt — für eine einsprachige Site korrekt

`<html lang="de">` und `og:locale de_DE` sind konsistent gesetzt. hreflang ist
bei genau einer Sprachversion nicht erforderlich; erst bei einer zweiten
Sprache (z. B. Englisch/Tamil) nachrüsten. Kein Handlungsbedarf.

### P3-5: Sitemap ohne `lastmod`

`public/sitemap.xml` listet exakt die 10 indexierbaren Seiten (korrekt: keine
noindex-Seiten, keine 404, kein `/preview/`). `lastmod` fehlt — optional, aber
bei einem statischen Build leicht ergänzbar (`new Date().toISOString().slice(0,10)`
je `<url>` in `build.mjs`, Zeile ~328).

### P3-6: Keyword „flutopfer" auf `/sri-lanka/` nicht in Title/Description

Der Keyword-Plan nennt „sri lanka spenden flutopfer" als Fokus. Title
(„Sri-Lanka-Hilfe — …") und Description decken „sri lanka" und „spenden" ab,
verwenden aber „Überschwemmungen" statt „Flutopfer". H1 entspricht dem Plan.
Bei nächster Textredaktion „Flutopfer" in die Description aufnehmen — nur wenn
redaktionell vertretbar (kein Keyword-Stuffing).

### P3-7: NGO-Schema — korrekt und bewusst minimal

Geprüft auf allen 17 Seiten: `name`, `foundingDate` (2010-06-16 = Registerdatum),
`email`, `identifier` („Amtsgericht Köln VR 16395"), vollständige `PostalAddress`,
`url`. **Fehlendes `sameAs` ist korrekt** (keine verifizierten Social-Profile,
`socialLinks: []`). Kein `ContactPoint` (Telefon unbestätigt, LB-17) — korrekt.
Optionale Verfeinerung: `identifier` als `PropertyValue`
(`{"@type":"PropertyValue","propertyID":"Vereinsregister","value":"VR 16395"}`);
kein Muss.

### P3-8: NAP-Konsistenz — bestanden

„Kölner Straße 64, 51702 Bergneustadt" und `info@livingcharity.de` sind in
Footer (alle Seiten), Impressum, Kontakt und JSON-LD identisch. Telefon wird
konsequent nirgends genannt (Status confirmation-required). Achtung: Adresse
und E-Mail stehen laut `site.json` selbst auf `confirmation-required` — vor
Livegang bestätigen (deckt sich mit launch-blockers).

### P3-9: H1-Abdeckung vs. seo-plan.md — vollständig

Alle 10 H1s der indexierbaren Seiten entsprechen wortgleich der H1-Spalte des
Keyword-Plans (Startseite, Unsere Arbeit, Sri Lanka, Projekte, Plant Ceylon,
Spenden, Über uns, Aktuelles, Kontakt, Transparenz). Genau eine H1 pro Seite.

---

## Verbotscheck: erfundene Bewertungen / Events / Zahlen

**Bestanden.** Im gesamten Markup und JSON-LD finden sich keine
`AggregateRating`/`Review`/`Event`-Schemata und keine erfundenen Wirkungszahlen.
`projects.json`, `posts.json`, `events.json` enthalten leere Listen mit ehrlichen
Leerzuständen; Vorlagen tragen `[INHALT VON LIVING CHARITY ERFORDERLICH]`-Marker
und sind noindex. Der 5-€-Claim erscheint ausschließlich als zugeschriebenes
Zitat („Nach Angaben des öffentlichen Spendenaufrufs …") mit externem Quellenlink
und taucht in keiner Meta-Description auf — entspricht Redaktionsregel 2.

## Erinnerung Livegang (kein Befund, dokumentierte Absicht)

`robots.txt` blockiert derzeit absichtlich alles (LB-10). Beim Freischalten:
Vorlage aus dem Dateikommentar übernehmen (**inkl. neuem `Disallow: /preview/`,
siehe P1-1**), Sitemap in Search Console + Bing einreichen, Vorschau-Domain
per 301 stilllegen (seo-plan.md, Punkt 5).

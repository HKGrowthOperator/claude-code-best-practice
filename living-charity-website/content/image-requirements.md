# Bild- und Beweisanforderungen — Living Charity e. V. (v2)

Bildsprache: **dokumentarisch statt werblich.** Große echte Fotografie,
natürliches Licht, respektvolle Darstellung. Keine KI-Bilder als
Projektfotografie (technisch gesperrt), keine gemischten Stockbild-Stile,
keine entwürdigenden Armutsdarstellungen. Für jedes Bild: Bildrechte und —
bei erkennbaren Personen — schriftliche Einwilligungen (bei Minderjährigen:
Sorgeberechtigte).

## Asset-Struktur (angelegt)

```
/public/assets/projects/originals     unbearbeitete Originale (Beweiswert)
/public/assets/projects/compressed    Web-Ableitungen (WebP/AVIF, srcset)
/public/assets/projects/thumbnails    Karten-/Vorschaugrößen
/public/assets/documents              Belege, Rechnungen, Berichte (PDF)
/public/assets/team                   Vorstands-/Teamporträts
```

## Pflicht-Metadaten je echter Projektaufnahme

Dateiname · Projekt · Ort · Aufnahmedatum · Fotograf · Rechteinhaber ·
Einwilligungsstatus · Beschreibung · Alt-Text · Belegstatus
(`original` | `bericht` | `extern` | `illustration`) · Quelle.
In WordPress: Pflichtfelder der Mediathek (Blueprint Abschnitt 6). In der
Vorabversion: Begleitdatei `<dateiname>.meta.json` im selben Ordner.

## Beweisregeln (verbindlich)

1. Nur Aufnahmen mit Belegstatus `original` dürfen das Badge
   „Originalaufnahme" tragen.
2. Illustrationen/Platzhalter tragen sichtbar das Badge „Illustration" bzw.
   „Platzhalter" — niemals Bildunterschriften wie „Unsere Pflanzung",
   „Vor Ort", „Projektaufnahme", „Diese Familie wurde unterstützt".
3. KI-generierte Dateien (u. a. `ChatGPT_Image*`, plantceylon-CDN-Bilder)
   sind als Beweismaterial gesperrt — `src/utils/check.mjs` erzwingt das.
4. Benötigte Beweisarten je Projekt: Fotos vor/während/nach der Maßnahme,
   GPS-/Ortsangabe, Datum, Gruppenbild mit lokalem Team, Detailfotos
   (z. B. Setzlinge, Schilder mit Bestellreferenz), kurze Videos ohne starke
   Schnitte, Rechnungen/Belege, Erklärung des lokalen Verantwortlichen,
   Einwilligungen, regelmäßige Updates.

## Benötigte Bilder (Einsatzorte)

| Nr. | Einsatzort | Motiv | Format | Mindestauflösung |
| --- | --- | --- | --- | --- |
| H1 | Startseite Hero | dokumentarische Aufnahme aus Sri Lanka (Hilfssituation, Menschen, Würde) | 4:5 hochkant | 1200×1500 px |
| S1 | Sri-Lanka-Seite | Aufnahme der aktuellen Hilfe (Lebensmittel/Versorgung) | 4:5 | 1200×1500 px |
| A1 | Unsere Arbeit | Vereinsarbeit/Helfer | 4:5 | 1200×1500 px |
| P1–Pn | je Projekt: Kartenbild + Galerie (3–8 Bilder) | Ausgangslage, Umsetzung, Menschen, Details | 3:2 | 1600 px lange Kante |
| PC1–PCn | Plant Ceylon (nur nach Verifizierung) | Pflanzflächen, Setzlinge, Team, Schilder | 3:2 | 1600 px lange Kante |
| T1–T3 | Vorstandsporträts | einheitlicher Stil/Hintergrund, freundlich, schlicht | 1:1 | 800×800 px |
| OG1 | Social-Preview | Logo + starkes dokumentarisches Foto | exakt 1200×630, PNG | 1200×630 px |
| L1 | Logo | Vektordatei (SVG/AI/EPS) + Freisteller | — | Vektor |
| V1 | je Video | lokales Vorschaubild (kein Fremd-Thumbnail) | 16:9 | 1280×720 px |

## Technische Einbindung (vorbereitet)

- Feste `aspect-ratio` je Bildfläche → kein Layout-Shift beim Bildtausch.
- Hero: `fetchpriority="high"`; unterhalb des Folds `loading="lazy"`.
- `<picture>` mit AVIF/WebP + JPG-Fallback, `srcset` für responsive Größen.
- Alt-Texte beschreiben konkret das Motiv; dekorative Grafiken `alt=""` bzw.
  `aria-hidden`.
- Bis Originalmaterial vorliegt: neutrale Flächen mit ehrlicher Beschriftung
  „Originale Projektaufnahme wird ergänzt." + „Platzhalter"-Badge.

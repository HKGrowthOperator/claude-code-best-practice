# Bild-Anforderungsliste — Living Charity e. V.

Grundsatz: **dokumentarisch statt werblich.** Echte Menschen, echte Orte,
natürliches Licht. Keine KI-Bilder, keine gemischten Stockbild-Stile, keine
entwürdigenden Armutsdarstellungen. Für jedes Bild müssen Bildrechte und —
bei erkennbaren Personen — schriftliche Einwilligungen dokumentiert sein
(bei Minderjährigen: Sorgeberechtigte).

Technisch: Original in höchster Auflösung anliefern (JPG/HEIC/RAW). Die
Web-Ableitungen (WebP/AVIF, responsive Größen) erzeugen wir. Zielformate unten
= Seitenverhältnis der Bildfläche.

| Nr. | Einsatzort | Motiv (Wunsch) | Format | Mindestauflösung | Rechte/Einwilligung |
| --- | --- | --- | --- | --- | --- |
| H1 | Startseite Hero (Bogen-Bildfläche) | Eine konkrete Hilfssituation mit Menschen — Blickkontakt oder Interaktion, warmes Licht | 4:5 hochkant | 1200×1500 px | zwingend |
| H2 | Startseite Schwerpunktprojekt | Aktuelles Projekt: Ort + Tätigkeit | 4:3 | 1600×1200 px | zwingend |
| P1–Pn | je Projekt: Kartenbild | wiedererkennbares Projektmotiv | 3:2 | 1200×800 px | zwingend |
| P1g–Png | je Projekt: Galerie (3–8 Bilder) | Ausgangslage, Umsetzung, Menschen, Details | frei (3:2 bevorzugt) | 1600 px lange Kante | zwingend |
| U1 | Über uns: Vereinsleben | Vorstand/Aktive bei echter Vereinsarbeit | 4:3 | 1600×1200 px | zwingend |
| T1–T3 | Vorstandsporträts (3 Personen) | freundlich, schlicht, gleicher Stil/Hintergrund für alle drei | 1:1 | 800×800 px | zwingend (Personenfreigabe) |
| S1 | Social-Preview (OG-Bild) | Logo + starkes Projektfoto | exakt 1200×630 px, PNG/JPG | 1200×630 px | zwingend |
| L1 | Logo | Vektordatei (SVG oder AI/EPS), zusätzlich Freisteller | — | Vektor | Markenrechte klären |
| E1–En | je Veranstaltung (optional) | Ort/Aktion, nach dem Termin: Rückblicksfotos | 3:2 | 1200×800 px | zwingend, Hinweisschild bei Veranstaltungsfotos empfohlen |
| V1 | optionale Videos | lokales Vorschaubild je Video (kein YouTube-Thumbnail-Hotlink) | 16:9 | 1280×720 px | zwingend |

## Regeln für die Einbindung (bereits im Code vorbereitet)

- Bildflächen haben feste `aspect-ratio` → kein Layout-Shift beim Bildtausch.
- Hero-Bild: `fetchpriority="high"`, alle Bilder unterhalb des Folds `loading="lazy"`.
- Moderne Formate (WebP/AVIF) mit JPG-Fallback via `<picture>`.
- Alt-Texte: beschreiben konkret, was zu sehen ist („Zwei Helferinnen verteilen
  Schulmaterial im Gemeindesaal"), keine Keyword-Ketten. Dekorative Bilder: `alt=""`.
- Bildnachweis + Einwilligungsreferenz je Bild in WordPress-Mediathek
  (Feld „Beschreibung") pflegen.

## Bis Bilder vorliegen

Alle Bildflächen zeigen die kontrollierten, beschrifteten SVG-Platzhalter
(„Bildfläche — echtes Projektfoto erforderlich"). Diese sind absichtlich
als Platzhalter erkennbar und dürfen nicht live gehen.

# Blockliste & Template-Zuordnung

Jede Komponente der Vorabversion wird zu einem benannten Block Pattern
(Kategorie „Living Charity") oder — wo Logik nötig ist — zu einem kleinen
dynamischen Block. Backend-Namen sind deutsch und selbsterklärend.

## 1. Blöcke / Patterns

| Backend-Name (Pattern/Block) | Vorabversion (CSS-Komponente / Quelle) | Typ | Editierbare Inhalte |
| --- | --- | --- | --- |
| Hero (Startseite) | `.hero` + `.arch-media` (index.html) | Pattern | Overline, H1, Unterzeile, 2 Buttons, Bild |
| Vertrauensleiste | `.trust-bar` | dynamischer Block (liest Vereinsdaten) | Punkt 4 frei editierbar |
| Inhaltsintro / Sektionskopf | `.section-head` | Pattern | Overline, H2, Absatz |
| Projektkarten-Raster | `projects-grid`-Renderer (build.mjs) | dynamischer Block (Query auf `lc_project`) | Anzahl, Filter (Status/Thema/Region) |
| Projektfortschritt | `.progress` | dynamischer Block | nur aus `progress_percent`-Feld, sonst unsichtbar |
| Projekt-Faktenleiste | `.project-facts` | Template-Bestandteil single-lc_project | automatisch aus Feldern |
| Spendenbox | `donation-box`-Renderer | dynamischer Block (liest Bankdaten + Kopierknopf) | Verwendungszweck-Zeile |
| Text-Bild-Bereich | `.split` / `.split--media-left` | Pattern | Text, Bild, Ausrichtung |
| Schritt-Liste („So wirkt Unterstützung") | `.steps` | Pattern | Schritte (H3 + Absatz) |
| Teamkarten | `team-list`-Renderer | dynamischer Block (Query `lc_team`, nur `approved`) | — |
| Beitragskarten | `posts-list`-Renderer | dynamischer Block (Query posts) | Anzahl, Kategorie |
| Veranstaltungskarten | `events-list`-Renderer | dynamischer Block (Query `lc_event`, kommend/Rückblick) | Anzahl |
| Partnerlogos | `.grid` + `lc_partner` | dynamischer Block (nur `approved`) | — |
| FAQ / Aufklapper | `.faq` (`<details>`) | Pattern | Frage/Antwort-Paare |
| Kontaktbereich | kontakt.html (Formular + Infokarten) | Pattern + Formular-Plugin-Einbettung | Felder siehe migration-guide |
| Abschluss-CTA | `.cta-final` (section-dark) | Pattern | H2, Absatz, 2 Buttons |
| Bildergalerie | natives Gallery-Pattern mit `card`-Stil | Core-Block | Bilder |
| Dokumenten-Downloads | natives File-Block-Pattern, gestylte Liste | Core-Block | Dateien |
| Leerzustand | `.empty-state` | in dynamischen Blöcken eingebaut | Texte filterbar |
| Karten-Zwei-Klick (Anfahrt) | `.map-consent` | Pattern | Adresse, Link |
| Infokarte | `.info-card` | Pattern | frei |
| Wirkung und Stimmen | `lc_voice` | dynamischer Block, per Feature-Flag deaktiviert | erst mit Freigaben aktivieren |

## 2. Template-Zuordnung (Block-Theme `templates/`)

| Template | Aufbau (Patterns/Blöcke in Reihenfolge) |
| --- | --- |
| `front-page` | Hero → Vertrauensleiste → Sektionskopf + 3 Info-Karten → Schwerpunktprojekt (Text-Bild) → Schritt-Liste → Projektkarten (max. 3) → Teamkarten → Mitmachen-Karten → Beitragskarten → Abschluss-CTA |
| `page` (Über uns, Mitmachen, Spenden …) | Breadcrumb → Seitenkopf → freie Patterns |
| `archive-lc_project` | Seitenkopf → Projektkarten-Raster (alle) → Status-Legende → CTA |
| `single-lc_project` | Breadcrumb → Kopf (Badge+H1+Auszug) → Faktenleiste → Ausgangslage/Maßnahme/Ziel + Galerie → Stand/Updates/Nachweise + Spendenbox → CTA |
| `home` (Aktuelles) | Seitenkopf → Beitragskarten → Veranstaltungs-Querverweis |
| `single` | Breadcrumb → Kopf (Kategorie+Datum+H1+Teaser) → Inhalt → Beitragsnavigation |
| `archive-lc_event` | Seitenkopf → Veranstaltungskarten (kommend) → Rückblicke → Aktion-CTA |
| `single-lc_event` | Breadcrumb → Kopf → Faktenleiste (Datum/Ort/Anmeldung) → Inhalt → Kontakt-CTA |
| `404` | Fehlerseiten-Pattern (3 Auswege) |

Template Parts: `header` (Sticky-Header + Navigation), `footer` (4 Spalten +
Registerzeile + dynamisches Jahr).

## 3. Regeln für Redakteure (im Backend als Hinweistexte hinterlegen)

1. Keine Wirkungszahlen ohne Quelle — der Kennzahlen-Repeater verlangt eine Quelle.
2. Bankdaten nie in Textblöcke tippen — immer der Spendenbox-Block.
3. Bilder nur mit dokumentierten Rechten hochladen (Feld „Beschreibung" = Nachweis).
4. „Mehr erfahren"-Links immer mit Kontext beschriften („Mehr erfahren zu Sachspenden").
5. Maximal 3 hervorgehobene Projekte auf der Startseite.

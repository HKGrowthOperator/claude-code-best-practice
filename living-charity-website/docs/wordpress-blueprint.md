# WordPress-Blueprint — Living Charity e. V. (v2)

Zielbild: modernes **Block-Theme (FSE)** auf WordPress ≥ 6.5, PHP ≥ 8.1 —
theme.json, Gutenberg, Block Patterns, Template Parts, Custom Post Types,
native WordPress-Funktionen, möglichst wenige Plugins, verständliches Backend.
Kein Page Builder. Schritt-für-Schritt-Umsetzung: [migration-guide.md](migration-guide.md).
Ergänzend: [donation-provider.md](donation-provider.md) (Spendendienst-Schnittstelle),
[plugins-security.md](plugins-security.md) (Plugins & Sicherheit).

## 1. Custom Post Types

| CPT | Zweck | Archiv/URL |
| --- | --- | --- |
| `projects` | Projekte & Hilfsaktionen | /projekte/, /projekte/[slug]/ |
| `updates` | Berichte/Aktuelles (alternativ native Posts) | /aktuelles/, /aktuelles/[slug]/ |
| `events` | Veranstaltungen (vorbereitet, ohne Frontend-Bereich bis echte Termine vorliegen) | — |
| `team` | Vorstand/Team (kein öffentliches Archiv) | — |
| `partners` | Partner (nur mit Freigabe gerendert) | — |
| `documents` | Belege/Downloads mit Metadaten | — |

## 2. Taxonomien

`project_status` (geplant, aktiv, laufend, abgeschlossen, pausiert, pruefung) ·
`project_region` · `project_type` · `update_category` (Neuigkeit,
Projekt-Update, Rückblick, Pressemitteilung) · `document_type` (Beleg,
Bericht, Rechnung, Freigabe, Sonstiges)

## 3. Projektfelder (CPT `projects`)

`title` · `subtitle` · `status` · `region` · `exact_location` · `coordinates` ·
`start_date` · `end_date` · `short_description` · `problem` · `goal` ·
`measures` · `beneficiaries` · `current_need` · `funding_goal` ·
`funding_received` · `use_of_funds` · `project_manager` · `local_partner` ·
`image_gallery` · `videos` · `documents` · `external_sources` · `last_update` ·
`verification_status`

Regeln: Leere Felder werden nie als leere Blöcke gerendert. `funding_goal`/
`funding_received`/Fortschrittsbalken nur mit echten Zahlen. `image_gallery`
akzeptiert nur Medien mit gepflegten Beleg-Metadaten (siehe Abschnitt 6).
`verification_status` steuert das sichtbare Badge (u. a. „In Prüfung").

## 4. Globale Einstellungen (Options-Seite „Vereinsdaten")

Vereinsname · Logo · Adresse · E-Mail · Telefon (leer = ausgeblendet) ·
Registergericht · Registernummer · Eintragungsdatum · Vorstand · Bank · IBAN ·
BIC · Spendenhinweis/Bescheinigungstext · Social Links · Footer-Claim ·
**Quellenlink zum 5-Euro-Claim** · Feature-Flags (`show_events`,
`show_testimonials`, `donation_provider`).
Referenzstruktur: `src/data/site.json` (inkl. `status`-Feldern =
maschinenlesbare Freigabeliste).

## 5. UI-Komponenten ↔ Blöcke/Patterns

| Komponente (CSS) | WP-Umsetzung | Editierbar |
| --- | --- | --- |
| Trust Bar (`.trust-strip`) | Template Part, liest Vereinsdaten | — |
| Header + Mobile Navigation | Template Part `header` | Menü „Hauptmenü" |
| Editorial Hero (`.hero`) | Pattern | Eyebrow, H1, Text, 2 Buttons, Bild |
| 5-Euro Impact (`.impact5`) | dynamischer Block (liest Claim + Quellenlink aus Optionen) | — (Formulierung geschützt) |
| Project Feature / Project Card (`.card`) | dynamischer Block (Query `projects`) mit eingebauter Leerlösung | Anzahl, Filter |
| Project Evidence Gallery (`.proof-grid`, `.doc-media`) | Pattern + Galerie-Block mit Beleg-Metadaten | Bilder |
| Source Card / External Source Badge (`.source-line`, `.source-badge`) | wiederverwendbarer Block | Quelle, Typ |
| Donation Panel (`.donation-panel`) | dynamischer Block (Bankdaten aus Optionen; IBAN/BIC-Kopierknöpfe, Betragsauswahl, Girocode-Slot) | Verwendungszweck-Basistext |
| Plant Selector (`.tree-grid`) | Pattern/Block (Liste + Preis aus Optionen) | Baumarten, Preis |
| Four-Step Process (`.steps`) | Pattern | Schritte |
| Team Profile (`.team-card`) | dynamischer Block (Query `team`) | — |
| Update Card (`.update-card`) | Bestandteil single-Template | — |
| Document Download (`.doc-list`) | Block (Query `documents`) | Auswahl |
| Contact Form | Formular-Plugin-Block (Feldstruktur: migration-guide Schritt 4; Themenliste aus Optionen) | Themen |
| CTA Section (`.cta-final`) | Pattern | Texte, Buttons |
| Footer | Template Part `footer` | Menüs |
| Breadcrumbs | kleiner dynamischer Block | — |
| Empty/Loading/Error State | in dynamischen Blöcken eingebaut | Leertexte per Filter |

## 6. Medien-/Beweisregeln (technisch verankern)

- Mediathek-Pflichtfelder je Projektaufnahme: Projekt, Ort, Aufnahmedatum,
  Fotograf, Rechteinhaber, Einwilligungsstatus, Beschreibung, Alt-Text,
  Belegstatus (`original` | `bericht` | `extern` | `illustration`), Quelle.
- Upload-Ordnerstruktur analog Vorabversion:
  `assets/projects/originals|compressed|thumbnails`, `assets/documents`,
  `assets/team`.
- Rendering: `illustration` erhält automatisch das „Illustration"-Badge und ist
  für „Originalaufnahme"-Slots gesperrt. KI-Dateinamen (`ChatGPT_Image*`)
  werden beim Upload abgewiesen (Plugin-Hook).

## 7. Template-Zuordnung

| Template | Aufbau |
| --- | --- |
| `front-page` | 15 Sektionen exakt in Briefing-Reihenfolge (siehe information-architecture.md) |
| `page` | Breadcrumb → Seitenkopf → Patterns |
| `archive-projects` | Kopf → Karten (echte + Leerlösung) → Status-Legende → CTA |
| `single-projects` | Kopf (Badge/Region) → Faktenleiste → Problem/Ziel/Maßnahmen/Bedarf + Galerie → Finanzierung → Nachweise/Updates/Dokumente → CTA |
| `home` (Aktuelles) | Kopf → Update-Karten (Leerlösung) → Hinweisbereich |
| `single` (updates) | Kopf (Kategorie/Datum) → Inhalt → Quellen-Badges |
| `404` | Fehlerseiten-Pattern |
| `search` | Suchergebnis-Template (native WP-Suche ersetzt den clientseitigen Index) |
| Danke-Seite | normale Seite, Ziel der Formular-Weiterleitung, noindex |

## 8. Redaktionsregeln (im Backend hinterlegen)

1. Verbotene Altzahlen und Demo-Veranstaltungen (Liste in
   content/content-status.md) sind gesperrt — Plugin-seitige Prüfung beim
   Speichern empfohlen.
2. Wirkungszahlen nur mit Quelle/Zeitraum/Zählweise (Pflichtfelder im Repeater).
3. Bankdaten nie in Textblöcke — nur Donation-Panel-Block.
4. 5-Euro-Claim nur über den Impact-Block (Formulierung zentral, Quelle stets verlinkt).
5. Plant Ceylon behält „In Prüfung", bis /content/plant-ceylon-verification.md
   abgearbeitet ist.

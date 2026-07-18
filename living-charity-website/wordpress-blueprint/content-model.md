# Content-Modell — Custom Post Types, Felder, Taxonomien, Optionen

Feldumsetzung: bevorzugt **ACF (Advanced Custom Fields)**, falls in der
Zielinstallation vorhanden oder freigegeben; sonst native `register_post_meta`
+ Block Bindings (WP ≥ 6.5). Die JSON-Dateien in `src/data/` sind die
Referenz — Feldnamen dort = Feldnamen hier.

## 1. Custom Post Types

### `lc_project` — Projekt (Archiv: /projekte/)

Menüname „Projekte", Icon `dashicons-groups`, unterstützt Titel, Editor
(für Updates/Abschlussbericht), Beitragsbild, Auszug.

| Feld | Typ | Pflicht | Hinweis |
| --- | --- | --- | --- |
| `status` | Auswahl: geplant, aktiv, laufend, abgeschlossen, pausiert | ja | steuert Badge + Sortierung |
| `region` | Text (zusätzlich Taxonomie `lc_region`) | ja | Anzeigename des Orts |
| `topic` | via Taxonomie `lc_topic` | ja | |
| `excerpt` | natives Auszug-Feld | ja | Kartentext |
| `situation` | Textarea/WYSIWYG | ja | Ausgangslage |
| `measure` | Textarea | ja | geplante Maßnahme |
| `audience` | Text | ja | Zielgruppe |
| `goal` | Textarea | ja | überprüfbar formuliert |
| `needed_support` | Textarea | ja | Geld/Sachspenden/Zeit |
| `progress` | Textarea | nein | aktueller Stand |
| `progress_percent` | Zahl 0–100 | nein | NUR mit belegbarer Berechnungsgrundlage füllen |
| `start_date` | Datum | nein | |
| `end_date` | Datum | nein | |
| `partners` | Repeater (Name, Rolle, Link, Freigabe ja/nein) | nein | ohne Freigabe nicht gerendert |
| `contact_person` | Beziehung → `lc_team` oder Text | nein | |
| `gallery` | Galerie | nein | nur Bilder mit dokumentierten Rechten |
| `video_url` + `video_poster` | URL + Bild | nein | Zwei-Klick-Einbindung, lokales Poster |
| `documents` | Repeater (Titel, Datei) | nein | Downloads |
| `updates` | Repeater (Datum, Text) | nein | chronologisch |
| `donation_purpose` | Text | ja | Verwendungszweck projektbezogener Spenden |
| `final_report` | WYSIWYG | nein | ersetzt „Aktueller Stand" bei Abschluss |
| `impact_figures` | Repeater (Kennzahl, Wert, Zeitraum, Quelle) | nein | **Quelle ist Pflichtfeld im Repeater** |
| `sources` | Repeater (Bezeichnung, Link/Datei) | nein | Nachweise |

### `lc_event` — Veranstaltung (Archiv: /veranstaltungen/)

| Feld | Typ | Pflicht | Hinweis |
| --- | --- | --- | --- |
| `event_type` | via Taxonomie `lc_event_type` | ja | |
| `start` / `end` | Datum+Uhrzeit | ja / nein | Vergangenheit ⇒ automatische Rückblick-Kennzeichnung |
| `location` | Text | ja | |
| `description` | Editor | ja | |
| `registration_required` | Ja/Nein | ja | |
| `registration_contact` | Text/E-Mail | nein | |
| `related_project` | Beziehung → `lc_project` | nein | |
| Beitragsbild | nativ | nein | mit Einwilligungen |

Archiv-Logik: kommende Termine aufsteigend, dann „Rückblicke" absteigend;
niemals vergangene Termine als „kommend". Event-Schema.org nur bei echten,
zukünftigen Terminen ausgeben.

### `lc_team` — Team/Vorstand (kein öffentliches Archiv)

| Feld | Typ | Pflicht |
| --- | --- | --- |
| Titel = Name | nativ | ja |
| `role` | Text | ja |
| `personal_note` | Text (1 Satz) | nein |
| Beitragsbild = Porträt | nativ | nein (Fallback: Initialen) |
| `approved` | Ja/Nein | ja — ohne „ja" wird der Eintrag nicht öffentlich gerendert |

### `lc_partner` — Partner (kein öffentliches Archiv)

Titel = Name, `logo` (Bild), `url`, `approved` (Ja/Nein, Pflicht).

### `lc_voice` — Stimme/Erfahrung (optional, standardmäßig deaktiviert)

Titel = Person/Kontext, `quote`, `context`, `approved` (Pflicht). Wird erst
aktiviert (Feature-Flag, siehe Optionen), wenn freigegebene Inhalte existieren.
Navigationsname der zugehörigen Sektion: „Wirkung und Stimmen" — **nicht** „Kundenstimmen".

## 2. Taxonomien

| Taxonomie | Für | Beispiel-Terme (erst mit echten Projekten anlegen) |
| --- | --- | --- |
| `lc_topic` (Projektthema) | lc_project | — |
| `lc_region` (Projektregion) | lc_project | — |
| Projektstatus | **kein** Taxonomie-Kandidat — bewusst als Meta-Feld (einwertig, feste Liste) | |
| `category` (nativ, Beitragskategorie) | post | Neuigkeit, Rückblick, Projekt-Update, Pressemitteilung |
| `lc_event_type` (Veranstaltungsart) | lc_event | Benefizveranstaltung, Informationsabend, Sammelaktion, Mitgliederversammlung, Sonstiges |

## 3. Globale Einstellungen (Options-Seite „Vereinsdaten")

Quelle: `src/data/site.json` — Struktur 1:1 übernehmen.

- Vereinsname, Kurzname, Gründungsjahr
- Logo (Media-ID)
- Anschrift (Straße, PLZ, Ort)
- E-Mail, Telefon (leer = Click-to-Call und Footer-Zeile ausgeblendet)
- Registergericht, Registernummer
- Bankverbindung (Kontoinhaber, Bank, IBAN, BIC) + Schalter „bestätigt"
- Spendenhinweise (Verwendungszwecke, Bescheinigungstext nach Freigabe)
- Social-Media-Links (Repeater; leer = keine Icons)
- CTA-Texte (primär/sekundär/Projekte/Kontakt)
- Footer-Claim
- Feature-Flags: `show_events_in_header`, `show_testimonials`, `show_transparency_page`, `donation_provider`

**Zugriffsschutz:** Bankdaten-Ausgabe ausschließlich über den Spendenbox-Block
(rendert nur auf der Spendenseite und in Projekt-Einzelansichten).

## 4. Redaktionsrollen

- Redakteur:innen pflegen Inhalte über CPTs + Patterns; Options-Seite
  „Vereinsdaten" nur für Administratoren.
- Jede Liste hat einen eingebauten Leerzustand — nichts bricht, wenn noch
  keine Inhalte existieren.

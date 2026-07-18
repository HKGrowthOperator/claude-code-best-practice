# Review: WordPress-Übergabedokumentation — Living Charity e. V.

Datum: 2026-07-18 · Reviewer: WordPress-Architektur-Review (automatisiert)
Geprüfte Artefakte: `docs/wordpress-blueprint.md`, `docs/migration-guide.md`,
`docs/donation-provider.md`, `docs/plugins-security.md`,
`docs/information-architecture.md`, `wordpress-export/` (README, manifest.json,
pages/), `src/utils/export-wp.mjs`, `src/utils/push-wp.mjs`, `src/data/*.json`,
`public/sitemap.xml`, `package.json`.

Prioritäten: **P1** = vor Übergabe korrigieren (führt zu Fehlern/Fehlgriffen) ·
**P2** = vor Migration korrigieren (Inkonsistenz mit realem Schadenspotenzial) ·
**P3** = redaktionelle Klarstellung.

---

## A. Soll-Abgleich (Kundenbriefing)

| Soll-Anforderung | Status | Beleg |
| --- | --- | --- |
| Block-Theme mit theme.json, Gutenberg, Patterns, Template Parts | ✅ erfüllt | blueprint Kopf + §5/§7; migration-guide Schritt 1/3 |
| CPTs `projects`/`updates`/`events`/`team`/`partners`/`documents` | ✅ dokumentiert, ⚠️ Namenskonflikt `events` (siehe W1) | blueprint §1 |
| Taxonomien `project_status`/`project_region`/`project_type`/`update_category`/`document_type` | ✅ vollständig, inkl. Wertelisten für status/update_category/document_type | blueprint §2; posts.json/projects.json konsistent |
| 25 Projektfelder (title … verification_status) | ✅ vollständig und identisch in blueprint §3 und `src/data/projects.json` (`fields`) | abgeglichen, keine Abweichung |
| Globale Einstellungen inkl. **Quellenlink zum 5-Euro-Claim** | ✅ blueprint §4 (`Quellenlink zum 5-Euro-Claim`), Quelle real gepflegt in `site.json` → `claim5.sourceUrl` | ⚠️ Flag-Lücke, siehe W5 |
| UI-Komponenten-Liste (Trust Bar … Error State) | ✅ vollständig (18 Zeilen, Trust Bar bis Empty/Loading/Error State) | blueprint §5 |
| Wenige Plugins | ✅ blueprint Kopf + plugins-security.md („so wenige Plugins wie möglich", 0-Plugin-Alternative via `register_post_meta` + Block Bindings) | — |
| Verständliches Backend | ✅ Redaktionsregeln (blueprint §8) + Redaktionshandbuch (migration-guide) | — |

**Fazit Soll:** Keine harte inhaltliche Lücke gegenüber dem Briefing. Die
gefundenen Probleme sind Widersprüche/Detail-Lücken zwischen den Dokumenten
(Abschnitte B und C).

---

## B. Widerspruchsliste

### W1 (P1) — CPT-Name für Veranstaltungen: `events` vs. `lc_event`

- `docs/wordpress-blueprint.md` §1 und `docs/information-architecture.md` sagen CPT **`events`**.
- `src/data/events.json` (Zeile 2, `_kommentar`) sagt: „Entspricht in WordPress dem CPT **'lc_event'**".

Wer das Datenmodell nach Blueprint im Plugin `living-charity-core` registriert
und dabei events.json als Referenz nimmt, registriert zwei verschiedene Post
Types. (Randnotiz: ein Präfix wie `lc_` ist bei WP-CPTs sogar best practice —
`events` kollidiert leicht mit Event-Plugins; die Entscheidung sollte aber
EINMAL getroffen und überall gleich geschrieben werden.)

**Korrektur:** Einen Namen festlegen (Empfehlung: `lc_event` — und dann
konsequent auch `lc_project` etc. prüfen, oder überall die unpräfixten Namen
aus dem Blueprint). Mindestens: `events.json` Zeile 2 an den Blueprint
angleichen („CPT 'events'").

### W2 (P1) — Toter Pfad `wordpress-blueprint/migration-guide.md` (3 Fundstellen)

- `wordpress-export/README.md` Zeile 6 und Zeile 64 sowie
  `src/utils/export-wp.mjs` Kopfkommentar (Zeile 12) verweisen auf
  **`wordpress-blueprint/migration-guide.md`** — dieses Verzeichnis existiert
  nicht. Der reale Pfad ist **`docs/migration-guide.md`** (so korrekt in
  `manifest.json`-Notes und im push-wp-Abschlusstext verwendet).

**Korrektur:** In allen drei Fundstellen durch `docs/migration-guide.md`
ersetzen. Gerade das Export-README ist das erste Dokument, das ein externer
WP-Entwickler liest — ein toter Verweis auf die Hauptanleitung ist dort P1.

### W3 (P2) — Sicherheitsbremse (SPD-Instanz): „Beide Push-Wege" bei drei Wegen; Weg C ungesichert

- `wordpress-export/README.md` Zeile 21: „**Beide** Push-Wege unten
  verifizieren deshalb zuerst den Site-Namen." — es folgen aber **drei** Wege
  (A: Skript ✅ geprüft in `push-wp.mjs` Zeilen 52–62; B: MCP ✅ Schritt 1
  `wp_get_site_info`; **C: manuell — keinerlei Verifizierungsschritt**).
- Ausgerechnet Weg C (Copy-Paste im WP-Admin) ist der Weg, bei dem ein Mensch
  am ehesten im falschen Admin-Backend landet (die SPD-Instanz war zeitweise
  im Hosting-Panel angebunden).

**Korrektur:** (1) „Beide" → „Alle drei". (2) Weg C um Schritt 0 ergänzen:
„Vor dem Einfügen im WP-Admin prüfen: Websitetitel/Domain = Living Charity —
niemals in spdroshanithanapalas2338.live-website.com arbeiten." Positiv:
migration-guide Schritt 0.3 und Schritt 6.2 sowie push-wp.mjs (Abbruch +
`--force` nur bewusst) erwähnen die Bremse korrekt.

### W4 (P2) — Meta-Descriptions: Weg A (Skript) verliert sie, Weg B setzt sie

- `src/utils/push-wp.mjs` schreibt `metaDescription` nur in das
  WordPress-Feld **`excerpt`** (Zeile 70) — das ist kein SEO-Meta-Tag; ohne
  Zusatzschritt geht die gepflegte Description auf Weg A verloren bzw. taucht
  als Auszug auf.
- `wordpress-export/README.md` Weg B setzt sie dagegen explizit per
  `wp_update_seo_meta` (Zeile 49). Weder README-Weg A noch die
  „Nächste Schritte"-Ausgabe von push-wp.mjs erwähnen das Nachziehen der
  Descriptions im SEO-Plugin.

**Korrektur:** In README (Weg A) und im Abschlusstext von `push-wp.mjs` einen
Schritt ergänzen: „Meta-Descriptions aus `manifest.json` im SEO-Plugin
hinterlegen (Skript befüllt nur den Auszug)" — oder das Skript optional die
gängigen SEO-Plugin-Metafelder befüllen lassen. Zusätzlich migration-guide
Schritt 5 („Titles/Descriptions aus den META-Blöcken der Seitendateien")
auf das Manifest als einfachere Quelle verweisen.

### W5 (P2) — Feature-Flag `show_events` fehlt in der Referenzstruktur `site.json`

- `docs/wordpress-blueprint.md` §4 definiert Feature-Flags **`show_events`**,
  `show_testimonials`, `donation_provider` und erklärt `src/data/site.json`
  zur „Referenzstruktur".
- `src/data/site.json` → `features` enthält nur `showTestimonials` und
  `donationProvider` — **kein** Events-Flag.

**Korrektur:** `"showEvents": false` in `site.json.features` ergänzen (oder
das Flag aus blueprint §4 streichen und den Events-Frontend-Schalter allein
über den CPT-Status regeln). Zusätzlich einen Satz zur Namenskonvention
aufnehmen: JSON camelCase ↔ WP-Option snake_case (`showTestimonials` ↔
`show_testimonials`), damit das Mapping beim Befüllen der Options-Seite
(migration-guide Schritt 2) eindeutig ist.

### W6 (P3) — Block-Name „Donation Panel" vs. „Spendenbox"

- blueprint §5 nennt die Komponente „Donation Panel", §8 Regel 3
  „Donation-Panel-Block".
- `docs/donation-provider.md` nennt denselben Block „**Spendenbox** (Block
  ‚Spendenbox')"; `docs/plugins-security.md` Zeile 46 „Spendenbox-Block".

Für die Redaktion (deutschsprachiges Backend) und für den Entwickler
(Block-Registrierung) muss klar sein, dass das EIN Block ist.

**Korrektur:** Einen Backend-Anzeigenamen festlegen (Empfehlung:
„Spendenbox", technisch `lc/donation-panel`) und in blueprint §5/§8 einmalig
klammern: „Donation Panel (Backend-Name ‚Spendenbox')".

### W7 (P3) — Menü „Footer" (Singular) vs. drei Footer-Navigationslisten

- `src/data/navigation.json` `_kommentar`: „In WordPress: Menüs 'Hauptmenü'
  und 'Footer'" — die Datei enthält aber **drei** Footer-Listen
  (`footerVerein`, `footerHelfen`, `footerRecht`); blueprint §5 Footer sagt
  „Menüs" (Plural) ohne Anzahl/Namen.

**Korrektur:** In navigation.json präzisieren: „Menüs 'Hauptmenü',
'Footer Verein', 'Footer Helfen', 'Footer Recht'" (oder festlegen, dass ein
Footer-Menü mit drei Spalten-Patterns genügt) — sonst rät der Umsetzer.

---

## C. Lückenliste

### L1 (P2) — CPT `partners`: keine Feld-Spezifikation, keine Referenzdaten

`projects`, `updates`, `events`, `team` haben je eine `src/data/*.json`
Referenzdatei; **`partners` und `documents` haben keine**. Für `documents`
liefert blueprint §2 (`document_type`) + §6 (Medien-Pflichtfelder) genug;
für `partners` steht nur „nur mit Freigabe gerendert" — keine Felder (Name,
Logo, URL, Freigabestatus?), keine UI-Komponente in §5.

**Korrektur:** Mini-Feldliste für `partners` in blueprint §3 ergänzen
(z. B. `name`, `logo`, `url`, `description`, `approval_status`) oder den CPT
explizit als „Stub, Felder bei Bedarf" kennzeichnen.

### L2 (P3) — Event-Felder nur implizit in `events.json`

Das Briefing verlangt den CPT `events` „vorbereitet"; die einzige
Feldstruktur steht im `templateEvent` von `src/data/events.json` (slug, title,
type, start, end, location, description, registrationRequired,
registrationContact, relatedProject, image). Der Blueprint definiert weder
Event-Felder noch eine `event_type`-Taxonomie, obwohl `events.json`
`eventTypes` (5 Werte) pflegt.

**Korrektur:** Einen Satz in blueprint §1/§2 ergänzen: „Event-Felder und
Typenliste: Referenz `src/data/events.json` (`templateEvent`, `eventTypes`)."

### L3 (P3) — Export lässt `/suche/` unkommentiert weg

Export/Manifest (13 Seiten) vs. IA-Sitemap (17 Einträge): Differenz sind
`/projekte/projekt/`, `/aktuelles/beitrag/`, `/404.html`, `/suche/`. Der
Kommentar in `export-wp.mjs` (Zeilen 24–25) begründet nur Templates + 404
(„Projekt/Beitrag/Veranstaltung werden CPT-Inhalte, 404 liefert das Theme"),
**nicht** die Suche. Die Begründung existiert nur indirekt (blueprint §7:
native WP-Suche ersetzt den clientseitigen Index). Zudem nennt der Kommentar
„Veranstaltung", obwohl es in der v2-Sitemap gar keine Veranstaltungsseite
mehr gibt — das ist konsistent mit dem Soll („keine Veranstaltungsseiten"),
aber die Formulierung stiftet Verwirrung.

**Korrektur:** Kommentar erweitern: „…, Suche übernimmt die native WP-Suche
(blueprint §7), 404 liefert das Theme"; „Veranstaltung" streichen.
Sonst ist der Export **konsistent**: 13/13 Seiten in `pages/` = Manifest =
IA-Sitemap minus Templates/404/Suche; keine Veranstaltungsseiten;
`public/sitemap.xml` (10 URLs) = 13 minus noindex (danke, impressum,
datenschutz) — stimmig.

### L4 (P3) — `--publish` nicht an die Marker-Prüfung gekoppelt

README (Zeile 38): `--publish` „erst verwenden, wenn die Marker-Prüfung
(`node src/utils/check.mjs`) leer ist" — `push-wp.mjs` erzwingt das nicht
(kein check-Aufruf, keine Warnung bei `--publish`). Da alle Seiten laut
Konzept ohnehin als Entwürfe starten sollen, genügt ein Hinweis; sauberer
wäre eine Abfrage/Warnung im Skript vor `STATUS === "publish"`.

### L5 (P3) — Migrationsreihenfolge: kleine Vorwärtsreferenz, sonst logisch

Die Reihenfolge Schritt 0→7 funktioniert (Voraussetzungen → Theme →
Datenmodell-Plugin → Templates/Blöcke → Formular → SEO → Inhalte → Livegang);
Datenmodell vor Templates ist korrekt, „Schnellweg" (Schritt 6.2) ist als
kompatible Abkürzung gekennzeichnet. Einzige Stolperstelle: Schritt 5 setzt
`noindex` u. a. „für /suche/", obwohl es nach Blueprint §7 keine
`/suche/`-SEITE mehr gibt (native Suche). **Korrektur:** „/suche/" durch
„WP-Suchergebnisseiten (`?s=` bzw. search-Template)" ersetzen. Außerdem
verweist Schritt 1.3 auf `src/utils/main.js` als Theme-Skript, während
Export/push-wp `theme-assets/main.js` (gebaut aus `public/assets/js/main.js`)
verwenden — dieselbe Datei, aber ein einheitlicher Pfad vermeidet Nachfragen.

---

## D. Positivbefunde (keine Aktion nötig)

- Die 25 Projektfelder sind in blueprint §3 und `projects.json.fields`
  **zeichengenau identisch** — inklusive Reihenfolge.
- Taxonomie-Wertelisten (`project_status` 6 Werte, `update_category` 4,
  `document_type` 5) stimmen mit `projects.json.statusLabels` und
  `posts.json.categories` überein.
- 5-Euro-Claim: zentrale Formulierung + Quellen-URL in `site.json.claim5`,
  im Blueprint als geschützter dynamischer Block mit Optionen-Quellenlink
  verankert, in Redaktionsregel 4 abgesichert — Briefing-Soll voll erfüllt.
- Kontaktformular-Feldstruktur (migration-guide Schritt 4, 6 Themen) ==
  `site.json.contactTopics` (6 Einträge, gleiche Labels).
- Sicherheitsbremse in `push-wp.mjs` ist real implementiert (Site-Name-Regex,
  Exit 2, `--force` nur explizit) und in migration-guide Schritt 0 + Schritt 6
  erwähnt.
- DonationProvider-Abstraktion (`bank-transfer` als Fallback,
  `needs_consent`, `required_origins`) ist widerspruchsfrei zu
  `site.json.features.donationProvider = "bank-transfer"` und zur
  CSP-Aussage in plugins-security.md.

## E. Priorisierte Korrektur-Kurzliste

| # | Prio | Datei(en) | Korrektur |
| --- | --- | --- | --- |
| W1 | P1 | `src/data/events.json` ↔ `docs/wordpress-blueprint.md` §1 | CPT-Namen vereinheitlichen (`events` oder `lc_event` — einmal entscheiden) |
| W2 | P1 | `wordpress-export/README.md` (Z. 6, 64), `src/utils/export-wp.mjs` (Z. 12) | Pfad `wordpress-blueprint/…` → `docs/migration-guide.md` |
| W3 | P2 | `wordpress-export/README.md` | „Beide" → „Alle drei" Push-Wege; Weg C um Instanz-Check (SPD-Warnung) ergänzen |
| W4 | P2 | `src/utils/push-wp.mjs`, `wordpress-export/README.md` | Hinweis/Schritt: Meta-Descriptions landen nur im Excerpt — im SEO-Plugin nachziehen |
| W5 | P2 | `src/data/site.json` | `showEvents`-Flag ergänzen + camelCase↔snake_case-Mapping dokumentieren |
| L1 | P2 | `docs/wordpress-blueprint.md` §3 | Feldliste für CPT `partners` ergänzen |
| W6 | P3 | blueprint §5/§8, donation-provider.md | Blockname „Spendenbox"/„Donation Panel" vereinheitlichen |
| W7 | P3 | `src/data/navigation.json` | Footer-Menüstruktur (1 vs. 3 Menüs) festlegen |
| L2 | P3 | blueprint §1/§2 | Event-Felder/`eventTypes` als Referenz verlinken |
| L3 | P3 | `src/utils/export-wp.mjs` | Kommentar: Suche-Auslassung begründen, „Veranstaltung" streichen |
| L4 | P3 | `src/utils/push-wp.mjs` | Warnung bei `--publish` ohne Marker-Prüfung |
| L5 | P3 | `docs/migration-guide.md` Schritt 1/5 | Skript-Pfad vereinheitlichen; noindex „/suche/" → WP-Suchergebnisse |

# Information Architecture — Living Charity e. V. (v2)

## Sitemap

```
/                       Startseite (15-Sektionen-Aufbau lt. Briefing)
/unsere-arbeit/         Unsere Arbeit
/sri-lanka/             Sri-Lanka-Hilfe (Schwerpunkt, 5-€-Modul, Spendenaufruf)
/projekte/              Projekte & Spendenzwecke (inkl. Status-Legende)
/projekte/projekt/      Einzelprojekt — dynamische Vorlage (WP: CPT projects)
/plant-ceylon/          Plant Ceylon (Baumprojekt, Status „In Prüfung")
/spenden/               Spenden (Donation Panel, 5-€-Modul, FAQ)
/ueber-uns/             Über uns (Vorstand, Registerdaten, FAQ)
/aktuelles/             Aktuelles (Berichte)
/aktuelles/beitrag/     Einzelbeitrag — dynamische Vorlage (WP: updates/post)
/kontakt/               Kontakt (Formular mit 6 Themen, Anfahrt, Zwei-Klick-Karte)
/transparenz/           Transparenz (Ablauf, Nachweisarten, Registerdaten)
/impressum/             Impressum (Rechtstext in Vorbereitung — LB-01)
/datenschutz/           Datenschutz (Rechtstext in Vorbereitung — LB-02)
/danke/                 Danke-Seite (Formular-Ziel), noindex
/suche/                 Suchergebnisse (clientseitiger Index), noindex
/404.html               Fehlerseite
```

Veranstaltungen haben in der v2-Sitemap keinen eigenen Seitenbereich mehr;
der CPT `events` bleibt im WordPress-Blueprint vorbereitet.

## Hauptnavigation (Briefing)

Unsere Arbeit · Sri Lanka · Projekte · Über uns · Aktuelles · Kontakt
+ Primärbutton **„Jetzt helfen"** → /spenden/

## Startseiten-Reihenfolge (verbindlich, Briefing Abschnitt 11)

1. Trust-Bar (schmal: „Eingetragener Verein seit 2010 · Amtsgericht Köln · VR 16395")
2. Header (Forest, sticky nach erstem Scrollbereich)
3. Hero („Hilfe, die Menschen direkt erreicht.")
4. 5-Euro-Impact (zitierte Quelle, extern verlinkt)
5. Vorstellung Living Charity
6. Sri-Lanka-Hilfsbereich (2 aktive Wirkungspunkte; dritter folgt nach Beleg)
7. Aktuelles Hilfsprojekt (dynamische Komponente, Leerlösung aktiv)
8. Plant-Ceylon-Teaser (4 Schritte)
9. Transparenter Ablauf (5 Schritte, confirmationRequired)
10. Beweise & Dokumentation (Proof-Modul mit 4 Nachweisarten)
11. Vorstand
12. Möglichkeiten zu helfen (6 Optionen)
13. Aktuelle Berichte
14. Kontakt-CTA
15. Footer

## Nutzerwege (Top-Tasks)

| Persona | Weg | Ziel |
| --- | --- | --- |
| Privater Spender | Hero → 5-€-Modul → /spenden/ → IBAN kopieren | Überweisung |
| Skeptischer Spender | Trust-Bar → /ueber-uns/ (Register) → /transparenz/ → /spenden/ | Vertrauen, dann Spende |
| Sri-Lanka-Interessierte | /sri-lanka/ → Spendenaufruf-Quelle → /spenden/ | informierte Spende |
| Baumprojekt-Interessierte | Teaser → /plant-ceylon/ → externe Projektseite / Kontakt | informierte Entscheidung (Prüfstatus transparent) |
| Ehrenamt/Kooperation | Startseite „Möglichkeiten" → /kontakt/?thema=… (vorbelegt) | Anfrage |
| Presse/Öffentlichkeit | /ueber-uns/ + /transparenz/ | belastbare Fakten |
| WP-Redaktion | Backend: CPTs + Patterns | Pflege ohne Code |

## Inhaltstypen (Kurzfassung — Details: docs/wordpress-blueprint.md)

`projects` · `updates` · `events` (vorbereitet) · `team` · `partners` ·
`documents` + Taxonomien `project_status`, `project_region`, `project_type`,
`update_category`, `document_type` + Options-Seite „Vereinsdaten".

## Leerzustands-Prinzip

Jede dynamische Liste hat eine redaktionelle Leerlösung im Briefing-Wortlaut
(keine Demo-Inhalte, keine Warnhinweise). Fehler- und Ladezustände sind als
Komponenten definiert (`.error-state`, `.loading-state`).

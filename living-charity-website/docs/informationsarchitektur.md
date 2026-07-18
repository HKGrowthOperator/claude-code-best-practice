# Informationsarchitektur & UX-Konzept

## 1. Sitemap

```
/                       Startseite
/ueber-uns/             Über uns (Verein, Vorstand, Arbeitsweise, Transparenz)
/projekte/              Projektübersicht (filterbar nach Status/Region/Thema)
/projekte/projekt/      Einzelprojekt — dynamische Vorlage (WP: CPT lc_project)
/aktuelles/             Aktuelles (Beiträge)
/aktuelles/beitrag/     Einzelbeitrag — dynamische Vorlage (WP: post)
/veranstaltungen/       Veranstaltungen (kommend/vergangen getrennt)
/veranstaltungen/veranstaltung/  Einzelveranstaltung — dynamische Vorlage (WP: CPT lc_event)
/spenden/               Spenden & Unterstützung (Bankverbindung, Mittelverwendung)
/mitmachen/             Mitmachen (Ehrenamt, Sachspenden, Unternehmen)
/kontakt/               Kontakt (Formular, Anfahrt, Click-to-Call vorbereitet)
/impressum/             Impressum (Rechtstext-Platzhalter)
/datenschutz/           Datenschutz (Rechtstext-Platzhalter)
/404.html               Fehlerseite
/transparenz/           OPTIONAL, Phase 2: Transparenz & Mittelverwendung
                        (vorbereitet im Blueprint, erst mit echten Zahlen veröffentlichen)
```

Nicht in der Sitemap: „Kundenstimmen". Eine Sektion **„Wirkung und Stimmen"** ist als Block-Vorlage im WordPress-Blueprint vorbereitet und wird erst mit echten, freigegebenen Inhalten aktiviert.

## 2. Hauptnavigation (max. 6 Punkte + CTA)

1. Über uns
2. Projekte
3. Aktuelles (Dropdown-frei; Veranstaltungen als Unterpunkt im Footer + Querverlinkung auf der Seite)
4. Mitmachen
5. Kontakt
6. Button **„Jetzt helfen"** → /spenden/

Begründung: Veranstaltungen erhalten keinen eigenen Header-Punkt, solange keine echten Termine vorliegen; die Seite existiert, ist über Footer, Aktuelles und interne Links erreichbar und rückt bei Bedarf in den Header (eine Zeile in `src/data/navigation.json`).

## 3. Nutzerwege (Top-Tasks)

| Persona | Einstieg | Weg | Ziel |
| --- | --- | --- | --- |
| Privater Spender | Startseite / Google | Hero → Vertrauensleiste → Schwerpunktprojekt → /spenden/ | IBAN kopieren / später Zahlungsdienst |
| Skeptischer Spender | Startseite | „Über uns" → Vorstand + Register → „So wirkt Unterstützung" → /spenden/ | Vertrauen, dann Spende |
| Ehrenamtliche:r | Startseite / Mitmachen | Mitmachen → Formen der Hilfe → Kontaktformular (Anliegen „Ehrenamt") | Kontaktaufnahme |
| Unternehmen | Über uns / Mitmachen | Mitmachen → „Als Unternehmen unterstützen" → Kontakt | Anfrage |
| Mitglied/Unterstützer | Aktuelles | Aktuelles → Beitrag/Projekt-Update | Information |
| Presse/Öffentlichkeit | Über uns | Vorstand, Registerdaten, Kontakt | belastbare Fakten |
| Ältere Besucher | beliebig | große Schrift, hohe Kontraste, einfache Navigation, Telefon (sobald bestätigt) | jede Aufgabe ohne Hürden |
| Suchmaschine | sitemap.xml | strukturierte Daten (NGO, BreadcrumbList), saubere Titel | Indexierung |
| WP-Redaktion | Backend | CPTs + Blöcke mit klaren Namen, keine Verschachtelung | Pflege ohne Code |

## 4. Seitenziele & primäre Handlung pro Seite

| Seite | Primäres Ziel | Primäre Handlung |
| --- | --- | --- |
| Startseite | Vertrauen + Orientierung in < 10 s | „Projekte ansehen" / „Jetzt helfen" |
| Über uns | Glaubwürdigkeit (Menschen + Register) | Kontakt / Spenden |
| Projekte | Konkretheit der Arbeit zeigen | Projekt öffnen |
| Projektseite | Ein Projekt nachvollziehbar machen | projektbezogen unterstützen |
| Aktuelles | Lebendigkeit, Rechenschaft | Beitrag lesen |
| Veranstaltungen | Beteiligung ermöglichen | Termin ansehen / Kontakt |
| Spenden | Spende so einfach wie möglich | IBAN kopieren / Kontakt bei Fragen |
| Mitmachen | Hürde für Engagement senken | Kontaktformular mit Anliegen |
| Kontakt | Erreichbarkeit beweisen | Formular absenden |

## 5. Content-Typen (Kurzfassung — Details in /wordpress-blueprint/content-model.md)

- **Projekt** (`lc_project`) — Kernstück; Felder u. a. Status, Region, Thema, Ausgangslage, Ziel, Fortschritt, Updates, Nachweise.
- **Beitrag** (nativ `post`) — Kategorien: Neuigkeit, Rückblick, Projekt-Update, Pressemitteilung.
- **Veranstaltung** (`lc_event`) — Start/Ende, Ort, Art, Anmeldung; vergangene Termine automatisch als „Rückblick".
- **Team** (`lc_team`) — Name, Rolle, Porträt, persönlicher Satz, Freigabe-Feld.
- **Partner** (`lc_partner`) — Name, Logo, Link, Freigabe-Feld.
- **Stimme** (`lc_voice`, optional) — Zitat, Person, Kontext, Freigabe-Feld; ohne Freigabe nie ausgespielt.
- **Globale Einstellungen** — Vereins- und Kontaktdaten, Register, Bank, CTAs (in der Vorabversion: `src/data/site.json`).

## 6. Leerzustands-Prinzip

Jede dynamische Liste hat einen redaktionell formulierten, ehrlichen Leerzustand (z. B. Veranstaltungen: „Aktuell ist kein öffentlicher Termin geplant …" + Kontakt-CTA). Leere Felder eines Inhaltstyps werden im Template übersprungen, nie als leere Blöcke gerendert.

# Content-Status — Living Charity e. V. (v2)

Zentrale Inhaltsübersicht in drei Kategorien. Regel des Briefings: Im
sichtbaren Frontend erscheinen keine Warnhinweise — der Status wird hier und
in `/docs/launch-blockers.md` (LB-Nummern) geführt, maschinenlesbar über
`status`-Felder in `src/data/*.json`.

Stand: 18.07.2026 · Pflege: bei jeder Inhaltsänderung aktualisieren.

---

## Kategorie A — Bestätigt

| Inhalt | Quelle | Verwendung |
| --- | --- | --- |
| Vereinsname, Rechtsform | Briefing + Register | überall |
| Amtsgericht Köln, VR 16395, eingetragen 16.06.2010 | öffentliche Registerquellen (Q4–Q6) | Trust-Strip, Über uns, Impressum, Transparenz, NGO-Schema |
| Vorsitzender N. Sivananthan, Schatzmeister O. Thanapalasingham | Website + Register | Über uns, Startseite, Impressum |
| Kurzbeschreibung, Mission, Sri-Lanka-Einleitung, Transparenztext | Briefing (verbindlich freigegeben) | Startseite, Unsere Arbeit, Sri Lanka, Über uns, Transparenz |
| 5-Euro-Claim als zitierte fremde Aussage inkl. Quellenlink | öffentlicher Spendenaufruf (Q3) | Impact-Modul (3 Seiten) — exakte Formulierungsregeln in confirmed-data.md |
| Logo (Herz aus zwei Händen, Rot #B50000 / Schwarz #161616) | Originaldatei vom Auftraggeber (18.07.2026) | Header, Footer, Favicon, OG-Bild; Farbwelt der Website daraus abgeleitet |

## Kategorie B — Verwendet, aber vor Livegang zu bestätigen (`confirmation-required`)

| Inhalt | LB | Verwendung |
| --- | --- | --- |
| Anschrift Kölner Straße 64, 51702 Bergneustadt | LB-07 | Footer, Kontakt, Impressum |
| E-Mail info@livingcharity.de (Postfach aktiv?) | LB-07 | überall |
| Schriftführer S. Sathianandan | LB-07 | Über uns, Impressum |
| Bankverbindung (IBAN/BIC/Bank) | LB-03 | nur Spendenseite |
| Zweiter Missionsabsatz | LB-12 | Startseite, Unsere Arbeit |
| Transparenz-Ablauf (5 Schritte) | LB-13 | Startseite, Transparenz |
| Spendenbescheinigungs-Hinweis | LB-15 | Spenden, Über uns |
| Unterstützungsformen Sachspenden/Kooperation | LB-18 | Startseite |
| Wunschdomain www.livingcharity.de | LB-11 | Canonicals, Sitemap |
| Plant-Ceylon-Darstellung (als „In Prüfung" gekennzeichnet) | LB-04 | /plant-ceylon/, Startseite |

## Kategorie C — Vollständig fehlend (neutral gelöst, keine Fake-Inhalte)

| Inhalt | LB | Aktuelle Lösung im Frontend |
| --- | --- | --- |
| SVG-/Vektorfassung des Logos | LB-08 | hochauflösendes PNG-Original ist integriert (18.07.2026); Vektor für Druck/Skalierung nachreichen |
| Dokumentarische Fotos (Hero, Projekte, Team) | LB-09 | „Originale Projektaufnahme wird ergänzt." + Badge „Platzhalter"; Team: Initialen |
| Echte Hilfsaktions-Daten (Projekt-Komponente) | — | Leerlösung „Aktuelle Hilfsaktion wird dokumentiert" (Briefing-Wortlaut) |
| Beiträge/Berichte | — | Leerlösung „Neue Einblicke und Projektberichte werden derzeit vorbereitet." |
| Telefonnummer | LB-17 | nicht angezeigt (kein erfundener Wert); Click-to-Call vorbereitet |
| Impressums-/Datenschutz-Volltexte | LB-01/02 | neutrale „wird vorbereitet"-Absätze + interne Kommentar-Marker |
| Formular-Backend | LB-06 | Client-Validierung + Weiterleitung /danke/ mit ehrlichem Hinweis |
| Girocode-QR | LB-16 | reservierte Fläche mit neutraler Beschriftung |
| Veranstaltungen | — | kein Seitenbereich mehr (neue Sitemap); CPT im Blueprint vorbereitet |

## Verbotene Altdaten (dürfen nie wieder auftauchen — technisch erzwungen)

34 Projekte · 13.000 unterstützte Menschen · 348 Unterstützer ·
5.000+ Unterstützer · 8 Veranstaltungen · 400 organisierte Veranstaltungen ·
„Sommerfest der Solidarität" · „Benefiz-Konzert für Kinder" ·
„Charity-Lauf für Gesundheit" · „Kreativ-Workshop für Helfer".
`node src/utils/check.mjs` schlägt fehl, sobald einer dieser Werte im Build
auftaucht (sichtbar oder versteckt).

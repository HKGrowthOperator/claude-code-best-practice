# Launch-Blocker — Living Charity e. V.

Interne Freigabeliste. Regel des Briefings: Im sichtbaren Frontend erscheinen
**keine Warnhinweise**; alle unbestätigten Angaben werden hier geführt.
Livegang erst, wenn jeder Blocker (LB) aufgelöst oder bewusst durch den
Auftraggeber freigegeben ist.

## Harte Blocker (ohne Lösung kein Livegang)

| Nr. | Blocker | Betroffene Stellen | Auflösung durch |
| --- | --- | --- | --- |
| LB-01 | Impressum: Volltext fehlt (Verantwortlicher § 18 MStV, Haftung/Urheberrecht) — Rechtstext durch Auftraggeber bereitstellen und rechtlich prüfen lassen | /impressum/ | Verein + juristische Prüfung |
| LB-02 | Datenschutzerklärung: Volltext fehlt (Rechtsgrundlagen, Speicherdauern, Betroffenenrechte, Hosting) | /datenschutz/ | Verein + juristische Prüfung |
| LB-03 | Bankverbindung gegen Kontoauszug bestätigen (IBAN mod-97 gültig, dennoch zwingend) | /spenden/ (Donation Panel) | Verein |
| LB-04 | Plant Ceylon: rechtliche/finanzielle Zuordnung ungeklärt — vollständige Prüfliste in /content/plant-ceylon-verification.md; bis dahin Badge „In Prüfung" + Transparenz-Zusatz | /plant-ceylon/, Startseite | Verein / Betreiber |
| LB-05 | 5-Euro-Claim: schriftliche Freigabe von Dr. Umes Arunagirinathan für die zitierte Verwendung einholen (öffentliche Quelle ist verlinkt, Freigabe ist Empfehlung des Briefings) | Impact-Modul (3 Seiten) | Auftraggeber |
| LB-06 | Kontaktformular: serverseitige Verarbeitung + Versand erst mit WordPress-Integration (bis dahin Weiterleitung auf /danke/ mit ehrlichem Hinweis) | /kontakt/ | WP-Integration |
| LB-07 | Anschrift, E-Mail-Postfach und Schriftführer-Angabe bestätigen | Footer, Kontakt, Impressum, Über uns | Verein |
| LB-08 | Logo: hochauflösendes Original (Herz-Hände, Rot/Schwarz) liegt vor und ist integriert (PNG, Farben gesampelt: #B50000/#161616); noch offen: SVG-/Vektordatei für perfekte Skalierung + formale Farbfreigabe | Header, Footer, Favicon, OG-Bild | Verein |
| LB-09 | Hero-/Projektbilder: drei dokumentarische Sri-Lanka-Fotos vom Auftraggeber übergeben und integriert (18.07.2026); Plant-Ceylon-Flächen weiter ohne Bild | Startseite, /sri-lanka/, /unsere-arbeit/, /projekte/ | teilerledigt — Rest siehe LB-21 |
| LB-10 | robots.txt steht auf Disallow (Vorabversion) — vor Livegang freischalten | /robots.txt | Umsetzung bei Livegang |
| LB-11 | Wunschdomain bestätigen (Canonical-Basis derzeit www.livingcharity.de) | alle Canonicals, sitemap.xml | Verein |

## Weiche Blocker (Freigabe oder kurzfristige Nachlieferung)

| Nr. | Punkt | Betroffene Stellen |
| --- | --- | --- |
| LB-12 | Zweiter Missionsabsatz („Unser Ziel ist es, Hilfsbedarf sichtbar zu machen …") inhaltlich freigeben | Startseite, /unsere-arbeit/ |
| LB-13 | Transparenz-Ablauf (5 Schritte) als tatsächliche Arbeitsweise bestätigen (`confirmationRequired: true`) | Startseite, /transparenz/ |
| LB-14 | Dritter Sri-Lanka-Wirkungspunkt „Langfristige Projekte vor Ort" erst aktivieren, wenn belegt (derzeit ausgeblendet) | Startseite, /sri-lanka/ |
| LB-15 | Spendenbescheinigungs-Formulierung („auf Anfrage über info@…") bestätigen | /spenden/, /ueber-uns/ |
| LB-16 | QR-Überweisung (Girocode) aktivieren — erst nach LB-03 | /spenden/ |
| LB-17 | Telefonnummer nachreichen → Click-to-Call + Footer-Zeile aktivieren (vorbereitet) | Footer, /kontakt/ |
| LB-18 | Nicht bestätigte Unterstützungsformen (Sachspenden, Unternehmens-Kooperation) bestätigen oder entfernen | Startseite „Möglichkeiten zu helfen" |
| LB-19 | ~~erledigt 18.07.2026~~ OG-Bild liegt als PNG 1200×630 mit echtem Logo vor (assets/img/og-default.png); optional später mit dokumentarischem Foto verfeinern | Meta aller Seiten |
| LB-20 | Externe Freigabe-/AV-Themen des Hostings klären (Server-Logs für Datenschutzerklärung) | /datenschutz/ |
| LB-21 | Bildrechte der drei übergebenen Sri-Lanka-Fotos dokumentieren: Urheber/Quelle, Nutzungslizenz und Einwilligungen der abgebildeten Personen (darunter Kinder). Die Fotos stammen von der bisherigen Website (livingcharityev-…live-website.com); Herkunft ungeklärt. Bis zur Klärung neutrale Bildunterschrift „dokumentarische Aufnahme" ohne Projektzuordnung; EXIF-Daten wurden entfernt | Startseite, /sri-lanka/, /unsere-arbeit/, /projekte/ |

## Prüfmechanik

- `node src/utils/check.mjs` erzwingt: keine sichtbaren Marker, keine
  verbotenen Altzahlen/Demo-Events, keine KI-Bildquellen (ChatGPT_Image /
  plantceylon-CDN), externe Links mit `target="_blank" rel="noopener"`.
- Interne Notizen zu LB-01/LB-02 stehen als HTML-Kommentare in den Rechtsseiten
  und werden vom Skript gezählt, aber nicht im Frontend angezeigt.
- Statusfelder `confirmation-required` in `src/data/*.json` sind die
  maschinenlesbare Fassung dieser Liste.

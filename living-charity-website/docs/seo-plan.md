# SEO-Plan — Living Charity e. V. (v2)

Canonical-Basis (zu bestätigen, LB-11): `https://www.livingcharity.de`
Vorabversion: `robots.txt` blockiert Indexierung absichtlich (LB-10; Vorlage
zum Freischalten steht als Kommentar in der Datei).

## Technische Grundeinrichtung (umgesetzt)

- individuelle Titles/Descriptions je Seite (META-Block je Seitendatei)
- Canonicals, Open Graph (og:locale de_DE), Social-Preview-Bild
- `sitemap.xml` aus dem Build (nur indexierbare Seiten); `noindex` für
  /danke/, /suche/, Impressum, Datenschutz, dynamische Vorlagen
- strukturierte Daten: `NGO` (Name, Anschrift, E-Mail, Register-Kennung,
  foundingDate 2010-06-16) auf allen Seiten; `BreadcrumbList` auf Unterseiten
- **bewusst nicht**: Review-Sterne, erfundene Bewertungen, Event-Daten,
  Wirkungszahlen; `Article`-Schema folgt mit echten Beiträgen,
  `Event`-Schema nur für echte Veranstaltungen, `ContactPoint` erst mit
  bestätigter Telefonnummer
- saubere URL-Struktur, sprechende Slugs, konsistente NAP-Daten aus site.json
- Ladezeit: keine Third-Party-Requests, Font-Preload, Inline-SVG above the fold

## Keyword-Plan je Seite

| Seite | Fokus-Keyword | Suchintention | H1 | Sekundäre Themen | Interne Links | Benötigte Inhalte |
| --- | --- | --- | --- | --- | --- | --- |
| Startseite | living charity e.v. | navigational | Hilfe, die Menschen direkt erreicht. | verein bergneustadt, sri lanka spenden | Sri Lanka, Spenden, Unsere Arbeit, Projekte | echte Fotos (LB-09) |
| Unsere Arbeit | living charity verein arbeit | informational | Aus Unterstützung wird konkrete Hilfe | notlagenhilfe, transparenz | Sri Lanka, Transparenz, Spenden | LB-12-Freigabe |
| Sri Lanka | sri lanka spenden flutopfer | informational/transactional | Unterstützung für Menschen in Sri Lanka | flutopfer sri lanka helfen, lebensmittelhilfe | Spenden, Plant Ceylon, Kontakt | Aktionsdaten, Fotos |
| Projekte | hilfsprojekte living charity | informational | Woran wir arbeiten | projektstatus, spendenzwecke | Projektseiten, Spenden | echte Projektdaten |
| Plant Ceylon | plant ceylon baum pflanzen sri lanka | informational/transactional | Einen Baum pflanzen. Wirkung sichtbar machen. | baum verschenken, mangobaum pflanzen | Spenden, Kontakt, externe Projektseite | LB-04-Klärung |
| Spenden | living charity spenden | transactional | Ihre Unterstützung kann direkt helfen. | spendenkonto IBAN, sri lanka spende | Projekte, Transparenz, Kontakt | LB-03, LB-15, LB-16 |
| Über uns | living charity bergneustadt vorstand | informational | Ein Verein, der ansprechbar ist | vereinsregister VR 16395 | Unsere Arbeit, Kontakt | Porträts (LB-09) |
| Aktuelles | living charity aktuelles | navigational | Berichte aus der Vereinsarbeit | projektberichte | Beiträge, Kontakt | echte Beiträge |
| Kontakt | living charity kontakt | navigational | Fragen zu Projekten oder Spenden? | anfahrt bergneustadt | Datenschutz, Spenden | Telefon (LB-17) |
| Transparenz | living charity transparenz mittelverwendung | informational | Nachvollziehbare Hilfe als Anspruch | spenden nachweis | Projekte, Spenden | LB-13-Freigabe |

## Redaktionsregeln

1. Ein Fokus-Keyword pro Seite; Title ≤ 60 Zeichen; Description 140–160
   Zeichen mit konkretem Nutzen.
2. Zahlen in Snippets nur mit Beleg; der 5-€-Claim erscheint in Descriptions
   nur mit Zuschreibung („nach Angaben des Spendenaufrufs").
3. Neue Projektseiten verlinken: Spenden (Zweck), thematisch nächstes
   Projekt, einen Bericht.
4. Bilder: sprechende Dateinamen, beschreibende Alt-Texte, keine
   Keyword-Ketten.
5. Nach Livegang: Search Console + Bing einrichten, Sitemap einreichen;
   Vorschau-Domain (live-website.com) 301/stilllegen — sie darf nicht
   indexiert bleiben.

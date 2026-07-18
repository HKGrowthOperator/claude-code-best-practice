# SEO-Plan — Living Charity e. V.

Canonical-Basis (zu bestätigen): `https://www.livingcharity.de`
Vorabversion: `robots.txt` blockiert Indexierung absichtlich. Vor Livegang auf
`Allow: /` + Sitemap-Zeile umstellen (Vorlage steht als Kommentar in der Datei).

## Technische Grundeinrichtung (umgesetzt)

- eindeutige Title/Description je Seite (META-Block je Seitendatei)
- Canonical-URLs, `og:*`-Tags, `og:locale de_DE`, Social-Preview-Bild
- `sitemap.xml` automatisch aus dem Build (nur indexierbare Seiten)
- strukturierte Daten: `NGO` (Name, Anschrift, E-Mail, Register-Kennung, Gründungsjahr) auf allen Seiten; `BreadcrumbList` auf Unterseiten
- **bewusst keine** strukturierten Daten für Bewertungen, Spendensummen, Wirkungszahlen oder Events (erst mit echten Daten; Event-Schema in der Veranstaltungsvorlage vorgesehen)
- saubere URL-Struktur (`/projekte/<slug>/`), sprechende Slugs, keine Parameter
- Impressum/Datenschutz/Vorlagen: `noindex,follow`
- Ladezeit: keine Third-Party-Requests, Fonts preloaded, Inline-SVG above the fold

## Keyword-Plan je Seite

| Seite | Fokus-Keyword | Suchintention | H1 | Sekundäre Themen | Interne Links (aus der Seite heraus) | Benötigte Inhalte |
| --- | --- | --- | --- | --- | --- | --- |
| Startseite | living charity e.v. | navigational/informational | Hilfe, die dort ankommt, wo sie gebraucht wird. | verein bergneustadt, spenden, helfen | Projekte, Spenden, Über uns, Mitmachen | Satzungszweck für präzise Description |
| Über uns | living charity verein bergneustadt | informational (Vertrauen) | Ein Verein, der ansprechbar ist | vorstand, vereinsregister VR 16395, gemeinnützig (erst nach Beleg) | Projekte, Kontakt, Spenden | Vorstandsfreigaben, Satzungszweck, Vereinsgeschichte |
| Projekte | hilfsprojekte living charity | informational | Woran wir arbeiten | projektorte, projektstatus | Projektseiten, Spenden | echte Projektliste |
| Projektseite (Vorlage) | <projektname> + ort | informational/transactional | Projekttitel | spenden für <thema>, <region> | Spenden, Kontakt, Projekte | vollständige Projektdaten |
| Aktuelles | living charity aktuelles | navigational | Neues aus dem Verein | neuigkeiten, rückblicke | Beiträge, Veranstaltungen | echte Beiträge |
| Veranstaltungen | living charity veranstaltungen bergneustadt | informational/lokal | Termine & Rückblicke | benefiz, sammelaktion, oberbergischer kreis | Mitmachen (#aktion), Kontakt | echte Termine |
| Spenden | living charity spenden | transactional | Ihre Spende, nachvollziehbar eingesetzt | spendenkonto, IBAN, spendenbescheinigung (erst nach Beleg) | Projekte, Kontakt, Mitmachen | Verwendungszwecke, Gemeinnützigkeitsangaben |
| Mitmachen | ehrenamt bergneustadt / living charity helfen | transactional | Helfen kann viele Formen haben | sachspenden, unternehmensspende, eigene aktion | Kontakt (mit Anliegen-Parameter), Spenden | bestätigte Unterstützungsformen |
| Kontakt | living charity kontakt | navigational | Wir sind ansprechbar | anfahrt bergneustadt, telefonnummer (nach Bestätigung) | Datenschutz, Spenden | Telefonnummer |

## Redaktionsregeln

1. Ein Fokus-Keyword pro Seite; Title ≤ 60 Zeichen, Description 140–160 Zeichen mit konkretem Nutzen.
2. Zahlen in Titles/Descriptions nur, wenn belegt (derzeit: keine).
3. Jede neue Projektseite verlinkt: Spendenseite (Verwendungszweck), thematisch nächstes Projekt, einen Beitrag.
4. Bilder: sprechende Dateinamen (`projekt-<slug>-<motiv>.webp`), Alt-Texte beschreiben das Motiv, nicht das Keyword.
5. Konsistenz: Name, Anschrift, E-Mail überall identisch aus den globalen Einstellungen (NAP-Konsistenz) — nie hart eintippen.
6. Nach Livegang: Google Search Console + Bing Webmaster einrichten, Sitemap einreichen; alte Vorschau-URL (live-website.com) darf nie indexiert bleiben (dort 301 oder noindex sicherstellen).

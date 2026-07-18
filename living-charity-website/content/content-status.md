# Content-Status — Living Charity e. V.

Zentrale Übersicht aller Inhalte der neuen Website, sortiert nach Verlässlichkeit.
Regel: **Kein Inhalt aus Kategorie B oder C darf im Livegang als Tatsache erscheinen.**

Stand: 18.07.2026 · Pflege: bei jeder Inhaltsänderung aktualisieren.

---

## Kategorie A — Bestätigt (vom Auftraggeber übergeben, vor Livegang noch einmal gegenzuprüfen)

| Inhalt | Wert | Verwendung auf der Website | Vor Livegang |
| --- | --- | --- | --- |
| Vereinsname | Living Charity e. V. | überall | bestätigen |
| Registergericht | Amtsgericht Köln | Footer, Impressum, Vertrauensleiste | bestätigen |
| Registernummer | VR 16395 | Footer, Impressum, Vertrauensleiste | bestätigen |
| Gründung/Eintragung | 2010 | Vertrauensleiste, Über uns | bestätigen (Eintragungsdatum lt. Registerauszug) |
| Anschrift | Kölner Straße 64, 51702 Bergneustadt | Footer, Kontakt, Impressum | bestätigen |
| E-Mail | info@livingcharity.de | Footer, Kontakt, Spenden | bestätigen (Postfach aktiv?) |
| Vorsitzender | Navaratnam Sivananthan | Über uns (Vorstand) | bestätigen (Schreibweise, Freigabe) |
| Schatzmeister | Ordin Thanapalasingham | Über uns (Vorstand) | bestätigen (Schreibweise, Freigabe) |
| Schriftführer | Seevaratnam Sathianandan | Über uns (Vorstand) | bestätigen (Schreibweise, Freigabe) |
| Bank | Sparkasse Gummersbach-Bergneustadt | Spendenseite | bestätigen |
| IBAN | DE18 3845 0000 1000 2149 63 | nur Spendenseite | **zwingend vom Verein gegen Kontoauszug prüfen** (Prüfsummen-Check bestanden, ersetzt keine Bestätigung) |
| BIC | WELADED1GMB | nur Spendenseite | bestätigen |

## Kategorie B — Öffentlich recherchiert, aber unbelegt (zu bestätigen oder zu streichen)

| Inhalt | Quelle | Bewertung | Entscheidung nötig |
| --- | --- | --- | --- |
| „über 13.000 Menschen geholfen" | Altseite (Suchindex) | rundes Zähler-Widget, keine Quelle, möglicher Template-Rest | Beleg (Zeitraum, Zählweise) oder streichen |
| „über 5.000 Unterstützer" | Altseite (Suchindex) | wie oben | Beleg oder streichen |
| „400 Veranstaltungen organisiert" | Altseite (Suchindex) | wie oben; steht im Widerspruch dazu, dass keine einzige konkrete Veranstaltung auffindbar ist | Beleg oder streichen |
| „setzt sich mit Hingabe für Menschen in Not ein" | Altseite | generisch; als Tonalität ok, ersetzt keinen Satzungszweck | durch Satzungszweck ersetzen |
| Tätigkeitsschwerpunkt/Region (z. B. Auslandshilfe) | nicht belegbar | aus öffentlichen Quellen NICHT ableitbar; es wurden bewusst keine Länder/Orte angenommen | Auftraggeber muss Projektorte liefern |

**Keiner dieser Punkte ist in der Vorabversion sichtbar als Tatsache verbaut.**

## Kategorie C — Vollständig fehlend (im Frontend mit Markern versehen)

Marker im sichtbaren Entwurf: `[INHALT VON LIVING CHARITY ERFORDERLICH]` bzw. `[BITTE DURCH DEN AUFTRAGGEBER BESTÄTIGEN]`.

| Inhalt | Betroffene Seiten/Komponenten |
| --- | --- |
| Satzungszweck (wörtlich oder redaktionell freigegeben) | Startseite (Hero-Unterzeile, „Was Living Charity tut"), Über uns, SEO-Descriptions |
| Logo (SVG/Druckdaten) + verbindliche Farbwerte | Header, Footer, Favicon, Designsystem-Tokens |
| Echte Projekte (Titel, Ort, Ausgangslage, Ziel, Stand, Bilder) | Projekte, Projekt-Template, Startseite Schwerpunktprojekt |
| Ablauf der Mittelverwendung (5 Schritte) | Startseite „So wirkt Unterstützung", Spenden — als Entwurf enthalten, **zu bestätigen** |
| Telefonnummer | Kontakt (Click-to-Call vorbereitet, deaktiviert), Footer |
| Gemeinnützigkeitsstatus, Freistellungsbescheid, Spendenbescheinigungen | Spenden (Sektion vorbereitet, ausgeblendet bis bestätigt) |
| Verwendungszweck-Vorgaben für Überweisungen | Spenden |
| Zahlungs-/Spendendienstleister | Spenden (DonationProvider-Schnittstelle vorbereitet) |
| Veranstaltungen (aktuell + vergangen) | Veranstaltungen (ehrlicher Leerzustand aktiv) |
| Beiträge/Neuigkeiten | Aktuelles (ehrlicher Leerzustand aktiv) |
| Vorstands-Porträtfotos + persönliche Sätze + Freigaben | Über uns |
| Partner/Sponsoren mit Logo-Freigaben | Mitmachen, optional Startseite |
| Freigegebene Stimmen/Erfahrungen | Sektion „Wirkung und Stimmen" — **nicht veröffentlicht**, nur als Vorlage im Blueprint |
| Social-Media-Profile (verifiziert) | Footer (ausgeblendet) |
| Impressum (Volltext) | Impressum — `[RECHTSTEXT DURCH AUFTRAGGEBER BEREITZUSTELLEN UND RECHTLICH PRÜFEN LASSEN]` |
| Datenschutzerklärung (Volltext) | Datenschutz — gleicher Marker |
| Wunschdomain | SEO (Canonical-Platzhalter `https://www.livingcharity.de` — **zu bestätigen**, Domain-Inhaberschaft prüfen) |
| Bildmaterial mit Rechten/Einwilligungen | alle Bildflächen (siehe /content/image-requirements.md) |

---

## Arbeitsregeln

1. Wird ein Inhalt bestätigt: Eintrag nach Kategorie A verschieben, Marker im Code entfernen, Datum notieren.
2. Wird ein Inhalt verworfen: Komponente über den vorgesehenen Leerzustand deaktivieren (kein leerer Block im Frontend).
3. Vor Livegang: `node src/utils/check.mjs` ausführen — das Skript listet alle noch im Build enthaltenen Marker auf. Livegang erst bei null sichtbaren Markern (außerhalb dieses Ordners).

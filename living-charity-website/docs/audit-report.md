# Research-Audit der bestehenden Website

Projekt: Neue Website für Living Charity e. V.
Datum des Audits: 18.07.2026
Geprüfte Quelle: https://livingcharityev-rzk0p1pm97.live-website.com/

## 1. Wichtiger Hinweis zur Prüfbarkeit

Die Vorschau-Domain `live-website.com` (Hosting-Vorschau, vermutlich Hostinger-Website-Builder oder WordPress-Staging) wird von der Netzwerk-Richtlinie der Entwicklungsumgebung blockiert (HTTP 403 auf Proxy-Ebene, Policy-Denial). Ein vollständiger Seitenabruf, Screenshots, Lighthouse-Messungen und ein Crawl der Unterseiten waren aus dieser Umgebung heraus **nicht möglich**.

Der Audit stützt sich daher auf:

1. Suchmaschinen-Snippets der Startseite (Titel, Beschreibungstexte, indexierte Inhalte),
2. öffentliche Registerquellen (Vereinsregister-Verzeichnisse, u. a. Northdata zu „Living Charity e. V., Amtsgericht Köln VR 16395"),
3. die vom Auftraggeber übergebenen Grunddaten.

Alle Punkte, die nur am Live-System prüfbar sind (mobile Darstellung, Ladezeit, Formulare, Konsolen-Fehler der Altseite), sind unten als **offen** gekennzeichnet und in `/docs/qa-report.md` unter „Offene Punkte" gelistet. Sie ändern nichts am Vorgehen: Die Altseite dient ausschließlich als Informationsquelle, nicht als Designreferenz.

## 2. Erfasste Inhalte der bestehenden Website

### 2.1 Bestätigbare bzw. plausible Angaben (mit Registerquellen deckungsgleich)

| Angabe | Quelle | Status |
| --- | --- | --- |
| Vereinsname „Living Charity e. V." | Altseite `<title>`, Registerverzeichnis | deckungsgleich mit Auftraggeber-Daten |
| Amtsgericht Köln, VR 16395 | Registerverzeichnis (Northdata) | deckungsgleich |
| Anschrift Kölner Str. 64, 51702 Bergneustadt | Altseite, Registerverzeichnis | deckungsgleich |
| E-Mail info@livingcharity.de | Altseite | vom Auftraggeber bestätigt zu prüfen |
| „seit 2010" aktiv | Altseite („Pionier in Engagement und Hilfsbereitschaft seit 2010") | plausibel, mit Gründungsangabe des Auftraggebers konsistent |
| Vorsitzender Navaratnam Sivananthan | Auftraggeber-Daten | vor Livegang bestätigen |

### 2.2 Nicht belegte bzw. widersprüchliche Angaben der Altseite

Die indexierte Startseite der Altseite enthält folgende Wirkungszahlen **ohne erkennbare Quelle oder Bezugszeitraum**:

- „über 13.000 Menschen geholfen"
- „über 5.000 Unterstützer"
- „400 Veranstaltungen organisiert"

Bewertung: Diese Zahlenkombination entspricht dem typischen Muster vorgefertigter Charity-Templates (drei runde Kennzahlen im Zähler-Widget). Ob es sich um echte Vereinszahlen oder um nicht ersetzte Template-Beispielwerte handelt, ist **nicht feststellbar**. Die Zahlen werden in der neuen Website **nicht** übernommen. Sie sind in `/content/content-status.md` als „öffentlich sichtbar, aber unbelegt — durch Auftraggeber zu bestätigen oder zu streichen" geführt.

Ebenfalls dem Template-Muster zuzuordnen (Formulierung generisch, kein konkreter Orts-, Zeit- oder Projektbezug in den indexierten Texten):

- Slogan-artige Aussagen („Spenden Sie Hoffnung", „setzt sich mit Hingabe für Menschen in Not ein")
- keine indexierten konkreten Projektnamen, Projektorte oder Länder
- keine indexierten Veranstaltungen mit Datum

### 2.3 Nicht auffindbar (weder Altseite-Snippets noch öffentliche Quellen)

- konkreter Satzungszweck / Tätigkeitsfelder
- Projektliste mit Orten und Zeiträumen
- Gemeinnützigkeitsstatus / Freistellungsbescheid
- Telefonnummer
- Social-Media-Profile
- Partner, Sponsoren, Presseberichte
- Fotos mit dokumentierten Bildrechten

## 3. Bewertung der Altseite

### 3.1 Glaubwürdigkeit

- **Kritisch:** Unbelegte Wirkungszahlen im Zähler-Format wirken auf informierte Spender wie Template-Reste und beschädigen Vertrauen mehr, als sie aufbauen.
- **Kritisch:** Ohne konkrete Projekte, Orte und Ansprechpersonen bleibt die zentrale Spenderfrage („Wohin fließt mein Geld?") unbeantwortet.
- Positiv: Registerdaten und Anschrift sind öffentlich konsistent — eine gute Grundlage für eine ehrliche Vertrauensleiste.

### 3.2 Struktur und Conversion (soweit erkennbar)

- Startseiten-Titel „Start – Living Charity e.V" ist SEO-schwach (kein Nutzenversprechen, kein Ort, kein Thema).
- Kein erkennbarer, klar priorisierter Spendenweg in den indexierten Inhalten.
- Vorschau-Domain ohne eigene Domain und ohne konsistente URL-Struktur — für SEO und Vertrauen ungeeignet (war aber erkennbar auch nur als Staging gedacht).

### 3.3 Technik (nur eingeschränkt prüfbar — offen)

Nicht messbar aus dieser Umgebung: Ladezeit, Core Web Vitals, mobile Darstellung, Barrierefreiheit, Formularverhalten, Cookie-/Consent-Verhalten, eingebundene Drittdienste. Diese Prüfungen sind vor Abschaltung der Altseite nicht erforderlich, da die neue Website ein vollständiger Neuaufbau ist.

## 4. Konsequenzen für den Neuaufbau

1. **Keine Übernahme** von Layout, Komponenten, Zählerwidgets oder Slogans der Altseite.
2. **Nur registerkonforme Fakten** werden sichtbar dargestellt (Verein, Register, Anschrift, Kontakt); alles andere trägt sichtbare Bestätigungsmarker.
3. Wirkungszahlen werden durch einen **nachvollziehbaren Ablauf der Mittelverwendung** ersetzt, bis belegte Zahlen vorliegen (siehe Startseite, Sektion „So wirkt Unterstützung" — als „mit Auftraggeber zu bestätigen" gekennzeichnet).
4. Projekt-, Beitrags- und Veranstaltungsvorlagen werden als **kontrollierte Templates ohne erfundene Beispieldaten** ausgeliefert.
5. Die Inhaltslücken sind vollständig in `/content/content-status.md` und `/content/client-checklist.md` dokumentiert.

---

## 5. Nachtrag 18.07.2026: Vollständige Sichtung per Screenshots des Auftraggebers

Der Auftraggeber hat 9 Screenshots der Altseite (iPad, 18.07.2026) übergeben.
Damit ist die unter Abschnitt 1 beschriebene Prüfbarkeitslücke weitgehend
geschlossen. Befunde:

### 5.1 Bestätigte Stammdaten (deckungsgleich mit unseren Daten)

Kontaktseite/Footer der Altseite zeigen: Kölner Str. 64, 51702 Bergneustadt ·
info@livingcharity.de · Sparkasse Gummersbach–Bergneustadt,
IBAN DE18384500001000214963, BIC WELADED1GMB · Vereinsregister des
Amtsgerichts Köln, VR16395 · Vorsitzender Navaratnam Sivananthan,
Schatzmeister Ordin Thanapalasingham, Schriftführer Seevaratnam Sathianandan.
→ Kategorie-B-Status („confirmation-required") bleibt formal bestehen, die
Quellenlage ist aber deutlich gefestigt.

### 5.2 Echte Bildmarke identifiziert

Die Altseite führt eine Bildmarke: dunkelgrüner Kreis mit weißen Wellenlinien,
Wortmarke „LIVING CHARITY E.V". In der Vorabversion ist die Marke jetzt als
**nachgezeichnete SVG-Näherung** hinterlegt (Header, Footer, Favicon, OG-Bild).
Original-Vektordatei und verbindliche Farbwerte bleiben angefordert (LB-08).

### 5.3 Bestätigte Template-Reste (nicht übernommen, per Denyliste gesperrt)

- Zähler-Sektion „Spenden für eine bessere Welt sammeln": „34 Projekte —
  halfen über 13.000 Menschen" · „348 Unterstützer — über 5.000 trugen bei" ·
  „8 Veranstaltungen — wir organisierten 400" (Widersprüche im Original belegt).
- Demo-Veranstaltungen mit Fantasiedaten: Sommerfest der Solidarität
  (12.06.2026), Benefiz-Konzert für Kinder (02.09.2026), Charity-Lauf für
  Gesundheit (10.11.2026), Kreativ-Workshop für Helfer (05.07.2026) — die
  Fotos sind erkennbar themenfremde Stockbilder (u. a. ein Demonstrations-
  foto als „Charity-Lauf", eine Mahnwache als „Benefiz-Konzert").
- Fake-Testimonial: Stock-Porträt mit Label „Living Charity — Gemeinnütziger
  Verein — Unser Engagement hat viele inspiriert."
- Hero-Slogan „Gemeinsam Hoffnung schenken" mit „Herzblut"-Text (Denyliste).
- Social-Icons (Instagram, Facebook, Twitter) ohne verifizierte Profile.
- Deutschlandflaggen-Grafik auf der Kontaktseite (Template-Rest ohne Bezug).
- Selbstbezeichnung „Gemeinnütziger Verein" — erst nach Vorlage des
  Freistellungsbescheids übernehmen (LB-15).

### 5.4 Verwertbares Material

Die Altseite enthält mehrere **echte dokumentarische Sri-Lanka-Fotografien**
(Familie vor Unterkunft, Trauerszene, Schulkinder; Hero-Foto einer Mutter mit
Kindern). Diese passen inhaltlich exakt zu unseren Bildflächen (H1, S1, P-Serie).
Vor Verwendung klären: Herkunft, Bildrechte, Einwilligungen der abgebildeten
Personen (siehe image-requirements.md; Aufnahme in client-checklist.md).

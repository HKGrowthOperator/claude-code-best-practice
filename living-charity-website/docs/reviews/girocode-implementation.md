# Girocode-Modul (EPC-QR) — Implementierungsbericht

**Datum:** 2026-07-18
**Modul:** `src/utils/girocode.mjs` (abhängigkeitsfrei, ES-Modul, Node + Browser)
**Test:** `src/utils/girocode.test.mjs` (`node src/utils/girocode.test.mjs`, Exit-Code ≠ 0 bei Fehlern)
**Status:** Implementiert und getestet — **NICHT in der UI aktiviert** (siehe Launch-Blocker unten).

## API

### `buildEpcPayload({ name, iban, bic, amount, purpose })`

Erzeugt den EPC069-12-Payload (Girocode) für SEPA-Überweisungen:

- Zeilenfolge: `BCD` (Service Tag) → `002` (Version) → `1` (Zeichensatz UTF-8) →
  `SCT` (Identification) → BIC → Name → IBAN → Betrag → Purpose-Code (leer) →
  strukturierte Referenz (leer) → Verwendungszweck (unstrukturiert).
- Zeilen mit `\n` getrennt, kein abschließender Zeilenumbruch, max. 331 Bytes gesamt.
- `name`: Pflicht, ≤ 70 Zeichen. `purpose`: optional, ≤ 140 Zeichen.
- `iban`: wird normalisiert (Leerzeichen entfernt, Großschreibung) und per
  Formatprüfung + ISO-13616-Mod-97 validiert.
- `amount`: optional; Zahl oder String (auch Kommaschreibweise `"25,00"`),
  0.01–999999999.99, Ausgabe als `EUR#.##` (z. B. `EUR5.00`). Ohne Betrag bleibt
  die Zeile leer — der Spender trägt den Betrag in der Banking-App selbst ein.
- Wirft bei jeder Limit-/Formatverletzung einen `Error` (kein stilles Kürzen).

### `qrMatrix(text)`

Vollständiger QR-Encoder ohne Abhängigkeiten. Rückgabe: quadratisches 2D-Array
aus `0` (hell) / `1` (dunkel).

- Byte-Modus (UTF-8), Fehlerkorrektur-Level **M** (Girocode-Standard).
- Automatische Versionswahl, Versionen 1–10 (bis 213 Bytes; der maximale
  EPC-Payload von 331 Bytes tritt bei unseren Daten nie auf — der reale Payload
  liegt bei ~100 Bytes, Version 6).
- Reed-Solomon-Fehlerkorrektur über GF(256) (Polynom 0x11D) inkl. Block-Splitting
  und Interleaving nach Norm-Tabelle.
- Alle 8 Maskenmuster mit Penalty-Bewertung (Regeln N1–N4), beste Maske gewinnt.
- Format-Bits (BCH 15,5 + XOR 0x5412) und Versions-Bits (BCH 18,6, ab Version 7).

### `qrSvg(text, { moduleSize = 4, quietZone = 4 })`

Rendert `qrMatrix(text)` als eigenständigen SVG-String: schwarze Module auf
weißem Grund, Quiet Zone standardmäßig 4 Module (Norm), `shape-rendering:
crispEdges` gegen Antialiasing-Artefakte beim Scannen. Kein DOM nötig — der
String kann serverseitig ins HTML eingebettet oder im Browser per
`innerHTML`/`data:`-URL verwendet werden.

## Testresultate

Testlauf vom 2026-07-18 (`node src/utils/girocode.test.mjs`, Exit-Code 0),
Roundtrip mit echten Vereinsdaten aus `src/data/site.json` (Empfänger
„Living Charity e. V.", IBAN DE18384500001000214963, BIC WELADED1GMB,
Verwendungszweck „Spende Living Charity", einmal ohne Betrag, einmal mit 5 €):

```
[1] Payload-Struktur (EPC069-12)
  ok      11 Zeilen ohne abschliessenden Zeilenumbruch
  ok      Zeile 1: Service Tag 'BCD'
  ok      Zeile 2: Version '002'
  ok      Zeile 3: Zeichensatz '1' (UTF-8)
  ok      Zeile 4: Identification 'SCT'
  ok      Zeile 5: BIC WELADED1GMB
  ok      Zeile 6: Empfaenger 'Living Charity e. V.'
  ok      Zeile 7: IBAN normalisiert (ohne Leerzeichen)
  ok      Zeile 8: Betrag leer (kein Betrag angegeben)
  ok      Zeile 9/10: Purpose-Code und strukturierte Referenz leer
  ok      Zeile 11: Verwendungszweck
  ok      Betragsformat 'EUR5.00' bei amount=5
  ok      Betragsformat 'EUR10.50' bei amount=10.5
  ok      Kommaschreibweise '25,00' wird akzeptiert
  ok      Name > 70 Zeichen wird abgelehnt
  ok      Name mit 70 Zeichen wird akzeptiert
  ok      Verwendungszweck > 140 Zeichen wird abgelehnt
  ok      Verwendungszweck mit 140 Zeichen wird akzeptiert
  ok      Fehlender Name wird abgelehnt
  ok      Ungueltige IBAN (Mod-97) wird abgelehnt
  ok      Betrag 0 wird abgelehnt
  ok      Negativer Betrag wird abgelehnt

[2] QR-Matrix
  ok      Matrix ist quadratisch
  ok      Modulgroesse 41x41 entspricht ganzzahliger Version (v6)
  ok      Matrix enthaelt nur 0/1
  ok      Finder-Pattern: Ecken (0,0), (0,n-1), (n-1,0) dunkel
  ok      Separator neben Finder hell

[3] Roundtrip-Verifikation (SVG -> Canvas -> Decoder)
  ok      Payload ohne Betrag: QR dekodierbar (Decoder: jsqr)
  ok      Payload ohne Betrag: dekodierter Text == EPC-Payload (exakt)
  ok      Payload mit 5 EUR: QR dekodierbar (Decoder: jsqr)
  ok      Payload mit 5 EUR: dekodierter Text == EPC-Payload (exakt)

==============================================
Tests bestanden: 31, fehlgeschlagen: 0
Verwendeter Decoder: jsqr
QR-Version fuer 5-EUR-Payload: v6 (41x41 Module)
==============================================
```

**Zur Roundtrip-Methodik:** Das erzeugte SVG wird per `playwright-core` in
Headless-Chromium auf einen Canvas gerendert. `BarcodeDetector` ist in diesem
Headless-Chromium für `qr_code` nicht verfügbar, daher greift der vorgesehene
Fallback: Dekodierung der Canvas-Pixel mit `jsqr`. Beide Payloads (ohne Betrag
und mit 5 €) wurden **byte-exakt** zurückgelesen. `playwright-core` und `jsqr`
sind reine Test-Abhängigkeiten und liegen ausschließlich im Session-Scratchpad —
`girocode.mjs` selbst hat null Abhängigkeiten.

## Integrationsschritt für die Spendenseite (später, NICHT jetzt umsetzen)

Der `donation-panel`-Renderer in `src/utils/build.mjs` enthält aktuell den
Platzhalter (Zeile ~151):

```html
<div class="qr-slot" aria-hidden="true"><span>QR-Überweisung<br>(Girocode) folgt nach Bestätigung der Bankverbindung</span></div>
```

Aktivierung, sobald freigegeben:

1. In `build.mjs` importieren:
   `import { buildEpcPayload, qrSvg } from "./girocode.mjs";`
2. Im `donation-panel`-Renderer den Payload aus den bereits geladenen
   Bankdaten bauen (ohne Betrag — der Spender wählt ihn in der Banking-App):
   ```js
   const epc = buildEpcPayload({
     name: b.accountHolder,
     iban: b.iban,
     bic: b.bic,
     purpose: "Spende Living Charity",
   });
   const qr = qrSvg(epc, { moduleSize: 4, quietZone: 4 });
   ```
3. Den `.qr-slot`-Platzhalter durch das SVG ersetzen, z. B.:
   ```html
   <figure class="qr-slot qr-slot--active">
     ${qr}
     <figcaption class="text-sm text-muted">Girocode mit Ihrer Banking-App scannen — Empfänger, IBAN und Verwendungszweck werden automatisch übernommen.</figcaption>
   </figure>
   ```
   Dabei `aria-hidden="true"` entfernen (das SVG trägt bereits `role="img"` +
   `aria-label`) und die `.qr-slot`-Styles auf die aktive Variante anpassen.
4. Optional (Ausbaustufe): Betrags-Buttons des `amount-picker` mit dem QR koppeln
   (pro Betrag ein vorgerenderter `qrSvg(buildEpcPayload({ ..., amount }))`,
   clientseitig umgeschaltet). Für den Launch genügt die betraglose Variante.

## Aktivierungs-Gate (Launch-Blocker)

**Nicht aktivieren, bevor diese Blocker aus `docs/launch-blockers.md` erledigt sind:**

- **LB-03** — Bankverbindung gegen Kontoauszug bestätigen (IBAN ist mod-97-gültig
  und identisch mit dem öffentlichen Spendenaufruf, muss aber zwingend gegen den
  Kontoauszug geprüft werden).
- **LB-16** — QR-Überweisung (Girocode) auf /spenden/ aktivieren — erst nach LB-03.

Bis dahin bleibt der `.qr-slot`-Platzhalter unverändert im Donation Panel.

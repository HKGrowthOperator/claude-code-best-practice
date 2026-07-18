# Plant Ceylon — Interne Prüfliste vor Veröffentlichung als Vereinsprojekt

Status: **verification-required** (Launch-Blocker LB-04).
Solange diese Fragen nicht geklärt sind, erscheint Plant Ceylon auf der
Website als vorgestelltes Projekt **mit Prüfstatus** („In Prüfung") und mit dem
sichtbaren Zusatz: „Die genaue rechtliche und finanzielle Zuordnung des
Projekts wird vor der Veröffentlichung transparent ergänzt." — nicht als
nachweislich vollständig von Living Charity betriebenes Vereinsprojekt.

## Rechtliche und organisatorische Zuordnung

- [ ] Wer ist rechtlicher Betreiber von Plant Ceylon?
- [ ] Welche Rolle hat Living Charity?
- [ ] Ist Living Charity Projektträger, Spendenempfänger oder Kooperationspartner?

## Finanzen

- [ ] Sind die 44 Euro ein Kaufpreis oder eine Spende?
- [ ] Wird Umsatzsteuer berechnet?
- [ ] Ist eine Spendenbescheinigung möglich?
- [ ] Wer erhält die Zahlung?
- [ ] Welche Kosten entstehen konkret?
- [ ] Welcher Betrag erreicht das Projekt?
- [ ] Welcher Anteil der 44 Euro wird wofür eingesetzt?

## Umsetzung vor Ort

- [ ] Wo liegen die Pflanzflächen?
- [ ] Wer besitzt oder nutzt die Flächen?
- [ ] Wem gehört der Baum?
- [ ] Wer pflanzt die Bäume?
- [ ] Wer pflegt die Bäume?
- [ ] Wie lange wird die Pflege übernommen?
- [ ] Was geschieht, wenn ein Baum eingeht?
- [ ] Wie werden begünstigte Familien ausgewählt?
- [ ] Welche lokalen Partner sind beteiligt?

## Dokumentation und Nachweise

- [ ] Wie werden Fortschritte dokumentiert?
- [ ] Welche Bildrechte liegen vor?
- [ ] Verbindliche Frist für den persönlichen Nachweis klären — die
      Projektseite nennt derzeit widersprüchlich „innerhalb von neun Tagen"
      (Ablauf) und „bis zu zwei Wochen" (FAQ). Bis zur Klärung verwendet die
      Living-Charity-Seite die vereinheitlichte Formulierung:
      „Der persönliche Nachweis wird nach erfolgter Pflanzung erstellt und in
      der Regel innerhalb von bis zu 14 Tagen übermittelt."

## Bildmaterial (kritisch)

Mehrere aktuell auf plantceylon.com eingebundene Bilder tragen Dateinamen wie
`ChatGPT_Image_16._Mai_2026_…png` — starkes Indiz für KI-generierte Bilder:

- https://plantceylon.com/cdn/shop/files/ChatGPT_Image_16._Mai_2026_21_38_15_d2e9becc-8409-45de-a4f7-917d3f719564.png
- https://plantceylon.com/cdn/shop/files/ChatGPT_Image_16._Mai_2026_21_41_15.png
- https://plantceylon.com/cdn/shop/files/ChatGPT_Image_16._Mai_2026_21_52_30.png
- https://plantceylon.com/cdn/shop/files/ChatGPT_Image_16._Mai_2026_21_55_24.png
- https://plantceylon.com/cdn/shop/files/ChatGPT_Image_16._Mai_2026_22_11_35.png

**Regeln (technisch durchgesetzt in `src/utils/check.mjs`):**

1. Diese Dateien werden auf der Living-Charity-Seite nicht eingebunden
   (Prüfskript schlägt bei `ChatGPT_Image` oder `plantceylon.com/cdn` fehl).
2. Falls später als vorläufige Illustration gewünscht, nur mit internem Status
   `assetType: "illustration"`, `proofValue: false`,
   `publicationStatus: "replace-before-launch"` und sichtbarem
   „Illustration"-Badge.
3. Verbotene Bildunterschriften, solange kein Originalmaterial vorliegt:
   „Unsere Pflanzung", „Vor Ort", „Projektaufnahme",
   „Diese Familie wurde unterstützt".

## Benötigte echte Beweise (siehe auch /content/image-requirements.md)

Unbearbeitete Originalfotos der Pflanzflächen · GPS-/Ortsangabe ·
Aufnahmedatum · Bilder vor/während/nach der Pflanzung · Gruppenbild mit
lokalem Team · Fotos der Setzlinge · Schilder mit Bestellreferenz ·
Videos ohne starke Schnitte · Rechnungen/Belege · Erklärung des lokalen
Projektverantwortlichen · Einwilligungen abgebildeter Personen ·
monatliche oder quartalsweise Updates.

## Belegstruktur je Pflanzung (Zielformat für die Projektseite)

```
Projekt:                    Ort:                     Region:
Koordinaten:                Datum:                   Lokaler Ansprechpartner:
Anzahl der Pflanzungen:     Baumarten:               Status:
Letztes Update:             Originalfotos:           Video:
Dokumente:                  Finanzierungszweck:
```

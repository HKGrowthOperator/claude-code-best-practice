# DonationProvider — abstrakte Spendendienst-Schnittstelle

Zweck: Ein Zahlungs- oder Spendendienst soll später integrierbar sein, **ohne
das Design oder die Spendenseite neu zu bauen**. Bis ein Anbieter bestätigt ist
(Vertrag + Zugangsdaten), existiert bewusst **keine** Zahlungsimplementierung.

## Architektur

Die Spendenseite kennt genau eine Einstiegskomponente: die **Spendenbox**
(Block „Spendenbox"). Sie rendert je nach konfiguriertem Provider
(Option `donation_provider` in den Vereinsdaten):

| Provider-Wert | Verhalten |
| --- | --- |
| `bank-transfer` (Standard, aktiv) | Bankverbindung + IBAN-Kopierknopf + Verwendungszweck (aktueller Stand der Vorabversion) |
| `none` | Box ausgeblendet, Hinweis auf Kontakt |
| `<anbieter-id>` (später) | zusätzlich Button/Einbettung des Dienstes gemäß Adapter |

## Adapter-Vertrag (PHP-Interface, im Plugin `living-charity-core`)

```php
interface LC_Donation_Provider {
    /** Eindeutige ID, z. B. 'bank-transfer' */
    public function id(): string;

    /** Anzeigename für das Backend */
    public function label(): string;

    /**
     * Rendert die Spenden-UI dieses Anbieters.
     * $context: ['project' => ?WP_Post, 'purpose' => ?string]
     * Muss ohne JavaScript benutzbar bleiben (Progressive Enhancement).
     */
    public function render(array $context): string;

    /** Externe Skripte/Domains, die der Anbieter benötigt (für Consent + CSP) */
    public function required_origins(): array;

    /** true, wenn die Einbindung eine Einwilligung erfordert (Zwei-Klick) */
    public function needs_consent(): bool;
}
```

`bank-transfer` ist die Referenzimplementierung (kein externes Skript,
`needs_consent() === false`).

## Pflichtanforderungen an jeden künftigen Anbieter-Adapter

Bei externer Weiterleitung oder Einbettung muss für Spendende klar erkennbar sein:

1. **zu welchem Dienst** weitergeleitet wird (Name + Logo vor dem Klick),
2. dass dort **dessen Datenschutzbestimmungen** gelten (Link),
3. **ob Gebühren** entstehen und wer sie trägt,
4. **wann die Spende als abgeschlossen gilt** (Bestätigungslogik).

Zusätzlich:

- Einbettungen mit externen Requests nur als Zwei-Klick-Lösung (Consent),
- keine Weitergabe personenbezogener Daten vor der Einwilligung,
- Datenschutzerklärung um den Anbieter ergänzen (anwaltlich prüfen),
- Ausfallverhalten: Bei Nichtverfügbarkeit des Dienstes bleibt die
  Banküberweisung sichtbar (Fallback ist immer `bank-transfer`).

## Auswahlkriterien für die Anbieter-Entscheidung (Empfehlungsbasis)

- Kosten/Gebührenmodell für gemeinnützige Organisationen
- Zahlarten (Lastschrift, Karte, PayPal, ggf. Dauerspenden)
- automatische Zuwendungsbestätigungen (setzt Gemeinnützigkeitsnachweis voraus)
- DSGVO: Serverstandort, AV-Vertrag
- Aufwand: gehostetes Formular/Weiterleitung ist einfacher zu warten als
  eine tief eingebettete Lösung

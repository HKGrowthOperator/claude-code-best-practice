# Plugin-Empfehlungen & Sicherheitsanforderungen

Grundsatz: **so wenige Plugins wie möglich.** Jedes Plugin ist Wartungs- und
Angriffsfläche. Kein Page Builder (Elementor & Co.) — das Design ist mit
Core-Blöcken vollständig abbildbar.

## Empfohlene Plugins (schlank, verbreitet, aktiv gepflegt)

| Zweck | Empfehlung | Anmerkung |
| --- | --- | --- |
| Felder/CPT-Verwaltung | ACF (frei) — falls nicht ohnehin vorhanden | Alternative: natives `register_post_meta` + Block Bindings, dann 0 Plugins |
| Formulare | ein schlankes DSGVO-taugliches Formular-Plugin mit serverseitiger Validierung und Honeypot | keine Formulardaten-Speicherung ohne Löschkonzept; SMTP-Versand |
| SEO | ein etabliertes SEO-Plugin (Meta, Sitemap, Redirects) | doppelte Organisations-Schemata deaktivieren (Theme liefert NGO-Schema) |
| Backups | tägliches automatisches Backup mit externem Speicherziel | Restore-Test vor Livegang |
| Caching/Performance | Server-Caching des Hosters bevorzugen; sonst ein leichtes Cache-Plugin | Fonts/CSS sind bereits optimiert |
| E-Mail-Zustellung | SMTP-Plugin mit authentifiziertem Postfach | sonst landen Formulareingänge im Spam |

Ausdrücklich **nicht** einsetzen: Page Builder, Slider-Plugins, Social-Feed-
Embeds, Google-Fonts-Loader, Analytics ohne Beschluss + Consent-Lösung.

## Sicherheitsanforderungen

### Plattform

- WordPress-Core, Theme, Plugins: automatische Sicherheitsupdates aktiv;
  monatlicher Update-Check (auch wenn Wartung nicht Teil dieses Auftrags ist —
  im Übergabegespräch klären, wer das übernimmt).
- PHP ≥ 8.1, aktuelles MySQL/MariaDB; SSL erzwingen (HTTPS-Redirect + HSTS).
- Admin-Konten: individuelle Benutzer, starke Passwörter, 2FA für Admins;
  keine Sammel-Logins; Benutzername ≠ „admin".
- Rollen: Redaktion arbeitet als „Redakteur", nicht als Administrator.
- Login-Härtung: Begrenzung von Login-Versuchen; XML-RPC deaktivieren,
  falls ungenutzt.
- Datei-Editierung im Backend deaktivieren (`DISALLOW_FILE_EDIT`).
- Backups getestet und extern gespeichert.

### Anwendung

- Formulare: serverseitige Validierung, Ausgabe-Escaping, Nonce-Prüfung,
  Honeypot; keine sensiblen Daten in Mails, die nicht nötig sind.
- Uploads: nur Bild-/PDF-Typen für Redaktionsrollen.
- Security-Header (per Hosting oder Plugin): `X-Content-Type-Options`,
  `Referrer-Policy: strict-origin-when-cross-origin`, restriktive
  `Content-Security-Policy` (einfach, da keine Third-Party-Skripte!),
  `Permissions-Policy` minimal.
- Bankdaten: nur über den Spendenbox-Block ausgeben; niemals in Mails an
  Dritte, niemals in Formularen abfragen.
- Vorschau-/Staging-Umgebungen: HTTP-Auth + `noindex`.

### Datenschutz-Betrieb

- Keine externen Requests ohne Consent (Status der Vorabversion halten).
- AV-Verträge: Hoster, SMTP-Dienst, ggf. Formular-/Spendendienst.
- Löschkonzept für Formulareingänge (Frist definieren, z. B. 6 Monate).

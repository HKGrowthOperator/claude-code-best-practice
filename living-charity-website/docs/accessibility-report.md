# Accessibility-Report — Living Charity e. V. (v2)

Zielniveau: **WCAG 2.2 AA**. Stand: 18.07.2026.
Methoden: rechnerische Kontrastprüfung (WCAG-Formel), Playwright-Tastatur-
und Interaktionstests, Code-Review gegen die Kriterienliste des Briefings.

## Umgesetzt und geprüft

| Kriterium | Umsetzung | Prüfung |
| --- | --- | --- |
| Semantische HTML-Struktur | header/nav/main/section/article/footer, `<address>`, `<time>`, `<dl>` für Fakten | Code-Review ✅ |
| Überschriftenhierarchie | genau 1 × h1 je Seite, keine Sprünge | check.mjs automatisiert ✅ (0 Fehler auf 17 Seiten) |
| Skip Link | „Zum Inhalt springen" als erstes Tab-Ziel | Playwright ✅ |
| Sichtbare Fokuszustände | 3-px-Outline (Terracotta-Deep) auf allen Interaktiven, Formularfelder zusätzlich mit Fokus-Ring | Code-Review + Stichprobe ✅ |
| Tastaturbedienung | Navigation, Menü (inkl. Escape schließt + Fokusrückgabe), Formulare, Aufklapper (`<details>`), Kopierknöpfe | Playwright ✅ |
| Touch-Ziele ≥ 44 px | `--touch-target: 2.75rem` auf Buttons, Links der Navigation, Formularfeldern, Betragsauswahl | Code-Review ✅ |
| Kontraste | 22 Token-Paare geprüft; 2 Verstöße gefunden und behoben (Muted-Text auf Sand → #575F5A = 5.11:1; Pausiert-Badge → #815318 = 5.3:1). Alle Textpaare jetzt ≥ 4.5:1; einzige Großtext-Ausnahme: 5-€-Ziffer 5.35:1 (auch AA-normal erfüllt) | rechnerisch ✅ |
| Formular-Labels | jedes Feld mit `<label for>`, Pflichtfelder mit `required` + `aria-describedby` | Code-Review ✅ |
| Verständliche Formularfehler | Fehlertexte je Feld („Bitte geben Sie eine gültige E-Mail-Adresse an …"), `aria-invalid`, Statusmeldung mit `role="status"`, Fokus aufs erste Fehlerfeld | Playwright ✅ |
| Alt-Texte | Prüfskript erzwingt alt-Attribute; SVG-Flächen mit `role="img"` + aria-label; dekorative SVGs `aria-hidden="true"` | check.mjs ✅ |
| Keine Information nur über Farbe | Status-Badges mit Text + Punkt, Quellen-Badges mit Text, Fehler mit Text | Code-Review ✅ |
| Reduzierte Bewegung | `prefers-reduced-motion` deaktiviert alle Transitionen/Reveals | Playwright (reducedMotion) ✅ |
| Ohne JavaScript | `no-js`-Fallback: alle Inhalte sichtbar; Suche mit `<noscript>`-Hinweis | Code-Review ✅ |
| Zoom/Reflow | fluide Layouts, überlauffrei bis 320 px (entspricht 400 % Zoom auf 1280) | Playwright ✅ |
| Sprache | `<html lang="de">`, `hyphens: auto` für deutsche Silbentrennung | Code-Review ✅ |
| Externe Links | als „Externe Quelle" gekennzeichnet, ↗-Suffix, `rel="noopener"` | check.mjs ✅ |

## Offene Punkte (vor Livegang)

1. **Screenreader-Stichprobe** mit NVDA und VoiceOver (Formular, Donation
   Panel, Navigation, Suche) — in dieser Umgebung nicht möglich.
2. **Echte Bilder**: Alt-Texte für Originalaufnahmen nach den Regeln in
   content/image-requirements.md verfassen.
3. **iOS Safari / Android Chrome** manuelle Prüfung (Touch-Verhalten,
   `<details>`-Bedienung).
4. Nach WP-Integration: Formular-Plugin auf gleiche Fehler-Semantik prüfen
   (aria-invalid, role=status, Fokusführung).

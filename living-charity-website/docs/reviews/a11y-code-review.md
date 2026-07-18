# Accessibility- & Frontend-Code-Review — Living Charity e. V. (Vorabversion)

**Prüfumfang:** `src/` (pages, components, styles, utils/main.js, utils/build.mjs) und gebaute Seiten in `public/`, live geprüft unter `http://localhost:8333/` (Chromium/Playwright).
**Maßstab:** WCAG 2.2 AA.
**Stand:** 2026-07-18.

Alle dynamischen Befunde wurden im Browser verifiziert (Leerformular-Submit, Tab-Reihenfolge, berechnete Fokus-Styles, XSS-Probe in der Suche, Suchindex-Inhalt). Kontrastwerte sind rechnerisch aus den Tokens ermittelt.

---

## P1 — Muss vor Livegang behoben werden

### P1-1: Fokusring #B50000 auf dunklen Ink-Sektionen: 2,55:1 — verfehlt 3:1 (WCAG 1.4.11 / 2.4.13)

- **Dateien:** `src/styles/tokens.css:91` (`--focus-ring: 3px solid var(--brand)`), `src/styles/base.css:87` (`:focus-visible { outline: var(--focus-ring); }`)
- **Befund:** Der globale Fokusring ist Marken-Rot `#B50000`. Auf hellen Flächen ist das gut (Ivory 6,46:1, Paper 7,08:1). Auf allen dunklen Flächen mit `--ink #161616` — `.section-dark` (CTA-Sektionen auf Start- und Spendenseite, Sri-Lanka-Sektion), `.site-footer`, `.trust-strip` — beträgt der Kontrast des Rings zum Hintergrund nur **2,55:1** und verfehlt die geforderten 3:1. Im Browser verifiziert: fokussierter `.section-dark .btn--ghost` erhält `outline: rgb(181,0,0) 3px solid` auf `rgb(22,22,22)`. Betroffen sind u. a. die Footer-Links (auf jeder Seite) und die CTA-Buttons „Kontakt aufnehmen“ / „Jetzt helfen“ / „Über Living Charity“.
- **Fix (empfohlen, zweifarbiger Ring — funktioniert auf jedem Untergrund):**
  ```css
  /* base.css */
  :focus-visible {
    outline: var(--focus-ring);
    outline-offset: 2px;
    border-radius: 2px;
    box-shadow: 0 0 0 2px var(--paper); /* heller Trennring zwischen Element und rotem Ring */
  }
  ```
  Alternativ minimal-invasiv: auf dunklen Flächen die Ringfarbe umschalten:
  ```css
  .section-dark :focus-visible,
  .site-footer :focus-visible,
  .trust-strip :focus-visible {
    outline-color: var(--on-dark); /* #f5f3f0 → 15,5:1 auf Ink */
  }
  ```

### P1-2: Fehlermeldung der Datenschutz-Checkbox wird nie sichtbar — aria-describedby-Verknüpfung faktisch tot (WCAG 3.3.1)

- **Dateien:** `src/pages/kontakt.html:81–88`, `src/styles/components.css:490–491`, `src/utils/main.js:124–128`
- **Befund (im Browser verifiziert):** Nach Absenden des leeren Formulars erhält die Checkbox korrekt `aria-invalid="true"` und `.checkbox-field` die Klasse `has-error` — aber `#err-datenschutz` bleibt `display:none`. Zwei Ursachen:
  1. Das `<p id="err-datenschutz">` steht in `kontakt.html:88` **außerhalb** des `.checkbox-field`-Wrappers, den `setError()` (main.js:125) mit `has-error` markiert. Die CSS-Regel `.field.has-error .field__error { display:block }` (components.css:491) kann es daher nie einblenden.
  2. Zusätzlich trägt es ein hartes Inline-`style="display:none"`, das jede CSS-Regel überstimmen würde.
  Konsequenz: Sehende Nutzer bekommen bei nicht angehakter Checkbox nur den Farbwechsel des Labels (`.checkbox-field.has-error label { color: var(--error) }` — Information allein durch Farbe, WCAG 1.4.1). Screenreader-Nutzer hören den Text dagegen **immer** (auch im fehlerfreien Zustand), weil per `aria-describedby` referenzierte, display:none-versteckte Elemente in die Accessible Description einfließen. Die Verknüpfung stimmt also formal (die ID existiert), aber das Verhalten ist genau invertiert zum Soll.
- **Fix:** Element in den Wrapper ziehen und Inline-Style entfernen:
  ```html
  <div class="checkbox-field field">
    <input type="checkbox" id="kontakt-datenschutz" name="datenschutz" required aria-describedby="err-datenschutz">
    <label for="kontakt-datenschutz">…</label>
    <p class="field__error" id="err-datenschutz">Bitte bestätigen Sie die Datenschutzhinweise.</p>
  </div>
  ```
  Da `.checkbox-field` `display:flex` ist, das `<p>` per `flex-basis:100%` bzw. `width:100%` in die zweite Zeile setzen (oder `.checkbox-field { flex-wrap: wrap }`).

---

## P2 — Sollte vor Livegang behoben werden

### P2-1: Kopierknöpfe (IBAN/BIC): dauerhaft verschmutzter Accessible Name, keine Erfolgsansage, Fallback kopiert gar nicht

- **Dateien:** `src/utils/build.mjs:147–148` (Markup), `src/utils/main.js:71–92` (Logik), `src/styles/components.css:429–443`
- **Befund (verifiziert):**
  1. Das Feedback-`<span role="status">Kopiert ✓</span>` liegt **innerhalb** des Buttons und ist nur per `opacity:0` versteckt. Opacity entfernt nichts aus dem Accessibility-Tree: Der Accessible Name jedes Kopierknopfs lautet dauerhaft „IBAN kopieren Kopiert ✓“.
  2. Der „Erfolg“ wird nur per Opacity-Wechsel gezeigt — der Inhalt der Live-Region ändert sich nie, also wird **nie etwas angesagt**.
  3. `navigator.clipboard.writeText(value).then(done, done)` (main.js:79) zeigt „Kopiert ✓“ auch bei **abgelehntem** Schreiben.
  4. Der Fallback-Zweig (main.js:81–89) selektiert den Text nur, ruft aber kein `document.execCommand("copy")` auf — es wird nichts kopiert, trotzdem erscheint „Kopiert ✓“.
- **Fix:**
  - Feedback-Span aus dem Button heraus als eigenes, visuell verstecktes/positioniertes Element neben dem Button; `role="status"` behalten, aber Erfolg per **Textänderung** melden (`fb.textContent = "IBAN kopiert"` → nach 2 s leeren) statt per Opacity.
  - Fehlerpfad ehrlich behandeln: bei Rejection/Fallback „Kopieren nicht möglich — bitte manuell markieren“ setzen; im Fallback nach der Selektion `document.execCommand("copy")` versuchen und dessen Rückgabewert auswerten.

### P2-2: aria-describedby aller Pflichtfelder verweist dauerhaft auf die Fehlertexte — Screenreader hören Fehler im fehlerfreien Zustand

- **Dateien:** `src/pages/kontakt.html:38,43,56,71,82`, `src/styles/components.css:490`
- **Befund:** Jedes Feld referenziert seinen `field__error` (display:none bis `has-error`). Per IDREF referenzierte versteckte Elemente werden in die Description übernommen — Screenreader lesen also z. B. bei einem leeren, noch unberührten Namensfeld bereits „Bitte geben Sie Ihren Namen an“. Das ist verwirrend (klingt wie ein bestehender Fehler) und macht die Fehlerdarstellung für AT-Nutzer zustandslos.
- **Fix (eine der beiden Varianten):**
  1. `aria-describedby` erst im Fehlerfall per JS setzen und beim Korrigieren entfernen (in `setError()` main.js:124–128: `field.setAttribute("aria-describedby", id)` / `removeAttribute`), oder
  2. Fehlertexte per `hidden`-Attribut statt CSS verstecken **und** describedby dynamisch halten. Wichtig: Variante „nur hidden“ reicht nicht, da referenzierte hidden-Knoten weiterhin ausgewertet werden — das JS-Umschalten ist der tragende Teil.

### P2-3: Ohne JavaScript ist das Kontaktformular tot — trotz „funktioniert vollständig ohne JS“-Anspruch

- **Datei:** `src/pages/kontakt.html:31` (`<form … data-endpoint="none" method="post" action="#" novalidate>`), Anspruch in `src/utils/main.js:2`
- **Befund:** `novalidate` ist hart im HTML gesetzt — ohne JS gibt es damit weder native Browservalidierung noch die JS-Validierung. Der Submit postet an `action="#"` (Seiten-Reload ohne jede Rückmeldung). Die Suche hat einen `<noscript>`-Hinweis (suche.html:33–35), das Formular nicht.
- **Fix:** `novalidate` erst per JS setzen (`form.setAttribute("novalidate","")` beim Initialisieren) — dann greift ohne JS die native `required`-Validierung. Zusätzlich einen `<noscript>`-Block im Formularbereich mit dem Mailto-Kontaktweg ergänzen, solange kein Backend existiert.

### P2-4: Statusmeldung des Formulars ist eine bei Seitenladung per display:none versteckte Live-Region — Ansage unzuverlässig

- **Dateien:** `src/styles/components.css:498` (`.form__status { display:none }`), `src/pages/kontakt.html:33`, `src/utils/main.js:145–148`
- **Befund:** `role="status"`/`aria-live="polite"`-Regionen, die bei Registrierung `display:none` sind, werden von mehreren Screenreader/Browser-Kombinationen nicht zuverlässig überwacht; Textänderung und Einblendung passieren hier im selben Tick. Die Fehlermeldung „Bitte prüfen Sie die markierten Felder …“ kann dadurch stumm bleiben. (Der Fokus-Sprung aufs erste Fehlerfeld, main.js:144, fängt das teilweise ab — verlassen sollte man sich darauf nicht.)
- **Fix:** Region immer gerendert lassen (`display:block`, ohne Inhalt keine sichtbare Höhe/Padding erst mit `:not(:empty)` bzw. über die `is-error`/`is-success`-Klassen nur die Optik steuern), nicht das `display` toggeln.

### P2-5: Suchindex enthält HTML-Entities — Anzeige „&amp;“ im Snippet und nicht auffindbare Begriffe

- **Dateien:** `src/utils/build.mjs:311–317` (Indexerzeugung), `src/utils/main.js:183–187` (Snippet-Ausgabe)
- **Befund (verifiziert):** Der Index wird aus dem fertigen HTML per Tag-Stripping erzeugt, Entities werden aber nicht dekodiert — `public/assets/search-index.json` enthält `&nbsp;`, `&amp;` usw. Da main.js die Snippets korrekt per `textContent` einsetzt, erscheinen sie wörtlich als „&amp;“/„&nbsp;“ im Suchergebnis; außerdem findet die Suche „Spenden & Unterstützung“ nicht als zusammenhängende Phrase und `e.&nbsp;V.` zerreißt Treffer.
- **Fix:** In build.mjs nach dem Tag-Stripping Entities dekodieren, mindestens die im Template vorkommenden:
  ```js
  .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  ```

### P2-6: Suchergebnis-Rendering per innerHTML mit Index-Daten — kein akutes XSS, aber einzige Injektionsstelle ohne Escaping

- **Datei:** `src/utils/main.js:185`
- **Befund (verifiziert):** Die XSS-Probe `?q=<img src=x onerror=alert(1)>` ist sicher — Query und Snippets gehen ausschließlich über `textContent` (main.js:178–180, 186–187). Die einzige innerHTML-Interpolation ist `'<a href="' + p.path + '">'` mit `p.path` aus dem selbst gebauten Index. Heute vertrauenswürdig; wird der Index später aus WordPress/CMS-Inhalten gespeist (Migrationspfad!), wird genau diese Zeile zur DOM-XSS-Stelle (z. B. Pfad mit `" onmouseover=…`).
- **Fix:** Ohne innerHTML bauen:
  ```js
  var a = document.createElement("a"); a.href = p.path; a.textContent = p.title;
  var para = document.createElement("p"); para.className = "text-sm text-muted"; para.textContent = excerpt;
  li.appendChild(a); li.appendChild(para);
  ```

---

## P3 — Empfohlen

### P3-1: target="_blank" ohne textliche Ankündigung des neuen Tabs

- **Dateien:** `src/pages/kontakt.html:119–121`, `src/utils/build.mjs:79` (impact5-Quelllink)
- **Befund:** Das „↗“ kommt aus CSS-`content` (`components.css:257`) — von Screenreadern uneinheitlich bis gar nicht gelesen. `rel="noopener"` ist gesetzt (gut).
- **Fix:** `<span class="visually-hidden">(öffnet in neuem Tab)</span>` in die Links aufnehmen; beim Kartenlink steht der Hinweis im Fließtext davor — dort reicht ggf. das.

### P3-2: Betragswahl: Anfangszustand inkonsistent, Änderung des Verwendungszwecks wird nicht angesagt

- **Dateien:** `src/utils/build.mjs:133–144`, `src/utils/main.js:95–109`
- **Befund (verifiziert):** Initial ist der erste Betrag `aria-pressed="true"`, der Verwendungszweck zeigt aber die betragslose Variante „Spende Living Charity“ — Zustand und Anzeige widersprechen sich. Beim Klick ändert sich `#purpose-value` (ein `<dd>`) ohne Live-Region — AT-Nutzer erfahren die Auswirkung ihrer Auswahl nicht.
- **Fix:** Entweder keinen Betrag vorwählen (alle `aria-pressed="false"`) oder initial den Zweck passend zum vorgewählten Betrag setzen; zusätzlich `aria-live="polite"` auf `#purpose-value` (sparsame, seltene Updates — unkritisch).

### P3-3: QR-Slot versteckt sichtbare Information vor Screenreadern

- **Datei:** `src/utils/build.mjs:151` (`<div class="qr-slot" aria-hidden="true"><span>QR-Überweisung … folgt …</span></div>`)
- **Befund:** Der Hinweis „Girocode folgt nach Bestätigung der Bankverbindung“ ist sichtbarer Inhalt, per `aria-hidden` aber nur für sehende Nutzer da — Informationsungleichheit.
- **Fix:** `aria-hidden="true"` entfernen; der Text ist selbsterklärend und schadet in der Vorlesereihenfolge nicht.

### P3-4: Fokusindikator der Formularfelder ist schwach

- **Datei:** `src/styles/components.css:484–488`
- **Befund:** `outline:none` wird durch Border-Farbwechsel (1,5 px, `--line-strong`→`--brand`) plus `box-shadow: 0 0 0 3px var(--stone)` ersetzt; der Stone-Schatten hat auf Paper nur **1,75:1**. Der rote Border rettet die 3:1-Anforderung knapp (Farbe 7,08:1 auf Weiß, aber nur 1,5 px Fläche) — gegen WCAG 2.2 „Focus Appearance“ (AAA) fällt es klar ab, gegen 2.4.13-Geist ist es grenzwertig.
- **Fix:** `box-shadow: 0 0 0 3px var(--brand-tint), 0 0 0 4px var(--brand)` oder schlicht den globalen `:focus-visible`-Outline auch auf Feldern zulassen.

### P3-5: aria-current per startsWith markiert Eltern-Navigationspunkt auf Unterseiten

- **Datei:** `src/utils/build.mjs:55`
- **Befund (verifiziert):** Auf `/projekte/projekt/` trägt der Hauptnav-Link „Projekte“ `aria-current="page"`, obwohl es nicht dieselbe Seite ist. Semantisch korrekt wäre `aria-current="true"` (Abschnitt) für Präfixtreffer und `"page"` nur bei exakter Gleichheit. Zudem würde ein künftiger Pfad wie `/projekte-archiv/` fälschlich matchen (Präfix ohne Segmentgrenze).
- **Fix:** `page.path === i.href ? ' aria-current="page"' : page.path.startsWith(i.href) ? ' aria-current="true"' : ""`.

### P3-6: build.mjs escapet Attribut-Kontexte nicht (Härtung für die WordPress-Migration)

- **Datei:** `src/utils/build.mjs:55` (`href="${i.href}"`), `:79` (`href="${c.sourceUrl}"`), `:147–148` (`data-copy-plain="${b.iban…}"`), `:179/189` (`href="/projekte/${p.slug}/"`), `:188` (`datetime="${p.date}"`)
- **Befund:** `esc()` wird konsequent für Textknoten genutzt (gut), aber URL-/Attributwerte aus den JSON-Dateien gehen roh ins Markup. Heute sind das eigene Repo-Daten; sobald `projects.json`/`posts.json` aus einem CMS befüllt werden, wird ein Slug/URL-Feld mit `"` zum Injektionsvektor.
- **Fix:** `esc()` auch auf alle interpolierten Attributwerte anwenden (esc behandelt `"` bereits); Slugs zusätzlich auf `[a-z0-9-]` validieren.

### P3-7: FAQ-Fragen sind keine Überschriften

- **Dateien:** `src/pages/spenden.html:72–96`, `src/pages/transparenz.html` (analoges Muster)
- **Befund:** `<summary>` funktioniert per Tastatur einwandfrei (nativ, 44 px Zielhöhe, +/×-Indikator, verifiziert) — aber die Fragen tauchen nicht in der Überschriften-Navigation von Screenreadern auf.
- **Fix (optional):** `<summary><h3 style="font:inherit;display:inline">Frage</h3></summary>` bzw. `role="heading"`-freie Variante beibehalten, wenn die Fragenliste kurz bleibt — bei wachsender FAQ nachrüsten.

---

## Verifiziert in Ordnung (keine Aktion nötig)

| Bereich | Ergebnis |
|---|---|
| **DOM-XSS Suche** | Probe `?q=<img src=x onerror=alert(1)>` wird ausschließlich per `textContent` gerendert — kein Script-Ausführungspfad (main.js:178–187). |
| **Honeypot** | `.hp-field` mit `aria-hidden="true"`, `tabindex="-1"`, off-screen (components.css:502) — nicht per Tab erreichbar (verifiziert), Label vorhanden, kein AT-Leak. |
| **Landmark-Struktur** | Genau ein `<main id="hauptinhalt">`, `<header>`/`<footer>`, alle `<nav>`-Landmarks mit `aria-label` (Hauptnavigation, Sie sind hier, Footer-Spalten via build.mjs:63) — sauber. |
| **Skip-Link & Tab-Reihenfolge** | Skip-Link ist erster Tab-Stopp und wird bei `:focus-visible` sichtbar; Tab-Reihenfolge auf /kontakt/ folgt der visuellen Ordnung, keine Tastaturfalle (verifiziert). Mobile Navigation nutzt `display:none` — keine versteckten Tab-Stopps; Escape schließt und fokussiert den Toggle (main.js:24–30). |
| **Logo-IMG Header/Footer** | `alt=""` korrekt dekorativ; Link-Name kommt im Header aus `aria-label` (enthält den sichtbaren Text — Label-in-Name ok), im Footer aus dem sichtbaren Text. |
| **Fehler-Fokusführung** | Bei Validierungsfehler wird das erste ungültige Feld fokussiert (main.js:144), `aria-invalid` wird gesetzt und beim Tippen zurückgesetzt (main.js:158–160). |
| **prefers-reduced-motion** | Vollständig: globaler Transition/Animation-Kill (base.css:163–171), `scroll-behavior:auto`, JS-Reveals werden ohne IO sofort sichtbar (main.js:34–56), `no-js`-Fallback vorhanden. |
| **Touch-Ziele** | Buttons, Nav-Links, Betrags-Buttons, Formularfelder, `summary` ≥ 44 px (`--touch-target: 2.75rem`). Footer-/Breadcrumb-Links ≈ 25 px hoch — über dem 24-px-Minimum von 2.5.8. |
| **Kontraste Text** | Links auf Dunkel `#e2b3b0` 9,7:1; Muted auf Dunkel 8,5:1; Muted auf Sand per Token-Override nachgedunkelt (base.css:180) — durchdacht. |

## Priorisierte Fix-Reihenfolge

1. P1-1 Fokusring auf Dunkelflächen (CSS, 10 Minuten)
2. P1-2 Datenschutz-Fehlermeldung (HTML+CSS, 15 Minuten)
3. P2-1 Kopierknöpfe (JS+Markup)
4. P2-2 describedby dynamisch (JS)
5. P2-3 novalidate per JS + noscript-Hinweis
6. P2-4 Live-Region immer gerendert (CSS)
7. P2-5/P2-6 Suchindex-Entities + createElement-Rendering
8. P3-Sammel-Commit

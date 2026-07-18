# Projekt-Assets (Beweismaterial)

Struktur und Regeln: siehe `/content/image-requirements.md`.

- `originals/` — unbearbeitete Originalaufnahmen (Beweiswert). Je Datei eine
  Begleitdatei `<dateiname>.meta.json` mit: Projekt, Ort, Aufnahmedatum,
  Fotograf, Rechteinhaber, Einwilligungsstatus, Beschreibung, Alt-Text,
  Belegstatus, Quelle.
- `compressed/` — Web-Ableitungen (AVIF/WebP, srcset-Größen).
- `thumbnails/` — Karten-/Vorschaugrößen.

Keine KI-Bilder, keine Fremd-CDN-Dateien. `node src/utils/check.mjs`
blockiert `ChatGPT_Image*` und plantceylon-CDN-Verweise im Build.

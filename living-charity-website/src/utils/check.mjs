#!/usr/bin/env node
/**
 * Qualitätsprüfung der gebauten Seiten (public/).
 *
 *  1. Interne Links/Assets: Ziel existiert?
 *  2. <img> ohne alt-Attribut?
 *  3. Überschriften-Hierarchie: genau ein h1, keine Sprünge?
 *  4. VERBOTENE ALTDATEN (hart): unbelegte Zahlen und Demo-Veranstaltungen
 *     der alten Website dürfen weder sichtbar noch versteckt vorkommen.
 *  5. Sichtbare Marker: Im Frontend dürfen KEINE [INHALT…]/[BITTE…]/[RECHTSTEXT…]
 *     Marker erscheinen (in HTML-Kommentaren sind sie als interne Notiz erlaubt).
 *  6. Tonalitäts-Denyliste (Floskeln aus dem Briefing).
 *  7. KI-Bild-Schutz: keine plantceylon-CDN- oder „ChatGPT_Image"-Dateien.
 *  8. Externe Links müssen target="_blank" + rel="noopener" tragen.
 *
 * Aufruf: node src/utils/check.mjs   (Exit-Code 1 bei harten Fehlern)
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT = join(ROOT, "public");

const htmlFiles = [];
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) { if (!p.endsWith("preview")) walk(p); }
    else if (f.endsWith(".html")) htmlFiles.push(p);
  }
})(OUT);

let errors = 0;
const internalNotes = [];

/* Verbotene Altdaten (Zahlen + Demo-Veranstaltungen der alten Website) */
const FORBIDDEN_LEGACY = [
  "34 Projekte", "13.000", "13000", "348 Unterstützer", "5.000 Unterstützer",
  "5000 Unterstützer", "400 Veranstaltungen", "400 organisierte",
  "8 Veranstaltungen",
  "Sommerfest der Solidarität", "Benefiz-Konzert für Kinder",
  "Charity-Lauf für Gesundheit", "Kreativ-Workshop für Helfer",
];

/* Verbotene KI-Bild-Quellen */
const FORBIDDEN_ASSETS = [/ChatGPT_Image/i, /plantceylon\.com\/cdn/i];

/* Tonalitäts-Denyliste */
const DENY_PHRASES = [
  "Wir verändern die Welt", "Teil von etwas Großem", "schreiben wir Geschichte",
  "Mission ist unsere Passion", "nachhaltigen Eindruck hinterlassen", "Herzblut",
  "bahnbrechend", "einzigartig", "garantiert eine Familie",
];

function resolveTarget(href) {
  const clean = href.split("#")[0].split("?")[0];
  if (clean === "") return true;
  if (clean === "/") return existsSync(join(OUT, "index.html"));
  if (clean.endsWith("/")) return existsSync(join(OUT, clean.slice(1), "index.html"));
  return existsSync(join(OUT, clean.replace(/^\//, "")));
}

for (const file of htmlFiles) {
  const rel = file.slice(OUT.length);
  const html = readFileSync(file, "utf8");
  const visible = html.replace(/<!--[\s\S]*?-->/g, ""); // ohne interne Kommentare

  for (const m of visible.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    if (!resolveTarget(m[1])) { console.error(`✗ ${rel}: kaputter interner Verweis ${m[1]}`); errors++; }
  }
  for (const m of visible.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt=/.test(m[0])) { console.error(`✗ ${rel}: <img> ohne alt-Attribut`); errors++; }
  }
  const h1s = [...visible.matchAll(/<h1[\s>]/g)].length;
  if (h1s !== 1) { console.error(`✗ ${rel}: ${h1s} × <h1> (erwartet: genau 1)`); errors++; }
  const levels = [...visible.matchAll(/<h([1-6])[\s>]/g)].map((m) => +m[1]);
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > levels[i - 1] + 1) {
      console.error(`✗ ${rel}: Überschriftensprung h${levels[i - 1]} → h${levels[i]}`); errors++;
    }
  }

  for (const bad of FORBIDDEN_LEGACY) {
    if (html.includes(bad)) { console.error(`✗ ${rel}: VERBOTENE ALTDATEN „${bad}"`); errors++; }
  }
  for (const re of FORBIDDEN_ASSETS) {
    if (re.test(html)) { console.error(`✗ ${rel}: verbotene Bildquelle (${re})`); errors++; }
  }
  for (const phrase of DENY_PHRASES) {
    if (visible.includes(phrase)) { console.error(`✗ ${rel}: verbotene Floskel „${phrase}"`); errors++; }
  }

  // Sichtbare Marker sind ein Fehler; in Kommentaren nur interne Notiz
  for (const m of visible.matchAll(/\[(INHALT VON LIVING CHARITY|BITTE DURCH DEN AUFTRAGGEBER|RECHTSTEXT DURCH AUFTRAGGEBER)[^\]]*\]/g)) {
    console.error(`✗ ${rel}: sichtbarer Marker im Frontend: ${m[0].slice(0, 60)}`); errors++;
  }
  for (const m of html.matchAll(/<!--[\s\S]*?-->/g)) {
    for (const n of m[0].matchAll(/\[(INHALT VON LIVING CHARITY|BITTE DURCH DEN AUFTRAGGEBER|RECHTSTEXT DURCH AUFTRAGGEBER)[^\]]*\]/g)) {
      internalNotes.push(`${rel}: ${n[0].slice(0, 70)}`);
    }
  }

  // Externe Links: Kennzeichnung + noopener
  for (const m of visible.matchAll(/<a\b[^>]*href="https?:\/\/[^"]*"[^>]*>/g)) {
    if (!/rel="[^"]*noopener/.test(m[0])) { console.error(`✗ ${rel}: externer Link ohne rel="noopener"`); errors++; }
    if (!/target="_blank"/.test(m[0])) { console.error(`✗ ${rel}: externer Link ohne target="_blank"`); errors++; }
  }
}

console.log(`\nGeprüfte Seiten: ${htmlFiles.length}`);
console.log(`Harte Fehler: ${errors}`);
console.log(`Interne Notizen in Kommentaren (ok, siehe docs/launch-blockers.md): ${internalNotes.length}`);
process.exit(errors ? 1 : 0);

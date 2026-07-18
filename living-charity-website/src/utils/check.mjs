#!/usr/bin/env node
/**
 * Qualitätsprüfung der gebauten Seiten (public/).
 *
 *  1. Interne Links: Ziel existiert (Seite, Anker-Datei oder Asset)?
 *  2. Bilder/Assets: referenzierte Dateien vorhanden?
 *  3. <img> ohne alt-Attribut?
 *  4. Überschriften-Hierarchie: genau ein h1, keine Sprünge?
 *  5. Inhalts-Marker: Übersicht aller [INHALT …]/[BITTE …]/[RECHTSTEXT …]
 *     (vor Livegang muss diese Liste leer sein).
 *  6. Verbotene Floskeln (Tonalitäts-Denyliste aus dem Briefing).
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
    if (statSync(p).isDirectory()) walk(p);
    else if (f.endsWith(".html")) htmlFiles.push(p);
  }
})(OUT);

let errors = 0;
let warnings = 0;
const markers = [];

const DENYLIST = [
  "Wir verändern die Welt", "Teil von etwas Großem", "schreiben wir Geschichte",
  "Mission ist unsere Passion", "nachhaltigen Eindruck hinterlassen", "Herzblut",
  "bahnbrechend", "einzigartig",
];

function resolveTarget(href) {
  const clean = href.split("#")[0].split("?")[0];
  if (clean === "") return true; // reiner Anker
  if (clean === "/") return existsSync(join(OUT, "index.html"));
  if (clean.endsWith("/")) return existsSync(join(OUT, clean.slice(1), "index.html"));
  return existsSync(join(OUT, clean.replace(/^\//, "")));
}

for (const file of htmlFiles) {
  const rel = file.slice(OUT.length);
  const html = readFileSync(file, "utf8");

  // 1+2: interne Links & Assets
  for (const m of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    if (!resolveTarget(m[1])) {
      console.error(`✗ ${rel}: kaputter interner Verweis ${m[1]}`);
      errors++;
    }
  }

  // 3: img ohne alt
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt=/.test(m[0])) {
      console.error(`✗ ${rel}: <img> ohne alt-Attribut`);
      errors++;
    }
  }

  // 4: Überschriften
  const h1s = [...html.matchAll(/<h1[\s>]/g)].length;
  if (h1s !== 1) { console.error(`✗ ${rel}: ${h1s} × <h1> (erwartet: genau 1)`); errors++; }
  const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => +m[1]);
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > levels[i - 1] + 1) {
      console.error(`✗ ${rel}: Überschriftensprung h${levels[i - 1]} → h${levels[i]}`);
      errors++;
    }
  }

  // 5: Inhalts-Marker sammeln
  for (const m of html.matchAll(/\[(INHALT VON LIVING CHARITY ERFORDERLICH|BITTE DURCH DEN AUFTRAGGEBER BESTÄTIGEN|RECHTSTEXT DURCH AUFTRAGGEBER BEREITZUSTELLEN[^\]]*)\]/g)) {
    markers.push(`${rel}: [${m[1].slice(0, 60)}…]`);
  }

  // 6: Floskel-Denyliste
  for (const phrase of DENYLIST) {
    if (html.includes(phrase)) {
      console.error(`✗ ${rel}: verbotene Floskel „${phrase}"`);
      errors++;
    }
  }

  // Bonus: horizontal-riskante Inline-Breiten
  if (/style="[^"]*width:\s*\d{3,}px/.test(html)) {
    console.warn(`⚠ ${rel}: feste Pixelbreite im Inline-Style`);
    warnings++;
  }
}

console.log(`\nGeprüfte Seiten: ${htmlFiles.length}`);
console.log(`Harte Fehler: ${errors} · Warnungen: ${warnings}`);
console.log(`\nOffene Inhalts-Marker (vor Livegang → 0):  ${markers.length}`);
for (const m of markers) console.log("  · " + m);

process.exit(errors ? 1 : 0);

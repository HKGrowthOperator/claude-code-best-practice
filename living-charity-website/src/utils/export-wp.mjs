#!/usr/bin/env node
/**
 * WordPress-Export: erzeugt aus den gebauten Seiten (public/) einen
 * Gutenberg-kompatiblen Export unter wordpress-export/:
 *
 *   pages/<slug>.html   Seiteninhalt als Custom-HTML-Block (<!-- wp:html -->)
 *   manifest.json       Titel, Slug, Meta-Description, Reihenfolge, Status
 *   theme-assets/       main.css, main.js (im Theme/Customizer einzubinden)
 *
 * Damit lässt sich die Vorabversion 1:1 in eine WordPress-Instanz übertragen
 * (Schnellweg über HTML-Blöcke), während die vollwertige Block-Theme-Migration
 * in wordpress-blueprint/migration-guide.md beschrieben bleibt.
 *
 * Aufruf: node src/utils/build.mjs && node src/utils/export-wp.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, cpSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT = join(ROOT, "public");
const EXP = join(ROOT, "wordpress-export");

/* Seiten, die als WordPress-SEITEN angelegt werden (Templates/404 bewusst nicht:
   Projekt/Beitrag/Veranstaltung werden CPT-Inhalte, 404 liefert das Theme). */
const PAGES = [
  { route: "/",               slug: "startseite",    title: "Startseite",     order: 0, front: true },
  { route: "/unsere-arbeit/", slug: "unsere-arbeit", title: "Unsere Arbeit",  order: 1 },
  { route: "/sri-lanka/",     slug: "sri-lanka",     title: "Sri Lanka",      order: 2 },
  { route: "/projekte/",      slug: "projekte",      title: "Projekte",       order: 3, note: "Wird später durch das CPT-Archiv projects ersetzt." },
  { route: "/plant-ceylon/",  slug: "plant-ceylon",  title: "Plant Ceylon",   order: 4 },
  { route: "/spenden/",       slug: "spenden",       title: "Spenden",        order: 5 },
  { route: "/ueber-uns/",     slug: "ueber-uns",     title: "Über uns",       order: 6 },
  { route: "/aktuelles/",     slug: "aktuelles",     title: "Aktuelles",      order: 7, note: "Als Beitragsseite konfigurieren oder durch home-Template ersetzen." },
  { route: "/kontakt/",       slug: "kontakt",       title: "Kontakt",        order: 8, note: "Formular durch Formular-Plugin-Block ersetzen (docs/migration-guide.md Schritt 4)." },
  { route: "/transparenz/",   slug: "transparenz",   title: "Transparenz",    order: 9 },
  { route: "/danke/",         slug: "danke",         title: "Danke",          order: 10, note: "noindex; Ziel der Formular-Weiterleitung." },
  { route: "/impressum/",     slug: "impressum",     title: "Impressum",      order: 11 },
  { route: "/datenschutz/",   slug: "datenschutz",   title: "Datenschutz",    order: 12 },
];

mkdirSync(join(EXP, "pages"), { recursive: true });
mkdirSync(join(EXP, "theme-assets"), { recursive: true });

const manifest = { generated: "aus public/ via src/utils/export-wp.mjs", defaultStatus: "draft", pages: [] };

for (const p of PAGES) {
  const file = p.route === "/" ? join(OUT, "index.html") : join(OUT, p.route.replace(/^\/|\/$/g, ""), "index.html");
  const html = readFileSync(file, "utf8");
  const main = html.match(/<main id="hauptinhalt">([\s\S]*?)<\/main>/)[1].trim();
  const description = (html.match(/<meta name="description" content="([^"]*)"/) || [, ""])[1];
  const content = `<!-- wp:html -->\n${main}\n<!-- /wp:html -->\n`;
  writeFileSync(join(EXP, "pages", `${p.slug}.html`), content);
  manifest.pages.push({
    slug: p.slug, title: p.title, order: p.order,
    metaDescription: description,
    front: !!p.front, note: p.note || null,
    file: `pages/${p.slug}.html`,
  });
  console.log(`✓ ${p.slug}`);
}

cpSync(join(OUT, "assets", "css", "main.css"), join(EXP, "theme-assets", "main.css"));
cpSync(join(OUT, "assets", "js", "main.js"), join(EXP, "theme-assets", "main.js"));
writeFileSync(join(EXP, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`\nExport fertig: wordpress-export/ (${manifest.pages.length} Seiten, Status-Vorgabe: draft)`);

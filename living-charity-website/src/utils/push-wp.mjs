#!/usr/bin/env node
/**
 * Push des WordPress-Exports in eine WordPress-Instanz per REST-API.
 * Legt alle Seiten aus wordpress-export/manifest.json als ENTWÜRFE an
 * (oder aktualisiert sie, wenn der Slug schon existiert).
 *
 * Voraussetzungen:
 *   - WordPress ≥ 5.6 mit Application Passwords (Benutzer → Profil)
 *   - Umgebungsvariablen:
 *       WP_URL           z. B. https://staging.livingcharity.de
 *       WP_USER          WordPress-Benutzername
 *       WP_APP_PASSWORD  Application Password
 *
 * Sicherheitsbremse: Das Skript bricht ab, wenn der Site-Name der
 * Zielinstanz nicht zu Living Charity passt — es sei denn, es wird
 * ausdrücklich mit --force aufgerufen. Hintergrund: In der Entwicklungs-
 * umgebung war zeitweise eine FREMDE Instanz („SPD – Roshani
 * Thanapalasingham") verbunden; dorthin darf nie gepusht werden.
 *
 * Aufruf:
 *   node src/utils/export-wp.mjs
 *   WP_URL=… WP_USER=… WP_APP_PASSWORD=… node src/utils/push-wp.mjs [--force] [--publish]
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const EXP = join(ROOT, "wordpress-export");

const { WP_URL, WP_USER, WP_APP_PASSWORD } = process.env;
if (!WP_URL || !WP_USER || !WP_APP_PASSWORD) {
  console.error("Fehlende Umgebungsvariablen: WP_URL, WP_USER, WP_APP_PASSWORD");
  process.exit(1);
}
const FORCE = process.argv.includes("--force");
const STATUS = process.argv.includes("--publish") ? "publish" : "draft";
const base = WP_URL.replace(/\/$/, "");
const auth = "Basic " + Buffer.from(`${WP_USER}:${WP_APP_PASSWORD}`).toString("base64");

async function api(path, opts = {}) {
  const res = await fetch(`${base}/wp-json/wp/v2${path}`, {
    ...opts,
    headers: { Authorization: auth, "Content-Type": "application/json", ...(opts.headers || {}) },
  });
  if (!res.ok) throw new Error(`${opts.method || "GET"} ${path} → HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res.json();
}

const manifest = JSON.parse(readFileSync(join(EXP, "manifest.json"), "utf8"));

// Sicherheitsbremse: Zielinstanz verifizieren
const site = await (await fetch(`${base}/wp-json`)).json();
console.log(`Zielinstanz: „${site.name}" — ${base}`);
if (!/living\s*charity/i.test(site.name || "") && !FORCE) {
  console.error(
    `ABBRUCH: Site-Name enthält nicht „Living Charity".\n` +
    `Diese Sicherheitsbremse verhindert Pushes in fremde Instanzen.\n` +
    `Wenn die Zielinstanz sicher korrekt ist, mit --force erneut ausführen.`
  );
  process.exit(2);
}

for (const p of manifest.pages) {
  const content = readFileSync(join(EXP, p.file), "utf8");
  const existing = await api(`/pages?slug=${p.slug}&status=any&per_page=1`);
  const payload = {
    title: p.title, slug: p.slug, status: STATUS,
    content, menu_order: p.order,
    excerpt: p.metaDescription,
  };
  if (existing.length) {
    const r = await api(`/pages/${existing[0].id}`, { method: "POST", body: JSON.stringify(payload) });
    console.log(`↻ aktualisiert (${STATUS}): ${p.slug} (ID ${r.id})`);
  } else {
    const r = await api(`/pages`, { method: "POST", body: JSON.stringify(payload) });
    console.log(`＋ angelegt (${STATUS}): ${p.slug} (ID ${r.id})`);
  }
}

console.log(`\nFertig. Nächste Schritte (manuell im WP-Admin):
 1. theme-assets/main.css einbinden (Child-Theme-Enqueue oder Customizer → Zusätzliches CSS)
 2. theme-assets/main.js als Theme-Skript einbinden (defer)
 3. Fonts aus public/assets/fonts/ ins Theme kopieren (lokal hosten!)
 4. „${manifest.pages.find((p) => p.front)?.slug}" als statische Startseite setzen
 5. Menü laut src/data/navigation.json anlegen
 6. Kontaktformular durch Formular-Plugin ersetzen (migration-guide Schritt 4)`);

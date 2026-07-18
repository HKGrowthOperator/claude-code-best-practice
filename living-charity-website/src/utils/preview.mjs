#!/usr/bin/env node
/**
 * Erzeugt eine einzelne, vollständig selbst-enthaltene Vorschau-Datei:
 *   public/preview/index.html
 *
 *  - alle 17 Seiten in einem Dokument (Client-Router, echte Navigation)
 *  - CSS inline, Fonts als Data-URIs (keinerlei externe Requests)
 *  - Viewport-Umschalter (Mobil 390 / Tablet 768 / Laptop 1024 / Voll)
 *    über ein same-origin-iframe, damit Media Queries echt reagieren
 *  - Zähler der offenen Inhalts-Marker im Kopf der Vorschau
 *
 * Zweck: Review durch Auftraggeber/Team ohne Server und ohne Build.
 * Aufruf: node src/utils/build.mjs && node src/utils/preview.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT = join(ROOT, "public");

/* ---------- gebaute Seiten einsammeln ---------- */
const pages = {};
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) { if (!p.includes("preview")) walk(p); }
    else if (f.endsWith(".html")) {
      let route = p.slice(OUT.length).replace(/index\.html$/, "");
      if (route === "/404.html") route = "/404.html";
      const html = readFileSync(p, "utf8");
      const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/)[1]
        .replace(/<script src="\/assets\/js\/main\.js" defer><\/script>/, "");
      const title = html.match(/<title>([\s\S]*?)<\/title>/)[1];
      pages[route] = { body, title };
    }
  }
})(OUT);

/* ---------- Assets inline ---------- */
const b64 = (p) => readFileSync(join(OUT, p)).toString("base64");
let css = readFileSync(join(OUT, "assets", "css", "main.css"), "utf8");
for (const f of ["manrope-var.woff2", "source-sans-3-var.woff2", "newsreader-italic-var.woff2"]) {
  css = css.replace(`url("/assets/fonts/${f}")`, `url("data:font/woff2;base64,${b64("assets/fonts/" + f)}")`);
}
const mainJs = readFileSync(join(OUT, "assets", "js", "main.js"), "utf8");

// v2: keine sichtbaren Marker mehr — gezählt werden offene Launch-Blocker (docs/launch-blockers.md)
const markerCount = 11;

/* ---------- Dokument für das iframe (die eigentliche Website) ---------- */
const siteDoc = `<!doctype html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Living Charity e. V. — Vorschau</title>
<style>${css}</style></head><body>
<a class="skip-link" href="#hauptinhalt">Zum Inhalt springen</a>
<div id="app"></div>
<script>
var PAGES = __PAGES__;
window.__LC_SEARCH_INDEX = __SEARCHINDEX__;
var MAIN_JS = __MAINJS__;
function render(route) {
  if (!PAGES[route]) route = "/404.html";
  document.getElementById("app").innerHTML = PAGES[route].body;
  document.title = PAGES[route].title;
  window.scrollTo(0, 0);
  try { new Function(MAIN_JS)(); } catch (e) {}
  parent.postMessage({ lcRoute: route }, "*");
}
document.addEventListener("click", function (e) {
  var a = e.target.closest ? e.target.closest("a") : null;
  if (!a) return;
  var href = a.getAttribute("href") || "";
  if (href.startsWith("mailto:") || href.startsWith("tel:") || a.target === "_blank") return;
  if (href.startsWith("http")) return;
  e.preventDefault();
  var route = href.split("?")[0].split("#")[0];
  var hash = href.indexOf("#") > -1 ? href.slice(href.indexOf("#")) : "";
  if (route === "" || route === "#") route = location.__lcRoute || "/";
  render(route || "/");
  if (hash) { var t = document.querySelector(hash); if (t) t.scrollIntoView(); }
});
window.addEventListener("message", function (e) {
  if (e.data && e.data.lcGoto) render(e.data.lcGoto);
});
render("/");
</script></body></html>`
  .replace("__PAGES__", JSON.stringify(pages).replace(/<\/script/gi, "<\\/script"))
  .replace("__SEARCHINDEX__", readFileSync(join(OUT, "assets", "search-index.json"), "utf8").replace(/<\/script/gi, "<\\/script"))
  .replace("__MAINJS__", JSON.stringify(mainJs).replace(/<\/script/gi, "<\\/script"));

/* ---------- Vorschau-Rahmen ---------- */
const routesForSelect = [
  ["/", "Startseite"], ["/unsere-arbeit/", "Unsere Arbeit"], ["/sri-lanka/", "Sri Lanka"],
  ["/projekte/", "Projekte"], ["/projekte/projekt/", "· Projekt-Vorlage"],
  ["/plant-ceylon/", "Plant Ceylon"], ["/spenden/", "Spenden"], ["/ueber-uns/", "Über uns"],
  ["/aktuelles/", "Aktuelles"], ["/aktuelles/beitrag/", "· Beitrags-Vorlage"],
  ["/kontakt/", "Kontakt"], ["/transparenz/", "Transparenz"],
  ["/impressum/", "Impressum"], ["/datenschutz/", "Datenschutz"],
  ["/danke/", "Danke-Seite"], ["/suche/", "Suche"], ["/404.html", "404-Seite"],
];

const shell = `<title>Living Charity e. V. — Website-Vorabversion</title>
<style>
  :root {
    --chrome-bg: #14241f; --chrome-fg: #e9ede7; --chrome-muted: #9db3a8;
    --chrome-accent: #d98b4f; --chrome-line: rgba(255,255,255,.14);
    --stage-bg: #dcd8cd;
  }
  :root[data-theme="dark"], :root:not([data-theme="light"]) { color-scheme: light dark; }
  @media (prefers-color-scheme: dark) { :root { --stage-bg: #202622; } }
  :root[data-theme="dark"] { --stage-bg: #202622; }
  :root[data-theme="light"] { --stage-bg: #dcd8cd; }
  * { box-sizing: border-box; margin: 0; }
  html, body { height: 100%; }
  body { display: flex; flex-direction: column; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif; background: var(--stage-bg); }
  .bar { background: var(--chrome-bg); color: var(--chrome-fg); padding: .6rem 1rem; display: flex; flex-wrap: wrap; align-items: center; gap: .75rem 1.25rem; border-bottom: 3px solid var(--chrome-accent); }
  .bar strong { font-size: .95rem; letter-spacing: .01em; }
  .bar .tag { font-size: .72rem; text-transform: uppercase; letter-spacing: .12em; color: var(--chrome-muted); }
  .bar .grow { flex: 1; }
  .bar select { background: transparent; color: var(--chrome-fg); border: 1px solid var(--chrome-line); border-radius: 6px; padding: .35rem .5rem; font: inherit; font-size: .85rem; }
  .bar select option { color: #14241f; }
  .vp { display: flex; border: 1px solid var(--chrome-line); border-radius: 6px; overflow: hidden; }
  .vp button { background: transparent; color: var(--chrome-muted); border: 0; padding: .4rem .7rem; font: inherit; font-size: .8rem; cursor: pointer; }
  .vp button[aria-pressed="true"] { background: var(--chrome-accent); color: #1d1208; font-weight: 600; }
  .vp button:focus-visible, .bar select:focus-visible { outline: 2px solid var(--chrome-accent); outline-offset: 1px; }
  .note { font-size: .75rem; color: var(--chrome-muted); }
  .note b { color: var(--chrome-accent); font-weight: 600; }
  .stage { flex: 1; display: flex; justify-content: center; padding: 0; min-height: 0; }
  .stage.framed { padding: 1.25rem; }
  iframe { border: 0; width: 100%; height: 100%; background: #faf6ef; }
  .stage.framed iframe { max-width: var(--vw, 100%); border-radius: 10px; box-shadow: 0 12px 40px rgba(0,0,0,.35); }
</style>
<div class="bar">
  <strong>Living Charity e.&nbsp;V.</strong>
  <span class="tag">Website-Vorabversion · nicht öffentlich</span>
  <span class="grow"></span>
  <label class="tag" for="pagesel">Seite</label>
  <select id="pagesel" aria-label="Seite auswählen">
    ${routesForSelect.map(([r, l]) => `<option value="${r}">${l}</option>`).join("")}
  </select>
  <div class="vp" role="group" aria-label="Viewport-Breite">
    <button type="button" data-w="390">Mobil</button>
    <button type="button" data-w="768">Tablet</button>
    <button type="button" data-w="1024">Laptop</button>
    <button type="button" data-w="full" aria-pressed="true">Voll</button>
  </div>
  <span class="note"><b>${markerCount}</b> offene Launch-Blocker</span>
</div>
<div class="stage" id="stage"><iframe id="site" title="Website-Vorschau: Living Charity e. V."></iframe></div>
<script>
  var siteHtml = __SITEDOC__;
  var frame = document.getElementById("site");
  frame.contentDocument.open(); frame.contentDocument.write(siteHtml); frame.contentDocument.close();
  var stage = document.getElementById("stage");
  document.querySelectorAll(".vp button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".vp button").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      btn.setAttribute("aria-pressed", "true");
      if (btn.dataset.w === "full") { stage.classList.remove("framed"); stage.style.removeProperty("--vw"); }
      else { stage.classList.add("framed"); stage.style.setProperty("--vw", btn.dataset.w + "px"); }
    });
  });
  var sel = document.getElementById("pagesel");
  sel.addEventListener("change", function () { frame.contentWindow.postMessage({ lcGoto: sel.value }, "*"); });
  window.addEventListener("message", function (e) {
    if (e.data && e.data.lcRoute && [].some.call(sel.options, function (o) { return o.value === e.data.lcRoute; })) sel.value = e.data.lcRoute;
  });
</script>`
  .replace("__SITEDOC__", JSON.stringify(siteDoc).replace(/<\/script/gi, "<\\/script"));

mkdirSync(join(OUT, "preview"), { recursive: true });
writeFileSync(join(OUT, "preview", "index.html"), shell);
console.log(`Vorschau erzeugt: public/preview/index.html (${(shell.length / 1024 / 1024).toFixed(2)} MB, ${Object.keys(pages).length} Seiten, ${markerCount} Marker)`);

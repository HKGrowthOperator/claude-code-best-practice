#!/usr/bin/env node
/**
 * Build der Vorabversion — ohne Abhängigkeiten (nur Node ≥ 18).
 *
 *  - fügt Layout (src/layouts/base.html) + Seiten (src/pages/*.html) zusammen
 *  - ersetzt Partials      {{> name}}            aus src/components/<name>.html
 *  - ersetzt Datenpfade    {{site.org.name}}     aus src/data/*.json
 *  - ruft Renderer auf     {{@impact5}} u. a.    (dynamische Module, Leerzustände)
 *  - baut <head> (Title, Description, Canonical, Open Graph, JSON-LD)
 *  - bündelt CSS, erzeugt sitemap.xml, robots.txt und den Suchindex
 *
 * Redaktionsregel: Im Frontend erscheinen KEINE Warnhinweise/Marker.
 * Unbestätigte Angaben werden intern über status-Felder in src/data/*.json
 * und docs/launch-blockers.md geführt.
 *
 * Aufruf:  node src/utils/build.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, cpSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SRC = join(ROOT, "src");
const OUT = join(ROOT, "public");

/* ---------- Daten laden ---------- */
const data = {
  site: json("site.json"),
  nav: json("navigation.json"),
  projectsData: json("projects.json"),
  postsData: json("posts.json"),
  eventsData: json("events.json"),
  teamData: json("team.json"),
};
function json(f) { return JSON.parse(readFileSync(join(SRC, "data", f), "utf8")); }

/* ---------- Hilfsfunktionen ---------- */
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const partialCache = new Map();
function partial(name) {
  if (!partialCache.has(name)) {
    partialCache.set(name, readFileSync(join(SRC, "components", `${name}.html`), "utf8"));
  }
  return partialCache.get(name);
}
function lookup(path) {
  return path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), data);
}

/* ---------- Renderer ---------- */
const renderers = {
  "nav-main": (page) =>
    data.nav.main
      .map((i) => `<li><a class="site-nav__link" href="${i.href}"${page.path.startsWith(i.href) ? ' aria-current="page"' : ""}>${esc(i.label)}</a></li>`)
      .join("\n"),

  "footer-nav": () =>
    ["footerVerein", "footerHelfen", "footerRecht"]
      .map((k, idx) => {
        const titles = ["Der Verein", "Helfen", "Rechtliches"];
        const items = data.nav[k].map((i) => `<li><a href="${i.href}">${esc(i.label)}</a></li>`).join("");
        return `<nav aria-label="${titles[idx]}"><h2>${titles[idx]}</h2><ul>${items}</ul></nav>`;
      })
      .join("\n"),

  /* 5-Euro-Impact — fremde, transparent zitierte Aussage mit Quellenlink */
  "impact5": () => {
    const c = data.site.claim5;
    return `<section class="impact5" aria-label="Was ein kleiner Beitrag bewirken kann">
      <div class="container impact5__grid">
        <p class="impact5__figure reveal">${esc(c.figure)}<small>Ein Tag Nahrung — laut Spendenaufruf</small></p>
        <div class="impact5__body reveal">
          <h2>${esc(c.headline)}</h2>
          <p>${esc(c.body)}</p>
          <p class="impact5__note">${esc(c.note)}</p>
          <p class="source-line">
            <span class="source-badge source-badge--extern">Externe Quelle</span>
            <a class="external-link" href="${c.sourceUrl}" target="_blank" rel="noopener">${esc(c.sourceLabel)}</a>
          </p>
        </div>
      </div>
    </section>`;
  },

  /* Projektübersicht bzw. redaktionelle Leerlösung (Briefing-Wortlaut) */
  "projects-grid": () => {
    const list = data.projectsData.projects;
    if (!list.length) {
      const e = data.projectsData.emptyState;
      return `<div class="empty-state reveal">
        <h2>${esc(e.title)}</h2>
        <p>${esc(e.text)}</p>
        <a class="btn btn--primary" href="/kontakt/">Fragen zur aktuellen Hilfsaktion <span class="btn__arrow" aria-hidden="true">→</span></a>
      </div>`;
    }
    return `<div class="grid grid--cards reveal-stagger">` + list.map(projectCard).join("") + `</div>`;
  },

  "posts-list": () => {
    const list = data.postsData.posts;
    if (!list.length) {
      const e = data.postsData.emptyState;
      return `<div class="empty-state reveal">
        <h2>${esc(e.title)}</h2>
        <p>${esc(e.text)}</p>
        <a class="btn btn--ghost" href="/kontakt/">Fragen? Kontakt aufnehmen</a>
      </div>`;
    }
    return `<div class="grid grid--cards reveal-stagger">` + list.map(postCard).join("") + `</div>`;
  },

  "team-list": () =>
    `<div class="grid grid--cards reveal-stagger">` +
    data.teamData.members
      .map((m) => {
        const initials = m.name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("");
        return `<div class="team-card reveal">
          <div class="team-card__portrait" aria-hidden="true">${initials}</div>
          <div>
            <p class="team-card__name">${esc(m.name)}</p>
            <p class="team-card__role">${esc(m.role)}</p>
          </div>
        </div>`;
      })
      .join("") +
    `</div>`,

  /* Donation Panel: IBAN/BIC-Kopierknöpfe, Betragsauswahl, QR-Vorbereitung */
  "donation-panel": () => {
    const b = data.site.bank;
    const amounts = data.site.donation.amounts
      .map((a, i) => `<button type="button" aria-pressed="${i === 0 ? "true" : "false"}" data-amount="${a}">${a} €</button>`)
      .join("");
    return `<div class="donation-panel">
      <p class="donation-panel__label">Spenden per Überweisung</p>
      <p class="text-sm text-muted" style="margin-top:.5rem">Wählen Sie einen Betrag als Orientierung — überwiesen wird ganz normal über Ihre Bank.</p>
      <div class="amount-picker" role="group" aria-label="Spendenbetrag als Orientierung wählen">${amounts}<button type="button" aria-pressed="false" data-amount="frei">Freier Betrag</button></div>
      <dl>
        <dt>Empfänger</dt><dd>${esc(b.accountHolder)}</dd>
        <dt>IBAN</dt><dd><span class="iban" id="iban-value">${esc(b.iban)}</span></dd>
        <dt>BIC</dt><dd><span id="bic-value">${esc(b.bic)}</span></dd>
        <dt>Bank</dt><dd>${esc(b.bankName)}</dd>
        <dt>Verwendungszweck</dt><dd id="purpose-value">Spende Living Charity</dd>
      </dl>
      <div class="donation-panel__actions">
        <button type="button" class="btn btn--primary copy-btn" data-copy-target="iban-value" data-copy-plain="${b.iban.replace(/\s/g, "")}">IBAN kopieren<span class="copy-btn__feedback" role="status">Kopiert ✓</span></button>
        <button type="button" class="btn btn--ghost copy-btn" data-copy-target="bic-value" data-copy-plain="${b.bic}">BIC kopieren<span class="copy-btn__feedback" role="status">Kopiert ✓</span></button>
      </div>
      <div style="display:flex; gap:1rem; align-items:center; margin-top:var(--space-5); flex-wrap:wrap">
        <div class="qr-slot" aria-hidden="true"><span>QR-Überweisung<br>(Girocode) folgt nach Bestätigung der Bankverbindung</span></div>
        <p class="text-sm text-muted" style="flex:1; min-width:14rem">${esc(data.site.donation.certificateNote)}</p>
      </div>
    </div>`;
  },

  /* Plant Ceylon: 4 Schritte + Baumarten */
  "plant-steps": () =>
    `<ol class="steps reveal">` +
    data.site.plantCeylon.steps
      .map((s) => `<li><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`)
      .join("") +
    `</ol>`,

  "tree-grid": () =>
    `<div class="tree-grid reveal-stagger">` +
    data.site.plantCeylon.trees
      .map((t) => `<div class="tree-item reveal"><strong>${esc(t)}</strong><span>${esc(data.site.plantCeylon.price)}</span></div>`)
      .join("") +
    `</div>`,
};

function projectCard(p) {
  const statusLabel = data.projectsData.statusLabels[p.status] || p.status;
  return `<article class="card reveal">
    <div class="card__media"><div class="media-pending">Originale Projektaufnahme wird ergänzt.</div></div>
    <div class="card__body">
      <p class="card__meta"><span class="badge badge--${p.status}">${esc(statusLabel)}</span><span>${esc(p.region || "")}</span></p>
      <h3 class="card__title"><a href="/projekte/${p.slug}/">${esc(p.title)}</a></h3>
      <p class="card__excerpt">${esc(p.short_description || "")}</p>
      <span class="card__link">Zum Projekt <span aria-hidden="true">→</span></span>
    </div>
  </article>`;
}
function postCard(p) {
  return `<article class="card reveal">
    <div class="card__body">
      <p class="card__meta"><span class="badge">${esc(p.category)}</span><time datetime="${p.date}">${fmtDate(p.date)}</time></p>
      <h3 class="card__title"><a href="/aktuelles/${p.slug}/">${esc(p.title)}</a></h3>
      <p class="card__excerpt">${esc(p.excerpt)}</p>
    </div>
  </article>`;
}
function fmtDate(iso) {
  if (!iso) return "";
  return new Date(iso + "T12:00:00").toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });
}

/* ---------- Template-Engine (bewusst minimal) ---------- */
function render(tpl, page) {
  for (let i = 0; i < 5; i++) {
    const before = tpl;
    tpl = tpl.replace(/\{\{>\s*([\w-]+)\s*\}\}/g, (_, name) => partial(name));
    if (tpl === before) break;
  }
  tpl = tpl.replace(/\{\{@\s*([\w-]+)\s*\}\}/g, (_, name) => {
    if (!renderers[name]) throw new Error(`Unbekannter Renderer: ${name}`);
    return renderers[name](page);
  });
  tpl = tpl.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (m, path) => {
    if (path.startsWith("page.")) {
      const v = page[path.slice(5)];
      return v == null ? "" : esc(v);
    }
    const v = lookup(path);
    if (v === undefined) throw new Error(`Unbekannter Datenpfad: ${path}`);
    return typeof v === "string" ? esc(v) : String(v ?? "");
  });
  return tpl;
}

/* ---------- <head> ---------- */
function headFor(page) {
  const base = data.site.domain.canonicalBase.replace(/\/$/, "");
  const canonical = base + page.path;
  const org = data.site.org;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: org.name,
    foundingDate: "2010-06-16",
    email: org.email,
    identifier: `${org.register.court} ${org.register.number}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: org.address.street,
      postalCode: org.address.zip,
      addressLocality: org.address.city,
      addressCountry: org.address.country,
    },
    url: base + "/",
  };
  const breadcrumb =
    page.path !== "/" && page.breadcrumb
      ? `\n<script type="application/ld+json">${JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Startseite", item: base + "/" },
            { "@type": "ListItem", position: 2, name: page.breadcrumb, item: canonical },
          ],
        })}</script>`
      : "";
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
${page.noindex ? '<meta name="robots" content="noindex,follow">' : `<link rel="canonical" href="${canonical}">`}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(org.name)}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${base}/assets/img/og-default.svg">
<meta property="og:locale" content="de_DE">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/assets/fonts/manrope-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/source-sans-3-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/main.css">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>${breadcrumb}`;
}

/* ---------- Build ---------- */
const layout = readFileSync(join(SRC, "layouts", "base.html"), "utf8");
const pages = readdirSync(join(SRC, "pages")).filter((f) => f.endsWith(".html"));
const builtPaths = [];
const searchIndex = [];

const css = ["tokens.css", "base.css", "components.css"]
  .map((f) => readFileSync(join(SRC, "styles", f), "utf8"))
  .join("\n\n");
mkdirSync(join(OUT, "assets", "css"), { recursive: true });
writeFileSync(join(OUT, "assets", "css", "main.css"), css);

mkdirSync(join(OUT, "assets", "js"), { recursive: true });
cpSync(join(SRC, "utils", "main.js"), join(OUT, "assets", "js", "main.js"));

for (const file of pages) {
  const raw = readFileSync(join(SRC, "pages", file), "utf8");
  const metaMatch = raw.match(/^<!--META\s*([\s\S]*?)\s*-->/);
  if (!metaMatch) throw new Error(`${file}: META-Block fehlt`);
  const page = JSON.parse(metaMatch[1]);
  const body = raw.slice(metaMatch[0].length).trim();

  let html = layout
    .replace("{{!head}}", headFor(page))
    .replace("{{!body}}", body)
    .replace("{{!bodyclass}}", page.bodyClass || "");
  html = render(html, page);

  const outPath =
    page.path === "/" ? join(OUT, "index.html")
    : page.path === "/404.html" ? join(OUT, "404.html")
    : join(OUT, page.path.replace(/^\/|\/$/g, ""), "index.html");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
  if (!page.noindex && page.path !== "/404.html") {
    builtPaths.push(page.path);
    // Suchindex: Titel, Pfad, sichtbarer Text (komprimiert)
    const text = html
      .replace(/<script[\s\S]*?<\/script>/g, " ")
      .replace(/<style[\s\S]*?<\/style>/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .slice(0, 4000);
    searchIndex.push({ path: page.path, title: page.title.split("—")[0].trim(), text });
  }
  console.log(`✓ ${page.path}`);
}

writeFileSync(join(OUT, "assets", "search-index.json"), JSON.stringify(searchIndex));

const base = data.site.domain.canonicalBase.replace(/\/$/, "");
writeFileSync(
  join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    builtPaths.sort().map((p) => `  <url><loc>${base}${p}</loc></url>`).join("\n") +
    `\n</urlset>\n`
);
writeFileSync(
  join(OUT, "robots.txt"),
  `# VORABVERSION: Indexierung gesperrt.\n# Vor Livegang ersetzen durch:\n#   User-agent: *\n#   Allow: /\n#   Sitemap: ${base}/sitemap.xml\nUser-agent: *\nDisallow: /\n`
);

console.log(`\nBuild fertig: ${pages.length} Seiten → public/`);

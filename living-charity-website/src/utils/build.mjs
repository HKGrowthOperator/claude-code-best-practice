#!/usr/bin/env node
/**
 * Build der Vorabversion — ohne Abhängigkeiten (nur Node ≥ 18).
 *
 *  - fügt Layout (src/layouts/base.html) + Seiten (src/pages/*.html) zusammen
 *  - ersetzt Partials      {{> name}}            aus src/components/<name>.html
 *  - ersetzt Datenpfade    {{site.org.name}}     aus src/data/*.json
 *  - ruft Renderer auf     {{@nav-main}} u. a.   (dynamische Listen, Leerzustände)
 *  - baut <head> (Title, Description, Canonical, Open Graph, JSON-LD)
 *  - bündelt CSS zu public/assets/css/main.css, erzeugt sitemap.xml
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

/* ---------- Renderer für dynamische Listen ---------- */
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

  "projects-grid": () => {
    const list = data.projectsData.projects;
    if (!list.length) {
      return `<div class="empty-state reveal">
        <h2>Die Projektliste wird derzeit zusammengestellt</h2>
        <p>Wir bereiten die Darstellung unserer Projekte mit Ort, Ziel und aktuellem Stand vor.
        Bis dahin beantworten wir Fragen zu unserer Arbeit gern persönlich.</p>
        <p class="content-todo-block" style="margin-top:1rem"><strong>[INHALT VON LIVING CHARITY ERFORDERLICH]</strong>
        Echte Projekte (Titel, Ort, Ausgangslage, Ziel, Stand, Bilder mit Rechten) liefern —
        Struktur und Vorlage sind fertig, siehe Projekt-Detailvorlage.</p>
        <a class="btn btn--primary" href="/kontakt/">Kontakt aufnehmen <span class="btn__arrow" aria-hidden="true">→</span></a>
      </div>`;
    }
    return `<div class="grid grid--cards reveal-stagger">` + list.map(projectCard).join("") + `</div>`;
  },

  "posts-list": () => {
    const list = data.postsData.posts;
    if (!list.length) {
      return `<div class="empty-state reveal">
        <h2>Noch keine Beiträge veröffentlicht</h2>
        <p>Sobald es Neuigkeiten aus dem Verein oder den Projekten gibt, erscheinen sie hier —
        ehrlich datiert und klar gekennzeichnet als Neuigkeit, Rückblick oder Projekt-Update.</p>
        <a class="btn btn--ghost" href="/kontakt/">Fragen? Kontakt aufnehmen</a>
      </div>`;
    }
    return `<div class="grid grid--cards reveal-stagger">` + list.map(postCard).join("") + `</div>`;
  },

  "events-list": () => {
    const now = new Date().toISOString().slice(0, 10);
    const upcoming = data.eventsData.events.filter((e) => e.start && e.start >= now);
    const past = data.eventsData.events.filter((e) => e.start && e.start < now);
    let html = "";
    if (!upcoming.length) {
      html += `<div class="empty-state reveal">
        <h2>Aktuell ist kein öffentlicher Termin geplant</h2>
        <p>Wir kündigen Veranstaltungen hier an, sobald Ort und Datum feststehen.
        Wenn Sie eine eigene Aktion zugunsten von Living Charity planen, sprechen Sie uns an.</p>
        <a class="btn btn--primary" href="/kontakt/">Kontakt aufnehmen <span class="btn__arrow" aria-hidden="true">→</span></a>
      </div>`;
    } else {
      html += `<div class="grid grid--cards reveal-stagger">` + upcoming.map(eventCard).join("") + `</div>`;
    }
    if (past.length) {
      html += `<h2 style="margin-top:var(--space-8)">Rückblicke</h2>
      <div class="grid grid--cards">` + past.map(eventCard).join("") + `</div>`;
    }
    return html;
  },

  "team-list": () =>
    `<div class="grid grid--cards reveal-stagger">` +
    data.teamData.members
      .map((m) => {
        const initials = m.name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("");
        const note = m.personalNote
          ? `<p class="text-sm" style="margin-top:.5rem">${esc(m.personalNote)}</p>`
          : "";
        const confirm = m.approved ? "" : `<p style="margin-top:.5rem"><span class="content-todo">Porträt, persönlicher Satz und Freigabe fehlen [BITTE DURCH DEN AUFTRAGGEBER BESTÄTIGEN]</span></p>`;
        return `<div class="team-card reveal">
          <div class="team-card__portrait" aria-hidden="true">${initials}</div>
          <div>
            <p class="team-card__name">${esc(m.name)}</p>
            <p class="team-card__role">${esc(m.role)}</p>
            ${note}${confirm}
          </div>
        </div>`;
      })
      .join("") +
    `</div>`,

  "donation-box": () => {
    const b = data.site.bank;
    const confirm = b.needsConfirmation
      ? `<p style="margin-top:1rem"><span class="content-todo">Bankverbindung vor Livegang gegen Kontoauszug prüfen [BITTE DURCH DEN AUFTRAGGEBER BESTÄTIGEN]</span></p>`
      : "";
    return `<div class="donation-box">
      <p class="donation-box__label">Spendenkonto</p>
      <dl>
        <dt>Kontoinhaber</dt><dd>${esc(b.accountHolder)}</dd>
        <dt>Bank</dt><dd>${esc(b.bankName)}</dd>
        <dt>IBAN</dt><dd><span class="iban" id="iban-value">${esc(b.iban)}</span></dd>
        <dt>BIC</dt><dd>${esc(b.bic)}</dd>
        <dt>Verwendungszweck</dt><dd><span class="content-todo">[INHALT VON LIVING CHARITY ERFORDERLICH] gewünschte Verwendungszwecke</span></dd>
      </dl>
      <button type="button" class="btn btn--primary copy-btn" data-copy-target="iban-value" data-copy-plain="${b.iban.replace(/\s/g, "")}">
        IBAN kopieren
        <span class="copy-btn__feedback" role="status">Kopiert ✓</span>
      </button>
      ${confirm}
    </div>`;
  },
};

function projectCard(p) {
  const statusLabel = data.projectsData.statusLabels[p.status] || p.status;
  return `<article class="card reveal">
    <div class="card__media">${mediaPlaceholder(p.title)}</div>
    <div class="card__body">
      <p class="card__meta"><span class="badge badge--${p.status}">${esc(statusLabel)}</span><span>${esc(p.region)}</span></p>
      <h3 class="card__title"><a href="/projekte/${p.slug}/">${esc(p.title)}</a></h3>
      <p class="card__excerpt">${esc(p.excerpt)}</p>
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
function eventCard(e) {
  return `<article class="card reveal">
    <div class="card__body">
      <p class="card__meta"><span class="badge">${esc(e.type)}</span><time datetime="${e.start}">${fmtDate(e.start)}</time></p>
      <h3 class="card__title"><a href="/veranstaltungen/${e.slug}/">${esc(e.title)}</a></h3>
      <p class="card__excerpt">${esc(e.location)}</p>
    </div>
  </article>`;
}
function mediaPlaceholder(label) {
  return `<svg viewBox="0 0 600 400" role="img" aria-label="Bildfläche — echtes Projektfoto erforderlich" preserveAspectRatio="xMidYMid slice">
    <rect width="600" height="400" fill="#e4efe9"/>
    <path d="M0 400 C150 300 450 340 600 260 L600 400 Z" fill="#cfe2d8"/>
    <text x="300" y="200" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#175b4f">Bildfläche · ${esc(label).slice(0, 40)}</text>
  </svg>`;
}
function fmtDate(iso) {
  if (!iso) return "";
  return new Date(iso + "T12:00:00").toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });
}

/* ---------- Template-Engine (bewusst minimal) ---------- */
function render(tpl, page) {
  // Partials zuerst (können selbst Platzhalter enthalten)
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

/* ---------- <head>-Bausteine ---------- */
function headFor(page) {
  const base = data.site.domain.canonicalBase.replace(/\/$/, "");
  const canonical = base + page.path;
  const org = data.site.org;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: org.name,
    foundingDate: org.foundedYear,
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
<link rel="preload" href="/assets/fonts/alegreya-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/source-sans-3-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/main.css">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>${breadcrumb}`;
}

/* ---------- Build ---------- */
const layout = readFileSync(join(SRC, "layouts", "base.html"), "utf8");
const pages = readdirSync(join(SRC, "pages")).filter((f) => f.endsWith(".html"));
const builtPaths = [];

// CSS bündeln
const css = ["tokens.css", "base.css", "components.css"]
  .map((f) => readFileSync(join(SRC, "styles", f), "utf8"))
  .join("\n\n");
mkdirSync(join(OUT, "assets", "css"), { recursive: true });
writeFileSync(join(OUT, "assets", "css", "main.css"), css);

// JS kopieren
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
  if (!page.noindex && page.path !== "/404.html") builtPaths.push(page.path);
  console.log(`✓ ${page.path}`);
}

// sitemap.xml
const base = data.site.domain.canonicalBase.replace(/\/$/, "");
writeFileSync(
  join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    builtPaths.sort().map((p) => `  <url><loc>${base}${p}</loc></url>`).join("\n") +
    `\n</urlset>\n`
);

// robots.txt — Vorabversion: nicht indexieren; vor Livegang umstellen (siehe docs/seo-plan.md)
writeFileSync(
  join(OUT, "robots.txt"),
  `# VORABVERSION: Indexierung gesperrt.\n# Vor Livegang ersetzen durch:\n#   User-agent: *\n#   Allow: /\n#   Sitemap: ${base}/sitemap.xml\nUser-agent: *\nDisallow: /\n`
);

console.log(`\nBuild fertig: ${pages.length} Seiten → public/`);

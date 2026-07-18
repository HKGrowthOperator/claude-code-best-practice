/**
 * girocode.test.mjs — Testskript fuer das Girocode-Modul (EPC-QR).
 *
 * Aufruf:  node src/utils/girocode.test.mjs
 * Exit-Code != 0 bei Fehlern.
 *
 * Teil 1: Payload-Struktur-Tests (Zeilenfolge, Limits, Betragsformat) — reine Node-Tests.
 * Teil 2: Roundtrip-Verifikation — das erzeugte QR-SVG wird in Headless-Chromium
 *         (playwright-core aus dem Scratchpad) auf einen Canvas gerendert und dekodiert:
 *         bevorzugt mit BarcodeDetector (format 'qr_code'), sonst mit jsqr
 *         (Test-Abhaengigkeit NUR im Scratchpad — girocode.mjs selbst bleibt
 *         abhaengigkeitsfrei).
 *
 * Getestet wird mit den echten Vereinsdaten aus src/data/site.json.
 */

import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { buildEpcPayload, qrMatrix, qrSvg } from "./girocode.mjs";

const SCRATCHPAD =
  "/tmp/claude-0/-home-user/d1cac195-28b3-5fe9-af38-90f50022a025/scratchpad";
const CHROMIUM_PATH = "/opt/pw-browsers/chromium";

const __dirname = dirname(fileURLToPath(import.meta.url));
const site = JSON.parse(
  readFileSync(join(__dirname, "..", "data", "site.json"), "utf8")
);

let failures = 0;
let passed = 0;

function check(label, condition, detail = "") {
  if (condition) {
    passed++;
    console.log(`  ok      ${label}`);
  } else {
    failures++;
    console.error(`  FEHLER  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

/* ============================================================
 * Teil 1: Payload-Struktur
 * ============================================================ */
console.log("\n[1] Payload-Struktur (EPC069-12)");

const ORG = {
  name: "Living Charity e. V.",
  iban: site.bank.iban, // "DE18 3845 0000 1000 2149 63" -> normalisiert
  bic: site.bank.bic, // "WELADED1GMB"
  purpose: "Spende Living Charity",
};

const payloadNoAmount = buildEpcPayload(ORG);
const payloadWithAmount = buildEpcPayload({ ...ORG, amount: 5 });

{
  const lines = payloadNoAmount.split("\n");
  check("11 Zeilen ohne abschliessenden Zeilenumbruch", lines.length === 11, `erhalten: ${lines.length}`);
  check("Zeile 1: Service Tag 'BCD'", lines[0] === "BCD");
  check("Zeile 2: Version '002'", lines[1] === "002");
  check("Zeile 3: Zeichensatz '1' (UTF-8)", lines[2] === "1");
  check("Zeile 4: Identification 'SCT'", lines[3] === "SCT");
  check("Zeile 5: BIC WELADED1GMB", lines[4] === "WELADED1GMB");
  check("Zeile 6: Empfaenger 'Living Charity e. V.'", lines[5] === "Living Charity e. V.");
  check(
    "Zeile 7: IBAN normalisiert (ohne Leerzeichen)",
    lines[6] === "DE18384500001000214963",
    `erhalten: ${lines[6]}`
  );
  check("Zeile 8: Betrag leer (kein Betrag angegeben)", lines[7] === "");
  check("Zeile 9/10: Purpose-Code und strukturierte Referenz leer", lines[8] === "" && lines[9] === "");
  check("Zeile 11: Verwendungszweck", lines[10] === "Spende Living Charity");
}

{
  const lines = payloadWithAmount.split("\n");
  check("Betragsformat 'EUR5.00' bei amount=5", lines[7] === "EUR5.00", `erhalten: ${lines[7]}`);
  const l1050 = buildEpcPayload({ ...ORG, amount: 10.5 }).split("\n")[7];
  check("Betragsformat 'EUR10.50' bei amount=10.5", l1050 === "EUR10.50", `erhalten: ${l1050}`);
  const komma = buildEpcPayload({ ...ORG, amount: "25,00" }).split("\n")[7];
  check("Kommaschreibweise '25,00' wird akzeptiert", komma === "EUR25.00", `erhalten: ${komma}`);
}

{
  const throws = (fn) => {
    try {
      fn();
      return false;
    } catch {
      return true;
    }
  };
  check("Name > 70 Zeichen wird abgelehnt", throws(() => buildEpcPayload({ ...ORG, name: "x".repeat(71) })));
  check("Name mit 70 Zeichen wird akzeptiert", !throws(() => buildEpcPayload({ ...ORG, name: "x".repeat(70) })));
  check("Verwendungszweck > 140 Zeichen wird abgelehnt", throws(() => buildEpcPayload({ ...ORG, purpose: "x".repeat(141) })));
  check("Verwendungszweck mit 140 Zeichen wird akzeptiert", !throws(() => buildEpcPayload({ ...ORG, purpose: "x".repeat(140) })));
  check("Fehlender Name wird abgelehnt", throws(() => buildEpcPayload({ iban: ORG.iban })));
  check("Ungueltige IBAN (Mod-97) wird abgelehnt", throws(() => buildEpcPayload({ ...ORG, iban: "DE18384500001000214964" })));
  check("Betrag 0 wird abgelehnt", throws(() => buildEpcPayload({ ...ORG, amount: 0 })));
  check("Negativer Betrag wird abgelehnt", throws(() => buildEpcPayload({ ...ORG, amount: -5 })));
}

/* ============================================================
 * Teil 2: QR-Matrix-Basisdaten
 * ============================================================ */
console.log("\n[2] QR-Matrix");

const matrix5 = qrMatrix(payloadWithAmount);
const size5 = matrix5.length;
const version5 = (size5 - 17) / 4;
{
  check("Matrix ist quadratisch", matrix5.every((row) => row.length === size5));
  check(
    `Modulgroesse ${size5}x${size5} entspricht ganzzahliger Version (v${version5})`,
    Number.isInteger(version5) && version5 >= 1 && version5 <= 10
  );
  check(
    "Matrix enthaelt nur 0/1",
    matrix5.every((row) => row.every((v) => v === 0 || v === 1))
  );
  // Finder-Pattern-Stichprobe: Ecken dunkel, Separator hell
  check(
    "Finder-Pattern: Ecken (0,0), (0,n-1), (n-1,0) dunkel",
    matrix5[0][0] === 1 && matrix5[0][size5 - 1] === 1 && matrix5[size5 - 1][0] === 1
  );
  check("Separator neben Finder hell", matrix5[7][0] === 0 && matrix5[0][7] === 0);
}

/* ============================================================
 * Teil 3: Roundtrip-Verifikation (Chromium + Decoder)
 * ============================================================ */
console.log("\n[3] Roundtrip-Verifikation (SVG -> Canvas -> Decoder)");

const require = createRequire(join(SCRATCHPAD, "package.json"));

function loadJsqr() {
  try {
    return require("jsqr");
  } catch {
    console.log("  info    jsqr nicht gefunden — installiere im Scratchpad ...");
    execSync("npm install jsqr", { cwd: SCRATCHPAD, stdio: "pipe" });
    return require("jsqr");
  }
}

async function renderAndDecode(page, svg) {
  // SVG im Browser auf Canvas rendern; wenn moeglich direkt mit
  // BarcodeDetector dekodieren, sonst Pixeldaten fuer jsqr zurueckgeben.
  return page.evaluate(async (svgMarkup) => {
    const blob = new Blob([svgMarkup], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(new Error("SVG konnte nicht geladen werden"));
      img.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);

    let decoded = null;
    let decoder = null;
    if ("BarcodeDetector" in window) {
      try {
        const formats = (await window.BarcodeDetector.getSupportedFormats?.()) ?? [];
        if (formats.includes("qr_code")) {
          const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
          const codes = await detector.detect(canvas);
          if (codes.length > 0) {
            decoded = codes[0].rawValue;
            decoder = "BarcodeDetector";
          }
        }
      } catch {
        /* BarcodeDetector vorhanden, aber nicht funktionsfaehig -> jsqr-Fallback */
      }
    }

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return {
      decoded,
      decoder,
      width: imageData.width,
      height: imageData.height,
      pixels: decoded === null ? Array.from(imageData.data) : null,
    };
  }, svg);
}

let usedDecoder = null;

async function roundtrip(page, label, payload) {
  const svg = qrSvg(payload, { moduleSize: 8, quietZone: 4 });
  const result = await renderAndDecode(page, svg);

  let decodedText = result.decoded;
  let decoder = result.decoder;

  if (decodedText === null) {
    const jsQR = loadJsqr();
    const code = jsQR(
      Uint8ClampedArray.from(result.pixels),
      result.width,
      result.height
    );
    if (code) {
      decodedText = code.data;
      decoder = "jsqr";
    }
  }

  usedDecoder = usedDecoder ?? decoder;
  check(
    `${label}: QR dekodierbar (Decoder: ${decoder ?? "keiner"})`,
    decodedText !== null
  );
  check(
    `${label}: dekodierter Text == EPC-Payload (exakt)`,
    decodedText === payload,
    decodedText === null
      ? "keine Dekodierung"
      : `Abweichung: ${JSON.stringify(decodedText).slice(0, 120)}`
  );
}

const { chromium } = require("playwright-core");
const browser = await chromium.launch({
  executablePath: CHROMIUM_PATH,
  args: ["--no-sandbox"],
});
try {
  const page = await browser.newPage();
  await page.setContent("<!doctype html><html><body></body></html>");
  await roundtrip(page, "Payload ohne Betrag", payloadNoAmount);
  await roundtrip(page, "Payload mit 5 EUR", payloadWithAmount);
} finally {
  await browser.close();
}

/* ============================================================
 * Ergebnis
 * ============================================================ */
console.log("\n==============================================");
console.log(`Tests bestanden: ${passed}, fehlgeschlagen: ${failures}`);
console.log(`Verwendeter Decoder: ${usedDecoder ?? "keiner"}`);
console.log(
  `QR-Version fuer 5-EUR-Payload: v${version5} (${size5}x${size5} Module)`
);
console.log("==============================================\n");

process.exit(failures === 0 ? 0 : 1);

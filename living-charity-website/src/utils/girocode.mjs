/**
 * girocode.mjs — Girocode-Modul (EPC-QR fuer SEPA-Ueberweisungen) fuer Living Charity e. V.
 *
 * Abhaengigkeitsfreies ES-Modul, laeuft in Node UND im Browser (kein DOM noetig).
 *
 * API:
 *   buildEpcPayload({ name, iban, bic, amount, purpose })  -> EPC069-12-Payload (String)
 *   qrMatrix(text)                                          -> 2D-Array aus 0/1 (QR-Module)
 *   qrSvg(text, { moduleSize, quietZone })                  -> SVG-String (schwarz auf weiss)
 *
 * QR-Encoder: Byte-Modus, Fehlerkorrektur M, automatische Versionswahl (1-10),
 * Reed-Solomon (GF(256), Polynom 0x11D), Maskierung mit Penalty-Bewertung,
 * Format-Bits (BCH 15,5) und Versions-Bits (BCH 18,6) fuer Version >= 7.
 *
 * WICHTIG (Launch-Blocker): Dieses Modul wird in der UI ERST aktiviert, wenn die
 * Bankverbindung bestaetigt ist (docs/launch-blockers.md: LB-03, dann LB-16).
 */

/* ============================================================
 * 1) EPC069-12-Payload ("Girocode")
 * ============================================================ */

const EPC_MAX_BYTES = 331; // EPC069-12: max. Gesamtlaenge des Payloads in Bytes

function utf8Length(str) {
  return new TextEncoder().encode(str).length;
}

function ibanMod97Ok(iban) {
  // ISO 13616: erste 4 Zeichen ans Ende, Buchstaben -> Zahlen (A=10..Z=35), mod 97 === 1
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  let remainder = 0;
  for (const ch of rearranged) {
    const code = ch >= "0" && ch <= "9" ? ch : String(ch.charCodeAt(0) - 55);
    for (const digit of code) {
      remainder = (remainder * 10 + Number(digit)) % 97;
    }
  }
  return remainder === 1;
}

/**
 * Baut den EPC069-12-Payload (Version 002, Zeichensatz UTF-8, SEPA Credit Transfer).
 *
 * @param {object} opts
 * @param {string} opts.name    Empfaengername (Pflicht, max. 70 Zeichen)
 * @param {string} opts.iban    IBAN (Pflicht; Leerzeichen erlaubt, wird normalisiert)
 * @param {string} [opts.bic]   BIC (optional seit Version 002)
 * @param {number|string} [opts.amount]  Betrag in Euro (optional, 0.01 - 999999999.99)
 * @param {string} [opts.purpose]        Verwendungszweck / unstrukturierter Text (max. 140 Zeichen)
 * @returns {string} Payload-Zeilen mit "\n" getrennt, ohne abschliessenden Zeilenumbruch
 */
export function buildEpcPayload({ name, iban, bic = "", amount, purpose = "" } = {}) {
  if (typeof name !== "string" || name.trim().length === 0) {
    throw new Error("buildEpcPayload: 'name' ist erforderlich");
  }
  const cleanName = name.trim();
  if (cleanName.length > 70) {
    throw new Error("buildEpcPayload: 'name' darf maximal 70 Zeichen lang sein");
  }

  if (typeof iban !== "string" || iban.trim().length === 0) {
    throw new Error("buildEpcPayload: 'iban' ist erforderlich");
  }
  const cleanIban = iban.replace(/\s+/g, "").toUpperCase();
  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/.test(cleanIban)) {
    throw new Error("buildEpcPayload: 'iban' hat kein gueltiges Format");
  }
  if (!ibanMod97Ok(cleanIban)) {
    throw new Error("buildEpcPayload: 'iban' besteht die Mod-97-Pruefung nicht");
  }

  const cleanBic = String(bic || "").replace(/\s+/g, "").toUpperCase();
  if (cleanBic && !/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(cleanBic)) {
    throw new Error("buildEpcPayload: 'bic' hat kein gueltiges Format");
  }

  let amountLine = "";
  if (amount !== undefined && amount !== null && amount !== "") {
    const num =
      typeof amount === "number" ? amount : Number(String(amount).replace(",", "."));
    if (!Number.isFinite(num) || num < 0.01 || num > 999999999.99) {
      throw new Error(
        "buildEpcPayload: 'amount' muss zwischen 0.01 und 999999999.99 liegen"
      );
    }
    amountLine = "EUR" + num.toFixed(2);
  }

  const remittance = String(purpose || "").trim();
  if (remittance.length > 140) {
    throw new Error("buildEpcPayload: 'purpose' darf maximal 140 Zeichen lang sein");
  }

  // Zeilenfolge nach EPC069-12:
  //  1 Service Tag        "BCD"
  //  2 Version            "002" (BIC optional)
  //  3 Zeichensatz        "1"   (UTF-8)
  //  4 Identification     "SCT" (SEPA Credit Transfer)
  //  5 BIC                (leer erlaubt)
  //  6 Empfaengername
  //  7 IBAN
  //  8 Betrag             "EUR#.##" (leer erlaubt)
  //  9 Purpose-Code       (leer, nicht genutzt)
  // 10 Strukturierte Ref. (leer, nicht genutzt)
  // 11 Verwendungszweck   (unstrukturiert, max. 140)
  const lines = [
    "BCD",
    "002",
    "1",
    "SCT",
    cleanBic,
    cleanName,
    cleanIban,
    amountLine,
    "",
    "",
    remittance,
  ];
  const payload = lines.join("\n");

  if (utf8Length(payload) > EPC_MAX_BYTES) {
    throw new Error(
      `buildEpcPayload: Payload ueberschreitet ${EPC_MAX_BYTES} Bytes (EPC069-12)`
    );
  }
  return payload;
}

/* ============================================================
 * 2) QR-Encoder (Byte-Modus, Fehlerkorrektur M, Versionen 1-10)
 * ============================================================ */

/* --- GF(256), Polynom 0x11D (Reed-Solomon) --- */

const GF_EXP = new Uint8Array(255);
const GF_LOG = new Uint8Array(256);
{
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
}

function gfMul(a, b) {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[(GF_LOG[a] + GF_LOG[b]) % 255];
}

/** Generatorpolynom fuer `degree` Fehlerkorrektur-Codewoerter. */
function rsDivisor(degree) {
  const result = new Array(degree).fill(0);
  result[degree - 1] = 1; // x^0-Koeffizient
  // Produkt (x - a^0)(x - a^1)...(x - a^(degree-1))
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < result.length; j++) {
      result[j] = gfMul(result[j], root);
      if (j + 1 < result.length) result[j] ^= result[j + 1];
    }
    root = gfMul(root, 0x02);
  }
  return result;
}

/** Rest der Polynomdivision (= Fehlerkorrektur-Codewoerter). */
function rsRemainder(data, divisor) {
  const result = new Array(divisor.length).fill(0);
  for (const b of data) {
    const factor = b ^ result.shift();
    result.push(0);
    for (let i = 0; i < divisor.length; i++) {
      result[i] ^= gfMul(divisor[i], factor);
    }
  }
  return result;
}

/* --- Tabellen fuer Fehlerkorrektur-Level M, Versionen 1-10 ---
 * [ecCodewordsProBlock, [[anzahlBloecke, datenCodewoerterProBlock], ...]]
 */
const EC_M_TABLE = {
  1: [10, [[1, 16]]],
  2: [16, [[1, 28]]],
  3: [26, [[1, 44]]],
  4: [18, [[2, 32]]],
  5: [24, [[2, 43]]],
  6: [16, [[4, 27]]],
  7: [18, [[4, 31]]],
  8: [22, [[2, 38], [2, 39]]],
  9: [22, [[3, 36], [2, 37]]],
  10: [26, [[4, 43], [1, 44]]],
};

const MIN_VERSION = 1;
const MAX_VERSION = 10;

/* Positionen der Alignment-Pattern-Zentren pro Version */
const ALIGN_POS = {
  1: [],
  2: [6, 18],
  3: [6, 22],
  4: [6, 26],
  5: [6, 30],
  6: [6, 34],
  7: [6, 22, 38],
  8: [6, 24, 42],
  9: [6, 26, 46],
  10: [6, 28, 52],
};

function dataCodewordCount(version) {
  const [, blocks] = EC_M_TABLE[version];
  return blocks.reduce((sum, [count, dataLen]) => sum + count * dataLen, 0);
}

function charCountBits(version) {
  return version <= 9 ? 8 : 16; // Byte-Modus
}

function chooseVersion(byteLen) {
  for (let v = MIN_VERSION; v <= MAX_VERSION; v++) {
    const capacityBits = dataCodewordCount(v) * 8;
    const neededBits = 4 + charCountBits(v) + byteLen * 8;
    if (neededBits <= capacityBits) return v;
  }
  throw new Error(
    `qrMatrix: Text zu lang fuer QR-Version ${MAX_VERSION} (Level M): ${byteLen} Bytes`
  );
}

/* --- Bitstrom -> Codewoerter (inkl. Terminator, Padding, RS, Interleaving) --- */

function buildCodewords(version, dataBytes) {
  const totalDataCw = dataCodewordCount(version);
  const bits = [];
  const pushBits = (value, count) => {
    for (let i = count - 1; i >= 0; i--) bits.push((value >>> i) & 1);
  };

  pushBits(0b0100, 4); // Modusindikator: Byte
  pushBits(dataBytes.length, charCountBits(version));
  for (const b of dataBytes) pushBits(b, 8);

  // Terminator (max. 4 Nullbits), dann auf Bytegrenze auffuellen
  const capacityBits = totalDataCw * 8;
  pushBits(0, Math.min(4, capacityBits - bits.length));
  if (bits.length % 8 !== 0) pushBits(0, 8 - (bits.length % 8));

  // Pad-Bytes 0xEC / 0x11 im Wechsel
  for (let pad = 0xec; bits.length < capacityBits; pad ^= 0xec ^ 0x11) {
    pushBits(pad, 8);
  }

  const codewords = [];
  for (let i = 0; i < bits.length; i += 8) {
    let b = 0;
    for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j];
    codewords.push(b);
  }

  // In Bloecke aufteilen, Fehlerkorrektur berechnen, interleaven
  const [ecLen, blockSpec] = EC_M_TABLE[version];
  const divisor = rsDivisor(ecLen);
  const dataBlocks = [];
  const ecBlocks = [];
  let offset = 0;
  for (const [count, dataLen] of blockSpec) {
    for (let i = 0; i < count; i++) {
      const block = codewords.slice(offset, offset + dataLen);
      offset += dataLen;
      dataBlocks.push(block);
      ecBlocks.push(rsRemainder(block, divisor));
    }
  }

  const result = [];
  const maxDataLen = Math.max(...dataBlocks.map((b) => b.length));
  for (let i = 0; i < maxDataLen; i++) {
    for (const block of dataBlocks) {
      if (i < block.length) result.push(block[i]);
    }
  }
  for (let i = 0; i < ecLen; i++) {
    for (const block of ecBlocks) result.push(block[i]);
  }
  return result;
}

/* --- Matrixaufbau --- */

function makeMatrix(size) {
  return Array.from({ length: size }, () => new Array(size).fill(0));
}

function buildSymbol(version, codewords) {
  const size = version * 4 + 17;
  const modules = makeMatrix(size); // 0 = hell, 1 = dunkel
  const isFunction = makeMatrix(size); // 1 = Funktionsmodul (nicht maskieren)

  const setFn = (x, y, dark) => {
    modules[y][x] = dark ? 1 : 0;
    isFunction[y][x] = 1;
  };

  /* Timing-Pattern */
  for (let i = 0; i < size; i++) {
    setFn(6, i, i % 2 === 0);
    setFn(i, 6, i % 2 === 0);
  }

  /* Finder-Pattern (mit Separator) an drei Ecken */
  const drawFinder = (cx, cy) => {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const x = cx + dx;
        const y = cy + dy;
        if (x < 0 || x >= size || y < 0 || y >= size) continue;
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        setFn(x, y, dist !== 2 && dist !== 4);
      }
    }
  };
  drawFinder(3, 3);
  drawFinder(size - 4, 3);
  drawFinder(3, size - 4);

  /* Alignment-Pattern (nicht ueber Finder-Ecken) */
  const positions = ALIGN_POS[version];
  const last = positions.length - 1;
  for (let i = 0; i < positions.length; i++) {
    for (let j = 0; j < positions.length; j++) {
      const skip =
        (i === 0 && j === 0) || (i === 0 && j === last) || (i === last && j === 0);
      if (skip) continue;
      const cx = positions[i];
      const cy = positions[j];
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          setFn(cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
        }
      }
    }
  }

  /* Format-Bereiche reservieren (Inhalt kommt nach der Maskenwahl) */
  const drawFormatBits = (mask) => {
    // BCH(15,5): 2 Bit EC-Level (M = 00) + 3 Bit Maske, XOR-Maske 0x5412
    const data = (0b00 << 3) | mask;
    let rem = data;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const bits = ((data << 10) | rem) ^ 0x5412;
    const bit = (i) => ((bits >>> i) & 1) !== 0;

    // Erste Kopie (um Finder oben links)
    for (let i = 0; i <= 5; i++) setFn(8, i, bit(i));
    setFn(8, 7, bit(6));
    setFn(8, 8, bit(7));
    setFn(7, 8, bit(8));
    for (let i = 9; i < 15; i++) setFn(14 - i, 8, bit(i));

    // Zweite Kopie (rechts unten / links unten)
    for (let i = 0; i <= 7; i++) setFn(size - 1 - i, 8, bit(i));
    for (let i = 8; i < 15; i++) setFn(8, size - 15 + i, bit(i));
    setFn(8, size - 8, true); // Dunkelmodul
  };
  drawFormatBits(0); // Platzhalter: reserviert die Modulflaechen

  /* Versions-Information (BCH 18,6) fuer Version >= 7 */
  if (version >= 7) {
    let rem = version;
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    const bits = (version << 12) | rem;
    for (let i = 0; i < 18; i++) {
      const bit = ((bits >>> i) & 1) !== 0;
      const a = size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      setFn(a, b, bit);
      setFn(b, a, bit);
    }
  }

  /* Datenbits im Zickzack platzieren (Spalte 6 wird uebersprungen) */
  let bitIndex = 0;
  const totalBits = codewords.length * 8;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const upward = ((right + 1) & 2) === 0;
        const y = upward ? size - 1 - vert : vert;
        if (!isFunction[y][x]) {
          if (bitIndex < totalBits) {
            modules[y][x] = (codewords[bitIndex >>> 3] >>> (7 - (bitIndex & 7))) & 1;
            bitIndex++;
          }
          // Restbits (Remainder) bleiben 0
        }
      }
    }
  }

  /* Maskierung: alle 8 Masken bewerten, beste (kleinste Penalty) waehlen */
  const maskBit = (mask, x, y) => {
    switch (mask) {
      case 0: return (x + y) % 2 === 0;
      case 1: return y % 2 === 0;
      case 2: return x % 3 === 0;
      case 3: return (x + y) % 3 === 0;
      case 4: return (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0;
      case 5: return ((x * y) % 2) + ((x * y) % 3) === 0;
      case 6: return (((x * y) % 2) + ((x * y) % 3)) % 2 === 0;
      case 7: return (((x + y) % 2) + ((x * y) % 3)) % 2 === 0;
      default: throw new Error("Ungueltige Maske");
    }
  };

  const applyMask = (mask) => {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (!isFunction[y][x] && maskBit(mask, x, y)) modules[y][x] ^= 1;
      }
    }
  };

  const penaltyScore = () => {
    let score = 0;

    // Regel 1: Laufweiten >= 5 in Zeilen und Spalten
    for (let axis = 0; axis < 2; axis++) {
      for (let i = 0; i < size; i++) {
        let runColor = -1;
        let runLen = 0;
        for (let j = 0; j < size; j++) {
          const v = axis === 0 ? modules[i][j] : modules[j][i];
          if (v === runColor) {
            runLen++;
            if (runLen === 5) score += 3;
            else if (runLen > 5) score += 1;
          } else {
            runColor = v;
            runLen = 1;
          }
        }
      }
    }

    // Regel 2: 2x2-Bloecke gleicher Farbe
    for (let y = 0; y < size - 1; y++) {
      for (let x = 0; x < size - 1; x++) {
        const v = modules[y][x];
        if (v === modules[y][x + 1] && v === modules[y + 1][x] && v === modules[y + 1][x + 1]) {
          score += 3;
        }
      }
    }

    // Regel 3: Finder-aehnliches Muster 1011101 mit 4 hellen Modulen davor/danach
    const finderLike = (get) => {
      for (let i = 0; i < size; i++) {
        for (let j = 0; j <= size - 11; j++) {
          const window = [];
          for (let k = 0; k < 11; k++) window.push(get(i, j + k));
          const s = window.join("");
          if (s === "10111010000" || s === "00001011101") score += 40;
        }
      }
    };
    finderLike((i, j) => modules[i][j]);
    finderLike((i, j) => modules[j][i]);

    // Regel 4: Anteil dunkler Module
    let dark = 0;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) dark += modules[y][x];
    }
    const percent = (dark * 100) / (size * size);
    score += Math.floor(Math.abs(percent - 50) / 5) * 10;

    return score;
  };

  let bestMask = 0;
  let bestScore = Infinity;
  for (let mask = 0; mask < 8; mask++) {
    applyMask(mask);
    drawFormatBits(mask);
    const score = penaltyScore();
    if (score < bestScore) {
      bestScore = score;
      bestMask = mask;
    }
    applyMask(mask); // Maske wieder entfernen (XOR ist selbstinvers)
  }
  applyMask(bestMask);
  drawFormatBits(bestMask);

  return modules;
}

/**
 * Erzeugt die QR-Matrix fuer einen Text (Byte-Modus, Fehlerkorrektur M).
 * @param {string} text
 * @returns {number[][]} Quadratisches 2D-Array aus 0 (hell) / 1 (dunkel)
 */
export function qrMatrix(text) {
  const dataBytes = Array.from(new TextEncoder().encode(String(text)));
  const version = chooseVersion(dataBytes.length);
  const codewords = buildCodewords(version, dataBytes);
  return buildSymbol(version, codewords);
}

/* ============================================================
 * 3) SVG-Ausgabe
 * ============================================================ */

/**
 * Rendert einen Text als QR-Code-SVG (schwarz auf weiss).
 * @param {string} text
 * @param {object} [opts]
 * @param {number} [opts.moduleSize=4]  Kantenlaenge eines Moduls in px
 * @param {number} [opts.quietZone=4]   Ruhezone in Modulen (Norm: 4)
 * @returns {string} Eigenstaendiger SVG-String
 */
export function qrSvg(text, { moduleSize = 4, quietZone = 4 } = {}) {
  if (!Number.isFinite(moduleSize) || moduleSize <= 0) {
    throw new Error("qrSvg: 'moduleSize' muss > 0 sein");
  }
  if (!Number.isInteger(quietZone) || quietZone < 0) {
    throw new Error("qrSvg: 'quietZone' muss eine nicht-negative Ganzzahl sein");
  }
  const matrix = qrMatrix(text);
  const n = matrix.length;
  const dim = (n + 2 * quietZone) * moduleSize;

  let path = "";
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (matrix[y][x] === 1) {
        const px = (x + quietZone) * moduleSize;
        const py = (y + quietZone) * moduleSize;
        path += `M${px} ${py}h${moduleSize}v${moduleSize}h-${moduleSize}z`;
      }
    }
  }

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${dim}" height="${dim}" ` +
    `viewBox="0 0 ${dim} ${dim}" shape-rendering="crispEdges" role="img" ` +
    `aria-label="Girocode: QR-Code für SEPA-Überweisung">` +
    `<rect width="${dim}" height="${dim}" fill="#ffffff"/>` +
    `<path d="${path}" fill="#000000"/>` +
    `</svg>`
  );
}

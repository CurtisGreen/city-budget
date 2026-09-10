/**
 * Shrink data/geojson/*.ts so the Leaflet map chunk stays small as cities are added.
 *
 * Two levers, both invisible at the zoom the map renders at (~zoom 10, where one
 * pixel covers roughly 150 m):
 *
 *   1. Ramer-Douglas-Peucker simplification at TOLERANCE degrees. The Overpass
 *      exports average ~1,100 vertices per city boundary; a few hundred is
 *      plenty. This is the big win (~47% of shipped bytes).
 *   2. Coordinate precision capped at DECIMALS (~12% of shipped bytes, and more
 *      after gzip -- trailing digits are incompressible noise).
 *
 * Formatting is deliberately NOT collapsed. Minifying the whitespace out saves
 * ~41% of the bytes on disk but 0% of the bytes that ship, because the bundler
 * strips whitespace anyway and these source files are never deployed. Keeping
 * Prettier's layout means the diff shows only coordinates that actually moved.
 *
 * Rings stay closed because RDP always keeps its endpoints.
 *
 * Re-running is a no-op: the output is a fixed point, so adding a city and
 * running this again shrinks only the new file and leaves the rest byte-identical.
 * See shrinkRing for why the operation order matters to that.
 *
 * Usage:
 *   node scripts/shrink-geojson.mjs           # dry run, prints savings
 *   node scripts/shrink-geojson.mjs --write   # apply
 */

import { execFileSync } from "node:child_process";
import { globSync, readFileSync, writeFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

const TOLERANCE = 0.00002; // degrees, ~2 m
const DECIMALS = 5; // ~1 m
const MIN_RING_POINTS = 8; // never simplify a ring below this
const PRETTIER = "prettier@3"; // pinned: formatting changes between majors

// depth: how many array levels sit above an individual ring of [lon, lat] pairs.
// min: fewest points that still form valid geometry -- a polygon ring needs 3
// distinct points plus the closing repeat, a line only needs 2.
const GEOMETRY = {
  LineString: { depth: 0, min: 2 },
  MultiLineString: { depth: 1, min: 2 },
  Polygon: { depth: 1, min: 4 },
  MultiPolygon: { depth: 2, min: 4 },
};

function perpendicularDistance([x, y], [x1, y1], [x2, y2]) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  if (dx === 0 && dy === 0) return Math.hypot(x - x1, y - y1);
  const t = Math.max(
    0,
    Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)),
  );
  return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy));
}

function simplify(points, tolerance) {
  if (points.length < 3) return points;
  let furthest = 0;
  let index = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const d = perpendicularDistance(points[i], points[0], points.at(-1));
    if (d > furthest) {
      furthest = d;
      index = i;
    }
  }
  if (furthest <= tolerance) return [points[0], points.at(-1)];
  return [
    ...simplify(points.slice(0, index + 1), tolerance).slice(0, -1),
    ...simplify(points.slice(index), tolerance),
  ];
}

const round = (n) => Number(n.toFixed(DECIMALS));

// Rounding runs before simplification, not after, so that re-running the script
// is a no-op on cities it has already shrunk. Rounding afterwards nudges every
// kept point by up to half a step -- a tenth of TOLERANCE -- which is enough for
// a second pass to find new near-collinear points and erode another 2.5% of the
// vertices, compounding every time a city is added.
function shrinkRing(ring, min) {
  const rounded = ring.map((point) => point.map(round));
  const simplified =
    rounded.length > MIN_RING_POINTS ? simplify(rounded, TOLERANCE) : rounded;
  // Never let simplification destroy geometry -- fall back to the full ring.
  return simplified.length >= min ? simplified : rounded;
}

function shrinkCoordinates(node, depth, min) {
  if (depth === 0) return shrinkRing(node, min);
  return node.map((child) => shrinkCoordinates(child, depth - 1, min));
}

/**
 * `JSON.stringify` with indent 2 puts a newline after every `{`, which is what
 * makes Prettier preserve each object's expansion instead of collapsing short
 * ones onto a single line. Combined with the Prettier pass below, an untouched
 * file round-trips byte-for-byte.
 */
function serialize(name, data) {
  return `export const ${name} = ${JSON.stringify(data, null, 2)};\n`;
}

function countVertices(text) {
  return (text.match(/\[\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*\]/g) ?? [])
    .length;
}

const write = process.argv.includes("--write");
const paths = globSync("data/geojson/*.ts").sort();
const results = [];

for (const path of paths) {
  const source = readFileSync(path, "utf8");
  const match = source.match(/^\s*export const (\w+) = ([\s\S]*?);?\s*$/);
  if (!match) {
    console.log(`  skip (unrecognized shape): ${path}`);
    continue;
  }
  const [, name, body] = match;
  const data = new Function(`return (${body});`)();

  for (const feature of data.features ?? []) {
    const shape = GEOMETRY[feature.geometry?.type];
    if (!shape) continue; // Point / MultiPoint carry no rings to shrink
    feature.geometry.coordinates = shrinkCoordinates(
      feature.geometry.coordinates,
      shape.depth,
      shape.min,
    );
  }

  results.push({ path, source, rebuilt: serialize(name, data) });
}

// Prettier restores the committed layout (unquoted keys where valid, coordinate
// pairs on one line, 80-column string wrapping, trailing commas).
if (write) {
  for (const { path, rebuilt } of results) writeFileSync(path, rebuilt);
  execFileSync("npx", ["--yes", PRETTIER, "--write", "data/geojson/*.ts"], {
    stdio: "ignore",
  });
}

// The bundler minifies before shipping, so measure savings on the minified form.
const minify = (text) => text.replace(/\s+/g, "");
const sum = (fn) => results.reduce((total, r) => total + fn(r), 0);
const bytes = (text) => Buffer.byteLength(text);

const before = {
  disk: sum((r) => bytes(r.source)),
  ship: sum((r) => bytes(minify(r.source))),
  gzip: sum((r) => gzipSync(Buffer.from(minify(r.source))).length),
  verts: sum((r) => countVertices(r.source)),
};
const after = {
  // Only meaningful once Prettier has run, so read it back off disk.
  disk: write ? sum((r) => bytes(readFileSync(r.path, "utf8"))) : null,
  ship: sum((r) => bytes(minify(r.rebuilt))),
  gzip: sum((r) => gzipSync(Buffer.from(minify(r.rebuilt))).length),
  verts: sum((r) => countVertices(r.rebuilt)),
};

const mb = (n) => `${(n / 1e6).toFixed(2)} MB`;
const change = (a, b) =>
  `${a > b ? "+" : ""}${((100 * (a - b)) / b).toFixed(0)}%`;
const row = (label, a, b, fmt = mb) =>
  `${label.padEnd(22)}${fmt(b).padStart(10)} -> ${fmt(a).padStart(10)}  ${change(a, b).padStart(5)}`;

console.log(`${results.length} files`);
console.log(row("shipped (minified)", after.ship, before.ship));
console.log(row("  after gzip", after.gzip, before.gzip));
console.log(
  row("vertices", after.verts, before.verts, (n) => n.toLocaleString()),
);
if (after.disk !== null) {
  console.log(row("on disk (formatted)", after.disk, before.disk));
}
console.log(
  `settings               tolerance ${TOLERANCE} deg (~${Math.round(TOLERANCE * 111000)} m), ${DECIMALS} dp`,
);
if (!write) console.log("\ndry run -- re-run with --write to apply");

const fs = require('fs');
const path = require('path');

const defaultInputs = [
  path.join('coverage', 'unit', 'lcov.info'),
  path.join('coverage', 'e2e', 'lcov.info'),
];

const extra = process.argv.slice(2).filter(Boolean);
const inputs = [...defaultInputs, ...extra];

const out = path.join('coverage', 'lcov.info');

function readIfExists(p) {
  try {
    if (fs.existsSync(p)) {
      let data = fs.readFileSync(p, 'utf8');
      if (!data.endsWith('\n')) data += '\n';
      return data;
    }
  } catch (err) {
    console.warn(`[merge-lcov] No se pudo leer ${p}:`, err?.message || err);
  }
  return '';
}

fs.mkdirSync(path.dirname(out), { recursive: true });

let merged = '';
const included = [];
const missing = [];

for (const file of inputs) {
  const data = readIfExists(file);
  if (data) {
    merged += data;
    included.push(file);
  } else {
    missing.push(file);
  }
}

if (!merged.trim()) {
  console.error('[merge-lcov] No se encontró ningún LCOV para unir.');
  console.error('Busqué en:', inputs.join(', '));
  process.exit(1);
}

fs.writeFileSync(out, merged, 'utf8');

console.log('[merge-lcov] LCOV unificado ->', out);
if (included.length) console.log('[merge-lcov] Incluidos:', included.join(', '));
if (missing.length)  console.log('[merge-lcov] Ausentes:',  missing.join(', '));

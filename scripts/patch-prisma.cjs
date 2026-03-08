/**
 * Patches the Prisma-generated client.ts so that fileURLToPath(import.meta.url)
 * failures on Windows (webpack/Turbopack dev mode) fall back to a safe path.
 * Run automatically after `prisma generate` via the postinstall script.
 */
const fs = require('fs');
const path = require('path');

const clientPath = path.resolve(__dirname, '../src/generated/prisma/client.ts');

if (!fs.existsSync(clientPath)) {
  console.warn('[patch-prisma] client.ts not found — skipping patch');
  process.exit(0);
}

const original = "globalThis['__dirname'] = path.dirname(fileURLToPath(import.meta.url))";
const patched  = "globalThis['__dirname'] = (() => { try { return path.dirname(fileURLToPath(import.meta.url)) } catch { return path.resolve(process.cwd(), 'src/generated/prisma') } })()";

let content = fs.readFileSync(clientPath, 'utf8');

if (content.includes(patched)) {
  console.log('[patch-prisma] already patched — nothing to do');
  process.exit(0);
}

if (!content.includes(original)) {
  console.warn('[patch-prisma] target line not found — Prisma may have changed its generated output');
  process.exit(0);
}

content = content.replace(original, patched);
fs.writeFileSync(clientPath, content, 'utf8');
console.log('[patch-prisma] patched client.ts successfully');

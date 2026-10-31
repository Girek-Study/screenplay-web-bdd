const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');
(async () => {
  const nav = await chromium.launch();
  const p = await nav.newPage({ viewport: { width: 1280, height: 500 }, deviceScaleFactor: 2 });
  await p.goto(pathToFileURL(path.join(__dirname, 'contraste.html')).href, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(500);
  await p.screenshot({ path: process.argv[2] });
  console.log('contraste:', process.argv[2]);
  await nav.close();
})().catch((e) => { console.error(e.message); process.exit(1); });

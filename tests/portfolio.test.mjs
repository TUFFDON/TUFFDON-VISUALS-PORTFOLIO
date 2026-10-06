import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const packagesSection = html.match(/<section id="packages">([\s\S]*?)<\/section>/)?.[1] ?? '';

test('booking options do not publish fixed prices', () => {
  assert.doesNotMatch(packagesSection, /\$\s*[\d,]+|\bJMD\b/i);
});

test('every booking option sends visitors to the existing contact section', () => {
  const bookingLinks = [...packagesSection.matchAll(/<a class="btn(?: ghost)?"[^>]*>[^<]*<\/a>/g)];

  assert.equal(bookingLinks.length, 3);
  for (const [link] of bookingLinks) {
    assert.equal(link.replace(' class="btn ghost"', ' class="btn"'), '<a class="btn" href="#contact">Enquire for booking</a>');
  }
});

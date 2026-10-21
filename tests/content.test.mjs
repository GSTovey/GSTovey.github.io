import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { renderPage, safeUrl, escapeHtml, publicationCard } from '../src/render.mjs';
import { site, interests } from '../src/data/site.mjs';
import { publications } from '../src/data/publications.mjs';
import { projects, openSource } from '../src/data/projects.mjs';
import { news, experience } from '../src/data/updates.mjs';

const content = { site, interests, publications, projects, openSource, news, experience };
test('all navigation anchors resolve to unique, rendered sections', () => {
  const html = renderPage(content);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const [, hash] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(hash), hash);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.ok(html.includes('<html lang="en">'));
});
test('empty collections and missing optional data do not produce empty sections or links', () => {
  const html = renderPage({ site: { ...site, email: undefined, avatar: undefined }, publications: [], projects: [], openSource: [], interests: [], news: [], experience: [] });
  for (const id of ['publications', 'projects', 'open-source', 'research', 'news', 'experience']) {
    assert.ok(!html.includes(`id="${id}"`), id);
    assert.ok(!html.includes(`href="#${id}"`), id);
  }
  assert.ok(!/href=""|undefined|null|mailto:/.test(html));
  const minimal = renderPage({ site, publications: [{ title: 'A long title without optional metadata' }, null, {}], projects: [{ title: 'Minimal project' }] });
  assert.ok(minimal.includes('A long title without optional metadata'));
  assert.ok(minimal.includes('Minimal project'));
  assert.ok(!minimal.includes('data-citation='));
  assert.ok(!minimal.includes('>Demo<'));
});
test('untrusted text is escaped and unsafe external links are omitted', () => {
  assert.equal(escapeHtml('<script>"&'), '&lt;script&gt;&quot;&amp;');
  for (const url of ['javascript:alert(1)', 'http://example.com', 'data:text/html,test', 'https://user:secret@example.com', '#fake']) assert.equal(safeUrl(url), '');
  const card = publicationCard({ title: '<img src=x onerror=alert(1)>', paperUrl: 'javascript:alert(1)', tags: ['<script>'] }, 0);
  assert.ok(!card.includes('<img'));
  assert.ok(!card.includes('javascript:'));
  assert.ok(card.includes('&lt;img'));
});
test('verified NESTTOR citation preserves author order and DOI without an unsupported status', () => {
  assert.deepEqual(publications[0].authors, ['Chenxin Zhou', 'Cheng Huang', 'Qiang Zhang', 'Qiliang Xie', 'Zeqing Li']);
  assert.ok(publications[0].paperUrl.endsWith('10.1109/TNSM.2026.3743261'));
  assert.equal(publications[0].status, undefined);
  const html = renderPage(content);
  for (const a of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) assert.ok(a[0].includes('rel="noopener noreferrer"'));
});
test('valid news and experience render, and malformed entries are excluded', () => {
  const html = renderPage({ site, news: [{ title: 'Verified event', date: '2026-10-21' }, { title: 'Invalid date', date: 'not-a-date' }], experience: [{ title: 'Verified role' }] });
  assert.ok(html.includes('id="news"'));
  assert.ok(html.includes('id="experience"'));
  assert.ok(!html.includes('Invalid date'));
});
test('every configured project has a real HTTPS source and no open-source card duplicates a research project', () => {
  for (const p of [...projects, ...openSource]) assert.ok(safeUrl(p.repository));
  for (const p of openSource) assert.ok(!projects.some((r) => r.repository === p.repository));
});
test('GitHub Pages workflow deploys the built root-domain site', async () => {
  const workflow = await readFile(new URL('../.github/workflows/pages.yml', import.meta.url), 'utf8');
  assert.ok(workflow.includes('path: dist'));
  assert.ok(workflow.includes('actions/deploy-pages@v4'));
  assert.ok(workflow.includes('pages: write'));
  assert.ok(workflow.includes('id-token: write'));
});

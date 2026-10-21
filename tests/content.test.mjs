import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { renderPage, safeUrl, escapeHtml, publicationCard } from '../src/render.mjs';
import { site, interests } from '../src/data/site.mjs';
import { publications } from '../src/data/publications.mjs';
import { projects, openSource } from '../src/data/projects.mjs';
import { news, experience } from '../src/data/updates.mjs';
import { getMessages, localizeContent } from '../src/i18n.mjs';
import { education } from '../src/data/education.mjs';

const content = { site, interests, publications, projects, education, openSource, news, experience };
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
  for (const id of ['publications', 'projects', 'education', 'open-source', 'research', 'news', 'experience']) {
    assert.ok(!html.includes(`id="${id}"`), id);
    assert.ok(!html.includes(`href="#${id}"`), id);
  }
  assert.ok(!/href=""|undefined|null|mailto:/.test(html));
  const minimal = renderPage({ site, publications: [{ title: 'A long title without optional metadata' }, null, {}], projects: [{ title: 'Minimal project' }] });
  assert.ok(minimal.includes('A long title without optional metadata'));
  assert.ok(minimal.includes('Minimal project'));
  assert.ok(!minimal.includes('data-citation='));
  assert.ok(!minimal.includes('data-copy-citation='));
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

test('Chinese output translates content, controls and SEO while preserving original citations', () => {
  const html = renderPage(content, { locale: 'zh' });
  assert.ok(html.includes('<html lang="zh-Hans">'));
  for (const phrase of ['网络安全研究', '研究方向', '聚焦研究问题。', '四川大学', '关闭引用', '复制 BibTeX', '展开导航', '返回顶部']) assert.ok(html.includes(phrase), phrase);
  assert.ok(html.includes('rel="canonical" href="https://gstovey.github.io/zh/"'));
  assert.ok(html.includes('hreflang="en"'));
  assert.ok(html.includes('hreflang="zh-Hans"'));
  for (const p of publications) {
    assert.ok(html.includes(escapeHtml(p.title)));
    assert.ok(html.includes(p.authors.map(escapeHtml).join(', ')));
  }
  assert.deepEqual(Object.keys(getMessages('en')), Object.keys(getMessages('zh')));
});

test('owner-provided papers and ORCID keep exact identifiers and author order', () => {
  assert.equal(publications.length, 3);
  const r3s = publications.find((p) => p.id === 'r3s-2026');
  assert.deepEqual(r3s.authors, ['Z. Li', 'C. Huang', 'J. Peng', 'X. Tian', 'C. Zhou', 'P. Cheng']);
  assert.ok(r3s.paperUrl.endsWith('10.1109/TIFS.2026.3725546'));
  const apt = publications.find((p) => p.id === 'aptbert-2024');
  assert.equal(apt.year, 2024);
  assert.ok(apt.venue.includes('ICDF2C 2023'));
  assert.deepEqual(apt.authors, ['C. Zhou', 'C. Huang', 'Y. Wang', 'Z. Zuo']);
  assert.equal(site.orcid, 'https://orcid.org/0000-0002-5871-946X');
  assert.ok(renderPage(content).includes(`href="${site.orcid}"`));
});

test('localization falls back for optional translations without mutating shared data', () => {
  const before = JSON.stringify(content);
  const zh = localizeContent(content, 'zh');
  assert.equal(zh.site.name, site.name);
  assert.equal(zh.publications[0].title, publications[0].title);
  assert.notEqual(zh.publications[0].summary, publications[0].summary);
  renderPage({ site, publications: [{ title: 'Original title only' }, null, {}] }, { locale: 'zh' });
  assert.equal(JSON.stringify(content), before);
});

test('Education preserves four separate study periods, schools and stages in both languages', () => {
  assert.deepEqual(education.map((entry) => [entry.start, entry.end]), [
    ['2019.09', '2020.06'], ['2020.09', '2024.06'], ['2024.09', '2026.06'], ['2026.09', null],
  ]);
  const zh = localizeContent(content, 'zh').education;
  assert.deepEqual(zh.map((entry) => entry.school), ['轻工科学与工程学院', '网络空间安全学院', '网络空间安全学院', '网络空间安全学院']);
  assert.deepEqual(zh.map((entry) => entry.stage), ['本科阶段', '本科阶段', '硕士阶段', '博士阶段']);
  assert.ok(education.every((entry) => entry.institution === 'Sichuan University'));
  assert.deepEqual(education.filter((entry) => entry.current).map((entry) => entry.start), ['2026.09']);
  for (const locale of ['en', 'zh']) {
    const html = renderPage(content, { locale });
    assert.equal((html.match(/class="education-item/g) || []).length, 4);
    assert.ok(html.indexOf('id="projects"') < html.indexOf('id="education"'));
    assert.ok(html.indexOf('id="education"') < html.indexOf('id="open-source"'));
    assert.ok(html.includes('href="#education"'));
    assert.ok(html.includes('datetime="2019-09"'));
    assert.ok(html.includes(locale === 'zh' ? '至今' : 'Present'));
  }
});

test('card copy controls reuse one citation source and disappear when data is missing', () => {
  const html = renderPage(content);
  assert.equal((html.match(/data-copy-citation=/g) || []).length, publications.length);
  for (const [index, paper] of publications.entries()) {
    assert.ok(html.includes(`data-copy-citation="${index}"`));
    assert.equal(html.split(escapeHtml(paper.bibtex)).length - 1, 1);
  }
  const incomplete = renderPage({ site, education: [{ institution: 'Unverified', school: 'Missing dates' }], publications: [{ title: 'No citation' }] });
  assert.ok(!incomplete.includes('id="education"'));
  assert.ok(!incomplete.includes('data-copy-citation='));
});

test('Contact stays open to general discussion and the progress decoration is hidden from assistive technology', () => {
  for (const locale of ['en', 'zh']) {
    const localized = localizeContent(content, locale);
    assert.ok(!localized.site.contactText.includes('NESTTOR'));
    const html = renderPage(content, { locale });
    assert.ok(html.includes('class="scroll-progress" aria-hidden="true"'));
    assert.ok(html.includes('class="profile-traces"'));
    assert.ok(html.includes(`mailto:${site.email}`));
    assert.ok(html.includes(site.orcid));
    assert.ok(html.includes(locale === 'zh' ? '欢迎交流' : 'Let’s Connect'));
  }
});

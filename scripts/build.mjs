import { access, cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { renderPage } from '../src/render.mjs';
import { site, interests } from '../src/data/site.mjs';
import { publications } from '../src/data/publications.mjs';
import { projects, openSource } from '../src/data/projects.mjs';
import { news, experience } from '../src/data/updates.mjs';

export const root = fileURLToPath(new URL('../', import.meta.url));
export const output = path.join(root, 'dist');
export async function build() {
  let avatar = site.avatarFallback;
  for (const candidate of [site.avatar, '/assets/avatar.png', '/assets/avatar.jpg']) {
    if (await access(path.join(root, 'public', candidate)).then(() => true, () => false)) {
      avatar = candidate;
      break;
    }
  }
  const resolvedSite = { ...site, avatar };
  const html = renderPage({ site: resolvedSite, interests, publications, projects, openSource, news, experience });
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  await cp(path.join(root, 'public'), output, { recursive: true });
  await Promise.all([
    writeFile(path.join(output, 'index.html'), html),
    writeFile(path.join(output, '.nojekyll'), ''),
    writeFile(path.join(output, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site.url}sitemap.xml\n`),
    writeFile(path.join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${site.url}</loc></url></urlset>\n`),
    writeFile(path.join(output, '404.html'), '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page not found — Tovey</title><link rel="stylesheet" href="/assets/styles.css"><main class="container section"><p class="eyebrow">404</p><h1>Page not found.</h1><p>This page may have moved.</p><p><a class="button button-primary" href="/">Return to the homepage</a></p></main></html>'),
  ]);
  console.log(`Built static portfolio → ${output}`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();

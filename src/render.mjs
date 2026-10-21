import { icon } from './icons.mjs';

export const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const e = escapeHtml;
const text = (value) => typeof value === 'string' && value.trim().length > 0;
const entries = (list) => Array.isArray(list) ? list.filter((x) => x && text(x.title)) : [];
const strings = (list) => Array.isArray(list) ? list.filter(text) : [];
export function safeUrl(value) {
  if (!text(value)) return '';
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : '';
  } catch { return ''; }
}
const external = (href, label, glyph = 'arrow', className = '') => safeUrl(href) ? `<a class="${e(className)}" href="${e(safeUrl(href))}" target="_blank" rel="noopener noreferrer">${icon(glyph)}<span>${e(label)}</span><span class="sr-only"> (opens in a new tab)</span></a>` : '';
const tags = (list) => strings(list).length ? `<ul class="tags" aria-label="Topics">${strings(list).map((tag) => `<li>${e(tag)}</li>`).join('')}</ul>` : '';
const heading = (number, eyebrow, title, description, aside = '') => `<div class="section-heading"><div><p class="eyebrow"><span>${number}</span> ${e(eyebrow)}</p><h2>${e(title)}</h2>${description ? `<p class="section-intro">${e(description)}</p>` : ''}</div>${aside}</div>`;

export function publicationCard(p, index) {
  const paper = safeUrl(p.paperUrl);
  const statuses = ['Published', 'Accepted', 'Preprint', 'Under Review', 'In Preparation'];
  return `<article class="publication-card">
    <div class="publication-year">${p.year ? `<span>${e(p.year)}</span>` : icon('file')}<span class="publication-index">${String(index + 1).padStart(2, '0')}</span></div>
    <div class="publication-content">
      ${text(p.venue) ? `<p class="venue">${e(p.venue)}</p>` : ''}
      ${statuses.includes(p.status) ? `<p class="status">${e(p.status)}</p>` : ''}
      <h3>${paper ? `<a href="${e(paper)}" target="_blank" rel="noopener noreferrer">${e(p.title)}${icon('arrow')}<span class="sr-only"> (opens in a new tab)</span></a>` : e(p.title)}</h3>
      ${strings(p.authors).length ? `<p class="authors">${strings(p.authors).map(e).join(', ')}</p>` : ''}
      ${text(p.summary) ? `<p class="publication-summary">${e(p.summary)}</p>` : ''}
      ${tags(p.tags)}
      <div class="card-actions">
        ${external(paper, 'Paper', 'file')}${external(p.codeUrl, 'Code', 'code')}${external(p.projectUrl, 'Project', 'arrow')}
        ${text(p.bibtex) ? `<button class="text-button cite-button" type="button" data-citation="${index}" aria-haspopup="dialog">${icon('quote')}<span>Cite<span class="sr-only"> ${e(p.title)}</span></span></button>` : ''}
      </div>
    </div>
  </article>`;
}

export function projectCard(project) {
  return `<article class="project-card">
    <div class="project-top"><span class="icon-box">${icon(project.icon)}</span>${text(project.eyebrow) ? `<span class="project-type">${e(project.eyebrow)}</span>` : ''}</div>
    <h3>${e(project.title)}</h3>
    ${text(project.description) ? `<p>${e(project.description)}</p>` : ''}
    ${strings(project.steps).length ? `<ol class="project-flow" aria-label="Workflow">${strings(project.steps).map((step) => `<li>${e(step)}</li>`).join('')}</ol>` : ''}
    ${tags(project.tags)}
    <div class="card-actions">${external(project.repository, 'Repository', 'github')}${external(project.documentation, 'Readme', 'book')}${external(project.demo, 'Demo', 'arrow')}</div>
  </article>`;
}

export function renderPage(content) {
  const { site, interests = [] } = content;
  const publications = entries(content.publications);
  const projects = entries(content.projects);
  const openSource = entries(content.openSource);
  const news = entries(content.news).filter((x) => /^\d{4}-\d{2}-\d{2}$/.test(x.date || ''));
  const experience = entries(content.experience);
  const research = entries(interests);
  const navigation = [ ['home', 'Home'], ...(research.length ? [['research', 'Research']] : []), ...(publications.length ? [['publications', 'Publications']] : []), ...(projects.length ? [['projects', 'Projects']] : []), ...(openSource.length ? [['open-source', 'Open source']] : []), ['contact', 'Contact'] ];
  const avatar = typeof site.avatar === 'string' && /^\/assets\/[\w.-]+$/.test(site.avatar) ? site.avatar : safeUrl(site.avatar);
  const email = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(site.email || '') ? site.email : '';
  const citationDialogs = publications.map((p, i) => text(p.bibtex) ? `<dialog id="citation-${i}" aria-labelledby="citation-heading-${i}"><div class="dialog-header"><div><p class="eyebrow">REFERENCE</p><h2 id="citation-heading-${i}">Cite this work</h2></div><button class="icon-button close-dialog" type="button" aria-label="Close citation">${icon('close')}</button></div><p class="citation-title">${e(p.title)}</p><pre tabindex="0"><code>${e(p.bibtex)}</code></pre><div class="dialog-footer"><button class="button button-primary copy-citation" type="button">${icon('copy')} Copy BibTeX</button><p class="copy-status" role="status"></p></div></dialog>` : '').join('');
  const schema = JSON.stringify({ '@context': 'https://schema.org', '@type': 'ProfilePage', url: site.url, name: site.title, mainEntity: { '@type': 'Person', name: site.name, url: site.url, sameAs: [safeUrl(site.github)].filter(Boolean), affiliation: { '@type': 'CollegeOrUniversity', name: site.institution } } }).replace(/</g, '\\u003c');
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${e(site.title)}</title>
  <meta name="description" content="${e(site.description)}">
  <meta name="theme-color" content="#935BED">
  <link rel="canonical" href="${e(site.url)}">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <meta property="og:type" content="profile">
  <meta property="og:locale" content="en_US">
  <meta property="og:title" content="${e(site.title)}">
  <meta property="og:description" content="${e(site.description)}">
  <meta property="og:url" content="${e(site.url)}">
  <meta property="og:image" content="${e(new URL('/assets/social-card.png', site.url).href)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Tovey — Network security, encrypted traffic analysis, and traffic classification">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="stylesheet" href="/assets/styles.css">
  <script type="application/ld+json">${schema}</script>
  <script type="module" src="/assets/main.js"></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="container header-inner">
      <a class="wordmark" href="#home" aria-label="${e(site.name)} — home">${e(site.name.toLowerCase())}<span aria-hidden="true">.</span></a>
      <button class="menu-toggle icon-button" type="button" aria-controls="navigation" aria-expanded="false" aria-label="Open navigation">${icon('menu', 'menu-open-icon')}${icon('close', 'menu-close-icon')}</button>
      <nav id="navigation" aria-label="Main navigation">${navigation.map(([id, label]) => `<a href="#${id}"${id === 'home' ? ' aria-current="location"' : ''}>${label}</a>`).join('')}</nav>
    </div>
  </header>
  <main id="main">
    <section class="hero container" id="home" aria-labelledby="hero-heading">
      <div class="hero-copy">
        <p class="hero-kicker"><span aria-hidden="true"></span> NETWORK SECURITY RESEARCH</p>
        <h1 id="hero-heading">Hi, I’m <span>${e(site.name)}.</span></h1>
        <p class="hero-headline">${e(site.headline)}</p>
        <p class="hero-bio">${e(site.bio)}</p>
        <div class="hero-actions"><a class="button button-primary" href="#${research.length ? 'research' : 'contact'}">Explore my research ${icon('right')}</a>${external(site.github, 'GitHub profile', 'github', 'button button-secondary')}</div>
      </div>
      <aside class="profile-card" aria-label="Research profile">
        <div class="profile-card-top"><span>RESEARCH PROFILE</span><span class="profile-dots" aria-hidden="true">● ● ●</span></div>
        <div class="avatar-wrap"><span class="avatar-monogram" aria-hidden="true">${e(site.name.charAt(0))}</span>${avatar ? `<img class="avatar" src="${e(avatar)}" data-fallback="${e(safeUrl(site.avatarFallback))}" width="140" height="140" alt="${e(site.name)}’s GitHub profile avatar" decoding="async">` : ''}</div>
        <p class="profile-name">${e(site.name)} <span>/ ${e(site.handle)}</span></p>
        <p class="profile-role">${e(site.role)} · ${e(site.lab)}</p>
        <div class="profile-affiliation">${icon('school')}<span>${e(site.institution)}</span></div>
        <div class="profile-card-bottom"><span>Research, code &amp; ideas</span>${icon('code')}</div>
      </aside>
    </section>

    ${research.length ? `<section class="section research-section" id="research" aria-labelledby="research-title"><div class="container">${heading('01', 'RESEARCH INTERESTS', 'Looking beyond the surface.', '') .replace('<h2>', '<h2 id="research-title">')}<div class="interests-grid">${research.map((item) => `<article class="interest"><span class="interest-icon">${icon(item.icon)}</span><h3>${e(item.title)}</h3>${text(item.description) ? `<p>${e(item.description)}</p>` : ''}</article>`).join('')}</div></div></section>` : ''}

    ${publications.length ? `<section class="section container" id="publications" aria-labelledby="publications-title">${heading('02', 'SELECTED PUBLICATIONS', 'Research in focus.', 'A selection of work on encrypted and anonymous network traffic.').replace('<h2>', '<h2 id="publications-title">')}<div class="publications-list">${publications.map(publicationCard).join('')}</div></section>` : ''}

    ${projects.length ? `<section class="section container projects-section" id="projects" aria-labelledby="projects-title">${heading('03', 'RESEARCH PROJECTS', 'From questions to implementations.', 'Methods and tools behind the research.').replace('<h2>', '<h2 id="projects-title">')}<div class="projects-grid">${projects.map(projectCard).join('')}</div></section>` : ''}

    ${openSource.length ? `<section class="section container open-source-section" id="open-source" aria-labelledby="open-source-title">${heading('04', 'OPEN SOURCE', 'Knowledge worth sharing.', 'Resources for reading, connecting, and building on research.', external(site.repositories || site.github, 'All repositories', 'arrow', 'section-link')).replace('<h2>', '<h2 id="open-source-title">')}<div class="resource-list">${openSource.map((resource) => `<article class="resource-card"><span class="icon-box">${icon(resource.icon)}</span><div class="resource-content"><h3>${e(resource.title)}</h3>${text(resource.description) ? `<p>${e(resource.description)}</p>` : ''}${tags(resource.tags)}<div class="card-actions">${external(resource.repository, 'Repository', 'github')}${external(resource.documentation, 'Getting started', 'book')}</div></div></article>`).join('')}</div></section>` : ''}

    ${news.length ? `<section class="section container" id="news" aria-labelledby="news-title">${heading('05', 'UPDATES', 'Latest news.', '').replace('<h2>', '<h2 id="news-title">')}<ul class="timeline">${news.map((item) => `<li><time datetime="${e(item.date)}">${e(item.date)}</time><div><h3>${e(item.title)}</h3>${text(item.description) ? `<p>${e(item.description)}</p>` : ''}${external(item.url, 'Read more')}</div></li>`).join('')}</ul></section>` : ''}

    ${experience.length ? `<section class="section container" id="experience" aria-labelledby="experience-title"><h2 id="experience-title">Education &amp; experience</h2><ul class="timeline">${experience.map((item) => `<li><span>${e(item.period)}</span><div><h3>${e(item.title)}</h3>${text(item.institution) ? `<p>${e(item.institution)}</p>` : ''}${text(item.description) ? `<p>${e(item.description)}</p>` : ''}</div></li>`).join('')}</ul></section>` : ''}

    <section class="contact-section container" id="contact" aria-labelledby="contact-title"><div class="contact-card"><div><p class="eyebrow">LET’S CONNECT</p><h2 id="contact-title">Good research starts with a conversation.</h2><p>${e(site.contactText)}</p></div>${email ? `<a class="button button-primary" href="mailto:${e(email)}">${icon('mail')} Get in touch ${icon('arrow')}</a><a class="contact-email" href="mailto:${e(email)}">${e(email)}</a>` : external(site.github, 'Find me on GitHub', 'github', 'button button-primary')}</div></section>
  </main>
  <footer class="container site-footer"><p><span class="footer-brand">${e(site.name.toLowerCase())}<span>.</span></span><span>© ${new Date().getUTCFullYear()} ${e(site.name)}</span></p><div>${external(site.github, 'GitHub', 'github')}<a class="back-top" href="#home">Back to top ${icon('up')}</a></div></footer>
  ${citationDialogs}
</body>
</html>`;
}

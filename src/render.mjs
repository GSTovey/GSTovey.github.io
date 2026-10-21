import { icon } from './icons.mjs';
import { getMessages, localizeContent } from './i18n.mjs';

export const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const e = escapeHtml;
const text = (value) => typeof value === 'string' && value.trim().length > 0;
const entries = (list) => Array.isArray(list) ? list.filter((x) => x && text(x.title)) : [];
const strings = (list) => Array.isArray(list) ? list.filter(text) : [];
const json = (value) => JSON.stringify(value).replace(/</g, '\\u003c');
export function safeUrl(value) {
  if (!text(value)) return '';
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : '';
  } catch { return ''; }
}
function helpers(ui) {
  return {
    external: (href, label, glyph = 'arrow', className = '') => safeUrl(href) ? `<a class="${e(className)}" href="${e(safeUrl(href))}" target="_blank" rel="noopener noreferrer">${icon(glyph, glyph === 'arrow' ? 'external-arrow' : '')}<span>${e(label)}</span><span class="sr-only">${e(ui.newTab)}</span></a>` : '',
    tags: (list) => strings(list).length ? `<ul class="tags" aria-label="${e(ui.topics)}">${strings(list).map((tag) => `<li>${e(tag)}</li>`).join('')}</ul>` : '',
    heading: (id, number, eyebrow, title, description, aside = '') => `<div class="section-heading"><div><p class="eyebrow"><span>${number}</span> ${e(eyebrow)}</p><h2 id="${id}">${e(title)}</h2>${description ? `<p class="section-intro">${e(description)}</p>` : ''}</div>${aside}</div>`,
  };
}

export function publicationCard(p, index, ui = getMessages()) {
  const { external, tags } = helpers(ui);
  const paper = safeUrl(p.paperUrl);
  return `<article class="publication-card">
    <div class="publication-year">${p.year ? `<span>${e(p.year)}</span>` : icon('file')}<span class="publication-index">${String(index + 1).padStart(2, '0')}</span></div>
    <div class="publication-content">
      ${text(p.venue) ? `<p class="venue">${e(p.venue)}</p>` : ''}
      ${Object.hasOwn(ui.statuses, p.status) ? `<p class="status">${e(ui.statuses[p.status])}</p>` : ''}
      <h3${p.language === 'en' ? ' lang="en"' : ''}>${paper ? `<a href="${e(paper)}" target="_blank" rel="noopener noreferrer">${e(p.title)}${icon('arrow', 'external-arrow')}<span class="sr-only">${e(ui.newTab)}</span></a>` : e(p.title)}</h3>
      ${strings(p.authors).length ? `<p class="authors">${strings(p.authors).map(e).join(', ')}</p>` : ''}
      ${text(p.summary) ? `<p class="publication-summary">${e(p.summary)}</p>` : ''}
      ${tags(p.tags)}
      <div class="card-actions">
        ${external(paper, ui.paper, 'file')}${external(p.codeUrl, ui.code, 'code')}${external(p.projectUrl, ui.project, 'arrow')}
        ${text(p.bibtex) ? `<button class="text-button cite-button" type="button" data-citation="${index}" aria-haspopup="dialog">${icon('quote')}<span>${e(ui.cite)}<span class="sr-only"> ${e(p.title)}</span></span></button>` : ''}
        ${text(p.bibtex) ? `<button class="text-button copy-bibtex-button" type="button" data-copy-citation="${index}">${icon('copy')}<span data-copy-label>${e(ui.copyBibtex)}</span><span class="sr-only"> ${e(p.title)}</span></button><span class="sr-only copy-feedback" role="status" aria-atomic="true"></span>` : ''}
      </div>
    </div>
  </article>`;
}

export function projectCard(project, ui = getMessages()) {
  const { external, tags } = helpers(ui);
  return `<article class="project-card">
    <div class="project-top"><span class="icon-box">${icon(project.icon)}</span>${text(project.eyebrow) ? `<span class="project-type">${e(project.eyebrow)}</span>` : ''}</div>
    <h3>${e(project.title)}</h3>
    ${text(project.description) ? `<p>${e(project.description)}</p>` : ''}
    ${strings(project.steps).length ? `<ol class="project-flow" aria-label="${e(ui.workflow)}">${strings(project.steps).map((step) => `<li>${e(step)}</li>`).join('')}</ol>` : ''}
    ${tags(project.tags)}
    <div class="card-actions">${external(project.repository, ui.repository, 'github')}${external(project.documentation, ui.readme, 'book')}${external(project.demo, ui.demo, 'arrow')}</div>
  </article>`;
}

function educationTimeline(items, ui) {
  const time = (value) => `<time datetime="${e(value.replace('.', '-'))}">${e(value)}</time>`;
  return `<ol class="education-timeline">${items.map((item) => `<li class="education-item${item.current ? ' is-current' : ''}"><div class="education-period">${time(item.start)}<span>–</span>${item.end ? time(item.end) : `<span>${e(ui.present)}</span>`}</div><div class="education-entry"><h3>${e(item.institution)}</h3><p class="education-school">${e(item.school)}</p>${text(item.stage) ? `<p class="education-stage">${e(item.stage)}</p>` : ''}</div></li>`).join('')}</ol>`;
}

export function renderPage(content, { locale = 'en' } = {}) {
  const ui = getMessages(locale);
  const { external, tags, heading } = helpers(ui);
  const localized = localizeContent(content, locale);
  const { site } = localized;
  const publications = entries(localized.publications);
  const projects = entries(localized.projects);
  const education = localized.education.filter((item) => item && text(item.institution) && text(item.school) && /^\d{4}\.\d{2}$/.test(item.start || '') && (item.end ? /^\d{4}\.\d{2}$/.test(item.end) : item.current === true));
  const openSource = entries(localized.openSource);
  const news = entries(localized.news).filter((x) => /^\d{4}-\d{2}-\d{2}$/.test(x.date || ''));
  const experience = entries(localized.experience);
  const research = entries(localized.interests);
  const navigation = [ ['home', ui.home], ...(research.length ? [['research', ui.research]] : []), ...(publications.length ? [['publications', ui.publications]] : []), ...(projects.length ? [['projects', ui.projects]] : []), ...(education.length ? [['education', ui.education]] : []), ...(openSource.length ? [['open-source', ui.openSource]] : []), ['contact', ui.contact] ];
  const avatar = typeof site.avatar === 'string' && /^\/assets\/[\w.-]+$/.test(site.avatar) ? site.avatar : safeUrl(site.avatar);
  const email = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(site.email || '') ? site.email : '';
  const orcid = safeUrl(site.orcid);
  const orcidLabel = orcid ? new URL(orcid).pathname.replace(/\/$/, '').split('/').at(-1) : '';
  const pageUrl = new URL(locale === 'zh' ? '/zh/' : '/', site.url).href;
  const citationDialogs = publications.map((p, i) => text(p.bibtex) ? `<dialog id="citation-${i}" aria-labelledby="citation-heading-${i}"><div class="dialog-header"><div><p class="eyebrow">${e(ui.reference)}</p><h2 id="citation-heading-${i}">${e(ui.citeTitle)}</h2></div><button class="icon-button close-dialog" type="button" aria-label="${e(ui.closeCitation)}">${icon('close')}</button></div><p class="citation-title">${e(p.title)}</p><pre tabindex="0"><code>${e(p.bibtex)}</code></pre><div class="dialog-footer"><button class="button button-primary copy-citation" type="button">${icon('copy')}<span data-copy-label>${e(ui.copyBibtex)}</span></button><p class="copy-status" role="status"></p></div></dialog>` : '').join('');
  const schema = json({ '@context': 'https://schema.org', '@type': 'ProfilePage', url: pageUrl, name: site.title, inLanguage: ui.lang, mainEntity: { '@type': 'Person', name: site.name, url: site.url, sameAs: [safeUrl(site.github), safeUrl(site.orcid)].filter(Boolean), affiliation: { '@type': 'CollegeOrUniversity', name: site.institution } } });
  return `<!doctype html>
<html lang="${ui.lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${e(site.title)}</title>
  <meta name="description" content="${e(site.description)}">
  <meta name="theme-color" content="#935BED">
  <link rel="canonical" href="${e(pageUrl)}">
  <link rel="alternate" hreflang="en" href="${e(site.url)}">
  <link rel="alternate" hreflang="zh-Hans" href="${e(new URL('/zh/', site.url).href)}">
  <link rel="alternate" hreflang="x-default" href="${e(site.url)}">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <meta property="og:type" content="profile">
  <meta property="og:locale" content="${ui.ogLocale}">
  <meta property="og:locale:alternate" content="${locale === 'zh' ? 'en_US' : 'zh_CN'}">
  <meta property="og:title" content="${e(site.title)}">
  <meta property="og:description" content="${e(site.description)}">
  <meta property="og:url" content="${e(pageUrl)}">
  <meta property="og:image" content="${e(new URL('/assets/social-card.png', site.url).href)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${e(site.description)}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preload" href="/assets/fonts/manrope-latin-variable.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/assets/styles.css">
  <script>try{if(location.pathname==='/'&&localStorage.getItem('portfolio-language')==='zh')location.replace('/zh/'+location.search+location.hash)}catch{}</script>
  <script type="application/ld+json">${schema}</script>
  <script type="application/json" id="ui-messages">${json(ui)}</script>
  <script type="module" src="/assets/main.js"></script>
</head>
<body>
  <a class="skip-link" href="#main">${e(ui.skip)}</a>
  <div class="scroll-progress" aria-hidden="true"><span></span></div>
  <header class="site-header">
    <div class="container header-inner">
      <a class="wordmark" href="#home" aria-label="${e(site.name)} — ${e(ui.homeLabel)}">${e(site.name.toLowerCase())}<span aria-hidden="true">.</span></a>
      <nav id="navigation" aria-label="${e(ui.mainNavigation)}">${navigation.map(([id, label]) => `<a href="#${id}"${id === 'home' ? ' aria-current="location"' : ''}>${label}</a>`).join('')}</nav>
      <div class="header-tools"><a class="language-switch" data-language-switch data-locale="${ui.targetLocale}" href="${ui.targetPath}" hreflang="${locale === 'zh' ? 'en' : 'zh-Hans'}" lang="${locale === 'zh' ? 'en' : 'zh-Hans'}" aria-label="${e(ui.switchLabel)}">${icon('globe')}<span>${ui.targetLabel}</span></a><button class="menu-toggle icon-button" type="button" aria-controls="navigation" aria-expanded="false" aria-label="${e(ui.openNavigation)}">${icon('menu', 'menu-open-icon')}${icon('close', 'menu-close-icon')}</button></div>
    </div>
  </header>
  <main id="main">
    <section class="hero container" id="home" aria-labelledby="hero-heading">
      <div class="hero-copy">
        <p class="hero-kicker"><span aria-hidden="true"></span> ${e(ui.researchKicker)}</p>
        <h1 id="hero-heading">${e(ui.greeting)}<span>${e(site.name)}${e(ui.greetingEnd)}</span></h1>
        <p class="hero-headline">${e(site.headline)}</p>
        <p class="hero-bio">${e(site.bio)}</p>
        <div class="hero-actions"><a class="button button-primary" href="#${research.length ? 'research' : 'contact'}">${e(ui.explore)} ${icon('right', 'direction-arrow')}</a>${external(site.github, ui.githubProfile, 'github', 'button button-secondary')}</div>
        ${orcid ? `<div class="hero-socials">${external(orcid, `ORCID · ${orcidLabel}`, 'arrow')}</div>` : ''}
      </div>
      <aside class="profile-card" aria-label="${e(ui.profile)}">
        <div class="profile-card-top"><span>${e(ui.profileKicker)}</span><span class="profile-dots" aria-hidden="true">● ● ●</span></div>
        <svg class="profile-traces" viewBox="0 0 292 210" aria-hidden="true" focusable="false" fill="none"><g stroke="currentColor" stroke-width="1"><path d="M-8 65h46l20 20h15M219 43h17l19-19h45M-8 172h48l28-28h7M219 151h17l22 22h42"/><circle cx="38" cy="65" r="3"/><circle cx="236" cy="43" r="3"/><circle cx="40" cy="172" r="3"/><circle cx="258" cy="173" r="3"/></g></svg>
        <div class="avatar-wrap"><span class="avatar-monogram" aria-hidden="true">${e(site.name.charAt(0))}</span>${avatar ? `<img class="avatar" src="${e(avatar)}" data-fallback="${e(safeUrl(site.avatarFallback))}" width="140" height="140" alt="${e(site.name)}${e(ui.avatarAlt)}" decoding="async">` : ''}</div>
        <p class="profile-name">${e(site.name)} <span>/ ${e(site.handle)}</span></p>
        <p class="profile-role">${e(site.role)} · ${e(site.lab)}</p>
        <div class="profile-affiliation">${icon('school')}<span>${e(site.institution)}</span></div>
        <div class="profile-card-bottom"><span>${e(ui.profileFooter)}</span>${icon('code')}</div>
      </aside>
    </section>

    ${research.length ? `<section class="section research-section" id="research" aria-labelledby="research-title"><div class="container">${heading('research-title', '01', ui.researchEyebrow, ui.researchTitle, '')}<div class="interests-grid">${research.map((item) => `<article class="interest"><span class="interest-icon">${icon(item.icon)}</span><h3>${e(item.title)}</h3>${text(item.description) ? `<p>${e(item.description)}</p>` : ''}</article>`).join('')}</div></div></section>` : ''}

    ${publications.length ? `<section class="section container" id="publications" aria-labelledby="publications-title">${heading('publications-title', '02', ui.publicationsEyebrow, ui.publicationsTitle, ui.publicationsIntro)}<div class="publications-list">${publications.map((p, i) => publicationCard(p, i, ui)).join('')}</div></section>` : ''}

    ${projects.length ? `<section class="section container projects-section" id="projects" aria-labelledby="projects-title">${heading('projects-title', '03', ui.projectsEyebrow, ui.projectsTitle, ui.projectsIntro)}<div class="projects-grid">${projects.map((p) => projectCard(p, ui)).join('')}</div></section>` : ''}

    ${education.length ? `<section class="section container education-section" id="education" aria-labelledby="education-title">${heading('education-title', '04', ui.educationEyebrow, ui.educationTitle, '')}${educationTimeline(education, ui)}</section>` : ''}

    ${openSource.length ? `<section class="section container open-source-section" id="open-source" aria-labelledby="open-source-title">${heading('open-source-title', education.length ? '05' : '04', ui.openSourceEyebrow, ui.openSourceTitle, ui.openSourceIntro, external(site.repositories || site.github, ui.allRepositories, 'arrow', 'section-link'))}<div class="resource-list">${openSource.map((resource) => `<article class="resource-card"><span class="icon-box">${icon(resource.icon)}</span><div class="resource-content"><h3>${e(resource.title)}</h3>${text(resource.description) ? `<p>${e(resource.description)}</p>` : ''}${tags(resource.tags)}<div class="card-actions">${external(resource.repository, ui.repository, 'github')}${external(resource.documentation, ui.gettingStarted, 'book')}</div></div></article>`).join('')}</div></section>` : ''}

    ${news.length ? `<section class="section container" id="news" aria-labelledby="news-title">${heading('news-title', education.length ? '06' : '05', ui.newsEyebrow, ui.newsTitle, '')}<ul class="timeline">${news.map((item) => `<li><time datetime="${e(item.date)}">${e(item.date)}</time><div><h3>${e(item.title)}</h3>${text(item.description) ? `<p>${e(item.description)}</p>` : ''}${external(item.url, ui.readMore)}</div></li>`).join('')}</ul></section>` : ''}

    ${experience.length ? `<section class="section container" id="experience" aria-labelledby="experience-title"><h2 id="experience-title">${e(ui.experienceTitle)}</h2><ul class="timeline">${experience.map((item) => `<li><span>${e(item.period)}</span><div><h3>${e(item.title)}</h3>${text(item.institution) ? `<p>${e(item.institution)}</p>` : ''}${text(item.description) ? `<p>${e(item.description)}</p>` : ''}</div></li>`).join('')}</ul></section>` : ''}

    <section class="contact-section container" id="contact" aria-labelledby="contact-title"><div class="contact-card"><div><p class="eyebrow">${e(ui.contactEyebrow)}</p><h2 id="contact-title">${e(ui.contactTitle)}</h2><p>${e(site.contactText)}</p></div>${email ? `<a class="button button-primary" href="mailto:${e(email)}">${icon('mail')} ${e(ui.getInTouch)} ${icon('arrow')}</a><a class="contact-email" href="mailto:${e(email)}">${e(email)}</a>` : external(site.github, ui.findOnGithub, 'github', 'button button-primary')}</div></section>
  </main>
  <footer class="container site-footer"><p><span class="footer-brand">${e(site.name.toLowerCase())}<span>.</span></span><span>© ${new Date().getUTCFullYear()} ${e(site.name)}</span></p><div>${external(site.github, 'GitHub', 'github')}<a class="back-top" href="#home">${e(ui.backTop)} ${icon('up')}</a></div></footer>
  ${citationDialogs}
</body>
</html>`;
}

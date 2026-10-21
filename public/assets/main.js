document.documentElement.classList.add('js');
const ui = JSON.parse(document.getElementById('ui-messages')?.textContent || '{}');

const languageSwitch = document.querySelector('[data-language-switch]');
if (languageSwitch) {
  const updateLanguageHash = () => { languageSwitch.hash = location.hash; };
  updateLanguageHash();
  window.addEventListener('hashchange', updateLanguageHash);
  languageSwitch.addEventListener('click', () => {
    try { localStorage.setItem('portfolio-language', languageSwitch.dataset.locale); } catch { /* Real links work without storage. */ }
  });
}

const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu(restoreFocus = false) {
  if (!toggle || !navigation) return;
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', ui.openNavigation);
  navigation.classList.remove('is-open');
  if (restoreFocus) toggle.focus();
}
toggle?.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(expanded));
  toggle.setAttribute('aria-label', expanded ? ui.closeNavigation : ui.openNavigation);
  navigation.classList.toggle('is-open', expanded);
  if (expanded) navigation.querySelector('a')?.focus();
});
navigation?.addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (link) {
    closeMenu();
    const section = document.getElementById(link.hash.slice(1));
    section?.setAttribute('tabindex', '-1');
    section?.focus({ preventScroll: true });
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.site-header')) closeMenu();
});
document.addEventListener('focusin', (event) => {
  if (!event.target.closest('.site-header')) closeMenu();
});
matchMedia('(min-width: 901px)').addEventListener('change', () => closeMenu());

// A short last section cannot always reach the top of the viewport. Handle
// the document bottom explicitly so Contact can still become current.
const links = [...(navigation?.querySelectorAll('a') || [])];
const sections = links.map((link) => document.getElementById(link.hash.slice(1))).filter(Boolean);
const scrollProgress = document.querySelector('.scroll-progress > span');
let activeFramePending = false;
function updateActiveSection() {
  const scrollDistance = Math.max(0, document.documentElement.scrollHeight - document.documentElement.clientHeight);
  const progress = scrollDistance > 0 ? Math.min(1, Math.max(0, scrollY / scrollDistance)) : 0;
  if (scrollProgress) scrollProgress.style.transform = `scaleX(${progress})`;
  const threshold = document.querySelector('.site-header').offsetHeight + 120;
  const atBottom = scrollDistance > 0 && Math.ceil(scrollY + innerHeight) >= document.documentElement.scrollHeight - 2;
  const current = atBottom ? sections.at(-1) : sections.findLast((section) => section.getBoundingClientRect().top <= threshold) || sections[0];
  for (const link of links) {
    if (link.hash === `#${current?.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
  activeFramePending = false;
}
function scheduleActiveSection() {
  if (!activeFramePending) {
    activeFramePending = true;
    requestAnimationFrame(updateActiveSection);
  }
}
window.addEventListener('scroll', scheduleActiveSection, { passive: true });
window.addEventListener('resize', scheduleActiveSection);
window.addEventListener('load', scheduleActiveSection, { once: true });
if ('ResizeObserver' in window) new ResizeObserver(scheduleActiveSection).observe(document.body);
updateActiveSection();

for (const avatar of document.querySelectorAll('img[data-fallback]')) {
  const fallback = () => {
    if (avatar.dataset.fallback && !avatar.dataset.triedFallback) {
      avatar.dataset.triedFallback = 'true';
      avatar.src = avatar.dataset.fallback;
    } else {
      avatar.hidden = true;
      avatar.parentElement.setAttribute('role', 'img');
      avatar.parentElement.setAttribute('aria-label', ui.avatarUnavailable);
    }
  };
  avatar.addEventListener('error', fallback);
  // An image may fail before this deferred module has executed.
  if (avatar.complete && !avatar.naturalWidth) fallback();
}

const copyResetTimers = new WeakMap();
async function copyCitation(dialog, button, feedback, showFallback = false) {
  if (button.disabled) return;
  const label = button.querySelector('[data-copy-label]');
  clearTimeout(copyResetTimers.get(button));
  feedback.textContent = '';
  button.disabled = true;
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(dialog.querySelector('code').textContent);
    label.textContent = ui.copied;
    feedback.textContent = ui.copySuccess;
  } catch {
    label.textContent = ui.copyFailed;
    if (showFallback && !dialog.open) dialog.showModal();
    feedback.textContent = ui.copyFailure;
    dialog.querySelector('.copy-status').textContent = ui.copyFailure;
    dialog.querySelector('pre').focus();
    const range = document.createRange();
    range.selectNodeContents(dialog.querySelector('code'));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  } finally {
    button.disabled = false;
    copyResetTimers.set(button, setTimeout(() => {
      label.textContent = ui.copyBibtex;
      // Keep manual-copy instructions visible until the dialog is closed.
      if (feedback.textContent === ui.copySuccess) feedback.textContent = '';
    }, 2500));
  }
}

for (const button of document.querySelectorAll('[data-citation]')) {
  const dialog = document.getElementById(`citation-${button.dataset.citation}`);
  button.addEventListener('click', () => {
    dialog.querySelector('.copy-status').textContent = '';
    dialog.showModal();
  });
  dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    }
  });
  const copyButton = dialog.querySelector('.copy-citation');
  copyButton.addEventListener('click', () => copyCitation(dialog, copyButton, dialog.querySelector('.copy-status')));
}

for (const button of document.querySelectorAll('[data-copy-citation]')) {
  const dialog = document.getElementById(`citation-${button.dataset.copyCitation}`);
  const feedback = button.closest('.publication-card').querySelector('.copy-feedback');
  button.addEventListener('click', () => copyCitation(dialog, button, feedback, true));
}

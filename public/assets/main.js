document.documentElement.classList.add('js');

const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu(restoreFocus = false) {
  if (!toggle || !navigation) return;
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open navigation');
  navigation.classList.remove('is-open');
  if (restoreFocus) toggle.focus();
}
toggle?.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(expanded));
  toggle.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('is-open', expanded);
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
let activeFramePending = false;
function updateActiveSection() {
  const threshold = document.querySelector('.site-header').offsetHeight + 120;
  const atBottom = Math.ceil(scrollY + innerHeight) >= document.documentElement.scrollHeight - 2;
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
updateActiveSection();

for (const avatar of document.querySelectorAll('img[data-fallback]')) {
  const fallback = () => {
    if (avatar.dataset.fallback && !avatar.dataset.triedFallback) {
      avatar.dataset.triedFallback = 'true';
      avatar.src = avatar.dataset.fallback;
    } else {
      avatar.hidden = true;
      avatar.parentElement.setAttribute('role', 'img');
      avatar.parentElement.setAttribute('aria-label', 'Profile image unavailable');
    }
  };
  avatar.addEventListener('error', fallback);
  // An image may fail before this deferred module has executed.
  if (avatar.complete && !avatar.naturalWidth) fallback();
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
  dialog.querySelector('.copy-citation').addEventListener('click', async () => {
    const status = dialog.querySelector('.copy-status');
    try {
      await navigator.clipboard.writeText(dialog.querySelector('code').textContent);
      status.textContent = 'BibTeX copied.';
    } catch {
      status.textContent = 'Select and copy the citation above.';
      dialog.querySelector('pre').focus();
    }
  });
}

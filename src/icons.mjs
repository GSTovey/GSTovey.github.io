// A small local subset of Lucide (ISC). See THIRD_PARTY_NOTICES.md.
const paths = {
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a17 17 0 0 1 0 20 17 17 0 0 1 0-20Z"/>',
  arrow: '<path d="M7 17 17 7M7 7h10v10"/>',
  right: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  up: '<path d="m6 12 6-6 6 6M12 6v14"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
  activity: '<path d="M2 12h4l3-8 6 16 3-8h4"/>',
  network: '<rect x="9" y="2" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="16" y="16" width="6" height="6" rx="1"/><path d="M12 8v4M5 16v-4h14v4"/>',
  book: '<path d="M12 7v14m0-14C9 4 5 4 2 5v15c3-1 7-1 10 1 3-2 7-2 10-1V5c-3-1-7-1-10 2Z"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
  code: '<path d="m8 8-4 4 4 4m8-8 4 4-4 4m-3-11-2 14"/>',
  terminal: '<rect x="2" y="3" width="20" height="18" rx="2"/><path d="m6 8 4 4-4 4m7 0h5"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 6 10 7L22 6"/>',
  quote: '<path d="M3 21c3 0 7-3 7-8V3H2v10h5c0 3-1 5-4 6Zm12 0c3 0 7-3 7-8V3h-8v10h5c0 3-1 5-4 6Z"/>',
  copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  school: '<path d="m2 9 10-5 10 5-10 5-10-5Zm4 2v6c4 3 8 3 12 0v-6M22 9v7"/>',
};
export function icon(name, className = '') {
  if (name === 'github') return `<svg class="icon ${className}" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 .75a11.25 11.25 0 0 0-3.558 21.924c.563.104.768-.244.768-.542 0-.267-.01-.974-.015-1.912-3.13.68-3.791-1.51-3.791-1.51-.512-1.3-1.25-1.646-1.25-1.646-1.023-.7.078-.686.078-.686 1.13.08 1.724 1.16 1.724 1.16 1.006 1.724 2.64 1.226 3.283.938.102-.728.393-1.226.715-1.508-2.498-.284-5.124-1.25-5.124-5.566 0-1.23.44-2.235 1.16-3.023-.117-.285-.503-1.43.11-2.98 0 0 .945-.303 3.094 1.155a10.79 10.79 0 0 1 5.63 0c2.148-1.458 3.09-1.155 3.09-1.155.615 1.55.23 2.695.114 2.98.722.788 1.158 1.793 1.158 3.023 0 4.327-2.63 5.28-5.137 5.558.404.35.764 1.042.764 2.1 0 1.517-.014 2.741-.014 3.113 0 .3.202.65.774.54A11.251 11.251 0 0 0 12 .75Z"/></svg>`;
  return `<svg class="icon ${className}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.file}</svg>`;
}

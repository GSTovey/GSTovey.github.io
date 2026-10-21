/**
 * @typedef {Object} Publication
 * @property {string} id
 * @property {string} title
 * @property {string[]} [authors] Keep the verified order.
 * @property {number} [year]
 * @property {string} [venue]
 * @property {'Published'|'Accepted'|'Preprint'|'Under Review'|'In Preparation'} [status]
 * @property {string} [summary]
 * @property {string[]} [tags]
 * @property {string} [paperUrl]
 * @property {string} [codeUrl]
 * @property {string} [projectUrl]
 * @property {string} [bibtex]
 */

/** @type {Publication[]} */
export const publications = [
  {
    id: 'nesttor-2026',
    title: 'NESTTOR: Detecting Tor-over-Proxy Traffic with Factorized Decisions',
    authors: ['Chenxin Zhou', 'Cheng Huang', 'Qiang Zhang', 'Qiliang Xie', 'Zeqing Li'],
    year: 2026,
    venue: 'IEEE Transactions on Network and Service Management',
    // Citation metadata is provided by the public README and CITATION.cff.
    // No separate publication-status badge until the publisher is checked.
    summary: 'How can Tor be detected when it is carried inside an encrypted proxy? NESTTOR studies a single bidirectional TCP flow and combines an independently trained proxy gate with a proxy-conditioned Tor detector. Stage-based features capture relative connection evolution, while evaluation across proxy types and capture periods controls for information leakage.',
    tags: ['Tor-over-Proxy', 'Traffic analysis', 'Factorized detection'],
    paperUrl: 'https://doi.org/10.1109/TNSM.2026.3743261',
    codeUrl: 'https://github.com/GSTovey/NestTor/tree/main/code',
    projectUrl: 'https://github.com/GSTovey/NestTor',
    bibtex: `@article{zhou2026nesttor,
  author  = {Zhou, Chenxin and Huang, Cheng and Zhang, Qiang and Xie, Qiliang and Li, Zeqing},
  title   = {{NESTTOR}: Detecting {Tor-over-Proxy} Traffic with Factorized Decisions},
  journal = {IEEE Transactions on Network and Service Management},
  year    = {2026},
  doi     = {10.1109/TNSM.2026.3743261},
  url     = {https://ieeexplore.ieee.org/document/11735245}
}`,
  },
];

/**
 * @typedef {Object} Project
 * @property {string} title
 * @property {string} [eyebrow]
 * @property {string} [description]
 * @property {string[]} [tags]
 * @property {string} [icon]
 * @property {string} [repository]
 * @property {string} [documentation]
 * @property {string} [demo]
 * @property {string[]} [steps]
 */

/** @type {Project[]} */
export const projects = [
  {
    title: 'NESTTOR',
    eyebrow: 'Detection framework',
    description: 'A research framework for detecting Tor-over-Proxy from client-to-proxy TCP flows. It separates evidence of an outer proxy from evidence of Tor inside it, then combines both decisions. The repository provides the implementation, evaluation resources, and the paper’s method overview.',
    tags: ['Python', 'Encrypted traffic', 'Detection'],
    icon: 'network',
    repository: 'https://github.com/GSTovey/NestTor',
    documentation: 'https://github.com/GSTovey/NestTor#readme',
    steps: ['Proxy gate + Tor detector', 'AND decision'],
  },
  {
    title: 'Tor Traffic Capture',
    eyebrow: 'Research tooling',
    description: 'A Docker-based workflow for collecting traffic from ordinary websites and Tor destinations. Browser automation and tcpdump produce per-visit PCAP files and logs, providing inputs for subsequent traffic analysis. Configuration files define the destinations and capture workflow.',
    tags: ['Shell', 'Docker', 'PCAP'],
    icon: 'terminal',
    repository: 'https://github.com/GSTovey/Tor-traffic-capture',
    documentation: 'https://github.com/GSTovey/Tor-traffic-capture#readme',
    steps: ['Browse', 'Capture', 'PCAP + logs'],
  },
];

/** Independent resources only; do not repeat the research project cards here. */
export const openSource = [
  {
    title: 'Traffic Classification Paper Wiki',
    description: 'An Obsidian knowledge base connecting paper notes, concepts, methods, and research questions in traffic classification. Structured notes and a linked bibliography support systematic literature review across encrypted traffic analysis and traffic foundation models.',
    tags: ['Obsidian', 'Markdown', 'Literature review'],
    icon: 'book',
    repository: 'https://github.com/GSTovey/Traffic-Classification-Paper-LLM-Wiki',
    documentation: 'https://github.com/GSTovey/Traffic-Classification-Paper-LLM-Wiki#usage',
  },
];

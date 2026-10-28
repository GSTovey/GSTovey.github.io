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
    description: 'Factorized Tor-over-Proxy detection from a single bidirectional TCP flow.',
    tags: ['Python', 'Encrypted traffic', 'Detection'],
    icon: 'network',
    repository: 'https://github.com/GSTovey/NestTor',
    documentation: 'https://github.com/GSTovey/NestTor#readme',
    steps: ['Proxy gate + Tor detector', 'AND decision'],
    translations: { zh: {
      eyebrow: '流量检测框架',
      description: '基于双向 TCP 流的因子化 Tor-over-Proxy 检测框架。',
      tags: ['Python', '加密流量', '流量检测'],
      steps: ['代理门控 + Tor 检测器', '与规则决策'],
    } },
  },
  {
    title: 'Tor-Crawl',
    description: 'A TorCrawl.py extension for multi-protocol traffic datasets, with Tor-over-Proxy and paired captures.',
    icon: 'activity',
    repository: 'https://github.com/GSTovey/Tor-Crawl',
    documentation: 'https://github.com/GSTovey/Tor-Crawl#readme',
    translations: { zh: {
      description: '扩展 TorCrawl.py，支持多协议代理、Tor-over-Proxy 与双视角流量采集。',
    } },
  },
  {
    title: 'Tor Traffic Capture',
    eyebrow: 'Research tooling',
    description: 'Docker-based automation for collecting Tor and clearnet traffic as PCAP files and logs.',
    tags: ['Shell', 'Docker', 'PCAP'],
    icon: 'terminal',
    repository: 'https://github.com/GSTovey/Tor-traffic-capture',
    documentation: 'https://github.com/GSTovey/Tor-traffic-capture#readme',
    steps: ['Browse', 'Capture', 'PCAP + logs'],
    translations: { zh: {
      title: 'Tor 流量采集', eyebrow: '研究工具',
      description: '基于 Docker 的 Tor 与普通网络流量采集工具，输出 PCAP 和日志。',
      tags: ['Shell', 'Docker', 'PCAP'], steps: ['自动访问', '流量采集', 'PCAP 与日志'],
    } },
  },
];

/** Independent resources only; do not repeat the research project cards here. */
export const openSource = [
  {
    title: 'Traffic Classification Paper Wiki',
    description: 'An Obsidian knowledge base for traffic classification papers, methods, and research questions.',
    tags: ['Obsidian', 'Markdown', 'Literature review'],
    icon: 'book',
    repository: 'https://github.com/GSTovey/Traffic-Classification-Paper-LLM-Wiki',
    documentation: 'https://github.com/GSTovey/Traffic-Classification-Paper-LLM-Wiki#usage',
    translations: { zh: {
      title: '流量分类论文知识库',
      description: '基于 Obsidian 的流量分类论文、方法与研究问题知识库。',
      tags: ['Obsidian', 'Markdown', '文献梳理'],
    } },
  },
];

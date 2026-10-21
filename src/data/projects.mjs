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
    translations: { zh: {
      eyebrow: '流量检测框架',
      description: '从客户端到代理的 TCP 流中检测 Tor-over-Proxy。框架分别分析外层代理的证据与代理内部 Tor 行为的证据，再组合检测结果。公开仓库提供实现代码、评估资源和论文中的方法总览，便于进一步理解与研究。',
      tags: ['Python', '加密流量', '流量检测'],
      steps: ['代理门控 + Tor 检测器', '与规则决策'],
    } },
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
    translations: { zh: {
      title: 'Tor 流量采集', eyebrow: '研究工具',
      description: '基于 Docker 的网络流量采集流程，支持普通网站与 Tor 目标。通过浏览器自动访问和 tcpdump，按访问保存 PCAP 文件及日志，为后续流量分析提供输入；目标列表和采集流程均通过配置文件管理。',
      tags: ['Shell', 'Docker', 'PCAP'], steps: ['自动访问', '流量采集', 'PCAP 与日志'],
    } },
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
    translations: { zh: {
      title: '流量分类论文知识库',
      description: '基于 Obsidian 的文献知识库，将论文笔记、概念、方法与研究问题连接起来。结构化笔记和关联参考文献支持系统性文献阅读，覆盖网络流量分类、加密流量分析与流量基础模型。',
      tags: ['Obsidian', 'Markdown', '文献梳理'],
    } },
  },
];

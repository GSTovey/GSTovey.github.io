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
 * @property {Object<string, Object>} [translations] Localized summaries and tags; preserve the original title and author order.
 */

/** @type {Publication[]} */
export const publications = [
  {
    id: 'nesttor-2026',
    language: 'en',
    title: 'NESTTOR: Detecting Tor-over-Proxy Traffic with Factorized Decisions',
    authors: ['Chenxin Zhou', 'Cheng Huang', 'Qiang Zhang', 'Qiliang Xie', 'Zeqing Li'],
    year: 2026,
    venue: 'IEEE Transactions on Network and Service Management',
    // Citation metadata is provided by the public README and CITATION.cff.
    // No separate publication-status badge until the publisher is checked.
    summary: 'How can Tor be detected when it is carried inside an encrypted proxy? NESTTOR studies a single bidirectional TCP flow and combines an independently trained proxy gate with a proxy-conditioned Tor detector. Stage-based features capture relative connection evolution, while evaluation across proxy types and capture periods controls for information leakage.',
    tags: ['Tor-over-Proxy', 'Traffic analysis', 'Factorized detection'],
    translations: { zh: {
      summary: '当 Tor 流量被封装在加密代理内部时，如何对其进行检测？NESTTOR 从客户端与代理之间的单条双向 TCP 流出发，分别训练代理门控器和代理条件下的 Tor 检测器，再组合两者的判断。阶段特征描述连接的相对演化；评估覆盖不同代理与采集时期，并控制信息泄漏。',
      tags: ['Tor-over-Proxy', '流量分析', '因子化检测'],
    } },
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
  {
    id: 'r3s-2026', language: 'en',
    title: 'R3S: Attack-Mitigation Reasoning in Security Knowledge Graphs',
    authors: ['Z. Li', 'C. Huang', 'J. Peng', 'X. Tian', 'C. Zhou', 'P. Cheng'],
    year: 2026,
    venue: 'IEEE Transactions on Information Forensics and Security · Vol. 21, pp. 8096–8106',
    summary: 'This work examines attack–mitigation reasoning in security knowledge graphs. It connects cyber threat intelligence with knowledge graph completion and semantic–structural integration, focusing on relationships between attacks and mitigation knowledge.',
    tags: ['Cyber threat intelligence', 'Knowledge graphs', 'Attack–mitigation reasoning'],
    paperUrl: 'https://doi.org/10.1109/TIFS.2026.3725546',
    translations: { zh: {
      summary: '研究安全知识图谱中的攻击与缓解措施推理。工作涉及网络威胁情报、知识图谱补全以及语义与结构的结合，关注如何组织攻击与缓解知识之间的关系。',
      tags: ['网络威胁情报', '知识图谱', '攻击与缓解推理'],
    } },
    bibtex: `@article{li2026r3s,
  author  = {Li, Z. and Huang, C. and Peng, J. and Tian, X. and Zhou, C. and Cheng, P.},
  title   = {{R3S}: Attack-Mitigation Reasoning in Security Knowledge Graphs},
  journal = {IEEE Transactions on Information Forensics and Security},
  volume  = {21},
  pages   = {8096--8106},
  year    = {2026},
  doi     = {10.1109/TIFS.2026.3725546},
  url     = {https://ieeexplore.ieee.org/document/11660765}
}`,
  },
  {
    id: 'aptbert-2024', language: 'en',
    title: 'APTBert: Abstract Generation and Event Extraction from APT Reports',
    authors: ['C. Zhou', 'C. Huang', 'Y. Wang', 'Z. Zuo'],
    year: 2024,
    venue: 'Digital Forensics and Cyber Crime · ICDF2C 2023 · LNICST 571',
    summary: 'A study of abstract generation and event extraction from advanced persistent threat (APT) reports. The work focuses on turning report narratives into concise summaries and structured event information for security analysis.',
    tags: ['APT reports', 'Abstract generation', 'Event extraction'],
    paperUrl: 'https://doi.org/10.1007/978-3-031-56583-0_14',
    translations: { zh: {
      summary: '围绕高级持续性威胁（APT）报告开展摘要生成与事件抽取研究，关注将报告中的叙述整理为精炼摘要与结构化事件信息，为安全分析提供支持。',
      tags: ['APT 报告', '摘要生成', '事件抽取'],
    } },
    bibtex: `@inproceedings{zhou2024aptbert,
  author    = {Zhou, C. and Huang, C. and Wang, Y. and Zuo, Z.},
  title     = {{APTBert}: Abstract Generation and Event Extraction from {APT} Reports},
  editor    = {Goel, S. and Nunes de Souza, P. R.},
  booktitle = {Digital Forensics and Cyber Crime. ICDF2C 2023},
  series    = {Lecture Notes of the Institute for Computer Sciences, Social Informatics and Telecommunications Engineering},
  volume    = {571},
  publisher = {Springer, Cham},
  year      = {2024},
  doi       = {10.1007/978-3-031-56583-0_14},
  url       = {https://link.springer.com/chapter/10.1007/978-3-031-56583-0_14}
}`,
  },
];

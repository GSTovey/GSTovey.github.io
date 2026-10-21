/** Public identity only. Do not infer a legal name from an author or Git username. */
export const site = {
  name: 'Tovey',
  handle: 'GSTovey',
  title: 'Tovey — Network Security Research',
  url: 'https://gstovey.github.io/',
  description: 'Tovey, a Ph.D. student at iTA-Lab, Sichuan University. Research on network security, encrypted traffic analysis, traffic classification, and cyber threat intelligence.',
  role: 'Ph.D. student',
  lab: 'iTA-Lab',
  school: 'School of Cyber Science and Engineering',
  institution: 'Sichuan University',
  headline: 'Understanding what encrypted traffic reveals.',
  bio: 'I’m a Ph.D. student at iTA-Lab, School of Cyber Science and Engineering, Sichuan University. My research focuses on network security, encrypted traffic analysis, and traffic classification. I also work on cyber threat intelligence and security knowledge graphs.',
  // Prefer a local avatar. The remote image is a verified GitHub profile URL,
  // with a text fallback if neither resource can be loaded.
  avatar: '/assets/avatar.jpg',
  avatarFallback: 'https://avatars.githubusercontent.com/u/76555656?s=300&v=4',
  github: 'https://github.com/GSTovey',
  repositories: 'https://github.com/GSTovey?tab=repositories',
  email: 'tovey_zhou@foxmail.com',
  orcid: 'https://orcid.org/0000-0002-5871-946X',
  contactText: 'For research discussions, questions about NESTTOR, or dataset access, feel free to get in touch.',
  translations: {
    zh: {
      title: 'Tovey — 网络安全研究',
      description: 'Tovey，四川大学网络空间安全学院 iTA-Lab 博士研究生，关注网络安全、加密流量分析、网络流量分类与网络威胁情报。',
      role: '博士研究生',
      school: '网络空间安全学院',
      institution: '四川大学',
      headline: '理解加密流量中可观测的网络行为。',
      bio: '我目前在四川大学网络空间安全学院 iTA-Lab 攻读博士，主要关注网络安全、加密流量分析与网络流量分类，也开展网络威胁情报与安全知识图谱相关研究。',
      contactText: '欢迎就相关研究、NESTTOR 或数据访问事宜通过邮件交流。',
    },
  },
};

export const interests = [
  {
    title: 'Network security', icon: 'shield',
    description: 'Studying observable network behavior to understand and detect anonymous traffic.',
    translations: { zh: { title: '网络安全', description: '研究可观测的网络行为，理解并检测匿名网络流量。' } },
  },
  {
    title: 'Encrypted traffic analysis', icon: 'activity',
    description: 'Exploring the signals that remain visible through encrypted proxy encapsulation.',
    translations: { zh: { title: '加密流量分析', description: '探索加密代理封装后仍然可见的行为信号与检测证据。' } },
  },
  {
    title: 'Traffic classification', icon: 'network',
    description: 'Connecting traffic representations, detection methods, and careful evaluation.',
    translations: { zh: { title: '网络流量分类', description: '围绕流量表示、分类方法与严谨评估，整理问题与研究路径。' } },
  },
  {
    title: 'Cyber threat intelligence', icon: 'book',
    description: 'Working with APT reports and security knowledge graphs to connect threat information.',
    translations: { zh: { title: '网络威胁情报', description: '围绕 APT 报告与安全知识图谱，探索威胁信息的提取、组织与推理。' } },
  },
];

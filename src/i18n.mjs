export const supportedLocales = ['en', 'zh'];
export const messages = {
  en: {
    lang: 'en', ogLocale: 'en_US', targetLocale: 'zh', targetPath: '/zh/', targetLabel: '中文', switchLabel: '切换到中文',
    home: 'Home', research: 'Research', publications: 'Publications', projects: 'Projects', education: 'Education', openSource: 'Open source', contact: 'Contact',
    skip: 'Skip to content', mainNavigation: 'Main navigation', openNavigation: 'Open navigation', closeNavigation: 'Close navigation',
    newTab: ' (opens in a new tab)', topics: 'Topics', workflow: 'Workflow', homeLabel: 'home',
    researchKicker: 'NETWORK SECURITY RESEARCH', greeting: 'Hi, I’m ', greetingEnd: '.', explore: 'Explore research', githubProfile: 'GitHub profile',
    profile: 'Research profile', profileKicker: 'RESEARCH PROFILE', profileFooter: 'Research, code & ideas', avatarAlt: '’s GitHub profile avatar', avatarUnavailable: 'Profile image unavailable',
    researchEyebrow: 'RESEARCH INTERESTS', researchTitle: 'Looking beyond the surface.',
    publicationsEyebrow: 'SELECTED PUBLICATIONS', publicationsTitle: 'Research in focus.', publicationsIntro: 'Selected work on traffic analysis, threat intelligence, and security knowledge.',
    projectsEyebrow: 'RESEARCH PROJECTS', projectsTitle: 'From questions to implementations.', projectsIntro: 'Methods and tools behind the research.',
    educationEyebrow: 'EDUCATION', educationTitle: 'Education', present: 'Present',
    openSourceEyebrow: 'OPEN SOURCE', openSourceTitle: 'Knowledge worth sharing.', openSourceIntro: 'Resources for reading, connecting, and building on research.', allRepositories: 'All repositories',
    newsEyebrow: 'UPDATES', newsTitle: 'Latest news.', experienceTitle: 'Education & experience', readMore: 'Read more',
    contactEyebrow: 'CONTACT', contactTitle: 'Let’s Connect', getInTouch: 'Get in touch', findOnGithub: 'Find me on GitHub', backTop: 'Back to top',
    paper: 'Paper', code: 'Code', project: 'Project', cite: 'Cite', repository: 'Repository', readme: 'Readme', demo: 'Demo', gettingStarted: 'Getting started',
    reference: 'REFERENCE', citeTitle: 'Cite this work', closeCitation: 'Close citation', copyBibtex: 'Copy BibTeX', copied: 'Copied!', copyFailed: 'Copy failed', copySuccess: 'BibTeX copied.', copyFailure: 'Couldn’t copy automatically. Select and copy the citation above.',
    statuses: { Published: 'Published', Accepted: 'Accepted', Preprint: 'Preprint', 'Under Review': 'Under Review', 'In Preparation': 'In Preparation' },
  },
  zh: {
    lang: 'zh-Hans', ogLocale: 'zh_CN', targetLocale: 'en', targetPath: '/', targetLabel: 'EN', switchLabel: 'Switch to English',
    home: '首页', research: '研究方向', publications: '论文', projects: '研究项目', education: '教育经历', openSource: '开源资源', contact: '联系',
    skip: '跳转至正文', mainNavigation: '主导航', openNavigation: '展开导航', closeNavigation: '收起导航',
    newTab: '（在新标签页打开）', topics: '主题标签', workflow: '工作流程', homeLabel: '首页',
    researchKicker: '网络安全研究', greeting: '你好，我是 ', greetingEnd: '。', explore: '了解我的研究', githubProfile: 'GitHub 主页',
    profile: '研究者档案', profileKicker: '研究者档案', profileFooter: '研究、代码与思考', avatarAlt: ' 的 GitHub 头像', avatarUnavailable: '头像暂时无法加载',
    researchEyebrow: '研究方向', researchTitle: '从网络行为中理解更多。',
    publicationsEyebrow: '代表论文', publicationsTitle: '聚焦研究问题。', publicationsIntro: '关于流量分析、威胁情报与安全知识的研究。',
    projectsEyebrow: '研究项目', projectsTitle: '从研究问题，到方法实现。', projectsIntro: '研究背后的方法、工具与实验流程。',
    educationEyebrow: '学习历程', educationTitle: '教育经历', present: '至今',
    openSourceEyebrow: '开源资源', openSourceTitle: '让知识连接起来。', openSourceIntro: '用于文献阅读、知识整理与后续研究的开放资源。', allRepositories: '查看全部仓库',
    newsEyebrow: '研究动态', newsTitle: '近期动态。', experienceTitle: '教育与研究经历', readMore: '了解详情',
    contactEyebrow: '联系交流', contactTitle: '欢迎交流', getInTouch: '邮件联系', findOnGithub: '在 GitHub 上找到我', backTop: '返回顶部',
    paper: '论文', code: '代码', project: '项目', cite: '引用', repository: '代码仓库', readme: '项目说明', demo: '演示', gettingStarted: '使用指南',
    reference: '参考文献', citeTitle: '引用这项研究', closeCitation: '关闭引用', copyBibtex: '复制 BibTeX', copied: '已复制', copyFailed: '复制失败', copySuccess: '已复制 BibTeX。', copyFailure: '自动复制失败，请选中并复制上方的引用文本。',
    statuses: { Published: '已发表', Accepted: '已录用', Preprint: '预印本', 'Under Review': '审稿中', 'In Preparation': '撰写中' },
  },
};

export function getMessages(locale = 'en') {
  return messages[supportedLocales.includes(locale) ? locale : 'en'];
}

export function localizeEntry(entry, locale = 'en') {
  return entry && typeof entry === 'object' ? { ...entry, ...entry.translations?.[locale] } : entry;
}

export function localizeContent(content, locale = 'en') {
  const result = { ...content, site: localizeEntry(content.site, locale) };
  for (const key of ['interests', 'publications', 'projects', 'education', 'openSource', 'news', 'experience']) {
    result[key] = Array.isArray(content[key]) ? content[key].map((entry) => localizeEntry(entry, locale)) : [];
  }
  return result;
}

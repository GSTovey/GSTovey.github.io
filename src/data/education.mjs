/**
 * Owner-provided study periods, 2026-10-21. These are stages of study,
 * not claims that a degree was awarded. Keep all four records separate.
 * English school names are editable here; see docs/content-sources.md.
 */
export const education = [
  {
    id: 'scu-undergraduate-2019',
    start: '2019.09', end: '2020.06',
    institution: 'Sichuan University',
    school: 'College of Biomass Science and Engineering',
    stage: 'Undergraduate Studies',
    translations: { zh: { institution: '四川大学', school: '轻工科学与工程学院', stage: '本科阶段' } },
  },
  {
    id: 'scu-undergraduate-2020',
    start: '2020.09', end: '2024.06',
    institution: 'Sichuan University',
    school: 'School of Cyber Science and Engineering',
    stage: "Bachelor's Studies",
    translations: { zh: { institution: '四川大学', school: '网络空间安全学院', stage: '本科阶段' } },
  },
  {
    id: 'scu-masters-2024',
    start: '2024.09', end: '2026.06',
    institution: 'Sichuan University',
    school: 'School of Cyber Science and Engineering',
    stage: "Master's Studies",
    translations: { zh: { institution: '四川大学', school: '网络空间安全学院', stage: '硕士阶段' } },
  },
  {
    id: 'scu-phd-2026',
    start: '2026.09', end: null, current: true,
    institution: 'Sichuan University',
    school: 'School of Cyber Science and Engineering',
    stage: 'Ph.D. Studies',
    translations: { zh: { institution: '四川大学', school: '网络空间安全学院', stage: '博士阶段' } },
  },
];

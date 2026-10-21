/** Public identity only. Do not infer a legal name from an author or Git username. */
export const site = {
  name: 'Tovey',
  handle: 'GSTovey',
  title: 'Tovey — Network Security Research',
  url: 'https://gstovey.github.io/',
  description: 'Tovey, a Ph.D. student at iTA-Lab, Sichuan University. Research on network security, encrypted traffic analysis, and traffic classification.',
  role: 'Ph.D. student',
  lab: 'iTA-Lab',
  school: 'School of Cyber Science and Engineering',
  institution: 'Sichuan University',
  headline: 'Understanding what encrypted traffic reveals.',
  bio: 'I’m a Ph.D. student at iTA-Lab, School of Cyber Science and Engineering, Sichuan University. My research focuses on network security, encrypted traffic analysis, and traffic classification.',
  // Prefer a local avatar. The remote image is a verified GitHub profile URL,
  // with a text fallback if neither resource can be loaded.
  avatar: '/assets/avatar.jpg',
  avatarFallback: 'https://avatars.githubusercontent.com/u/76555656?s=300&v=4',
  github: 'https://github.com/GSTovey',
  repositories: 'https://github.com/GSTovey?tab=repositories',
  email: 'tovey_zhou@foxmail.com',
  contactText: 'For research discussions, questions about NESTTOR, or dataset access, feel free to get in touch.',
};

export const interests = [
  {
    title: 'Network security', icon: 'shield',
    description: 'Studying observable network behavior to understand and detect anonymous traffic.',
  },
  {
    title: 'Encrypted traffic analysis', icon: 'activity',
    description: 'Exploring the signals that remain visible through encrypted proxy encapsulation.',
  },
  {
    title: 'Traffic classification', icon: 'network',
    description: 'Connecting traffic representations, detection methods, and careful evaluation.',
  },
];

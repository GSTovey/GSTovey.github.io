/** @typedef {{date: string, title: string, description?: string, url?: string}} NewsItem */
/** @typedef {{title: string, institution?: string, period?: string, description?: string}} Experience */
// Empty collections are hidden, including their navigation items.
// Add only verified events; a repository commit is not automatically news.
/** @type {NewsItem[]} */
export const news = [];
/** @type {Experience[]} */
export const experience = [];

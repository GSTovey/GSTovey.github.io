# Purple Academic Portfolio

Tovey 的个人学术主页，英文地址 **https://gstovey.github.io/**，中文地址 **https://gstovey.github.io/zh/**。顶部语言按钮可切换，保留当前章节并记住明确选择；禁用 JavaScript 时仍可通过真实链接切换和阅读两种语言。

极浅灰背景，辅以低对比度的淡紫色波形与节点连线；采用留白、细分隔线和紧凑列表，突出学术内容。包含个人介绍、研究方向、论文、研究项目、教育经历、开源知识库和联系信息。教育经历按最近时间在前展示；未核实的其他履历与新闻自动隐藏。

## 运行与检查

需要 Node.js 24+。生产构建没有第三方运行时依赖；开发依赖仅用于 Playwright 和 axe 无障碍检查。

```bash
npm ci
npm run dev       # 构建并监听 src/、public/；修改后刷新浏览器
npm test          # 内容、可选字段、转义和配置检查
npm run build    # 输出 dist/，可直接静态部署
npm run preview  # 启动 dist/ 生产预览服务器
npm run test:e2e # Chromium：五种视口、菜单、引用、资源和可访问性
```

服务器默认使用端口 5173，可通过 `PORT` 和 `HOST` 调整。云环境的 npm 缓存若不可写，安装时使用 `npm ci --cache /workspace/.cache/npm`。测试优先使用 `/usr/bin/chromium`，也可设置 `PLAYWRIGHT_EXECUTABLE_PATH`。其他机器先执行 `npx playwright install chromium`；Linux 缺少浏览器系统库时使用 `npx playwright install --with-deps chromium`。

## 更新内容

| 文件 | 内容 |
| --- | --- |
| `src/data/site.mjs` | 公开显示名、介绍、头像、研究兴趣与联系入口 |
| `src/data/publications.mjs` | 论文、准确的作者顺序、引用、可选状态和链接 |
| `src/data/projects.mjs` | 研究项目与独立的开源资源 |
| `src/data/updates.mjs` | 新闻与经历；空数组时不生成模块 |
| `src/data/education.mjs` | 四段学习经历的准确时间、学院和学习阶段，中英文集中维护 |
| `src/render.mjs` | 静态 HTML 组件与元信息 |
| `public/assets/styles.css` | 主题 Token、组件与响应式样式 |
| `docs/content-sources.md` | 内容来源与核实边界 |
| `src/i18n.mjs` | 界面双语词条与本地化辅助函数 |
| `AGENTS.md`、`docs/MAINTENANCE.md` | 其他智能体的维护约定与可复制任务说明 |

页面无需 JavaScript 也能阅读内容和使用导航；JavaScript 增强移动菜单、当前章节提示、顶部滚动进度、头像回退和 BibTeX 复制。论文列表保留题名、作者、刊物、年份与链接，可直接复制已有引用；成功提示短暂显示后恢复，复制受限时打开引用弹窗并选中文本，便于手动复制。没有 BibTeX 时不生成复制按钮。外链仅接受 HTTPS，无效或缺失的可选链接不会生成按钮。论文无链接时以普通标题显示。不要添加占位 URL、未经证实的状态或私人资料。

主色为 `#935BED`；文字及按钮使用对比度更高的 `#6F3FC5`。背景 `#F8F8FA`，正文 `#302642`，次级文字 `#716B7C`，辅助表面 `#F1EEF6`。背景 SVG 静止、透明度为 0.11，不响应鼠标且对辅助技术隐藏。所有主题色集中在 CSS `:root` 中。英文采用本地托管的 Manrope 可变字体（约 25 KB，SIL OFL），中文回退至苹方、思源黑体、微软雅黑等系统无衬线字体，不请求第三方字体服务。正文保持 16–18px。

双语内容在每条数据的 `translations.zh` 中维护；论文保留正式英文标题、作者与引用。论文简介与标签保留在数据中，页面采用精简列表，不展示这些扩展说明。构建生成 `dist/index.html` 与 `dist/zh/index.html`，并输出各自的 canonical、hreflang 与页面语言信息。如何交给其他智能体修改见 [维护指南](docs/MAINTENANCE.md)。

### 头像

```bash
npm run avatar:fetch
npm run build
```

该命令通过 HTTPS 下载公开 GitHub 头像并检查图片签名，按真实格式保存到 `public/assets/avatar.jpg` 或 `avatar.png`。网络限制导致失败时不会覆盖已有头像；构建自动使用已确认的 GitHub 头像 URL，再降级为显示名首字母，不使用替代人像。当前真实头像已下载并包含在项目中。

## GitHub Pages 发布

仓库为 `GSTovey/GSTovey.github.io`，采用根域名部署，所有站内资源从 `/assets/` 加载。

1. 将本项目提交并推送到该仓库的 `main` 分支。
2. 在仓库 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**（已配置时无需重复操作）。不要设置自定义域名或项目子路径。
3. 推送到 `main` 自动触发 `.github/workflows/pages.yml`；也可在 Actions 页面手动运行。构建作业先安装依赖、运行内容测试、下载公开 GitHub 头像、构建和浏览器检查，成功后上传 `dist/` 并部署。头像在 CI 构建中本地化到产物，线上页面不需要请求头像 API；下载失败会明确使工作流失败。
4. 在 Actions 确认部署成功后检查线上页面、头像、锚点与引用弹窗。仅完成本地构建或推送，不代表已上线。

工作流只使用 GitHub 自带的 `GITHUB_TOKEN`；不需要将任何 Token 放入源码。`node_modules`、构建结果、浏览器测试产物和 `.env` 均不提交。开发过程中的抓包项目仅作为链接展示，不会在个人主页或 CI 中运行。

## 测试范围

`npm run check` 运行内容测试、生产构建和 Chromium 测试。浏览器覆盖 1440、1024、768、390、320px 宽度；检查 WCAG A/AA 常见问题、横向溢出、移动菜单和焦点、引用复制、头像失败回退、无 JavaScript 阅读、减少动画与静态资源。

自动化检查不能替代完整人工无障碍审计或跨浏览器验证。公开内容来源和未独立核实的出版社信息见 `docs/content-sources.md`。

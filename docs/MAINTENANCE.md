# 交给其他智能体维护

代码、内容和维护约定都保存在这个 GitHub 仓库中，不依赖当前聊天记录。你可以使用其他 Codex 会话、Claude Code、Cursor 或其他支持 Git 的智能体。让它连接或克隆 `GSTovey/GSTovey.github.io`，先阅读根目录 `AGENTS.md`、`README.md` 和本文即可开始。

## 一段可直接复用的任务说明

> 请维护 GSTovey/GSTovey.github.io。先阅读 AGENTS.md、README.md、docs/MAINTENANCE.md 和 docs/content-sources.md，检查 Git 状态并保留已有工作。请完成以下修改：[写具体需求]。同时更新英文 `/` 与中文 `/zh/`，保持论文原题、作者顺序和引用准确。运行 npm run check，并实际检查桌面和手机页面。请在独立分支提交并创建 PR，报告修改与测试结果；本任务不授权发布。

若希望它直接发布，把最后一句替换为：

> 本任务授权将通过测试的修改合并或推送到 main 并发布；请跟进 GitHub Actions，验证线上两种语言与静态资源，返回实际部署结果。

无需发送任何 Token 给智能体聊天。通过所选工具的 GitHub 授权功能或 Git 的正常认证机制授予该仓库必要权限即可。不同工具的云环境不会自动共享进程、缓存或认证，但可用同一份源码和锁文件重新安装。

## 修改位置

| 修改内容 | 文件 |
| --- | --- |
| 身份、介绍、头像、邮箱、ORCID、研究方向 | `src/data/site.mjs` |
| 新增论文、作者、出处、DOI、BibTeX | `src/data/publications.mjs` |
| 项目与开源资源 | `src/data/projects.mjs` |
| 动态和履历 | `src/data/updates.mjs` |
| 中英文导航、标题、按钮、提示、无障碍标签 | `src/i18n.mjs` |
| 字体、字号、颜色、间距与响应式布局 | `public/assets/styles.css` |
| 页面组件及 SEO | `src/render.mjs` |

每条内容的英文基础字段与 `translations.zh` 放在同一记录中；论文原题和作者不必翻译。没有可用代码链接就省略 `codeUrl`，不要添加占位按钮。简介只能描述已经有出处支持的研究内容。

## 环境与发布

使用 Node.js 24+，执行 `npm ci` 和 `npm run dev`。完整检查是 `npm run check`。其他机器首次运行浏览器测试需要 `npx playwright install --with-deps chromium`；云端提供的 Chromium 可直接使用。

每位智能体使用自己的分支，按提交先后合并或通过 PR 审查。不要让多个工具同时直接修改 `main`。这不需要复制当前聊天记录或在已有云任务中另建 worktree。

GitHub 仓库 Settings → Pages → Source 应选择 **GitHub Actions**。推送 `main` 后跟进 Actions；构建及部署成功，再检查 `/`、`/zh/`、论文引用、头像、字体与语言按钮。线上修改全部由该工作流重建，不要手工修改 `dist/` 或生成的 HTML。

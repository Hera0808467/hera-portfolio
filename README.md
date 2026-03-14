# microsoft_2026（可编辑复刻版）

这是一个基于 `reference/`（Next.js 生成制品）逆向得到的可编辑项目：Next.js App Router + TypeScript + Tailwind v4。

目标：
- 保持页面结构/关键动效尽量贴近制品
- 同时把“经常要改的内容”下沉成配置/数据（不必改组件代码）

## 开发 / 构建

```bash
npm run dev
npm run build
npm run start
```

约定：
- `reference/`：制品来源目录（请保持不改动）
- 可编辑源码：`app/`、`components/`、`data/`、`lib/`
- 静态资源：`public/`

## 我该改哪里（可配置项入口）

### 1) 站点级配置（标题/品牌/目录/联系邮箱/背景色）

编辑：`data/siteConfig.ts`

常用项：
- `metadata.title` / `metadata.description`：浏览器标题与 SEO 描述（同时会影响 `app/layout.tsx` 的 Next.js metadata）
- `brand.name`：Hero 标题 + Loading overlay 标题
- `brand.tagline`：Hero 第二行（如 “DESIGN & RESEARCH”）
- `brand.loadingSubtitle`：Loading overlay 副标题（如 “Newsletter”）
- `contact.email` / `contact.label`：结尾页 Contact 按钮（mailto + 文案）
- `navigation.groupNavEnabled`：是否启用左下角“目录”（分组导航）
- `navigation.showGroupNavOnHero`：是否在首页（Hero）显示目录（当前默认不显示）
- `navigation.showGroupNavOnEnding`：是否在结束页显示目录（默认不显示）
- `navigation.groupOrder`：可选，显式指定目录分组排序（未列出的分组保持自然顺序）
- `theme.backgroundColor`：页面底色（当前制品为 `#1A1918`）
- `projects.titleCase`：是否对项目标题做保守的 Title Case（默认 true；如需完全按原样显示，设为 false，并可用 `displayTitle` 覆盖）

### 2) 内容数据（首屏文案 / 结束页文案 / 项目卡片）

编辑：`data/newsletter.ts`

你最常改的字段：
- `welcomeText`：首屏正文（支持 `\n` 换行）
- `endingText`：结束页文案（支持 `\n` 换行）
  - 解析规则：优先按“空行分段”。第一段的第一句会作为动画标题（SplitText）；后续段落作为 footer/signature。
- `projects[]`：项目列表（决定页面 section 数量、内容与目录分组）

项目字段说明（核心）：
- `title`：项目标题（可被 `projects.titleCase` 影响）
- `displayTitle?`：可选，强制 UI 显示标题（不影响 `title`）
- `group?`：分组名；左下角目录会按 `group` 自动生成
- `contributors` / `contributorType`：成员与 “Designed by / Researched by”
- `coverImage`：封面图路径（建议 `/images/...`）
- `figmaUrl`：点击卡片打开的链接（为空则卡片不可点）
- `videoUrl?`：可选，设置后卡片会显示视频播放入口（资源需放 `public/`）
- `description`：项目描述（桌面端在图片右下的浮层，移动端在图片下方）

示例（复制改字段即可）：

```ts
{
  id: "my-project",
  month: "2026-1",
  title: "My Project Title",
  displayTitle: "My Project Title (Exact)",
  contributorType: "designers",
  contributors: ["Your Name"],
  figmaUrl: "https://www.figma.com/...",
  coverImage: "/images/2026-1/my-project.png",
  videoUrl: "/videos/2026-1/my-project.mp4",
  description: "一句话概述...\n第二行..."
}
```

## 怎么“加目录”（左下角分组导航）

目录来自 `projects[].group`：
- 想新增一个目录项：给某些项目加上新的 `group` 值即可
- 想调整目录顺序：
  1) 最简单：调整 `projects[]` 的项目顺序（目录顺序默认由“该分组首次出现的位置”决定）
  2) 更可控：在 `data/siteConfig.ts` 里设置 `navigation.groupOrder = ["Copilot", "Edge", "Bing"]`

首页是否显示目录：
- 默认不显示（`navigation.showGroupNavOnHero: false`）
- 如需显示，改为 `true`

## 怎么“加图 / 换图 / 加视频”

### 图片
- 放到：`public/images/...`
- 数据引用：`coverImage: "/images/..."`（以 `/` 开头）
- 需要复用制品静态资源：直接从 `reference/images/` 拷贝到 `public/images/`

### 视频（可选）
- 放到：`public/videos/...`（或任意 `public/` 子目录）
- 数据引用：`videoUrl: "/videos/..."`（以 `/` 开头）

## Tailwind v4（重要）

本项目使用 Tailwind v4。入口在 `app/globals.css`：
- 使用 `@import "tailwindcss";`
- 使用 `@config "../tailwind.config.js";` 指定配置文件

不要把它改回 v3 的 `@tailwind base/components/utilities;`，否则会丢失 v4 的 theme 层输出（响应式 `sm:`/`lg:` 等会异常）。

## 从制品重新提取数据（可选）

如果你想从 `reference/` 重新提取 `data/newsletter.ts`（会覆盖现有改动）：

```bash
node "scripts/extract-reference-newsletter.mjs"
```

建议：
- 先备份你对 `data/newsletter.ts` 的手动改动
- 或者只把脚本输出内容复制你需要的部分，避免覆盖你新增的 `displayTitle` 等字段

## 常见问题

### `next build` 报 `.next/server` 无法删除（ENOTEMPTY）

这通常是 macOS 在 `.next/` 里生成了 `.DS_Store`。

```bash
node -e "const fs=require('fs'); for (const p of ['.next/.DS_Store','.next/server/.DS_Store','.next/dev/.DS_Store']) { try { fs.unlinkSync(p); console.log('deleted', p); } catch {} }"
```

/*
 * Macaron genUI / Dynamic UI 团队动态日报数据。
 * 复用 hera-portfolio 的 newsletter 结构：每个 project = 一张工作卡，按月分组。
 */

export type ContributorType = "designers" | "researchers";

/** 翻面展示的关键指标。value 是目标数字（用于生长动画），suffix/prefix 可选，label 是说明。 */
export type ProjectMetric = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  /** 若有，显示为 "from → value" 的对比（如 17750 → 473）。 */
  from?: number;
  decimals?: number;
};

export type NewsletterProject = {
  id: string;
  month: string;
  title: string;
  /** Optional override for UI display without touching the canonical title. */
  displayTitle?: string;
  contributorType: ContributorType;
  contributors: string[];
  figmaUrl: string;
  coverImage: string;
  description: string;
  group?: string;
  themeColor?: string;
  videoUrl?: string;
  /** 翻面的指标面板（最多 3 条效果最好）。 */
  metrics?: ProjectMetric[];
  /** 翻面顶部一句话亮点。 */
  flipHeadline?: string;
  /** 白板上 dynamic 逐条写出的要点。 */
  bullets?: string[];
  /** 工作项状态：已完成 / 进行中 / 观察中。 */
  status?: "done" | "progress" | "observe";
};

export type NewsletterData = {
  month: string;
  displayMonth?: string;
  welcomeText?: string;
  endingText?: string;
  projects: NewsletterProject[];
};

export const newsletterData: NewsletterData = {
  month: "2026-6",
  displayMonth: "JUN 2026",
  welcomeText:
    "🎉 欢迎来到 Macaron genUI / Dynamic UI 团队动态日报。\n\n往下滚 👇",
  endingText:
    "感谢浏览 Macaron genUI 团队的进展。\n\n能力定义 × 场景探索 × 评估验证，闭环上升。\n\nMacaron genUI Team ♥️",
  projects: [
    {
      id: "progressive-disclosure",
      month: "2026-6",
      title: "渐进式披露 · read_example_group",
      displayTitle: "渐进式披露",
      contributorType: "researchers",
      contributors: ["Hera", "庄毅辉"],
      figmaUrl: "https://neocloud.feishu.cn/docx/Gf84dVLppoS6dGxFPbncMWDsnDo",
      coverImage: "",
      description:
        "让巨型 prompt 学会「按需加载」\n\n【问题】所有 example + component + 指令全打包成一个 ~40K token 的 prompt，接 100 组件会到 90K。\n\n【方案】照 Claude Agent Skills 三级渐进披露：system prompt 只放分组目录，模型自主调 read_example_group 拉取需要的那组。\n\n📉 example 块 17750 → 473 token（−97%），接 100 组件目录仍恒定。\n\n主轴 O2KR1 · 生成质量",
      group: "能力定义",
      status: "done",
      themeColor: "#7B3FF2",
      flipHeadline: "让巨型 prompt 学会按需加载",
      bullets: ["把所有 example + component + 指令打包，prompt 一度高达 ~40K token", "照 Claude Agent Skills 三级渐进披露，只放分组目录", "模型自主调 read_example_group 拉取需要的那组", "example 块从 17750 → 473 token，压缩 97%"],
      metrics: [
        { label: "example 块 token", value: 473, from: 17750 },
        { label: "压缩比例", value: 97, suffix: "%" },
        { label: "接入组件后目录仍恒定", value: 473, suffix: " tok" },
      ],
    },
    {
      id: "tarot-card",
      month: "2026-6",
      title: "塔罗占卜卡 · persona example",
      displayTitle: "塔罗占卜卡",
      contributorType: "designers",
      contributors: ["Hera"],
      figmaUrl: "#",
      coverImage: "/images/macaron/tarot-card.png",
      description:
        "把手工精品卡固化为 AI 的「品味参照」\n\n【做了什么】5 张 persona 卡（塔罗 / MBTI / 月相 / 心情 / 睡前仪式）转写成 example，补真交互，归入场景分组。\n\n【关键发现】模型「过一遍 example」才有 genUI 的灵魂——没看 example 就画不出我们的设计语言。\n\n深紫星空 · 金描边 · 扇形抽牌\n\n能力定义 · example polish",
      group: "能力定义",
      status: "done",
      themeColor: "#9A78FF",
      flipHeadline: "把手工精品卡固化为 AI 的品味参照",
      bullets: ["5 张 persona 卡转写成 example，补真交互", "归入 5 个场景分组，按意图触发", "关键发现：模型「过一遍 example」才有 genUI 灵魂", "深紫星空 · 金描边 · 扇形抽牌"],
      metrics: [
        { label: "persona 卡转 example", value: 5, suffix: " 张" },
        { label: "每张补真交互", value: 100, suffix: "%" },
        { label: "归入场景分组", value: 5, suffix: " 组" },
      ],
    },
    {
      id: "eval-system",
      month: "2026-6",
      title: "三维 Eval 体系 + 黄金集",
      displayTitle: "Eval 体系",
      contributorType: "researchers",
      contributors: ["Hera", "李天琛"],
      figmaUrl: "https://neocloud.feishu.cn/docx/Gf84dVLppoS6dGxFPbncMWDsnDo",
      coverImage: "",
      description:
        "Dynamic UI 评估体系，判断生成质量是否符合 taste\n\n【三维】① 是否触发 ② 触发是否正确 ③ 卡片是否正常。\n\n【黄金集】22 题（清晰 / 模糊 / 跨域 / 不该触发四类）。\n\n【自动 + 人工】judge 看图打分 + 人工复核——发现 judge 会误判，by-case 反馈反过来校准 rubric。\n\n触发 22/22 · 组对 18/18\n\n验证翼 O3KR2",
      group: "评估验证",
      status: "progress",
      themeColor: "#3AA6FF",
      flipHeadline: "三维评估，判断生成是否符合 taste",
      bullets: ["三维评估：是否触发 / 触发是否正确 / 卡片是否正常", "黄金集 22 题：清晰 / 模糊 / 跨域 / 不该触发", "judge 看图打分 + 人工复核，by-case 校准 rubric", "触发 22/22 · 触发组 18/18"],
      metrics: [
        { label: "是否触发正确", value: 22, suffix: " / 22" },
        { label: "触发组正确", value: 18, suffix: " / 18" },
        { label: "黄金 case 集", value: 22, suffix: " 题" },
      ],
    },
    {
      id: "multimodel",
      month: "2026-6",
      title: "多模型对比 · gpt-5.5 vs Gemini",
      displayTitle: "多模型对比",
      contributorType: "researchers",
      contributors: ["Hera"],
      figmaUrl: "#",
      coverImage: "",
      description:
        "同一需求，不同模型现场画卡，比真实能力\n\n【方法】原版 example vs gpt-5.5 vs gemini-3.5-flash vs gemini-3.1-pro，注入相同 example 当参照。\n\n【发现】风格可迁移（Gemini 学得到贴纸 / 星空），但「这张卡该承载什么信息」抄不走——MBTI 仿作退化成问卷。\n\n→ example 的语义价值，模型替代不了。\n\n探索翼 O2KR3",
      group: "场景探索",
      status: "progress",
      themeColor: "#FF7AD9",
      flipHeadline: "风格可迁移，但语义抄不走",
      bullets: ["原版 vs gpt-5.5 vs gemini-3.5-flash vs gemini-3.1-pro", "注入相同 example 当参照，公平对比", "风格可迁移：Gemini 学得到贴纸 / 星空", "但语义抄不走——MBTI 仿作退化成问卷"],
      metrics: [
        { label: "对比模型", value: 4, suffix: " 个" },
        { label: "代表场景", value: 5, suffix: " 题" },
        { label: "关键发现", value: 1, prefix: "#", suffix: " example 是灵魂" },
      ],
    },
    {
      id: "moon-phase",
      month: "2026-6",
      title: "月相卡 · Gemini 仿作",
      displayTitle: "月相卡",
      contributorType: "designers",
      contributors: ["Hera"],
      figmaUrl: "#",
      coverImage: "/images/macaron/moon-card.png",
      description:
        "注入 example 后，Gemini 终于有了 genUI 的味道\n\n深蓝渐变 · 发光满月 · 相位指示行\n\n【对照】裸 prompt 时 Gemini 自己瞎画、跟 genUI 不搭；注入我们的月相 example 后，几乎复刻了设计语言。\n\n证明「过一遍 example」是 genUI 的灵魂。\n\n场景探索 · 风格迁移验证",
      group: "场景探索",
      status: "done",
      themeColor: "#5B8DEF",
      flipHeadline: "注入 example 后，Gemini 有了 genUI 的味道",
      bullets: ["裸 prompt 时 Gemini 自己瞎画、跟 genUI 不搭", "注入月相 example 后几乎复刻了设计语言", "深蓝渐变 · 发光满月 · 相位指示行", "证明「过一遍 example」是灵魂"],
      metrics: [
        { label: "设计语言复刻度", value: 95, suffix: "%" },
        { label: "深蓝相位行 · 发光满月", value: 1, prefix: "✦" },
      ],
    },
    {
      id: "engine-mechanism",
      month: "2026-6",
      title: "引擎 · component / example 机制",
      displayTitle: "引擎机制",
      contributorType: "researchers",
      contributors: ["庄毅辉"],
      figmaUrl: "#",
      coverImage: "/images/macaron/mbti-card.png",
      description:
        "让 AI 写数据驱动的前端框架代码（TSX）\n\n【component = diversity】headless 组件，只给逻辑、省 token；数量已够，缺 mermaid / 3D。\n\n【example = polish】给样式 / 配色 / 阴影，是 retrieve 来的 skill。\n\n【探索中】genUI in markdown：以 markdown 代码块插入 genUI，解决跨模型 tool 行为不一致。\n\n技术 owner · 引擎核心",
      group: "能力定义",
      status: "progress",
      themeColor: "#37C8C2",
      flipHeadline: "让 AI 写数据驱动的前端框架代码",
      bullets: ["component = diversity：headless 省 token，数量已够", "example = polish：给样式 / 配色 / 阴影", "探索 genUI in markdown：解决跨模型 tool 行为不一致", "缺的只有 mermaid / 3D 两个组件"],
      metrics: [
        { label: "component 数量", value: 100, suffix: "+ 已够" },
        { label: "diversity 省 token", value: 1, prefix: "✦" },
        { label: "example = polish 质量", value: 1, prefix: "✦" },
      ],
    },
    {
      id: "ritual-card",
      month: "2026-6",
      title: "睡前仪式卡 · 可勾选交互",
      displayTitle: "睡前仪式卡",
      contributorType: "designers",
      contributors: ["Hera"],
      figmaUrl: "#",
      coverImage: "",
      description:
        "纯展示组件 → 真交互\n\n暖紫渐变 · 步骤可勾选打勾 · 进度条 · 全部完成的温柔收尾。\n\n【会议任务③】给组件加交互——按钮真能点、状态可变，不再是死样式。\n\n归入 focus-wellness 自我管理组。\n\n能力定义 · 交互补全",
      group: "能力定义",
      status: "done",
      themeColor: "#B06BFF",
      flipHeadline: "纯展示组件 → 真交互",
      bullets: ["纯展示组件 → 真交互", "步骤可勾选打勾 · 进度条 · 温柔收尾", "归入 focus-wellness 自我管理组", "暖紫渐变 · 会议任务③交互补全"],
      metrics: [
        { label: "步骤可勾选", value: 4, suffix: " 步" },
        { label: "进度条 · 温柔收尾", value: 1, prefix: "✦" },
      ],
    },
    {
      id: "roadmap",
      month: "2026-6",
      title: "genUI 双月 Roadmap",
      displayTitle: "双月 Roadmap",
      contributorType: "designers",
      contributors: ["Hera", "庄毅辉"],
      figmaUrl: "https://neocloud.feishu.cn/docx/QSzSdgjSuowXxYxJxCkcdJUknfg",
      coverImage: "/images/macaron/roadmap.png",
      description:
        "以「生成质量」为核心的闭环\n\n探索翼（往哪走）→ 质量主轴（什么算好 · 怎么更好）→ 验证翼（好没好 · 符不符 taste）→ 喂回。\n\n【分工】庄毅辉 = 技术 owner（能做到什么）；Hera = 质量 / 产品 owner（什么是好、往哪做、好没好）。\n\n→ 点击查看完整 Roadmap 飞书文档\n\nO2KR1 + O2KR3 + O3KR2",
      group: "评估验证",
      status: "done",
      themeColor: "#E9B8FF",
      flipHeadline: "以「生成质量」为核心的闭环",
      bullets: ["以「生成质量」为核心的闭环", "探索翼 → 质量主轴 → 验证翼 → 喂回", "庄毅辉 = 技术 owner，Hera = 质量/产品 owner", "覆盖 O2KR1 + O2KR3 + O3KR2"],
      metrics: [
        { label: "覆盖 KR", value: 3, suffix: " 个" },
        { label: "探索 → 质量 → 验证 → 喂回", value: 1, prefix: "♺" },
      ],
    },
    {
      id: "stream-parser",
      month: "2026-6",
      title: "流式生成 parser",
      displayTitle: "流式生成 parser",
      contributorType: "researchers",
      contributors: ["庄毅辉"],
      figmaUrl: "#",
      coverImage: "",
      description: "生成一半也能渲染的流式 parser，边写边出。",
      group: "能力定义",
      status: "progress",
      themeColor: "#37C8C2",
      flipHeadline: "生成一半也能渲染",
      bullets: ["TSX 流式生成、写一半即可渲染", "自动补全不完美时底部容错", "后续正确生成会覆盖修正"],
      metrics: [{ label: "流式渲染", value: 1, prefix: "✦" }],
    },
    {
      id: "auto-repair",
      month: "2026-6",
      title: "自动修复机制",
      displayTitle: "自动修复机制",
      contributorType: "researchers",
      contributors: ["庄毅辉"],
      figmaUrl: "#",
      coverImage: "",
      description: "把 runtime / linter error 回灌给模型自修复。",
      group: "能力定义",
      status: "progress",
      themeColor: "#37C8C2",
      flipHeadline: "错误回灌，模型自修复",
      bullets: ["runtime error + linter error 全提交回模型", "模型自己定位并修复", "遇到一个修一个，持续维护"],
      metrics: [{ label: "自动修复", value: 1, prefix: "✦" }],
    },
    {
      id: "genui-markdown",
      month: "2026-6",
      title: "genUI in markdown 探索",
      displayTitle: "genUI in markdown",
      contributorType: "researchers",
      contributors: ["庄毅辉"],
      figmaUrl: "#",
      coverImage: "",
      description: "以 markdown 代码块插入 genUI，图文并茂。",
      group: "场景探索",
      status: "observe",
      themeColor: "#37C8C2",
      flipHeadline: "以 markdown 形式插入 genUI",
      bullets: ["不用 tool 插 genUI，改 markdown 代码块", "解决跨模型 tool / 文本行为不一致", "图文并茂、可训练、可强制"],
      metrics: [{ label: "跨模型行为对齐", value: 1, prefix: "✦" }],
    },
    {
      id: "align-goals",
      month: "2026-6",
      title: "对齐双月目标",
      displayTitle: "对齐双月目标",
      contributorType: "researchers",
      contributors: ["李天琛"],
      figmaUrl: "#",
      coverImage: "",
      description: "跟帅帅、yuhan 对齐双月目标。",
      group: "能力定义",
      status: "done",
      themeColor: "#3AA6FF",
      flipHeadline: "跟帅帅、yuhan 对齐双月目标",
      bullets: ["跟帅帅、yuhan 对齐双月目标", "明确各自方向与协作边界"],
      metrics: [{ label: "目标对齐", value: 1, prefix: "✦" }],
    },
    {
      id: "trace-export",
      month: "2026-6",
      title: "Trace 导出流程",
      displayTitle: "Trace 导出流程",
      contributorType: "researchers",
      contributors: ["李天琛"],
      figmaUrl: "#",
      coverImage: "",
      description: "Trace 导出流程跑通，识别不同后端表中的重要信息。",
      group: "评估验证",
      status: "done",
      themeColor: "#3AA6FF",
      flipHeadline: "Trace 导出流程跑通",
      bullets: ["Trace 导出流程跑通", "识别不同后端表中的重要信息", "做了一个 trace 导出脚本"],
      metrics: [{ label: "Trace 导出", value: 1, prefix: "✦" }],
    },
    {
      id: "memory-eval",
      month: "2026-6",
      title: "memory 评估平台",
      displayTitle: "memory 评估平台",
      contributorType: "researchers",
      contributors: ["李天琛"],
      figmaUrl: "https://bidder-visits-wyoming-somewhere.trycloudflare.com/",
      coverImage: "",
      description: "学习 openai 的 memory 评估，搭建 memory 评估平台。",
      group: "评估验证",
      status: "progress",
      themeColor: "#3AA6FF",
      flipHeadline: "学习 openai 的 memory 评估",
      bullets: ["搭建 memory 评估平台", "学习 openai 的 memory 评估", "已可在后端导入线上用户数据并抽取记忆"],
      metrics: [{ label: "memory 评估平台", value: 1, prefix: "✦" }],
    },
  ],
};

/* ───────────────────────── 人物维度（按人 / 按主题分组用） ───────────────────────── */

export type Person = {
  id: string;
  name: string;
  role: string;
  /** 头像渐变主色。 */
  color: string;
  summary: string;
  /** 头像 emoji。 */
  avatar?: string;
  /** 日报日期。 */
  date?: string;
  /** 喂给 shader HSV 变色的代表图。 */
  coverRef?: string;
  /** 白板内嵌的配图（如 Roadmap 图）。 */
  boardImage?: string;
  /** 整卡点击跳转的文档链接。 */
  docUrl?: string;
};

export const people: Person[] = [
  { id: "Hera", name: "冯欢 Hera", role: "genUI 质量 / 产品 Owner", color: "#9A78FF", avatar: "/images/macaron/hera-avatar.png", date: "6 月 5 日 · 周五", coverRef: "/images/macaron/tarot-card.png", boardImage: "/images/macaron/roadmap.png", docUrl: "https://neocloud.feishu.cn/docx/QSzSdgjSuowXxYxJxCkcdJUknfg", summary: "渐进式披露、Eval 体系、多模型对比、5 张 persona 卡——围绕生成质量定标准、推迭代、做验证。" },
  { id: "庄毅辉", name: "庄毅辉", role: "genUI 技术 Owner · 引擎核心", color: "#37C8C2", avatar: "🛠️", date: "6 月 5 日 · 周五", coverRef: "/images/macaron/mbti-card.png", summary: "component / example 机制、流式生成、自动修复、genUI in markdown 探索。" },
  { id: "李天琛", name: "李天琛", role: "Eval / 质量", color: "#3AA6FF", avatar: "📊", date: "6 月 5 日 · 周五", coverRef: "/images/macaron/moon-card.png", summary: "评估体系协同，benchmark 方向。" },
];

/** 每个 project 的「主理人」= contributors 第一位。 */
export function ownerOf(project: NewsletterProject): string {
  return project.contributors[0] ?? "Hera";
}

/** 按人分组：每人一组、含 ta 主理的 projects。 */
export function groupByPerson(): { person: Person; projects: NewsletterProject[] }[] {
  return people
    .map((person) => ({
      person,
      projects: newsletterData.projects.filter((p) => ownerOf(p) === person.id),
    }))
    .filter((g) => g.projects.length > 0);
}

/** 一个人的工作项状态计数。 */
export function personStats(projects: NewsletterProject[]) {
  const done = projects.filter((p) => p.status === "done").length;
  const progress = projects.filter((p) => p.status === "progress").length;
  const observe = projects.filter((p) => p.status === "observe").length;
  return { done, progress, observe };
}

export type PersonBoardData = {
  person: Person;
  projects: NewsletterProject[];
  stats: { done: number; progress: number; observe: number };
  /** 该人项目按业务线（group）再分组，供白板两栏用。 */
  byGroup: { group: string; projects: NewsletterProject[] }[];
};

/** 同形适配器：把"人"伪装成"项目"，让 page.tsx 遍历逻辑零改动地复用。 */
export type PersonSection = NewsletterProject & { personData: PersonBoardData };

export function buildPersonSections(): PersonSection[] {
  const order = ["能力定义", "场景探索", "评估验证"];
  return groupByPerson().map(({ person, projects }) => {
    const stats = personStats(projects);
    const map = new Map<string, NewsletterProject[]>();
    for (const p of projects) {
      const g = p.group ?? "其他";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(p);
    }
    const byGroup = [...map.entries()]
      .sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]))
      .map(([group, ps]) => ({ group, projects: ps }));
    return {
      id: `person-${person.id}`,
      month: newsletterData.month,
      title: person.name,
      displayTitle: person.name,
      contributorType: "designers",
      contributors: [person.name],
      figmaUrl: "",
      coverImage: person.coverRef ?? "",
      description: person.summary,
      group: person.role,
      themeColor: person.color,
      personData: { person, projects, stats, byGroup },
    };
  });
}

/** 按主题（group 字段）分组。 */
export function groupByTheme(): { theme: string; projects: NewsletterProject[] }[] {
  const order = ["能力定义", "场景探索", "评估验证"];
  const map = new Map<string, NewsletterProject[]>();
  for (const p of newsletterData.projects) {
    const t = p.group ?? "其他";
    if (!map.has(t)) map.set(t, []);
    map.get(t)!.push(p);
  }
  return [...map.entries()]
    .sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]))
    .map(([theme, projects]) => ({ theme, projects }));
}


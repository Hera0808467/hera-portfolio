/*
 * AUTO-GENERATED from reference artifact.
 * Source: reference/_next/static/chunks/9d18e53bc5db42e6.js (module 84509)
 *
 * You can edit this file directly once generated.
 */

export type ContributorType = "designers" | "researchers";

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
};

export type NewsletterData = {
  month: string;
  displayMonth?: string;
  welcomeText?: string;
  endingText?: string;
  projects: NewsletterProject[];
};

export const newsletterData: NewsletterData = {
  "month": "2026-2",
  "displayMonth": "FEB 2026",
  "welcomeText": "🎉 Hey there! Welcome to my corner of the internet.\n\nI'm Hera, an AI Product Manager who builds products that truly matter.\n\nHighlights:\n- 0 to 100K DAU at Zhipu AI (Z.ai overseas chatbot)\n- Shipped AI products at Microsoft, Zhipu AI, and Baidu\n- Won 1st Prize at Tsinghua Hackathon + CCTV Interview with \"Shrimp Detective\"\n- Won Best Product Award at Hackathon with \"WeiWei\"\n- 1K+ followers on Xiaohongshu (@欢崽11)\n\nI bridge user needs and technical reality—whether designing evaluation frameworks, optimizing models, or diving into code.\n\nCurrently at Renmin University, exploring AI's future.\n\nLet's build something meaningful 👇",
  "endingText": "Thanks for exploring my work! Feel free to reach out if you have ideas, opportunities, or just want to chat about AI products.\n\nHera ♥️",
  "projects": [
    {
      "id": "shrimp-detective",
      "month": "2026-3",
      "title": "Shrimp Detective Agency - AI Tabletop Game Master",
      "displayTitle": "\ud83e\udd90 \u867e\u867e\u4fa6\u63a2\u793e",
      "contributorType": "designers",
      "contributors": ["Hera"],
      "figmaUrl": "#",
      "coverImage": "/images/hera-projects/shrimp_detective.webp",
      "description": "AI \u00d7 \u7269\u7406\u4e16\u754c \u2014\u2014 \u8ba9 AI \u63a7\u5236\u673a\u68b0\u81c2\u3001\u706f\u5149\u548c\u97f3\u7bb1\u7684\u684c\u6e38\u4f53\u9a8c\n\n\ud83e\udd47 \u6e05\u534e OpenClaw \u9ed1\u5ba2\u677e\u4e00\u7b49\u5956\n\ud83e\udd48 \u4e2d\u5173\u6751\u9f99\u867e\u5927\u8d5b\u4e8c\u7b49\u5956\uff08\u00a530,000\uff09\n\ud83c\udfac \u592e\u89c6\u91c7\u8bbf\u62a5\u9053\n\n\u3010\u6311\u6218\u3011AI \u5982\u4f55\u7a81\u7834\u5c4f\u5e55\uff0c\u63a7\u5236\u7269\u7406\u4e16\u754c\uff1f\n\n\u3010\u89e3\u6cd5\u3011\u57fa\u4e8e OpenClaw \u5206\u5e03\u5f0f\u67b6\u6784\uff0c\u6253\u9020 AI \u684c\u6e38\u4e3b\u6301\u4eba\u3002\u73a9\u5bb6\u5728\u98de\u4e66\u7fa4\u804a\u4e2d\u63a8\u7406\uff0cAI DM \u4e00\u53e5\u8bdd\u540c\u65f6\u9a71\u52a8\u673a\u68b0\u81c2\u3001\u706f\u5149\u3001\u8bed\u97f3\u97f3\u7bb1\n\n\ud83d\udcca 1\u5929\u5168\u94fe\u8def\u9a8c\u8bc1 \u00b7 \u7aef\u5230\u7aef\u5ef6\u8fdf2-4s \u00b7 \u5355\u573a\u6210\u672c\u00a52 \u00b7 \u6bdb\u5229\u738797%\n\n\u4ea7\u54c1\u5b9a\u4e49 + \u6280\u672f\u65b9\u6848\u51b3\u7b56 + \u9879\u76ee\u4ea4\u4ed8 | 2026",
      "group": "Product",
      "themeColor": "#C9A96E"
    },
    {
      "id": "weiwei-hackathon",
      "month": "2026-2",
      "title": "WeiWei - AI Emotional Companion",
      "displayTitle": "WeiWei",
      "contributorType": "designers",
      "contributors": ["Hera"],
      "figmaUrl": "https://www.figma.com/design/r7zfW9LEgDcih55tqLJqls/%E5%96%82%E5%96%82?node-id=0-1&t=DxkYpSEr0EDCNsS7-1",
      "coverImage": "/images/hera-projects/weiwei.webp",
      "description": "「那是食物，不是爱」\n\n🏆 Hackathon最佳产品奖\n\n【洞察】市面方案聚焦「控制」反而加重焦虑，WeiWei重新定位为「陪伴」\n\n【设计】90秒情感陪伴机制，用LLM构建非说教式对话系统，帮用户度过冲动高峰\n\n产品设计+开发 | 2026",
      "group": "Product",
      "themeColor": "#FF6B9D"
    },
    {
      "id": "drift-adhd",
      "month": "2026-2",
      "title": "Drift - ADHD Task Initiator",
      "displayTitle": "Drift | 漂流",
      "contributorType": "designers",
      "contributors": ["Hera"],
      "figmaUrl": "https://drift-for-adhd.netlify.app",
      "coverImage": "/images/hera-projects/drift.webp",
      "description": "缓解时间不知道干什么？捞一个瓶子，帮你开始\n\n【痛点】决策瘫痪导致任务启动困难\n\n【方案】\u201c捞瓶子\u201d随机机制 + 智能推荐，降低选择成本，5分钟也能推进主线\n\n📱 小红书ADHD话题Top3 | 对拖延症和ADHDer友好\n\nSide Project | 产品 + 独立开发 | 2026",
      "group": "Side Project",
      "themeColor": "#8B7FD8"
    },
    {
      "id": "research-copilot",
      "month": "2026-2",
      "title": "Research Copilot",
      "displayTitle": "Research Copilot",
      "contributorType": "designers",
      "contributors": ["Hera"],
      "figmaUrl": "#",
      "coverImage": "/images/hera-projects/research_copilot.webp",
      "description": "AI驱动的科研效率系统\n\n🎯 产品能力：三层产品矩阵（情绪激励→执行管理→导师沟通），gamification降低实验启动门槛\n\n💻 AI Native工程：多模态AI能力组合，动态生成组会材料/PPT/沟通话术，准备时间<10分钟\n\n📊 情绪层·加油站 → 执行层·进度管理 → 协作层·AI生成\n\n产品设计 + Claude Code独立开发",
      "group": "Product Design",
      "themeColor": "#7B3FF2"
    }
  ]
};

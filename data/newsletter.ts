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
  "welcomeText": "🎉 Hey there! Welcome to my corner of the internet.\n\nI'm Hera, an AI Product Manager who builds products that truly matter.\n\nHighlights:\n- 0 to 100K DAU at Zhipu AI (Z.ai overseas chatbot)\n- Shipped AI products at Microsoft, Zhipu AI, and Baidu\n- Won Best Product Award at Hackathon with \"WeiWei\"\n- 1K+ followers on Xiaohongshu (@欢崽11)\n\nI bridge user needs and technical reality—whether designing evaluation frameworks, optimizing models, or diving into code.\n\nCurrently at Renmin University, exploring AI's future.\n\nLet's build something meaningful 👇",
  "endingText": "Thanks for exploring my work! Feel free to reach out if you have ideas, opportunities, or just want to chat about AI products.\n\nHera ♥️",
  "projects": [
    {
      "id": "weiwei-hackathon",
      "month": "2026-2",
      "title": "WeiWei - AI Emotional Companion",
      "displayTitle": "WeiWei",
      "contributorType": "designers",
      "contributors": ["Hera"],
      "figmaUrl": "https://www.figma.com/make/W2hmSYCwrO8T6HpXvJgGML/%E7%95%8C%E9%9D%A2%E5%A4%8D%E5%88%BB%E4%B8%8E%E8%B7%B3%E8%BD%AC?p=f&t=ykwA2bBG439pVg4a-0&fullscreen=1",
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

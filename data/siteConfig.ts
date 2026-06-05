export type SiteConfig = {
  metadata: {
    title: string;
    description: string;
  };

  brand: {
    /** Main brand label used in hero + loading overlay (e.g. "MAI-China"). */
    name: string;
    /** Secondary brand label used in the loading overlay (e.g. "Newsletter"). */
    loadingSubtitle: string;
    /** Hero tagline line (e.g. "DESIGN & RESEARCH"). */
    tagline: string;
  };

  contact: {
    email: string;
    label: string;
  };

  navigation: {
    /** Enable/disable the left-bottom group navigation. */
    groupNavEnabled: boolean;
    /** Show group navigation on the first (hero) section. */
    showGroupNavOnHero: boolean;
    /** Show group navigation on the last (ending) section. */
    showGroupNavOnEnding: boolean;
    /** Optional explicit ordering for groups in the nav. Groups not listed keep their natural order. */
    groupOrder?: string[];
  };

  hero: {
    scrollHint: {
      enabled: boolean;
      label: string;
    };
  };

  theme: {
    backgroundColor: string;
  };

  projects: {
    /** If true, apply a conservative title-casing to project titles. */
    titleCase: boolean;
  };
};

export const siteConfig: SiteConfig = {
  metadata: {
    title: "Hera's Portfolio",
    description: "Macaron genUI / Dynamic UI 团队动态日报。"
  },

  brand: {
    name: "Dynamic Report",
    loadingSubtitle: "Macaron genUI",
    tagline: "MACARON · GENUI TEAM · 动态日报"
  },

  contact: {
    email: "https://neocloud.feishu.cn/docx/Gf84dVLppoS6dGxFPbncMWDsnDo",
    label: "查看 Roadmap"
  },

  navigation: {
    groupNavEnabled: true,
    showGroupNavOnHero: false,
    showGroupNavOnEnding: false,
    groupOrder: undefined
  },

  hero: {
    scrollHint: {
      enabled: true,
      label: "Scroll"
    }
  },

  theme: {
    backgroundColor: "#1A1918"
  },

  projects: {
    titleCase: true
  }
};


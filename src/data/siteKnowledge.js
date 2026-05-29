export const siteKnowledge = {
  ownerName: "Jason",
  assistantName: "Jason 个人网站智能助理",
  fallback:
    "目前网站资料中没有相关信息，可以通过联系方式进一步咨询 Jason。",
  profile: {
    role: "平面设计师 / 视觉设计师",
    summary:
      "Jason 专注品牌识别、版式系统、包装与数字视觉，强调把复杂信息整理成清晰、有质感、可延展的视觉体验。",
    traits: ["阳光开朗", "执行力强", "能快速理解需求", "重视稳定输出"]
  },
  services: [
    "品牌识别设计",
    "海报与版式设计",
    "包装设计",
    "视觉系统设计",
    "数字界面视觉",
    "设计规范整理",
    "字体与网格系统",
    "创意提案"
  ],
  style: [
    "简洁、安静、精确",
    "重视信息结构与视觉秩序",
    "关注字距、色阶、材料触感等落地细节",
    "适合品牌、编辑、包装、数字传播等视觉方向"
  ],
  projects: [
    {
      name: "AURELIA",
      type: "品牌视觉系统",
      year: "2026",
      description:
        "为精品香氛品牌建立从标志、包装到线下陈列的完整视觉语言。"
    },
    {
      name: "MINO STUDIO",
      type: "展览主视觉",
      year: "2025",
      description:
        "以网格、留白和动态线条构建现代艺术展览的海报与数字传播系统。"
    },
    {
      name: "NORTHLINE",
      type: "数字产品视觉",
      year: "2025",
      description:
        "为创意工具设计高识别度界面视觉、图标体系和官网资产规范。"
    }
  ],
  experience: [
    "2023 至今：自由视觉设计师，为消费品牌、文化项目和初创产品提供品牌视觉、传播物料与设计系统。",
    "2020 - 2023：高级平面设计师，负责主视觉、包装、线上营销素材与跨渠道视觉一致性管理。",
    "2018 - 2020：视觉设计师，参与品牌升级、活动视觉、社交媒体视觉和印刷品落地。"
  ],
  contact: {
    email: "jie121203@gmail.com",
    phone: "15224036632",
    preferredMethod:
      "访客可以通过网站联系方式进一步咨询 Jason 的合作方式、项目排期和报价。"
  },
  assistantRules: [
    "只能根据本文件中的资料回答。",
    "不要编造不存在的经历、项目、客户、奖项、报价或服务承诺。",
    "资料不足时必须使用 fallback 中的固定回复。"
  ]
};

export function buildSiteKnowledgeText() {
  return [
    `姓名：${siteKnowledge.ownerName}`,
    `身份：${siteKnowledge.profile.role}`,
    `简介：${siteKnowledge.profile.summary}`,
    `个人特质：${siteKnowledge.profile.traits.join("、")}`,
    `服务范围：${siteKnowledge.services.join("、")}`,
    `设计风格：${siteKnowledge.style.join("；")}`,
    "作品案例：",
    ...siteKnowledge.projects.map(
      (project) =>
        `- ${project.name}（${project.year}，${project.type}）：${project.description}`
    ),
    "经历：",
    ...siteKnowledge.experience.map((item) => `- ${item}`),
    `联系方式：邮箱 ${siteKnowledge.contact.email}；电话 ${siteKnowledge.contact.phone}`,
    `合作咨询：${siteKnowledge.contact.preferredMethod}`,
    `固定兜底回复：${siteKnowledge.fallback}`
  ].join("\n");
}

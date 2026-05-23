export type Herb = {
  id: string;
  name: string;
  pinyin: string;
  nature: string;
  channels: string;
  taste: string;
  keywords: string[];
  brief: string;
  dailyUse: string;
  caution: string;
  culture: string;
};

export type TimelineNode = {
  id: string;
  phase: string;
  title: string;
  date: string;
  summary: string;
  color: string;
  keywords: string[];
};

export type Branch = {
  name: string;
  short: string;
  image: string;
  color: string;
  focus: string;
  note: string;
  memberCount: string;
  leader: string;
  role: string;
  intro: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
  explain: string;
};

export const themeLine = "金光青黛同济兴，本草杏林华夏清";

export const siteInfo = {
  name: "光药医路",
  fullName: "「光药医路」联合团支部",
  university: "华中科技大学",
  activity: "本科特色团日",
  tagline: "从三个班，到一个集体",
  memberCount: "75 位同学",
  supervisor: "华中科技大学团委",
  location: "湖北 · 武汉",
  yearRange: "2025–2026",
  contactNote: "合作与反馈请联系各班团支书：药学中外2503班 艾宇杭 (15827190081)、光电2506班 张子栋 (18921667323)、基医强基2501班 高雨佳 (15290074535)，或反馈至邮箱 2499133151@qq.com (宣传负责人 谭茗月)。",
  rightsNote:
    "本站内容用于中医药文化科普与团支部活动展示，未经授权请勿转载或商用。除明确标注开源的部分外，页面文案与视觉素材版权归联合团支部及权利人所有。"
};

export const footerNavGroups = [
  {
    title: "站点导航",
    links: [
      { href: "#home", label: "主页" },
      { href: "#arc", label: "成长弧" },
      { href: "#union", label: "联合支部" },
      { href: "#herb-lab", label: "中药查询" }
    ]
  },
  {
    title: "互动体验",
    links: [
      { href: "#knowledge", label: "趣味知识" },
      { href: "#quiz", label: "互动问答" },
      { href: "#research", label: "研究成果" },
      { href: "#contact", label: "页脚信息" }
    ]
  }
] as const;

export const footerBranches = [
  "药学（中外合作办学）2503 班团支部",
  "光电 2506 班团支部",
  "基础医学（强基计划实验班）2501 班团支部"
] as const;

export const navItems = [
  { href: "#home", label: "主页" },
  { href: "#arc", label: "成长弧" },
  { href: "#union", label: "联合支部" },
  { href: "#herb-lab", label: "中药查询" },
  { href: "#knowledge", label: "趣味知识" },
  { href: "#quiz", label: "互动问答" },
  { href: "#research", label: "研究成果" },
  { href: "#contact", label: "联系" }
];

export const branches: Branch[] = [
  {
    name: "药学（中外合作办学）2503班团支部",
    short: "药学中外 2503",
    image: "/images/activity/pharmacy-branch-real.jpg",
    color: "#2D6A45",
    focus: "本草识别、药材质量、健康科普",
    note: "把中医药的传统经验转译成青年愿意理解、愿意传播的生活知识。",
    memberCount: "26人 (男15 / 女11)",
    leader: "团支书·药学支部",
    role: "联合支部总协调 · 传统与国际桥梁",
    intro: "一支充满国际视野与创新活力的团支部。26位同学怀揣着对药学事业的热忱与对中西医药融合的探索之心，齐聚于此，始终是联合支部的“定海神针”。"
  },
  {
    name: "光电信息科学与工程 2506 班团支部",
    short: "光电 2506",
    image: "/images/activity/opto-branch-real.jpg",
    color: "#B98F46",
    focus: "光谱识别、可视化表达、科技赋能",
    note: "让近红外、拉曼光谱与成分分析成为认识中医药现代化的一束光。",
    memberCount: "29人 (男25 / 女4)",
    leader: "团支书·光电支部",
    role: "联合支部技术支撑 · 破冰总策划",
    intro: "来自“中国光谷”人才摇篮。以理工科的严谨与创造力为活动开发小程序、管理账目，用“系统设计”思维让陌生的支部迅速破冰、打破隔阂。"
  },
  {
    name: "基础医学（强基计划实验班）2501班团支部",
    short: "基医强基 2501",
    image: "/images/activity/medicine-branch-real.png",
    color: "#AE262B",
    focus: "生命机制、健康教育、医学桥梁",
    note: "以医学基础训练连接传统智慧与现代健康需求，守住科学表达边界。",
    memberCount: "20人 (男8 / 女12)",
    leader: "团支书·基医支部",
    role: "联合支部学术引领 · 视觉海报设计",
    intro: "基础医学院“强基计划”首批班级。以对生命科学的敬畏，负责领学主题团课、统筹学术深度与主导海报设计，为活动注入宝贵的人文温度与科学严谨度。"
  }
];

export const growthArc: TimelineNode[] = [
  {
    id: "white",
    phase: "初识白",
    title: "破冰相识 · 味冰之夜",
    date: "2025.12",
    summary: "从三个班到一个集体，在温馨明亮的初识阶段建立共同语言。",
    color: "#F6F1E2",
    keywords: ["破冰", "相识", "联合"]
  },
  {
    id: "red",
    phase: "思政红",
    title: "团课学习 · 社区志愿",
    date: "2026.01–02",
    summary: "以团课与红建社区服务承接思政主线，把青年责任落到行动里。",
    color: "#AE262B",
    keywords: ["团课", "志愿", "社区"]
  },
  {
    id: "green",
    phase: "药草绿",
    title: "嘉年华 · 研学考察",
    date: "2026.03–04",
    summary: "本草嘉年华、叶开泰博物馆与家乡考察，让药草绿成为成长主线。",
    color: "#2D6A45",
    keywords: ["嘉年华", "叶开泰", "研学"]
  }
];

export const activityHighlights = [
  {
    title: "草色通真",
    image: "/images/activity/carnival-booth.jpg",
    text: "通过辨识药材、闻香识草和任务闯关，把中药标本从展柜带到同学手边。"
  },
  {
    title: "捣药闻香",
    image: "/images/activity/carnival-poster.png",
    text: "用捣药钵、茶饮和现场讲解营造沉浸式医馆氛围，让文化体验有触感。"
  },
  {
    title: "叶开泰研学",
    image: "/images/activity/yekaitai-group.png",
    text: "走进中医药文化园，从老字号、古方新研和数字化智造理解守正创新。"
  },
  {
    title: "志愿同行",
    image: "/images/activity/volunteer-group.jpg",
    text: "以社区服务连接社会责任，在真实劳动中把团支部凝聚力落到行动里。"
  }
];

export const herbs: Herb[] = [
  {
    id: "gouqi",
    name: "枸杞子",
    pinyin: "gou qi zi",
    nature: "性平",
    channels: "肝、肾经",
    taste: "甘",
    keywords: ["养肝", "明目", "药食同源", "茶饮"],
    brief: "常见药食同源本草，传统上常用于滋补肝肾、益精明目。",
    dailyUse: "适合做本草茶饮、校园科普样品和药食同源展示。",
    caution: "外感实热、脾虚便溏等情况需谨慎，具体使用应咨询专业人士。",
    culture: "一粒红果连接日常养生与本草传统，是最容易被青年记住的中药入口。"
  },
  {
    id: "chenpi",
    name: "陈皮",
    pinyin: "chen pi",
    nature: "性温",
    channels: "肺、脾经",
    taste: "辛、苦",
    keywords: ["理气", "健脾", "岭南", "香气"],
    brief: "由成熟橘皮陈化而来，传统上重在理气健脾、燥湿化痰。",
    dailyUse: "适合做闻香识药、药材年份对比和药食同源展示。",
    caution: "阴虚燥咳、气虚明显者不宜随意大量使用。",
    culture: "陈皮的价值来自时间，适合讲述中医药里“炮制与陈化”的耐心。"
  },
  {
    id: "huangqi",
    name: "黄芪",
    pinyin: "huang qi",
    nature: "性微温",
    channels: "肺、脾经",
    taste: "甘",
    keywords: ["补气", "固表", "免疫", "切片"],
    brief: "传统补气要药之一，常用于补气升阳、固表止汗等方向的科普讲解。",
    dailyUse: "可作为切片标本，解释根类药材、道地药材与质量控制。",
    caution: "表实邪盛、阴虚阳亢等情况不宜自行服用。",
    culture: "黄芪很适合连接“扶正”理念与现代免疫调节研究的话题。"
  },
  {
    id: "jinyinhua",
    name: "金银花",
    pinyin: "jin yin hua",
    nature: "性寒",
    channels: "肺、心、胃经",
    taste: "甘",
    keywords: ["清热", "解毒", "花类", "夏季"],
    brief: "常见花类中药，传统上用于清热解毒、疏散风热等方向。",
    dailyUse: "适合做花蕾形态观察、香气辨识和暑期健康科普。",
    caution: "脾胃虚寒者需谨慎，儿童和孕期人群更应遵医嘱。",
    culture: "从忍冬花到金银花，名字本身就是一段可讲给公众听的植物故事。"
  },
  {
    id: "danshen",
    name: "丹参",
    pinyin: "dan shen",
    nature: "性微寒",
    channels: "心、肝经",
    taste: "苦",
    keywords: ["活血", "红色根", "现代研究", "心血管"],
    brief: "以根入药，传统上与活血祛瘀相关，现代研究关注其多成分作用。",
    dailyUse: "适合引出中药复方、有效成分和现代药理研究的讨论。",
    caution: "正在使用抗凝药物、手术前后或特殊人群不应自行使用。",
    culture: "丹参是“传统经验如何进入现代研究问题”的典型入口。"
  },
  {
    id: "aicao",
    name: "艾草",
    pinyin: "ai cao",
    nature: "性温",
    channels: "肝、脾、肾经",
    taste: "辛、苦",
    keywords: ["端午", "艾灸", "温经", "民俗"],
    brief: "兼具药用、民俗与生活场景的植物，传统上与温经止血、散寒相关。",
    dailyUse: "适合端午民俗、艾绒制作和传统技艺展示。",
    caution: "艾灸和烟熏并不适合所有人，呼吸道敏感者尤其要注意环境通风。",
    culture: "一束艾草把节令、家庭记忆和中医药文化自然接在一起。"
  }
];

export const funFacts = [
  "“道地药材”不是营销词，而是产地、生态、品种、采收和加工共同形成的质量概念。",
  "中药材常见的“炮制”会改变药材形态、气味和作用侧重，也是传统经验与工艺标准交汇处。",
  "近红外光谱、拉曼光谱等光电技术可用于药材真伪鉴别和成分分析，是“光药医路”的专业融合点。",
  "药食同源不等于可以无限量食用；剂量、体质、搭配和使用场景都很重要。",
  "很多中药名来自形态、颜色、产地或传说，适合做成面向公众的文化故事卡。"
];

export const quizQuestions: QuizQuestion[] = [
  {
    question: "“金光青黛同济兴，本草杏林华夏清”中，“金光”更适合对应哪类支部特色？",
    options: ["光电技术赋能", "只代表金银花", "社区清扫工具", "纯粹装饰词"],
    answer: 0,
    explain: "“金光”可连接光电学科与中医药现代化中的检测、成像、可视化等技术。"
  },
  {
    question: "哪一项最适合解释“药食同源”的科普边界？",
    options: ["可以随意大量食用", "既有生活场景，也应注意体质与剂量", "只用于实验室", "与中医药无关"],
    answer: 1,
    explain: "药食同源适合公众科普，但不能替代专业诊疗，使用也需要考虑个体差异。"
  },
  {
    question: "嘉年华路演里“分两入毫”最能体现哪种传统中药师技能？",
    options: ["戥秤称量", "脉象记录", "针灸定位", "古籍校勘"],
    answer: 0,
    explain: "“分两入毫”对应中药称量体验，能让参与者感受传统药房的精细操作。"
  },
  {
    question: "用 AI 查询中药时，最重要的设计原则是什么？",
    options: ["只给结论", "避免任何风险提示", "说明来源边界并提示不可替代医生", "把内容写得越玄越好"],
    answer: 2,
    explain: "健康相关内容必须明确边界，AI 适合做科普摘要，不应替代专业医疗建议。"
  }
];

export const researchPrompts = [
  "丹参 心血管 现代研究",
  "黄芪 免疫调节 研究进展",
  "陈皮 挥发油 质量控制",
  "金银花 抗炎 成分分析"
];

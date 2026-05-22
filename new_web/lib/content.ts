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

export type Branch = {
  name: string;
  short: string;
  image: string;
  color: string;
  focus: string;
  note: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
  explain: string;
};

export const themeLine = "金光青黛同济兴，本草杏林华夏清";

export const navItems = [
  { href: "#home", label: "主页" },
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
    image: "/images/activity/pharmacy-branch.jpg",
    color: "#1c8b60",
    focus: "本草识别、药材质量、健康科普",
    note: "把中医药的传统经验转译成青年愿意理解、愿意传播的生活知识。"
  },
  {
    name: "光电 2506 班团支部",
    short: "光电 2506",
    image: "/images/activity/opto-branch.jpg",
    color: "#e3a424",
    focus: "光谱识别、可视化表达、科技赋能",
    note: "让近红外、拉曼光谱与成分分析成为认识中医药现代化的一束光。"
  },
  {
    name: "基础医学（强基计划实验班）2501班团支部",
    short: "基医强基 2501",
    image: "/images/activity/medicine-branch.png",
    color: "#c7433d",
    focus: "生命机制、健康教育、医学桥梁",
    note: "以医学基础训练连接传统智慧与现代健康需求，守住科学表达边界。"
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

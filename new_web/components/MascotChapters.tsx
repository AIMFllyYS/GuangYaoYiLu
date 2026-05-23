"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, FileText, ArrowRight, User2, BookOpen, Layers, Target, Compass } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// 章节逐字稿数据体系
const scriptChapters = [
  {
    id: "intro",
    title: "🎨 主题选题初心",
    phase: "联合支部",
    theme: "#b98f46",
    quote: "“金光青黛同济兴，本草杏林华夏清”",
    bgClass: "from-[#fbfaf5] to-[#f6f1e2]",
    text: "中医药文化中蕴含的“天人合一”哲学思想、“辨证论治”科学方法、“大医精诚”人文精神，与我们三个专业——光电信息的前沿探索、药学的传承创新、基础医学的生命关怀——形成了奇妙的呼应。我们选择中医药，不仅因为它是民族文化的瑰宝，更因为它是三个专业共同的精神交汇点——以科技之光照亮传统医药的创新之路。",
    images: [
      { src: "/images/brand/guangyao-logo-light.jpg", caption: "「光药医路」联合支部徽标" }
    ]
  },
  {
    id: "white",
    title: "🤍 初识白：味冰之夜",
    phase: "初识白 · 破冰",
    theme: "#b98f46",
    quote: "“从三个班，到一个温暖集体的破冰之旅”",
    bgClass: "from-[#faf9f0] to-[#f6f1e2]",
    text: "2025年秋，一纸通知将药学、光电、基医三个素不相识的团支部联结在了一起。为了打破隔阂，光电支部策划了精彩的传声筒、阿瓦隆与桌游互动。传声筒中因专业术语产生的奇妙误会，数字炸弹被引爆时的欢声笑语，在一盘盘零食与奖品中，这股寒冬里的暖流，让75位青年自此走在了一起，开启了‘三色同行’的序幕。",
    images: [
      { src: "/images/activity/icebreak-group.jpeg", caption: "破冰活动·联合支部全体大合照" },
      { src: "/images/activity/icebreak-play.jpeg", caption: "同学们围坐在一起进行桌游破冰互动" }
    ]
  },
  {
    id: "red",
    title: "❤️ 思政红：团课与志愿行",
    phase: "思政红 · 践行",
    theme: "#ae262b",
    quote: "“以团课筑基，以志愿践行的青年担当”",
    bgClass: "from-[#fdf5f5] to-[#fce8e8]",
    text: "思政红，是支部的精神支柱。我们召开了‘锚定十五五蓝图’主题团课，以严谨的医学与理工视角审视国家发展规划。更将思政课堂搬进红建社区，青年们弯下腰、挽起袖子，用铲子细致清理着红砖墙上的顽固牛皮癣小广告、清扫巷道落叶、维护下水道。每一次擦拭和弯腰，都将医者仁心与社会责任转化为真真切切的实际行动。",
    images: [
      { src: "/images/activity/volunteer-real-group.jpg", caption: "联合支部红建社区志愿服务合影留念" },
      { src: "/images/activity/volunteer-shovel.jpg", caption: "支部男生使用铲子细致清理红砖墙小广告" }
    ]
  },
  {
    id: "green",
    title: "💚 药草绿：嘉年华与叶开泰",
    phase: "药草绿 · 深度实践",
    theme: "#2d6a45",
    quote: "“本草嘉年华与三百年老字号的创新对话”",
    bgClass: "from-[#f4faf6] to-[#e6f3ec]",
    text: "药草绿是特色活动的实践高潮。在校园风采嘉年华中，三个支部共同搭建了中式风情药铺，调配了润喉中药茶饮。光电开发的专属小程序吸引了全校上百人次互动，通过捣药称量、辨识标本把药材带到同学身边。我们更实地走访了有着三百年历史的‘叶开泰中医药文化园’，听讲解员述说老字号如何通过数字化智造和现代分析检验完成守正创新。",
    images: [
      { src: "/images/activity/carnival-weigh.jpg", caption: "嘉年华路演中，参与者亲身体验传统戥秤称量草药" },
      { src: "/images/activity/yekaitai-hall.png", caption: "同学们在叶开泰中医药文化园大厅前集体合影" },
      { src: "/images/activity/yekaitai-cabinet.jpg", caption: "叶开泰展厅内震撼的植物标本玻璃罐墙与中药百子柜" },
      { src: "/images/activity/carnival-grind.jpg", caption: "摊位桌上展示的经典捣药钵、香包与自调养生茶水" }
    ]
  }
];

export function MascotChapters() {
  const [activeTab, setActiveTab] = useState<"profile" | "script">("profile");
  const [activeChapter, setActiveChapter] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState<Record<string, number>>({});

  const currentChapter = scriptChapters[activeChapter];

  const handleNextImage = (chapterId: string, max: number) => {
    setActiveImageIndex((prev) => ({
      ...prev,
      [chapterId]: ((prev[chapterId] || 0) + 1) % max
    }));
  };

  const updateMascotUrlParams = (tab: "profile" | "script", chapterId: string) => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    params.set("tab", tab);
    params.set("chapter", chapterId);
    const newRelativePathQuery = window.location.pathname + "?" + params.toString() + window.location.hash;
    window.history.replaceState(null, "", newRelativePathQuery);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    const chapParam = params.get("chapter");

    if (tabParam === "profile" || tabParam === "script") {
      setActiveTab(tabParam);
    }
    if (chapParam) {
      const idx = scriptChapters.findIndex((chap) => chap.id === chapParam);
      if (idx !== -1) {
        setActiveChapter(idx);
      }
    }
  }, []);

  return (
    <section id="mascot-guide" className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 relative overflow-hidden">
      
      {/* 极美环境飘散背景 */}
      <div className="pointer-events-none absolute right-0 top-1/4 h-72 w-72 rounded-full bg-accent/5 blur-3xl opacity-40" aria-hidden="true" />
      <div className="pointer-events-none absolute left-0 bottom-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl opacity-40" aria-hidden="true" />

      {/* 模块头部 */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary">
          <Sparkles className="size-3.5 text-[#b98f46]" />
          <span>Mascot & Script Scroll / 灵魂角色与逐字故事</span>
        </span>
        <h2 className="mt-4 font-serif text-3xl font-black tracking-tight text-foreground sm:text-4xl md:text-5xl">
          瑶光指引，三色画卷
        </h2>
        <p className="mt-4 font-sans text-sm md:text-base leading-relaxed text-muted-foreground">
          我们引入了联合支部的灵魂守护者——“瑶光”，并通过她的视角，带您深度还原与翻阅《总结书》和《答辩PPT》中长达半年的真实科考志愿画卷。
        </p>

        {/* 顶部高定切换 Tabs */}
        <div className="mt-8 flex justify-center gap-4">
          <Button
            onClick={() => {
              setActiveTab("profile");
              updateMascotUrlParams("profile", currentChapter.id);
            }}
            variant={activeTab === "profile" ? "default" : "outline"}
            className={cn(
              "h-11 px-6 rounded-xl font-semibold shadow-sm transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              activeTab === "profile" 
                ? "bg-primary text-[#f6f1e2]" 
                : "border-primary/10 bg-white/40 hover:bg-primary/5 text-muted-foreground hover:text-primary"
            )}
          >
            <User2 className="size-4.5 mr-2" />
            瑶光人物档案
          </Button>
          <Button
            onClick={() => {
              setActiveTab("script");
              updateMascotUrlParams("script", currentChapter.id);
            }}
            variant={activeTab === "script" ? "default" : "outline"}
            className={cn(
              "h-11 px-6 rounded-xl font-semibold shadow-sm transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              activeTab === "script" 
                ? "bg-primary text-[#f6f1e2]" 
                : "border-primary/10 bg-white/40 hover:bg-primary/5 text-muted-foreground hover:text-primary"
            )}
          >
            <BookOpen className="size-4.5 mr-2" />
            三色逐字稿画卷
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "profile" ? (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid gap-8 md:grid-cols-[0.85fr_1.15fr] items-stretch"
          >
            {/* 左侧：精美的立绘插图面板 */}
            <Card className="gold-corner-hollow gold-fine-frame overflow-hidden border border-primary/10 bg-[#091510] text-[#cfe0d6] flex flex-col items-center justify-center p-8 relative min-h-[460px]">
              {/* 背景微晕光 */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
              
              <div className="relative z-10 space-y-6 text-center">
                <div className="relative mx-auto w-48 h-48 sm:w-56 sm:h-56 transition-transform duration-500 hover:scale-105">
                  <Image
                    src="/images/mascot/yaoguang-assistant.png"
                    fill
                    sizes="(max-width: 768px) 192px, 224px"
                    alt="瑶光全身立绘设定"
                    className="object-contain drop-shadow-[0_16px_32px_rgba(185,143,70,0.25)]"
                    priority
                  />
                  {/* 三色流动标章 */}
                  <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#ae262b] text-[10px] font-bold text-white shadow ring-2 ring-[#091510]">
                    医
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-2xl font-black text-white">瑶 光</h3>
                  <p className="font-mono text-xs text-[#9cb3a4] tracking-widest uppercase">Yáo Guāng · Mascot</p>
                </div>
                <div className="vermilion-stamp font-serif text-xs">
                  光药医路 · 守护者
                </div>
              </div>
            </Card>

            {/* 右侧：高度设计感的人物设定卡 */}
            <Card className="gold-corner-hollow glass-panel border border-primary/10 p-6 sm:p-8 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#b98f46]">
                  <Compass className="size-4.5" />
                  <span>Character Profile / 档案卡</span>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="border-b border-primary/5 pb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">🏷️ 姓名含义</span>
                    <p className="font-sans text-sm font-semibold text-foreground mt-1">“瑶”取自中草药“瑶草”，“光”呼应光电学院</p>
                  </div>
                  <div className="border-b border-primary/5 pb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">🎂 设定年龄</span>
                    <p className="font-sans text-sm font-semibold text-foreground mt-1">19 岁（风华正茂的大一联合支部青年）</p>
                  </div>
                  <div className="border-b border-primary/5 pb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">🎨 设计风格</span>
                    <p className="font-sans text-sm font-semibold text-foreground mt-1">日系清新立绘 × 古典优雅中国风</p>
                  </div>
                  <div className="border-b border-primary/5 pb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">🌈 视觉代表</span>
                    <p className="font-sans text-sm font-semibold text-foreground mt-1">白、红、绿三色渐变流体</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="relative border-l-2 border-primary/30 pl-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#b98f46] block">头饰与服饰细节</span>
                    <p className="font-sans text-xs sm:text-sm leading-relaxed text-muted-foreground mt-1">
                      发间别着一枚<strong>透镜发簪</strong>（透明镜片内隐现何首乌与银杏叶脉络），身着改良版<strong>白大褂</strong>，绣着忍冬花，内搭红色衬衣，腰系绿色丝带挂着小药壶。
                    </p>
                  </div>
                  <div className="relative border-l-2 border-primary/30 pl-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#b98f46] block">手持圣物与胸前印记</span>
                    <p className="font-sans text-xs sm:text-sm leading-relaxed text-muted-foreground mt-1">
                      右手持一束新鲜中药（带根须何首乌），左手托着折射出三色光的光学透镜，白大褂上端别着华中大校徽和闪耀的共青团团徽。
                    </p>
                  </div>
                </div>
              </div>

              {/* 瑶光手写寄语卷轴 */}
              <div className="mt-8 rounded-xl border border-[#b98f46]/20 bg-[#f6f1e2]/40 p-5 relative shadow-inner">
                {/* 装饰边角 */}
                <div className="absolute top-0 left-0 h-1.5 w-1.5 border-t border-l border-[#b98f46]" />
                <div className="absolute bottom-0 right-0 h-1.5 w-1.5 border-b border-r border-[#b98f46]" />
                
                <p className="font-serif text-xs sm:text-sm italic leading-relaxed text-foreground/90">
                  “嗨，我是瑶光！🌿 欢迎翻开我们的故事。在这条名为‘光药医路’的漫漫求索线上，我会带你走过破冰活动的暖冬之夜、严肃而深刻的主题团课、热闹非凡的嘉年华，还有那座有着三百年历史的叶开泰文化园。准备好了吗？我们一同出发吧！”
                </p>
                <div className="mt-3.5 flex items-center justify-between text-[10px] font-bold text-[#b98f46]">
                  <span>✨ 瑶光给读者的信笺</span>
                  <span>▸ 点击右上角按钮阅读三色卷轴</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="script"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]"
          >
            {/* 左侧：章节卷轴目录 */}
            <div className="flex flex-col gap-3">
              {scriptChapters.map((chap, idx) => {
                const isSelected = activeChapter === idx;
                return (
                  <button
                    key={chap.id}
                    onClick={() => {
                      setActiveChapter(idx);
                      updateMascotUrlParams("script", chap.id);
                    }}
                    className={cn(
                      "group relative flex items-center justify-between gap-4 rounded-xl border p-5 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                      isSelected
                        ? "border-[#b98f46] bg-white shadow-md -translate-y-0.5"
                        : "border-primary/10 bg-white/40 hover:bg-white/70 hover:border-primary/20"
                    )}
                  >
                    {/* 左侧装饰色条 */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl transition-all"
                      style={{ backgroundColor: chap.theme }}
                    />
                    
                    <div className="pl-3 space-y-1.5">
                      <span
                        className="font-serif text-[10px] font-extrabold uppercase tracking-widest"
                        style={{ color: chap.theme }}
                      >
                        {chap.phase}
                      </span>
                      <h3 className="font-serif text-base font-bold text-foreground group-hover:text-primary transition-colors">
                        {chap.title}
                      </h3>
                    </div>
                    
                    <ArrowRight 
                      className={cn(
                        "size-4 shrink-0 transition-transform duration-300",
                        isSelected ? "translate-x-1.5 text-[#b98f46]" : "text-muted-foreground/40 group-hover:translate-x-1 group-hover:text-primary"
                      )} 
                    />
                  </button>
                );
              })}
            </div>

            {/* 右侧：高度还原纸卷质感的逐字稿视窗 */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentChapter.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.3 }}
                className="scroll-paper gold-fine-frame rounded-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[500px]"
              >
                {/* 顶部的章节标头 */}
                <div className="relative z-10 border-b border-primary/5 pb-5">
                  <div className="flex items-center gap-2">
                    <span 
                      className="inline-block h-2.5 w-2.5 rounded-full" 
                      style={{ backgroundColor: currentChapter.theme }}
                    />
                    <span 
                      className="font-serif text-xs font-black uppercase tracking-wider"
                      style={{ color: currentChapter.theme }}
                    >
                      {currentChapter.phase}
                    </span>
                  </div>
                  <h3 className="mt-2.5 font-serif text-2xl font-extrabold text-foreground tracking-wide">
                    {currentChapter.title}
                  </h3>
                </div>

                {/* 正文与图片展示网格 */}
                <div className="relative z-10 my-6 grid gap-6 md:grid-cols-[1.1fr_0.9fr] items-center">
                  
                  {/* 左侧：精美朱批斜体诗句与长文字 */}
                  <div className="space-y-4">
                    <div className="relative overflow-hidden rounded-xl border border-[#b98f46]/25 bg-[#f6f1e2]/45 p-4.5">
                      <p className="font-serif text-sm font-bold text-foreground leading-relaxed italic">
                        {currentChapter.quote}
                      </p>
                    </div>
                    <p className="font-sans text-xs leading-relaxed text-muted-foreground/90 sm:text-sm text-pretty font-medium pl-1">
                      {currentChapter.text}
                    </p>
                  </div>

                  {/* 右侧：实践纪实大图轮播器，点睛之笔 */}
                  <div className="relative h-56 w-full overflow-hidden rounded-xl border border-primary/10 bg-black/5 shadow-inner group">
                    {(() => {
                      const imageIndex = activeImageIndex[currentChapter.id] || 0;
                      const currentImg = currentChapter.images[imageIndex];
                      
                      return (
                        <div className="relative h-full w-full">
                          <Image
                            src={currentImg.src}
                            fill
                            sizes="(max-width: 768px) 100vw, 300px"
                            alt={currentImg.caption}
                            className="object-cover transition-transform duration-700 hover:scale-[1.04]"
                          />
                          {/* 微暗遮罩与文字解释 */}
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-3 text-center">
                            <p className="font-sans text-[10px] text-white/95 leading-normal font-bold">
                              {currentImg.caption}
                            </p>
                            {currentChapter.images.length > 1 && (
                              <p className="text-[8px] text-[#b98f46] mt-0.5 font-mono">
                                真实纪实 ({imageIndex + 1}/{currentChapter.images.length}) · 点击图片轮播
                              </p>
                            )}
                          </div>
                          
                          {/* 如果有超过一张图片，点击图片可以直接切换 */}
                          {currentChapter.images.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleNextImage(currentChapter.id, currentChapter.images.length)}
                              className="absolute inset-0 bg-transparent cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b98f46] focus-visible:ring-offset-2 rounded-xl"
                              aria-label="查看下一张图片"
                            />
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* 底部阅读进度与翻页提示 */}
                <div className="relative z-10 border-t border-primary/5 pt-5 flex items-center justify-between text-xs text-muted-foreground/75 font-semibold">
                  <div className="flex items-center gap-1">
                    <FileText className="size-3.5 text-primary" />
                    <span>总结书逐字纪实</span>
                  </div>
                  <span className="tabular-nums font-mono">
                    {activeChapter + 1} / {scriptChapters.length} 章节
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

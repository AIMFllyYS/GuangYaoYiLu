"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import {
  Sparkles,
  Search,
  BookOpenCheck,
  Check,
  Loader2,
  Save,
  Square,
  Award,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  TrendingUp,
  BookmarkCheck,
  Compass,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Info,
  Layers,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Users,
  MapPin,
  Calendar,
  GraduationCap,
  Mail,
  Home,
  Phone,
  ArrowDown
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Navigation bar import
import { SiteNav } from "@/components/sections/SiteNav";

import {
  fieldStates,
  loadHistory,
  parseAiCard,
  saveHistory,
  type SavedCard
} from "@/lib/ai-card";

import {
  herbs,
  researchPrompts,
  funFacts,
  quizQuestions,
  themeLine,
  siteInfo,
  footerBranches,
  type Herb
} from "@/lib/content";

// helper for local herb feeds
function localContextFor(herb?: Herb) {
  if (!herb) return "";
  return `${herb.name}：${herb.brief}；性味：${herb.taste}，${herb.nature}；归经：${herb.channels}；提示：${herb.caution}`;
}

// Field status indicator for light-green theme
function FieldLabel({ label, done, streaming }: { label: string; done: boolean; streaming: boolean }) {
  return (
    <div className="mb-2.5 flex items-center gap-2">
      <span className="font-mono text-[9px] font-extrabold uppercase tracking-widest text-[#b98f46] bg-primary/[0.08] px-2 py-0.5 rounded border border-primary/10">
        {label}
      </span>
      {streaming && !done && <Loader2 className="size-3 animate-spin text-[#b98f46]" aria-hidden="true" />}
      {done && (
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
          <Check className="size-3 text-primary" aria-hidden="true" />
        </motion.span>
      )}
    </div>
  );
}

// Custom Creative Products list from copied English folders
const creativeProducts = [
  {
    id: "01_notebook",
    name: "「瑶草」主题线装笔记本",
    labeled: "/yaoguang/creative/labeled/01_notebook.png",
    pure: "/yaoguang/creative/pure/01_notebook.png",
    desc: "采用宣纸封套与传统手工线装工艺，扉页夹带天然银杏与何首乌叶脉书签，让岐黄探秘手记芬芳盈手。"
  },
  {
    id: "02_calendar",
    name: "「光药」二十四节气本草台历",
    labeled: "/yaoguang/creative/labeled/02_calendar.png",
    pure: "/yaoguang/creative/pure/02_calendar.png",
    desc: "精选二十四节气本草养生干货，结合近红外光谱吸收曲线可视化设计，光电与本草的绝美跨界交融。"
  },
  {
    id: "03_badge",
    name: "「三色同行」联合支部烤漆徽章",
    labeled: "/yaoguang/creative/labeled/03_badge.png",
    pure: "/yaoguang/creative/pure/03_badge.png",
    desc: "高定锌合金电镀红铜烤漆徽章，融合透镜折射光路、共青团徽与忍冬藤蔓，凝结75位青年的跨学科热忱。"
  },
  {
    id: "04_keychain",
    name: "Q版「瑶光助手」水晶钥匙扣",
    labeled: "/yaoguang/creative/labeled/04_keychain.png",
    pure: "/yaoguang/creative/pure/04_keychain.png",
    desc: "超清高透水晶双面夹层亚克力钥匙扣，绘制瑶光吃茶、捣药的激萌神态，药光相随，常伴身边。"
  },
  {
    id: "05_cardholder",
    name: "「忍冬何首乌」手工浮雕皮革卡套",
    labeled: "/yaoguang/creative/labeled/05_cardholder.png",
    pure: "/yaoguang/creative/pure/05_cardholder.png",
    desc: "精选植鞣牛皮手工擦色，凹凸钢印刻画中药何首乌经典叶形，完美收纳同济校徽校园卡。"
  },
  {
    id: "06_pen",
    name: "「妙笔生草」原生态竹制签字笔",
    labeled: "/yaoguang/creative/labeled/06_pen.png",
    pure: "/yaoguang/creative/pure/06_pen.png",
    desc: "甄选优质楠竹打磨笔杆，手感温润如玉，采用可降解草木本色墨水，勾勒同济医路奋斗印记。"
  }
];

// Guess you want to search list
const guessRecommendations = [
  { name: "枸杞子", pinyin: "Gou Qi Zi", icon: "🌿" },
  { name: "陈皮", pinyin: "Chen Pi", icon: "🍊" },
  { name: "黄芪", pinyin: "Huang Qi", icon: "🍂" },
  { name: "金银花", pinyin: "Jin Yin Hua", icon: "🌼" },
  { name: "丹参", pinyin: "Dan Shen", icon: "🏮" },
  { name: "艾草", pinyin: "Ai Cao", icon: "🌱" }
];

export function HomeExperience() {
  const reduce = useReducedMotion();

  // Search and AI state
  const [query, setQuery] = useState("枸杞子");
  const [xml, setXml] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<SavedCard[]>([]);
  const [validationError, setValidationError] = useState("");
  const [searched, setSearched] = useState(false);
  const [searchIsHerb, setSearchIsHerb] = useState(true);

  // Today Specimen state
  const [specimenIndex, setSpecimenIndex] = useState(0);
  const todayHerb = useMemo(() => herbs[specimenIndex], [specimenIndex]);

  // Trivia facts state
  const [triviaIndex, setTriviaIndex] = useState(0);

  // Q&A state
  const [quizActive, setQuizActive] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizBest, setQuizBest] = useState(0);
  const [quizFlash, setQuizFlash] = useState<"right" | "wrong" | null>(null);

  // Mascot Bubble & Cultural state
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const [creativeIndex, setCreativeIndex] = useState(0);
  const [showLabeled, setShowLabeled] = useState(true);

  // Photo active state
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  // Scroll Target Ref for photos unfolding unrolling effect
  const middleScrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: middleScrollRef,
    offset: ["start end", "end start"]
  });

  // 1. Unrolling Chinese classical scroll (画卷) - scroll-controlled transformations
  // Collapsed to a thin golden line initially, then flips 90deg and expands horizontally/vertically
  const scrollUnrollScaleX = useTransform(scrollYProgress, [0.32, 0.58], [0.05, 1]);
  const scrollUnrollScaleY = useTransform(scrollYProgress, [0.32, 0.58], [0.005, 1]); // starts very thin (水平线)
  const scrollUnrollRotateX = useTransform(scrollYProgress, [0.32, 0.58], [90, 0]); // horizontal line flips to open (水平线翻转卷轴打开)
  const scrollUnrollOpacity = useTransform(scrollYProgress, [0.32, 0.52], [0.1, 1]);

  // 2. Stacked Polaroid Photos unfolding/spreading out in a wider range
  // Spreads widely across the open scroll paper (照片展开比现在距离大一些)
  const xPhoto1 = useTransform(scrollYProgress, [0.36, 0.68], [0, -290]);
  const xPhoto2 = useTransform(scrollYProgress, [0.36, 0.68], [0, -100]);
  const xPhoto3 = useTransform(scrollYProgress, [0.36, 0.68], [0, 100]);
  const xPhoto4 = useTransform(scrollYProgress, [0.36, 0.68], [0, 290]);

  const yPhoto1 = useTransform(scrollYProgress, [0.36, 0.68], [80, -15]);
  const yPhoto2 = useTransform(scrollYProgress, [0.36, 0.68], [80, 5]);
  const yPhoto3 = useTransform(scrollYProgress, [0.36, 0.68], [80, -5]);
  const yPhoto4 = useTransform(scrollYProgress, [0.36, 0.68], [80, 15]);

  const rotPhoto1 = useTransform(scrollYProgress, [0.36, 0.68], [0, -12]);
  const rotPhoto2 = useTransform(scrollYProgress, [0.36, 0.68], [0, 4]);
  const rotPhoto3 = useTransform(scrollYProgress, [0.36, 0.68], [0, -6]);
  const rotPhoto4 = useTransform(scrollYProgress, [0.36, 0.68], [0, 10]);

  // Photo opacity: hidden when scroll is a flat thin line, fades in as scroll opens
  const photoOpacity = useTransform(scrollYProgress, [0.34, 0.56], [0, 1]);

  // Refs
  const abortRef = useRef<AbortController | null>(null);
  const xmlRef = useRef("");
  const rafRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);

  // Hydration safety best score
  const scoreKey = "guangyao-quiz-best";
  useEffect(() => {
    setQuizBest(Number(localStorage.getItem(scoreKey) || "0"));
    setHistory(loadHistory());

    // Pull initial parameters
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlQuery = params.get("query");
      const urlTab = params.get("tab");
      if (urlQuery) {
        setQuery(urlQuery);
        setSearched(true);
        handleSearchExecution(urlQuery);
      }
      if (urlTab === "creative") {
        setBubbleOpen(true);
      }
    }
  }, []);

  const flushXml = useCallback(() => {
    setXml(xmlRef.current);
    rafRef.current = null;
  }, []);

  const scheduleFlush = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = window.requestAnimationFrame(flushXml);
  }, [flushXml]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
      abortRef.current?.abort();
    };
  }, []);

  const card = useMemo(() => (xml ? parseAiCard(xml) : null), [xml]);
  const fields = useMemo(() => (xml ? fieldStates(xml) : null), [xml]);
  const streaming = loading && Boolean(xml);

  const [viewMode, setViewMode] = useState<"svg" | "image">("svg");
  const [wikiImageSrc, setWikiImageSrc] = useState<string | null>(null);
  const [wikiImageLoading, setWikiImageLoading] = useState(false);

  useEffect(() => {
    const rawQuery = card?.imageSearchQuery?.trim();
    if (!rawQuery) {
      setWikiImageSrc(null);
      return;
    }
    const queryStr: string = rawQuery;

    let active = true;
    async function fetchImage() {
      setWikiImageLoading(true);
      try {
        // 1. Try English Wikipedia
        const enUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
          queryStr
        )}&prop=pageimages&format=json&pithumbsize=400&origin=*`;
        const enRes = await fetch(enUrl);
        const enData = await enRes.json();
        const enPages = enData?.query?.pages;
        if (enPages) {
          const pageId = Object.keys(enPages)[0];
          if (pageId && pageId !== "-1" && enPages[pageId].thumbnail?.source) {
            if (active) {
              setWikiImageSrc(enPages[pageId].thumbnail.source);
              setWikiImageLoading(false);
              return;
            }
          }
        }

        // 2. Try Chinese Wikipedia
        const zhUrl = `https://zh.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
          queryStr
        )}&prop=pageimages&format=json&pithumbsize=400&origin=*`;
        const zhRes = await fetch(zhUrl);
        const zhData = await zhRes.json();
        const zhPages = zhData?.query?.pages;
        if (zhPages) {
          const pageId = Object.keys(zhPages)[0];
          if (pageId && pageId !== "-1" && zhPages[pageId].thumbnail?.source) {
            if (active) {
              setWikiImageSrc(zhPages[pageId].thumbnail.source);
              setWikiImageLoading(false);
              return;
            }
          }
        }

        if (active) {
          setWikiImageSrc(null);
        }
      } catch (err) {
        console.error("Error fetching botanical image:", err);
        if (active) setWikiImageSrc(null);
      } finally {
        if (active) setWikiImageLoading(false);
      }
    }

    fetchImage();

    return () => {
      active = false;
    };
  }, [card?.imageSearchQuery]);

  function updateUrlParams(nextQuery: string) {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const q = nextQuery.trim();
    if (q) {
      params.set("query", q);
      params.set("mode", "herb");
    } else {
      params.delete("query");
      params.delete("mode");
    }
    const newRelativePathQuery = window.location.pathname + "?" + params.toString() + window.location.hash;
    window.history.replaceState(null, "", newRelativePathQuery);
  }

  // Helper to check if a query is a real herb
  const isRealHerb = useCallback((q: string) => {
    const clean = q.trim().toLowerCase();
    if (!clean) return false;
    return herbs.some(
      (h) =>
        h.name.includes(clean) ||
        clean.includes(h.name) ||
        h.pinyin.toLowerCase().includes(clean) ||
        h.keywords.some((kw) => kw.toLowerCase().includes(clean) || clean.includes(kw.toLowerCase()))
    );
  }, []);

  // Execution router for Chinese medicine checking
  async function handleSearchExecution(nextQuery = query) {
    const trimmedQuery = nextQuery.trim();
    if (!trimmedQuery) {
      setValidationError("搜索关键词不能为空，请选择或输入中药名。");
      inputRef.current?.focus();
      return;
    }
    setValidationError("");
    setSearched(true);
    updateUrlParams(trimmedQuery);

    // Scroll to search results section smoothly
    setTimeout(() => {
      searchResultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);

    const isHerb = isRealHerb(trimmedQuery);
    setSearchIsHerb(isHerb);

    if (!isHerb) {
      // If it is not a real herb, DO NOT stream AI card. Set empty and display fallback recommendations.
      abortRef.current?.abort();
      setXml("");
      setLoading(false);
      return;
    }

    // It is a real herb, proceed with AI stream query
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setError("");
    xmlRef.current = "";
    setXml("");
    setLoading(true);

    const localHerb = herbs.find(
      (h) => h.name === trimmedQuery || h.pinyin.toLowerCase() === trimmedQuery.toLowerCase()
    );

    try {
      const response = await fetch("/api/ai-herb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: trimmedQuery,
          mode: "herb",
          localContext: localContextFor(localHerb)
        }),
        signal: controller.signal
      });

      if (!response.ok || !response.body) {
        throw new Error(await response.text());
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        xmlRef.current += decoder.decode(value, { stream: true });
        scheduleFlush();
      }
      flushXml();
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === "AbortError") return;
      setError(caught instanceof Error ? caught.message : "AI 解析生成失败，请稍后重试。");
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  function stopGeneration() {
    abortRef.current?.abort();
    setLoading(false);
  }

  function persistCard() {
    if (!card || !xml) return;
    const saved: SavedCard = {
      ...card,
      id: `${Date.now()}`,
      query,
      mode: "herb",
      createdAt: new Date().toLocaleString("zh-CN"),
      xml
    };
    const next = [saved, ...history.filter((item) => item.query !== query)].slice(0, 8);
    setHistory(next);
    saveHistory(next);
  }

  // Specimen manual rotation
  function nextSpecimen() {
    setSpecimenIndex((prev) => (prev + 1) % herbs.length);
  }

  // Fact auto-rotation
  function nextTrivia() {
    setTriviaIndex((prev) => (prev + 1) % funFacts.length);
  }

  // Quiz interactive choose
  const currentQuestion = quizQuestions[quizIndex];
  const quizAnswered = quizSelected !== null;

  function handleQuizChoose(optionIdx: number) {
    if (quizAnswered) return;
    setQuizSelected(optionIdx);
    const correct = optionIdx === currentQuestion.answer;
    if (correct) {
      setQuizScore((v) => v + 1);
    }
    setQuizFlash(correct ? "right" : "wrong");
    setTimeout(() => setQuizFlash(null), 250);
  }

  function handleQuizNext() {
    const nextIdx = quizIndex + 1;
    if (nextIdx >= quizQuestions.length) {
      const finalS = quizScore;
      if (finalS > quizBest) {
        setQuizBest(finalS);
        localStorage.setItem(scoreKey, String(finalS));
      }
      setQuizIndex(0);
      setQuizSelected(null);
      setQuizScore(0);
      setQuizActive(false);
      return;
    }
    setQuizIndex(nextIdx);
    setQuizSelected(null);
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* ==================== 0. Top全局吸顶导航栏 ==================== */}
      <SiteNav />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12" id="home">
        
        {/* 极美环境光斑 */}
        <div className="bg-glow-ambient" aria-hidden="true" />

        {/* ==================== 1. Header (醒目标题，光药医路，口号，logo) ==================== */}
        <header className="relative overflow-hidden rounded-2xl border border-primary/15 bg-white/60 p-6 shadow-sm backdrop-blur-md gold-fine-frame">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            {/* Logo & Slogan Area */}
            <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
              <div className="relative shrink-0 transition-transform duration-500 hover:scale-105">
                <Image
                  src="/images/brand/guangyao-logo-light.jpg"
                  width={80}
                  height={80}
                  alt="光药医路徽标"
                  className="rounded-2xl border border-primary/10 shadow-md ring-4 ring-primary/5"
                  priority
                />
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#ae262b] text-[10px] font-bold text-white shadow ring-2 ring-white">
                  印
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2 md:justify-start">
                  <Image
                    src="/images/brand/hust-logo-new.png"
                    width={110}
                    height={32}
                    alt="华中科技大学"
                    className="h-6 w-auto brightness-95"
                  />
                  <Badge variant="outline" className="font-mono text-[9px] border-primary/20 text-primary bg-primary/5">
                    本科特色团日
                  </Badge>
                </div>
                <h1 className="font-serif text-3xl font-black text-foreground sm:text-4xl tracking-tight">
                  光药医路
                </h1>
                <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80 pl-0.5">
                  Guang Yao Yi Lu Joint League Branch
                </p>
              </div>
            </div>

            {/* Slogan Banner */}
            <div className="max-w-md space-y-2 text-center md:text-right border-t border-primary/5 pt-4 md:border-t-0 md:pt-0">
              <p className="font-serif text-base font-bold italic text-foreground leading-relaxed sm:text-lg">
                “{themeLine}”
              </p>
              <p className="font-sans text-xs text-muted-foreground/80 font-medium">
                药学 2503 · 光电 2506 · 基医 2501 联合团支部组成
              </p>
            </div>
          </div>
        </header>

        {/* ==================== 2. Interactive Dashboard Grid (Three columns) ==================== */}
        <section className="grid gap-6 md:grid-cols-12 items-stretch" id="dashboard">
          
          {/* ==================== Column 1 (Width: 4/12) ==================== */}
          <div className="md:col-span-4 flex flex-col gap-6">
            {/* 2.1 Search Specimen Input */}
            <Card className="gold-corner-hollow border border-primary/10 bg-white/45 backdrop-blur-md p-5 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#b98f46]">
                  <Search className="size-3.5" />
                  <span>SPECIMEN SEARCH / 本草集</span>
                </div>
                
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearchExecution();
                  }}
                  className="space-y-2.5"
                >
                  <label htmlFor="dashboard-herb-query" className="sr-only">请输入您想了解的中药</label>
                  <div className="relative">
                    <Input
                      id="dashboard-herb-query"
                      ref={inputRef}
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        if (validationError) setValidationError("");
                      }}
                      className="h-10 min-h-0 pl-3 pr-10 rounded-xl border-primary/10 bg-white/60 focus:border-primary/30 text-sm focus-visible:ring-1 focus-visible:ring-primary placeholder:text-muted-foreground/50"
                      placeholder="输入中药名，例如：枸杞子…"
                      spellCheck={false}
                      autoComplete="off"
                      inputMode="search"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={loading}
                      className="absolute right-1 top-1 h-8 w-8 min-h-0 min-w-0 p-0 rounded-lg bg-primary text-white shadow-sm hover:bg-primary/95 focus-visible:ring-2"
                      aria-label="提交AI分析"
                    >
                      {loading ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="size-3.5" />
                      )}
                    </Button>
                  </div>
                  {validationError && (
                    <p id="dashboard-herb-validation" className="text-[11px] text-destructive font-semibold flex items-center gap-1 pl-1" aria-live="polite">
                      ⚠️ {validationError}
                    </p>
                  )}
                </form>
              </div>
              
              <div className="mt-4 border-t border-primary/5 pt-3.5 flex items-center justify-between text-[10px] text-muted-foreground/60 leading-normal">
                <BookmarkCheck className="size-3.5 text-[#b98f46] shrink-0" />
                <span className="pl-1">输入后点击右侧魔法星，即刻拉起流式 AI 解析</span>
              </div>
            </Card>

            {/* 2.2 Today's Herb Specimen Card */}
            <Card className="flex-1 border border-primary/10 bg-white/45 backdrop-blur-md p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-primary">
                    <BookmarkCheck className="size-3.5 text-[#b98f46]" />
                    <span>TODAY SPECIMEN / 今日中药科普</span>
                  </div>
                  <Button
                    onClick={nextSpecimen}
                    variant="ghost"
                    size="sm"
                    className="h-6 text-[10px] rounded-lg px-2 text-primary hover:bg-primary/5 font-bold"
                  >
                    轮换本草 ▸
                  </Button>
                </div>

                {/* Specimen Info Layout */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-primary/5 pb-2.5">
                    <div className="space-y-0.5">
                      <strong className="font-serif text-lg font-black text-foreground">{todayHerb.name}</strong>
                      <span className="font-mono text-[9px] font-medium text-muted-foreground uppercase tracking-wider block">
                        {todayHerb.pinyin}
                      </span>
                    </div>
                    <Badge variant="outline" className="font-sans text-[10px] border-primary/20 text-[#b98f46] bg-primary/[0.02]">
                      {todayHerb.nature} · {todayHerb.taste}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex gap-2">
                      <span className="text-[10px] text-muted-foreground shrink-0 font-bold uppercase tracking-wider">归经</span>
                      <p className="text-foreground/90 font-medium">{todayHerb.channels}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[10px] text-muted-foreground shrink-0 font-bold uppercase tracking-wider">药用</span>
                      <p className="text-foreground/90 font-medium text-pretty">{todayHerb.brief}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[10px] text-muted-foreground shrink-0 font-bold uppercase tracking-wider">避忌</span>
                      <p className="text-destructive font-semibold text-pretty">{todayHerb.caution}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Herb Botanical Grinder Image */}
              <div className="mt-4 relative h-28 w-full overflow-hidden rounded-xl border border-primary/10 shadow-inner group">
                <Image
                  src="/images/activity/carnival-grind.jpg"
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  alt="传统本草研磨称量器具"
                  className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-center">
                  <span className="text-[9px] font-bold text-white/90">传统戥秤、药碗与香包纪实</span>
                </div>
              </div>
            </Card>

            {/* 2.3 Trivia Fun Facts Card */}
            <Card className="border border-primary/10 bg-white/45 backdrop-blur-md p-4 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-primary/5 pb-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#b98f46]">BOTANICAL TRIVIA / 趣味小常识</span>
                <Button
                  onClick={nextTrivia}
                  variant="ghost"
                  size="sm"
                  className="h-5 text-[9px] rounded px-1.5 text-primary hover:bg-primary/5 font-semibold"
                >
                  下一条
                </Button>
              </div>
              <p className="font-sans text-xs leading-relaxed text-muted-foreground/90 font-medium min-h-[44px]">
                {funFacts[triviaIndex]}
              </p>
            </Card>
          </div>

          {/* ==================== Column 2 (Width: 4/12 - 最新研究) ==================== */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <Card className="flex-1 border border-primary/10 bg-white/45 backdrop-blur-md p-5 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-primary">
                  <TrendingUp className="size-3.5 text-[#b98f46]" />
                  <span>MODERN RESEARCH / 最新研究</span>
                </div>

                {/* Research x3 List */}
                <div className="space-y-4">
                  
                  {/* Research Card 1 */}
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("黄芪 免疫调节 研究进展");
                      handleSearchExecution("黄芪 免疫调节 研究进展");
                    }}
                    className="w-full text-left group rounded-xl border border-primary/10 bg-white/40 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:bg-white/80 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <span className="font-mono text-[9px] font-extrabold uppercase tracking-wider text-[#b98f46] bg-primary/[0.03] px-2 py-0.5 rounded">
                      Spectroscopy & Immunology / 光谱与免疫
                    </span>
                    <h3 className="mt-2 font-serif text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      黄芪多糖调节免疫之近红外检测
                    </h3>
                    <p className="mt-1.5 font-sans text-[11px] leading-relaxed text-muted-foreground/80 font-medium line-clamp-2">
                      利用近红外反射光谱法对不同生长年限的黄芪进行成分定标与快速品质控制，探讨多糖对免疫细胞反应活性...
                    </p>
                  </button>

                  {/* Research Card 2 */}
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("丹参 心血管 现代研究");
                      handleSearchExecution("丹参 心血管 现代研究");
                    }}
                    className="w-full text-left group rounded-xl border border-primary/10 bg-white/40 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:bg-white/80 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <span className="font-mono text-[9px] font-extrabold uppercase tracking-wider text-[#b98f46] bg-primary/[0.03] px-2 py-0.5 rounded">
                      Raman Micro-Scattering / 拉曼微区扫描
                    </span>
                    <h3 className="mt-2 font-serif text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      丹参酮成分的高通量拉曼分析
                    </h3>
                    <p className="mt-1.5 font-sans text-[11px] leading-relaxed text-muted-foreground/80 font-medium line-clamp-2">
                      应用拉曼共聚焦扫描成像技术，高灵敏表征中药丹参根茎切片中活性成分丹参酮的微观空间原位分布规律...
                    </p>
                  </button>

                  {/* Research Card 3 */}
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("陈皮 质量控制 挥发油");
                      handleSearchExecution("陈皮 质量控制 挥发油");
                    }}
                    className="w-full text-left group rounded-xl border border-primary/10 bg-white/40 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:bg-white/80 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <span className="font-mono text-[9px] font-extrabold uppercase tracking-wider text-[#b98f46] bg-primary/[0.03] px-2 py-0.5 rounded">
                      Machine Learning / 智能等级评定
                    </span>
                    <h3 className="mt-2 font-serif text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      陈皮陈化年限红外无损指纹图谱
                    </h3>
                    <p className="mt-1.5 font-sans text-[11px] leading-relaxed text-muted-foreground/80 font-medium line-clamp-2">
                      结合中红外衰减全反射光谱与机器学习算法，快速分析橙皮苷等挥发油成分，实现广陈皮药材陈化等级高精...
                    </p>
                  </button>

                </div>
              </div>

              <div className="mt-4 border-t border-primary/5 pt-3.5 text-[10px] text-muted-foreground/60 leading-normal flex items-center gap-1.5">
                <Info className="size-3.5 text-primary shrink-0" />
                <span>点击任意科研卡片，均可自动填入搜索框并启动 AI 流式速读</span>
              </div>
            </Card>
          </div>

          {/* ==================== Column 3 (Width: 4/12 - 问答大插图) ==================== */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <Card className="flex-1 border border-primary/10 bg-white/45 backdrop-blur-md shadow-sm overflow-hidden flex flex-col justify-between relative rounded-2xl">
              {/* 朱印或顶角装饰 */}
              <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-[#b98f46] z-20" />
              <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-[#b98f46] z-20" />

              <AnimatePresence mode="wait">
                {!quizActive ? (
                  /* Cover Illustration Screen */
                  <motion.div
                    key="quiz-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative h-full w-full flex flex-col justify-between p-6 sm:p-8"
                  >
                    <div className="space-y-2 relative z-10">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#b98f46]">
                        <HelpCircle className="size-4 animate-pulse" />
                        <span>IMPERIAL EXAM / 岐黄趣味科考</span>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-foreground">中药现代与传统趣味问答</h3>
                      <p className="font-sans text-xs leading-relaxed text-muted-foreground/80 font-medium">
                        点击下方大图，测一测您的本草知识，解锁“瑶光助手”点睛点评！
                      </p>
                    </div>

                    {/* Big Clickable Illustration */}
                    <button
                      type="button"
                      onClick={() => setQuizActive(true)}
                      className="relative w-full h-64 overflow-hidden rounded-xl border border-primary/10 shadow-lg cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary my-4"
                    >
                      <Image
                        src="/images/brand/quiz-cover.png"
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        alt="岐黄科考封面插图"
                        className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="bg-[#b98f46] text-[#f6f1e2] text-xs font-bold px-4 py-2 rounded-xl shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          点击启程 ⚔️
                        </span>
                      </div>
                    </button>

                    <div className="text-[10px] text-muted-foreground/60 text-center relative z-10 font-bold border-t border-primary/5 pt-3">
                      联合支部联合大语言模型特供 · 完全离线计分
                    </div>
                  </motion.div>
                ) : (
                  /* Q&A Active Game Screen */
                  <motion.div
                    key="quiz-game"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6 sm:p-8 flex flex-col justify-between h-full"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-primary/5 pb-3">
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60 block">Imperial exam</span>
                          <h4 className="font-serif text-sm font-bold text-foreground">岐黄闯关中</h4>
                        </div>
                        <div className="text-right leading-none bg-[#f6f1e2]/60 px-3 py-1.5 rounded-lg border border-primary/5">
                          <span className="text-xs font-black tabular-nums">{quizScore} / {quizQuestions.length}</span>
                          <p className="text-[8px] text-muted-foreground/80 mt-0.5">最高 {quizBest}</p>
                        </div>
                      </div>

                      {/* Progress dots */}
                      <div className="flex gap-1.5" aria-label={`进度：第 ${quizIndex + 1} 题`}>
                        {quizQuestions.map((q, idx) => (
                          <span
                            key={q.question}
                            className={`h-1.5 flex-1 rounded-full transition-all ${
                              idx < quizIndex
                                ? "bg-primary"
                                : idx === quizIndex
                                ? "bg-[#b98f46] scale-y-[1.12]"
                                : "bg-primary/5 border border-primary/5"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Question text */}
                      <div className="space-y-1">
                        <span className="font-mono text-[9px] text-[#b98f46] font-bold uppercase">Q{quizIndex + 1}</span>
                        <p className="font-serif text-sm font-bold text-foreground leading-relaxed text-pretty">
                          {currentQuestion.question}
                        </p>
                      </div>

                      {/* Options list */}
                      <div className="grid gap-2">
                        {currentQuestion.options.map((opt, oIdx) => {
                          const optState =
                            quizAnswered && oIdx === currentQuestion.answer
                              ? "right"
                              : quizAnswered && oIdx === quizSelected
                              ? "wrong"
                              : "";
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleQuizChoose(oIdx)}
                              disabled={quizAnswered}
                              className={`flex min-h-[38px] items-center justify-between gap-3 rounded-lg border border-primary/10 bg-white/40 px-3.5 py-2 text-left text-xs font-medium transition-all focus-visible:ring-1 focus-visible:ring-primary ${
                                optState === "right"
                                  ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                                  : optState === "wrong"
                                  ? "border-destructive/30 bg-destructive/5 text-destructive font-semibold"
                                  : "hover:bg-white/80"
                              }`}
                            >
                              <span>{opt}</span>
                              {optState === "right" && <CheckCircle2 className="size-3.5 text-primary shrink-0" />}
                              {optState === "wrong" && <XCircle className="size-3.5 text-destructive shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation thought bubble */}
                      {quizAnswered && (
                        <div className="rounded-lg border border-primary/10 bg-primary/[0.02] p-3 text-pretty shadow-inner text-[11px] leading-relaxed text-muted-foreground/90 font-medium">
                          <strong className={quizSelected === currentQuestion.answer ? "text-primary" : "text-destructive"}>
                            🌿 瑶光助手点评：
                          </strong>
                          <p className="mt-0.5">{currentQuestion.explain}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 border-t border-primary/5 pt-4 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuizActive(false)}
                        className="rounded-lg border-primary/10 text-[10px] h-8"
                      >
                        返回封面
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleQuizNext}
                        disabled={!quizAnswered}
                        className="rounded-lg text-[10px] h-8 px-4 flex-1"
                      >
                        {quizIndex + 1 >= quizQuestions.length ? "完成科考" : "下一题"}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>

        </section>

        {/* ==================== 3. Middle Section: Dynamic Scroll-Controlled Polaroid Fan Unfolding ("联系我们") ==================== */}
        <section
          ref={middleScrollRef}
          id="union"
          className="relative overflow-hidden border border-primary/10 bg-[#fbfaf3] rounded-3xl p-6 sm:p-8 lg:p-12 shadow-sm flex flex-col justify-between items-center"
        >
          {/* Soft background aura */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(185,143,70,0.05),transparent_40%)] pointer-events-none" />

          <div className="w-full relative z-10 space-y-10 text-center">
            {/* Header label */}
            <div className="space-y-3">
              <span className="font-serif text-xs font-black uppercase tracking-widest text-[#b98f46] bg-primary/[0.04] px-4 py-1.5 rounded-full border border-primary/5 inline-block">
                🌿 联系我们
              </span>
              <h2 className="font-serif text-3xl font-black text-foreground tracking-tight sm:text-4xl">
                金光青黛同济兴，本草杏林华夏清
              </h2>
              <p className="font-sans text-xs sm:text-sm leading-relaxed text-muted-foreground/80 max-w-xl mx-auto font-medium">
                向下滑动页面，中间的真实科考实践卷轴将自动铺展，带您重温我们在冷冬破冰、红建社区志愿、嘉年华本草路演及叶开泰中医药研学中的青春足迹。
              </p>
            </div>

            {/* 3.1 Unrolling Chinese classical scroll (画卷) - scroll-controlled width */}
            <div className="relative w-full flex items-center justify-center min-h-[350px] [perspective:1200px]">
              <motion.div
                style={{
                  scaleX: scrollUnrollScaleX,
                  scaleY: scrollUnrollScaleY,
                  rotateX: scrollUnrollRotateX,
                  opacity: scrollUnrollOpacity
                }}
                className="relative mx-auto w-full max-w-4xl h-[330px] rounded-2xl border-2 border-[#b98f46]/35 bg-[#fffdf6] shadow-xl overflow-hidden scroll-paper gold-fine-frame flex items-center justify-center p-6 origin-center [transform-style:preserve-3d]"
              >
                {/* Golden circular lens axis decorations on left/right edges to look like scroll ends */}
                <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-[#b98f46]/70 shadow-inner z-20 border-r border-[#b98f46]" />
                <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-[#b98f46]/70 shadow-inner z-20 border-l border-[#b98f46]" />

                {/* Scroll inner background */}
                <div className="absolute inset-4 border border-dashed border-[#b98f46]/20 rounded-lg pointer-events-none" />

                {/* Stacked Polaroid Photos unfolding/spreading out in a wide arc stack as scroll progress advances */}
                <div className="relative w-full h-full flex items-center justify-center">
                  
                  {/* Polaroid Photo 1 (破冰相识) */}
                  <motion.div
                    style={{
                      x: xPhoto1,
                      y: yPhoto1,
                      rotate: rotPhoto1,
                      opacity: photoOpacity
                    }}
                    onClick={() => setActivePhoto(activePhoto === "ice" ? null : "ice")}
                    className="absolute bg-white p-3 shadow-lg border border-primary/5 rounded-sm w-[155px] sm:w-[170px] cursor-pointer hover:shadow-2xl hover:scale-105 transition-all z-10 select-none origin-bottom"
                  >
                    <div className="relative h-28 w-full bg-muted overflow-hidden rounded-xs">
                      <Image
                        src="/images/activity/icebreak-group.jpeg"
                        fill
                        sizes="180px"
                        alt="破冰融聚"
                        className="object-cover"
                      />
                    </div>
                    <div className="mt-2.5 text-center leading-none">
                      <span className="font-serif text-[11px] font-black text-foreground block">初识白 · 破冰融聚</span>
                      <span className="text-[8px] text-muted-foreground/80 mt-1 block">味冰之夜 暖聚破冰</span>
                    </div>
                    {activePhoto === "ice" && (
                      <div className="absolute inset-0 bg-[#2d6a45]/95 text-white p-3 rounded-sm flex flex-col justify-between text-[10px] leading-relaxed z-30">
                        <span>“味冰之夜，我们在桌游互动和传声筒里融破隔阂，拉开了三色青春的帷幕。”</span>
                        <span className="text-[8px] text-[#b98f46] font-bold">点击关闭 ✕</span>
                      </div>
                    )}
                  </motion.div>

                  {/* Polaroid Photo 2 (社区志愿) */}
                  <motion.div
                    style={{
                      x: xPhoto2,
                      y: yPhoto2,
                      rotate: rotPhoto2,
                      opacity: photoOpacity
                    }}
                    onClick={() => setActivePhoto(activePhoto === "vol" ? null : "vol")}
                    className="absolute bg-white p-3 shadow-lg border border-primary/5 rounded-sm w-[155px] sm:w-[170px] cursor-pointer hover:shadow-2xl hover:scale-105 transition-all z-10 select-none origin-bottom"
                  >
                    <div className="relative h-28 w-full bg-muted overflow-hidden rounded-xs">
                      <Image
                        src="/images/activity/volunteer-real-group.jpg"
                        fill
                        sizes="180px"
                        alt="社区志愿"
                        className="object-cover"
                      />
                    </div>
                    <div className="mt-2.5 text-center leading-none">
                      <span className="font-serif text-[11px] font-black text-foreground block">思政红 · 思想引领</span>
                      <span className="text-[8px] text-muted-foreground/80 mt-1 block">红建社区 清理街巷</span>
                    </div>
                    {activePhoto === "vol" && (
                      <div className="absolute inset-0 bg-[#ae262b]/95 text-white p-3 rounded-sm flex flex-col justify-between text-[10px] leading-relaxed z-30">
                        <span>“弯下腰、铲除牛皮癣小广告。我们将医学仁心与理工干劲，融在志愿服务的巷道中。”</span>
                        <span className="text-[8px] text-[#f6f1e2] font-bold">点击关闭 ✕</span>
                      </div>
                    )}
                  </motion.div>

                  {/* Polaroid Photo 3 (本草路演) */}
                  <motion.div
                    style={{
                      x: xPhoto3,
                      y: yPhoto3,
                      rotate: rotPhoto3,
                      opacity: photoOpacity
                    }}
                    onClick={() => setActivePhoto(activePhoto === "weigh" ? null : "weigh")}
                    className="absolute bg-white p-3 shadow-lg border border-primary/5 rounded-sm w-[155px] sm:w-[170px] cursor-pointer hover:shadow-2xl hover:scale-105 transition-all z-10 select-none origin-bottom"
                  >
                    <div className="relative h-28 w-full bg-muted overflow-hidden rounded-xs">
                      <Image
                        src="/images/activity/carnival-weigh.jpg"
                        fill
                        sizes="180px"
                        alt="本草称量"
                        className="object-cover"
                      />
                    </div>
                    <div className="mt-2.5 text-center leading-none">
                      <span className="font-serif text-[11px] font-black text-foreground block">药草绿 · 嘉年华</span>
                      <span className="text-[8px] text-muted-foreground/80 mt-1 block">捣药闻香 戥秤称重</span>
                    </div>
                    {activePhoto === "weigh" && (
                      <div className="absolute inset-0 bg-[#b98f46]/95 text-white p-3 rounded-sm flex flex-col justify-between text-[10px] leading-relaxed z-30">
                        <span>“捣药钵里阵阵药香，戥秤上刻度精确。我们将中草药文化亲切呈现给师生。”</span>
                        <span className="text-[8px] text-white font-bold">点击关闭 ✕</span>
                      </div>
                    )}
                  </motion.div>

                  {/* Polaroid Photo 4 (叶开泰研学) */}
                  <motion.div
                    style={{
                      x: xPhoto4,
                      y: yPhoto4,
                      rotate: rotPhoto4,
                      opacity: photoOpacity
                    }}
                    onClick={() => setActivePhoto(activePhoto === "ykt" ? null : "ykt")}
                    className="absolute bg-white p-3 shadow-lg border border-primary/5 rounded-sm w-[155px] sm:w-[170px] cursor-pointer hover:shadow-2xl hover:scale-105 transition-all z-10 select-none origin-bottom"
                  >
                    <div className="relative h-28 w-full bg-muted overflow-hidden rounded-xs">
                      <Image
                        src="/images/activity/yekaitai-group.png"
                        fill
                        sizes="180px"
                        alt="叶开泰研学"
                        className="object-cover"
                      />
                    </div>
                    <div className="mt-2.5 text-center leading-none">
                      <span className="font-serif text-[11px] font-black text-foreground block">守正创新 · 博物馆</span>
                      <span className="text-[8px] text-muted-foreground/80 mt-1 block">三百年老字号 数字探索</span>
                    </div>
                    {activePhoto === "ykt" && (
                      <div className="absolute inset-0 bg-[#050b08]/95 text-[#cfe0d6] p-3 rounded-sm flex flex-col justify-between text-[10px] leading-relaxed z-30">
                        <span>“走进叶开泰，近红外与拉曼光谱的指纹成分质控，让传统中医守正创新有了可量化的『一束光』。”</span>
                        <span className="text-[8px] text-[#b98f46] font-bold">点击关闭 ✕</span>
                      </div>
                    )}
                  </motion.div>

                </div>
              </motion.div>
            </div>

            {/* 3.2 Secondary Slogans and Contact Cards as scroll expands */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="border-t border-[#b98f46]/20 pt-8 w-full space-y-6"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left space-y-1">
                  <span className="font-serif text-sm font-black text-[#2d6a45] block">
                    “从三个班，到一个集体；药光同行，医路相伴”
                  </span>
                  <p className="text-[10px] text-muted-foreground/80 font-medium">
                    药学中外 2503 · 光电 2506 · 基医强基 2501 联合团支部
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-white/70 p-2 px-3.5 rounded-xl border border-[#b98f46]/20 text-[10px] text-muted-foreground font-semibold">
                  <Home className="size-4 text-[#b98f46]" />
                  <span>华中科技大学 喻家山/同济校区</span>
                </div>
              </div>

              {/* Grid of contact cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
                {/* 1. 药学 */}
                <div className="bg-white/85 backdrop-blur-xs rounded-xl p-3.5 border border-[#b98f46]/15 hover:border-[#b98f46]/35 transition-all text-left space-y-2 group hover:shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-[#2d6a45] bg-[#2d6a45]/5 px-2 py-0.5 rounded">药学中外 2503</span>
                    <Phone className="size-3.5 text-[#b98f46] group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground block">团支书 · 艾宇杭</span>
                    <span className="font-mono text-xs text-muted-foreground block">158 2719 0081</span>
                  </div>
                </div>

                {/* 2. 光电 */}
                <div className="bg-white/85 backdrop-blur-xs rounded-xl p-3.5 border border-[#b98f46]/15 hover:border-[#b98f46]/35 transition-all text-left space-y-2 group hover:shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-[#b98f46] bg-[#b98f46]/5 px-2 py-0.5 rounded">光电 2506</span>
                    <Phone className="size-3.5 text-[#b98f46] group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground block">团支书 · 张子栋</span>
                    <span className="font-mono text-xs text-muted-foreground block">189 2166 7323</span>
                  </div>
                </div>

                {/* 3. 基医 */}
                <div className="bg-white/85 backdrop-blur-xs rounded-xl p-3.5 border border-[#b98f46]/15 hover:border-[#b98f46]/35 transition-all text-left space-y-2 group hover:shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-[#ae262b] bg-[#ae262b]/5 px-2 py-0.5 rounded">基医强基 2501</span>
                    <Phone className="size-3.5 text-[#b98f46] group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground block">团支书 · 高雨佳</span>
                    <span className="font-mono text-xs text-muted-foreground block">152 9007 4535</span>
                  </div>
                </div>

                {/* 4. 宣传负责人 */}
                <div className="bg-white/85 backdrop-blur-xs rounded-xl p-3.5 border border-[#b98f46]/15 hover:border-[#b98f46]/35 transition-all text-left space-y-2 group hover:shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded">宣传与反馈</span>
                    <Mail className="size-3.5 text-[#b98f46] group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground block">负责人 · 谭茗月</span>
                    <span className="font-mono text-[11px] text-muted-foreground block truncate">2499133151@qq.com</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Downward guidance line */}
            <div className="flex justify-center pt-2">
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="flex flex-col items-center gap-1 text-[10px] text-primary/60 font-bold"
              >
                <span>继续向下，体验 AI 智能分析板块</span>
                <ArrowDown className="size-3.5 text-[#b98f46]" />
              </motion.div>
            </div>

          </div>
        </section>

        {/* ==================== 4. Search Results Section prefabed by Logo Header ==================== */}
        <div ref={searchResultsRef} className="scroll-margin-top-16">
          <AnimatePresence mode="wait">
            {searched && (
              <motion.section
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-6 pt-4"
                aria-live="polite"
                aria-busy={loading}
              >
                
                {/* 4.1 "醒目标题，光药医路，口号，logo (联合团支部组成)" Header Banner */}
                <div className="relative overflow-hidden rounded-2xl border border-[#b98f46]/35 bg-[#fbf9f2] p-5 shadow-sm gold-fine-frame">
                  <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="flex items-center gap-3">
                      <Image
                        src="/images/brand/guangyao-logo-light.jpg"
                        width={46}
                        height={46}
                        alt="光药医路LOGO"
                        className="rounded-lg border border-primary/10"
                      />
                      <div>
                        <h2 className="font-serif text-lg font-black text-foreground leading-tight">
                          光药医路 · 智能多维搜索系统
                        </h2>
                        <span className="text-[10px] text-muted-foreground tracking-wide block">
                          药学 2503 · 光电 2506 · 基医 2501 联合团支部组成
                        </span>
                      </div>
                    </div>
                    <div className="text-center sm:text-right">
                      <p className="font-serif text-sm font-bold text-[#b98f46] italic">
                        “金光青黛同济兴，本草杏林华夏清”
                      </p>
                      <span className="text-[9px] font-bold text-muted-foreground/60 tracking-wider">
                        MODERN MULTI-SPECTRAL HERBAL FINGERPRINTING SYSTEM
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4.2 Grid layout: Left column (Vector Specimen SVG + Suggestions) & Right column (Gold & Light-green fixed-height card) */}
                <div className="grid gap-6 md:grid-cols-12 items-stretch">
                  
                  {/* Left Column (Width: 5/12 - Responsive Vector SVG Illustration) */}
                  <div className="md:col-span-5 flex flex-col gap-6">
                    <Card className="gold-corner-hollow border border-primary/15 bg-white/60 p-5 shadow-sm backdrop-blur-md flex flex-col justify-between overflow-hidden min-h-[380px]">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-primary/5 pb-2">
                          <span className="font-mono text-[9px] font-bold tracking-widest text-[#b98f46] bg-primary/[0.04] px-2 py-0.5 rounded">
                            SPECIMEN SPECTRUM / 多光谱照影
                          </span>
                          <span className="text-[9px] text-primary font-bold">
                            {loading ? "对焦扫描中…" : `照影对照：${query}`}
                          </span>
                        </div>

                        {/* Vector SVG Botanical/Spectroscopic Illustration */}
                        <div className="relative h-56 w-full rounded-xl border border-primary/10 bg-[#eaf4ed]/40 flex items-center justify-center shadow-inner p-3">
                          <svg
                            viewBox="0 0 200 200"
                            className="h-full w-auto text-primary shrink-0 transition-transform duration-500 hover:scale-105"
                            aria-hidden="true"
                          >
                            {/* Outer golden circle with coordinate dashboard style */}
                            <circle cx="100" cy="100" r="85" fill="none" stroke="#b98f46" strokeWidth="1.5" strokeDasharray="3 3" />
                            <circle cx="100" cy="100" r="76" fill="none" stroke="#b98f46" strokeWidth="0.8" opacity="0.4" />
                            <circle cx="100" cy="100" r="55" fill="none" stroke="#2d6a45" strokeWidth="0.5" opacity="0.3" />
                            
                            {/* Tech radar crosshairs */}
                            <line x1="15" y1="100" x2="185" y2="100" stroke="#b98f46" strokeWidth="0.5" opacity="0.15" />
                            <line x1="100" y1="15" x2="100" y2="185" stroke="#b98f46" strokeWidth="0.5" opacity="0.15" />
                            
                            {/* Premium Ginkgo Leaf Representation (Traditional Herb) */}
                            {/* Leaf shadow background */}
                            <path
                              d="M 100 155 C 100 142, 100 132, 100 122 M 100 122 C 80 117, 50 97, 45 72 C 42 57, 60 47, 92 62 C 96 64, 98 67, 100 69 C 102 67, 104 64, 108 62 C 140 47, 158 57, 155 72 C 150 97, 120 117, 100 122 Z"
                              fill="rgba(45, 106, 69, 0.08)"
                              stroke="#2d6a45"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            
                            {/* Radiating Ginkgo Veins */}
                            <path d="M 100 122 Q 80 108, 60 88" fill="none" stroke="#2d6a45" strokeWidth="0.8" opacity="0.6" strokeLinecap="round" />
                            <path d="M 100 122 Q 70 98, 50 76" fill="none" stroke="#2d6a45" strokeWidth="0.8" opacity="0.6" strokeLinecap="round" />
                            <path d="M 100 122 Q 85 92, 75 67" fill="none" stroke="#2d6a45" strokeWidth="0.8" opacity="0.6" strokeLinecap="round" />
                            <path d="M 100 122 Q 95 92, 92 65" fill="none" stroke="#2d6a45" strokeWidth="0.8" opacity="0.6" strokeLinecap="round" />
                            <path d="M 100 122 Q 120 108, 140 88" fill="none" stroke="#2d6a45" strokeWidth="0.8" opacity="0.6" strokeLinecap="round" />
                            <path d="M 100 122 Q 130 98, 150 76" fill="none" stroke="#2d6a45" strokeWidth="0.8" opacity="0.6" strokeLinecap="round" />
                            <path d="M 100 122 Q 115 92, 125 67" fill="none" stroke="#2d6a45" strokeWidth="0.8" opacity="0.6" strokeLinecap="round" />
                            <path d="M 100 122 Q 105 92, 108 65" fill="none" stroke="#2d6a45" strokeWidth="0.8" opacity="0.6" strokeLinecap="round" />

                            {/* Multi-spectral refracted laser scans (Optoelectronic theme) */}
                            {/* Red laser curve */}
                            <path d="M 30 130 C 70 130, 95 70, 170 70" fill="none" stroke="#ae262b" strokeWidth="1" opacity="0.55" strokeLinecap="round" />
                            {/* Gold spectral scan */}
                            <path d="M 30 135 C 70 135, 90 65, 170 65" fill="none" stroke="#b98f46" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.75" strokeLinecap="round" />
                            {/* Green analysis sweep */}
                            <path d="M 30 140 C 70 140, 85 60, 170 60" fill="none" stroke="#2d6a45" strokeWidth="0.8" opacity="0.45" strokeLinecap="round" />

                            {/* Glowing active ingredient nodes & energy sparkles */}
                            <circle cx="92" cy="62" r="3.5" fill="#b98f46" className="animate-pulse" />
                            <circle cx="125" cy="67" r="2" fill="#ae262b" />
                            <circle cx="50" cy="76" r="2.5" fill="#4ade80" />
                            <circle cx="75" cy="67" r="3" fill="#b98f46" className="animate-pulse" />
                            <circle cx="108" cy="62" r="2.5" fill="#2d6a45" />
                            <circle cx="100" cy="92" r="3" fill="#ae262b" className="animate-pulse" />
                            <circle cx="120" cy="100" r="2" fill="#b98f46" />
                          </svg>

                          <div className="absolute bottom-2 inset-x-0 text-center">
                            <span className="text-[8px] font-mono tracking-widest text-[#2d6a45] uppercase bg-white/70 px-2 py-0.5 rounded shadow-sm inline-block font-semibold">
                              Spectroscopy & Botanical Interaction Model
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Technical caption */}
                      <div className="text-[9px] text-muted-foreground/60 leading-normal border-t border-primary/5 pt-2">
                        图谱表达：左端代表多维近红外/拉曼光谱折射线，中部主脉象征岐黄草本，分子球节点显示经光谱指纹表征的活性多糖成分分布。
                      </div>
                    </Card>

                    {/* 4.3 Left Column Bottom: "猜你想搜" Recommendation Badges */}
                    <Card className="border border-primary/10 bg-white/45 p-4 shadow-sm">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[#b98f46] block mb-2">
                        GUESS YOU WANT TO SEARCH / 猜你想搜本草
                      </span>
                      <div className="flex flex-wrap gap-1.5" aria-label="猜你想搜推荐卡片">
                        {guessRecommendations.map((rec) => (
                          <Button
                            key={rec.name}
                            onClick={() => {
                              setQuery(rec.name);
                              setValidationError("");
                              handleSearchExecution(rec.name);
                            }}
                            variant="outline"
                            size="sm"
                            className="h-7 rounded-lg border-primary/10 bg-white/40 text-[10px] text-muted-foreground/90 hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all font-semibold"
                          >
                            <span className="mr-1">{rec.icon}</span>
                            <span>{rec.name}</span>
                            <span className="font-mono text-[8px] text-muted-foreground/60 ml-0.5 font-normal">
                              {rec.pinyin}
                            </span>
                          </Button>
                        ))}
                      </div>
                    </Card>
                  </div>

                  {/* Right Column (Width: 7/12 - Gold & Light Green Fixed-Height Card internally scrollable) */}
                  <div className="md:col-span-7 flex flex-col">
                    
                    {error && (
                      <Alert variant="destructive" className="rounded-2xl border-destructive/20 bg-destructive/[0.02] flex-1">
                        <AlertTitle className="font-serif font-bold">生成失败</AlertTitle>
                        <AlertDescription className="text-sm leading-relaxed">{error}</AlertDescription>
                      </Alert>
                    )}

                    {/* Fallback Router State: Not a recognized Herb */}
                    {!searchIsHerb && !loading && (
                      <Card className="gold-corner-hollow border-2 border-[#b98f46]/60 bg-[#f4faf6] p-6 sm:p-8 flex-1 flex flex-col items-center justify-center text-center rounded-2xl shadow-md h-[550px]">
                        <Image
                          src="/images/mascot/yaoguang-assistant.png"
                          width={75}
                          height={75}
                          alt=""
                          className="size-16 shrink-0 rounded-2xl drop-shadow-md"
                        />
                        <h3 className="font-serif text-base font-bold text-[#1b3d2b] mt-4">
                          ⚠️ 检索提示：未发现此本草的确切记录
                        </h3>
                        <p className="font-sans text-xs leading-relaxed text-muted-foreground mt-3 max-w-sm px-4">
                          抱歉，您输入的『<strong>{query}</strong>』可能不是标准中药或超出了我们的本草数据库范畴。
                        </p>
                        <p className="font-sans text-xs leading-relaxed text-[#b98f46] font-bold mt-2">
                          请在左下方『猜你想搜』本草切片中选择，或尝试搜索：枸杞子、陈皮、黄芪、丹参。
                        </p>
                      </Card>
                    )}

                    {/* Standard loading skeleton */}
                    {loading && !xml && (
                      <Card className="gold-corner-hollow border border-primary/10 bg-white/45 p-6 sm:p-8 flex-1 space-y-5 h-[550px] rounded-2xl">
                        <div className="space-y-2">
                          <div className="h-4 w-20 bg-primary/10 rounded animate-pulse" />
                          <div className="h-7 w-2/3 bg-primary/10 rounded animate-pulse" />
                          <div className="h-4 w-1/2 bg-primary/10 rounded animate-pulse" />
                        </div>
                        <div className="space-y-4">
                          <div className="h-20 w-full bg-primary/5 rounded animate-pulse" />
                          <div className="grid grid-cols-2 gap-3">
                            <div className="h-12 bg-primary/5 rounded animate-pulse" />
                            <div className="h-12 bg-primary/5 rounded animate-pulse" />
                          </div>
                        </div>
                      </Card>
                    )}

                    {/* Real structured streaming content */}
                    {card && searchIsHerb && (
                      <article className="flex-1 flex flex-col">
                        <Card className="gold-corner-hollow overflow-hidden border-2 border-[#b98f46] bg-[#f4faf6] text-[#1b3d2b] shadow-xl rounded-2xl h-[550px] flex flex-col justify-between relative p-6 sm:p-8">
                          
                          <div className="flex flex-col md:flex-row gap-6 h-full relative z-10 overflow-hidden">
                            
                            {/* 左侧：动态视觉展示与双重切换控制 */}
                            <div className="w-full md:w-[180px] shrink-0 flex flex-col items-center gap-4 h-full justify-start pt-2">
                              <div className="w-full aspect-square rounded-2xl overflow-hidden border border-[#b98f46]/20 bg-[#e7f3eb] relative shadow-inner flex items-center justify-center group/visual">
                                <AnimatePresence mode="wait">
                                  {viewMode === "svg" ? (
                                    <motion.div
                                      key="svg"
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.95 }}
                                      transition={{ duration: 0.2 }}
                                      className="w-full h-full flex items-center justify-center p-2"
                                    >
                                      {card.visual ? (
                                        <div
                                          className="w-full h-full text-primary flex items-center justify-center svg-container [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full"
                                          dangerouslySetInnerHTML={{ __html: card.visual }}
                                        />
                                      ) : (
                                        <div className="flex flex-col items-center gap-2 text-center">
                                          <Loader2 className="size-5 animate-spin text-[#b98f46]" />
                                          <span className="text-[10px] font-mono tracking-widest text-[#b98f46]/80 animate-pulse">GENERATING SPECTRUM...</span>
                                        </div>
                                      )}
                                    </motion.div>
                                  ) : (
                                    <motion.div
                                      key="image"
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.95 }}
                                      transition={{ duration: 0.2 }}
                                      className="w-full h-full flex items-center justify-center relative p-1"
                                    >
                                      {wikiImageLoading ? (
                                        <div className="flex flex-col items-center gap-2 text-center">
                                          <Loader2 className="size-5 animate-spin text-[#b98f46]" />
                                          <span className="text-[10px] font-mono tracking-widest text-[#b98f46]/80 animate-pulse">FETCHING PHOTO...</span>
                                        </div>
                                      ) : wikiImageSrc ? (
                                        <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#e7f3eb]">
                                          <img
                                            src={wikiImageSrc}
                                            alt={card.title}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                            loading="lazy"
                                          />
                                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                                        </div>
                                      ) : (
                                        <div className="flex flex-col items-center gap-2 text-center p-4">
                                          <div className="size-11 rounded-full bg-white flex items-center justify-center text-[#b98f46] border border-[#b98f46]/20 shadow-sm">
                                            <Image
                                              src="/images/mascot/yaoguang-assistant.png"
                                              width={32}
                                              height={32}
                                              alt="YaoGuang assistant fallback"
                                              className="rounded-full"
                                            />
                                          </div>
                                          <span className="text-[10px] text-[#2d6a45] leading-relaxed font-serif">
                                            {card.imageSearchQuery ? `未找到 ${card.imageSearchQuery} 标本` : "暂无标本图片"}
                                          </span>
                                        </div>
                                      )}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                              {/* 双态扁平滑动开关组件 */}
                              <div className="relative w-full h-9 rounded-xl bg-[#e7f3eb] border border-[#b98f46]/20 p-0.5 flex items-center select-none shadow-sm shrink-0">
                                <div
                                  className="absolute top-0.5 bottom-0.5 rounded-lg bg-[#b98f46] shadow transition-all duration-300 ease-out"
                                  style={{
                                    width: "calc(50% - 2px)",
                                    left: viewMode === "svg" ? "2px" : "calc(50%)",
                                  }}
                                />
                                
                                <button
                                  type="button"
                                  onClick={() => setViewMode("svg")}
                                  className={`flex-1 text-center font-serif text-[10px] font-bold tracking-wide relative z-10 transition-colors duration-200 ${
                                    viewMode === "svg" ? "text-white" : "text-[#2d6a45] hover:text-[#b98f46]"
                                  }`}
                                >
                                  数字谱图 (SVG)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setViewMode("image")}
                                  className={`flex-1 text-center font-serif text-[10px] font-bold tracking-wide relative z-10 transition-colors duration-200 ${
                                    viewMode === "image" ? "text-white" : "text-[#2d6a45] hover:text-[#b98f46]"
                                  }`}
                                >
                                  本草标本 (图片)
                                </button>
                              </div>
                            </div>

                            {/* 右侧：原有的卡片解析详细内容 */}
                            <div className="flex-1 flex flex-col h-full overflow-hidden">
                              
                              {/* 1. Card Header Area (Fixed position - does not scroll) */}
                              <div className="border-b border-[#b98f46]/20 pb-3 flex items-start justify-between gap-3 shrink-0">
                                <div className="space-y-1">
                                  <FieldLabel label="Herb Analysis Card" done={fields?.title.done ?? false} streaming={streaming} />
                                  <h3 className="font-serif text-2xl font-black text-[#164a32] tracking-tight">
                                    {card.title}
                                  </h3>
                                  {(card.subtitle || streaming) && (
                                    <p className="text-xs text-[#b98f46] font-serif tracking-wide italic block font-semibold">
                                      {card.subtitle}
                                      {streaming && !fields?.subtitle.done && fields?.subtitle.value && (
                                        <span className="inline-block h-3 w-0.5 bg-[#b98f46] animate-pulse ml-0.5" />
                                      )}
                                    </p>
                                  )}
                                </div>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={persistCard}
                                  disabled={loading}
                                  className="size-8.5 rounded-lg border-[#b98f46]/35 bg-white text-[#b98f46] hover:bg-primary/5 disabled:opacity-50"
                                  aria-label="保存报告卡片"
                                >
                                  <Save className="size-4" />
                                </Button>
                              </div>

                              {/* 2. Scrollable Body Area (Fixed strict height with internal custom scrollbar) */}
                              <div className="flex-1 overflow-y-auto pr-2 mt-4 space-y-6 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                                
                                {/* Summary / 提要 */}
                                <div>
                                  <FieldLabel label="Summary / 提要" done={fields?.summary.done ?? false} streaming={streaming} />
                                  {!fields?.summary.value && streaming ? (
                                    <div className="h-10 w-full bg-white/40 rounded animate-pulse" />
                                  ) : (
                                    <p className="font-sans text-xs leading-relaxed text-foreground/90 text-pretty font-medium">
                                      {card.summary || "分析中…"}
                                      {streaming && !fields?.summary.done && card.summary && (
                                        <span className="inline-block h-3.5 w-1 bg-[#b98f46] animate-pulse ml-0.5" />
                                      )}
                                    </p>
                                  )}
                                </div>

                                {/* Properties Gold Grid */}
                                {(card.properties.length > 0 || (streaming && !fields?.properties.done)) && (
                                  <div className="space-y-3">
                                    <FieldLabel label="Properties / 药性与多光谱指纹" done={fields?.properties.done ?? false} streaming={streaming} />
                                    {card.properties.length === 0 ? (
                                      <div className="grid grid-cols-2 gap-3">
                                        <div className="h-12 bg-white/40 rounded animate-pulse" />
                                        <div className="h-12 bg-white/40 rounded animate-pulse" />
                                      </div>
                                    ) : (
                                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                        {card.properties.map((item) => (
                                          <div
                                            key={item.label}
                                            className="rounded-xl border border-[#b98f46]/20 bg-white/40 p-3 transition-colors hover:bg-white/60"
                                          >
                                            <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#b98f46]">
                                              {item.label}
                                            </span>
                                            <p className="mt-1 font-serif text-xs font-bold text-[#164a32] leading-relaxed">
                                              {item.value}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Key Insights / 核心剖析 */}
                                {card.points.length > 0 && (
                                  <div className="space-y-3">
                                    <FieldLabel label="Key Insights / 核心剖析" done={true} streaming={false} />
                                    <ul className="space-y-2.5">
                                      {card.points.map((point) => (
                                        <li
                                          key={point}
                                          className="font-sans text-xs leading-relaxed text-foreground/80 font-medium pl-3 border-l-2 border-[#b98f46]"
                                        >
                                          {point}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {/* Research Modern Evidence */}
                                {(card.researchStatus || card.researchDetail) && (
                                  <div className="space-y-3">
                                    <FieldLabel label="Research & Verification / 现代研究与校验" done={fields?.research.done ?? false} streaming={streaming} />
                                    <div className="rounded-xl border border-[#b98f46]/25 bg-white/50 p-4 space-y-2 shadow-inner">
                                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#164a32]">
                                        <BookOpenCheck className="size-4 text-[#b98f46] shrink-0" />
                                        <h4>{card.researchStatus || "光谱共振分析中…"}</h4>
                                      </div>
                                      <p className="font-sans text-[11px] leading-relaxed text-muted-foreground font-medium text-pretty">
                                        {card.researchDetail}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {/* Safety boundary warning */}
                                {card.safety && (
                                  <div className="space-y-3">
                                    <FieldLabel label="Safety cautions / 避忌边界" done={fields?.safety.done ?? false} streaming={streaming} />
                                    <Alert variant="destructive" className="rounded-xl border-destructive/25 bg-destructive/5 text-destructive-foreground/90 py-3.5">
                                      <AlertDescription className="text-xs leading-relaxed font-bold">
                                        ⚠️ 避忌提醒：{card.safety}
                                      </AlertDescription>
                                    </Alert>
                                  </div>
                                )}

                                {/* Academic high reliability sources */}
                                {card.sources.length > 0 && (
                                  <div className="space-y-3.5">
                                    <span className="font-mono text-[9px] font-extrabold uppercase tracking-widest text-[#2d6a45]">
                                      References / 权威检索线索
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                      {card.sources.map((src) => (
                                        <Badge key={src} variant="outline" className="border-[#b98f46]/20 bg-white/70 text-[9px] text-[#2d6a45] font-sans font-semibold rounded px-2 py-0.5">
                                          {src}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                              </div>

                              {/* 3. Card Footer Control (Fixed position - does not scroll) */}
                              {loading && (
                                <div className="mt-4 pt-3.5 border-t border-[#b98f46]/20 flex justify-end gap-2 shrink-0">
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={stopGeneration}
                                    className="rounded-lg text-[10px] h-7 px-3 shadow"
                                  >
                                    <Square className="size-3 mr-1 fill-current" />
                                    停止生成
                                  </Button>
                                </div>
                              )}

                            </div>

                          </div>
                        </Card>
                      </article>
                    )}
                  </div>
                </div>

                {/* History Search Tabs */}
                {history.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 block">
                      Search History / 岐黄科考史
                    </span>
                    <ScrollArea className="w-full">
                      <div className="flex gap-2 pb-2">
                        {history.map((hist) => (
                          <Button
                            key={hist.id}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setQuery(hist.query);
                              setXml(hist.xml);
                              setSearched(true);
                              setTimeout(() => {
                                searchResultsRef.current?.scrollIntoView({ behavior: "smooth" });
                              }, 100);
                            }}
                            className="h-auto flex-col items-start gap-0.5 px-3 py-2 rounded-xl border-primary/10 bg-white/40 hover:bg-primary/5 text-left"
                          >
                            <strong className="font-serif text-xs font-bold text-foreground block">{hist.query}</strong>
                            <span className="font-mono text-[8px] text-muted-foreground/60">{hist.createdAt}</span>
                          </Button>
                        ))}
                      </div>
                      <ScrollBar orientation="horizontal" className="bg-primary/5" />
                    </ScrollArea>
                  </div>
                )}
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* ==================== 5. Floating Mascot (瑶光吉祥物) & Thought Bubble (瑶光文创) ==================== */}
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
          {/* Thought bubble drawer popup on the left of Mascot */}
          <AnimatePresence>
            {bubbleOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 15, x: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 15, x: 20 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="absolute bottom-28 right-0 md:right-4 w-[92vw] sm:w-[380px] md:w-[420px] max-w-lg bg-white/95 backdrop-blur-xl border border-primary/15 rounded-2xl shadow-2xl p-5 z-40 space-y-4 glass-panel"
              >
                {/* Gold corners */}
                <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-[#b98f46]" />
                <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-[#b98f46]" />
                
                <div className="flex items-center justify-between border-b border-primary/10 pb-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#b98f46]">
                    <ShoppingBag className="size-4 animate-bounce" />
                    <span>YAOGUANG CREATIVE / 瑶光文创品</span>
                  </div>
                  <Button
                    onClick={() => setBubbleOpen(false)}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 rounded-full text-muted-foreground hover:bg-primary/5 hover:text-primary"
                    aria-label="关闭文创展示"
                  >
                    ✕
                  </Button>
                </div>

                {/* Labeled vs Pure Toggles */}
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => setShowLabeled(true)}
                    size="sm"
                    variant={showLabeled ? "default" : "outline"}
                    className="h-7 rounded-lg text-[10px] px-3.5"
                  >
                    含标签完整卡片
                  </Button>
                  <Button
                    onClick={() => setShowLabeled(false)}
                    size="sm"
                    variant={!showLabeled ? "default" : "outline"}
                    className="h-7 rounded-lg text-[10px] px-3.5"
                  >
                    纯产品画面
                  </Button>
                </div>

                {/* Carousel Content */}
                <div className="relative border border-primary/10 rounded-xl overflow-hidden bg-primary/[0.02] p-3 flex flex-col items-center gap-3">
                  {/* Product display */}
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 transition-transform duration-500 hover:scale-105">
                    <Image
                      src={showLabeled ? creativeProducts[creativeIndex].labeled : creativeProducts[creativeIndex].pure}
                      fill
                      sizes="224px"
                      alt={creativeProducts[creativeIndex].name}
                      className="object-contain drop-shadow-[0_8px_20px_rgba(45,106,69,0.15)]"
                      priority
                    />
                  </div>

                  <div className="text-center space-y-1">
                    <strong className="font-serif text-sm text-foreground block">
                      {creativeProducts[creativeIndex].name}
                    </strong>
                    <p className="font-sans text-[11px] leading-relaxed text-muted-foreground/90 font-medium px-4">
                      {creativeProducts[creativeIndex].desc}
                    </p>
                  </div>

                  {/* Carousel indicators */}
                  <div className="flex gap-1.5 justify-center mt-1">
                    {creativeProducts.map((p, idx) => (
                      <span
                        key={p.id}
                        className={`h-1.5 w-1.5 rounded-full transition-all ${
                          idx === creativeIndex ? "bg-[#b98f46] w-3" : "bg-primary/20"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Left/Right buttons */}
                  <Button
                    onClick={() => setCreativeIndex((prev) => (prev - 1 + creativeProducts.length) % creativeProducts.length)}
                    size="icon"
                    variant="outline"
                    className="absolute left-1.5 top-1/2 -translate-y-1/2 size-7 rounded-full bg-white/80"
                    aria-label="前一款"
                  >
                    <ChevronLeft className="size-4 text-primary" />
                  </Button>
                  <Button
                    onClick={() => setCreativeIndex((prev) => (prev + 1) % creativeProducts.length)}
                    size="icon"
                    variant="outline"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 size-7 rounded-full bg-white/80"
                    aria-label="后一款"
                  >
                    <ChevronRight className="size-4 text-primary" />
                  </Button>
                </div>

                <div className="text-[10px] text-center text-[#b98f46] font-bold">
                  ✨ 瑶光文创特辑 · 弘扬中草药美学
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Small floating bubble dots connecting Mascot and bubble */}
          <AnimatePresence>
            {bubbleOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.8, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute bottom-24 right-6 w-3 h-3 rounded-full bg-primary/20"
                  transition={{ delay: 0.05 }}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.8, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute bottom-20 right-10 w-2 h-2 rounded-full bg-[#b98f46]/30"
                  transition={{ delay: 0.1 }}
                />
              </>
            )}
          </AnimatePresence>

          {/* Floating Mascot Button */}
          <button
            onClick={() => {
              setBubbleOpen(!bubbleOpen);
              if (typeof window !== "undefined") {
                const params = new URLSearchParams(window.location.search);
                if (!bubbleOpen) {
                  params.set("tab", "creative");
                } else {
                  params.delete("tab");
                }
                const newRelativePathQuery = window.location.pathname + "?" + params.toString() + window.location.hash;
                window.history.replaceState(null, "", newRelativePathQuery);
              }
            }}
            type="button"
            className="relative size-20 md:size-24 shrink-0 transition-transform duration-500 hover:scale-[1.08] hover:rotate-[3deg] active:scale-95 drop-shadow-[0_12px_28px_rgba(45,106,69,0.3)] z-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b98f46] rounded-full"
            aria-label="点击瑶光吉祥物，解锁瑶光文创"
          >
            <Image
              src="/images/mascot/yaoguang-assistant.png"
              width={110}
              height={110}
              alt="Q版瑶光助手"
              className="w-full h-full object-contain"
              priority
            />
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#ae262b] text-[9px] font-black text-white shadow ring-2 ring-white animate-pulse">
              文创
            </span>
          </button>
        </div>

      </main>

      {/* ==================== 6. Formal Page Footer (联系我们 - Full Width, No Rounded Corners, Gold accents, High legible dark green) ==================== */}
      <footer
        id="contact"
        className="relative w-full bg-[#050b08] text-[#e3ece6] border-t-2 border-[#b98f46] py-16 px-6 sm:px-8 lg:px-12 mt-20"
      >
        {/* Soft background botanical aura */}
        <div
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{
            background: `radial-gradient(circle at 10% 20%, rgba(45, 106, 69, 0.2) 0%, transparent 60%)`
          }}
          aria-hidden="true"
        />

        <div className="mx-auto max-w-7xl space-y-12">
          {/* Top Section: Three stage summary */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* White破冰 */}
            <div className="group border-b border-white/5 sm:border-b-0 sm:border-r sm:border-white/5 pr-4 pb-6 sm:pb-0">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#f6f1e2]/20 bg-[#f6f1e2]/5 text-[#f6f1e2] text-xs font-bold font-serif">
                  一
                </span>
                <div>
                  <span className="text-[9px] text-[#f6f1e2]/50 tracking-wider block font-bold uppercase">First stage</span>
                  <h4 className="font-serif text-sm font-bold text-[#f6f1e2]">初识白 · 破冰融聚</h4>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-[#9cb3a4] font-medium text-pretty">
                “味冰之夜，融破坚冰。”跨越药学、光电、基医的学科藩篱，写下“从三个班，到一个集体”的真挚序章。
              </p>
            </div>

            {/* Red思政 */}
            <div className="group border-b border-white/5 lg:border-b-0 lg:border-r lg:border-white/5 pr-4 pb-6 sm:pb-0">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#ae262b]/20 bg-[#ae262b]/5 text-[#f87171] text-xs font-bold font-serif">
                  二
                </span>
                <div>
                  <span className="text-[9px] text-[#f87171]/50 tracking-wider block font-bold uppercase">Second stage</span>
                  <h4 className="font-serif text-sm font-bold text-[#f87171]">思政红 · 思想引领</h4>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-[#9cb3a4] font-medium text-pretty">
                “红专并进，志愿同行。”以联合团课夯实信仰根基，以红建社区服务承接思政主线，把青年责任落到实处。
              </p>
            </div>

            {/* Green药草 */}
            <div className="group pb-6 sm:pb-0">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2d6a45]/20 bg-[#2d6a45]/5 text-[#4ade80] text-xs font-bold font-serif">
                  三
                </span>
                <div>
                  <span className="text-[9px] text-[#4ade80]/50 tracking-wider block font-bold uppercase">Third stage</span>
                  <h4 className="font-serif text-sm font-bold text-[#4ade80]">药草绿 · 守正创新</h4>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-[#9cb3a4] font-medium text-pretty">
                “本草馨香，科技赋能。”研学感悟文化厚重，嘉年华科普融合光电光谱分析，为中医药现代化注入科技力量。
              </p>
            </div>
          </div>

          {/* Middle Section: Site metadata */}
          <div className="grid gap-8 border-t border-white/5 pt-8 md:grid-cols-12">
            {/* Info */}
            <div className="space-y-4 md:col-span-6">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/brand/guangyao-logo-light.jpg"
                  width={42}
                  height={42}
                  alt="光药医路徽标"
                  className="rounded-lg border border-white/10"
                />
                <div>
                  <h3 className="font-serif text-base font-bold text-white leading-none">光药医路</h3>
                  <span className="text-[10px] text-[#8ca395] mt-1 block">{siteInfo.fullName}</span>
                </div>
              </div>
              <p className="font-serif text-xs italic text-[#f6f1e2]/80 leading-relaxed pl-1">
                “{themeLine}”
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#8ca395] leading-relaxed">
                <div>🏫 {siteInfo.university}</div>
                <div>📍 {siteInfo.location} · {siteInfo.memberCount}</div>
                <div>📅 {siteInfo.activity}</div>
                <div>🔰 指导单位：{siteInfo.supervisor}</div>
              </div>
            </div>

            {/* Branches */}
            <div className="space-y-3 md:col-span-6 border-t border-white/5 pt-6 md:border-t-0 md:pt-0">
              <h3 className="font-serif text-xs font-bold uppercase tracking-widest text-[#b98f46] flex items-center gap-1.5">
                <Users className="size-4" />
                联合支部架构组成
              </h3>
              <ul className="space-y-2">
                {footerBranches.map((br) => (
                  <li key={br} className="text-xs text-[#9cb3a4] leading-relaxed flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2d6a45] shrink-0" />
                    <span>{br}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Copyrights and security disclaimer */}
          <div className="border-t border-white/5 pt-8 space-y-6">
            <div className="grid gap-6 md:grid-cols-2 text-pretty">
              {/* Safety */}
              <div className="flex gap-3 bg-white/[0.01] rounded-xl p-4 border border-white/5">
                <ShieldCheck className="size-4 shrink-0 text-[#b98f46] mt-0.5" />
                <div className="space-y-1">
                  <strong className="text-xs font-bold text-white block">中医药科普安全声明</strong>
                  <p className="text-[11px] leading-relaxed text-[#8ca395]">
                    本站所载之中药科普、性味归经与药效成分均取自古今文献，不构成具体诊疗、用药、处方建议。凡涉及具体病理，请谨遵医嘱并前往医疗机构就诊。
                  </p>
                </div>
              </div>

              {/* Rights */}
              <div className="bg-white/[0.01] rounded-xl p-4 border border-white/5 text-[11px] leading-relaxed text-[#8ca395] space-y-1">
                <strong className="text-xs font-bold text-white block">版权与著作权说明</strong>
                <p>{siteInfo.contactNote}</p>
                <p>{siteInfo.rightsNote}</p>
              </div>
            </div>

            {/* HUST Link */}
            <div className="flex flex-col gap-4 items-center justify-between border-t border-white/5 pt-6 text-[11px] text-[#7d9486] md:flex-row">
              <span>
                &copy; 2025–2026 {siteInfo.university} {siteInfo.fullName}。保留所有权利。
              </span>
              <div className="flex items-center gap-3">
                <Link
                  href="https://www.hust.edu.cn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 transition-colors hover:text-white"
                >
                  华中科技大学官网
                  <ExternalLink className="size-3 opacity-80" />
                </Link>
                <span className="h-3 w-px bg-white/10" />
                <span className="text-[#b98f46] font-bold">🌿 学术赋能 · 药耀同行</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

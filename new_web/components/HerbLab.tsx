"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { BookOpenCheck, Check, Loader2, Save, Search, Sparkles, Square, BookmarkCheck } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fieldStates,
  loadHistory,
  parseAiCard,
  saveHistory,
  type SavedCard
} from "@/lib/ai-card";
import { herbs, researchPrompts, type Herb } from "@/lib/content";

function localContextFor(herb?: Herb) {
  if (!herb) return "";
  return `${herb.name}：${herb.brief}；性味：${herb.taste}，${herb.nature}；归经：${herb.channels}；提示：${herb.caution}`;
}

function FieldLabel({ label, done, streaming }: { label: string; done: boolean; streaming: boolean }) {
  return (
    <div className="mb-2.5 flex items-center gap-2">
      <span className="font-mono text-[10px] font-extrabold uppercase tracking-widest text-[#b98f46] bg-primary/[0.04] px-2 py-0.5 rounded border border-primary/5">
        {label}
      </span>
      {streaming && !done && <Loader2 className="size-3 animate-spin text-[#b98f46]" aria-hidden="true" />}
      {done && (
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
          <Check className="size-3.5 text-primary" aria-hidden="true" />
        </motion.span>
      )}
    </div>
  );
}

export function HerbLab({ researchOnly = false }: { researchOnly?: boolean }) {
  const [query, setQuery] = useState(researchOnly ? researchPrompts[0] : "枸杞子");
  const [xml, setXml] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<SavedCard[]>([]);
  const [mode, setMode] = useState<"herb" | "research">(researchOnly ? "research" : "herb");
  const [validationError, setValidationError] = useState("");

  const abortRef = useRef<AbortController | null>(null);
  const xmlRef = useRef("");
  const rafRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHistory(loadHistory());
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

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return herbs.slice(0, 4);
    return herbs
      .filter(
        (herb) =>
          herb.name.includes(query.trim()) ||
          herb.pinyin.includes(q) ||
          herb.keywords.some((keyword) => keyword.includes(query.trim()))
      )
      .slice(0, 4);
  }, [query]);

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

  function updateUrlParams(nextMode: string, nextQuery: string) {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const q = nextQuery.trim();
    if (q) {
      params.set("query", q);
      params.set("mode", nextMode);
    } else {
      params.delete("query");
      params.delete("mode");
    }
    const newRelativePathQuery = window.location.pathname + "?" + params.toString() + window.location.hash;
    window.history.replaceState(null, "", newRelativePathQuery);
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const urlQuery = params.get("query");
    const urlMode = params.get("mode");

    if (urlQuery && urlMode) {
      const q = urlQuery.trim();
      if (researchOnly && urlMode === "research") {
        setQuery(q);
        setMode("research");
        runAi("research", q);
      } else if (!researchOnly && urlMode === "herb") {
        setQuery(q);
        setMode("herb");
        runAi("herb", q);
      }
    }
  }, []);

  async function runAi(nextMode = mode, nextQuery = query) {
    const trimmedQuery = nextQuery.trim();
    if (!trimmedQuery) {
      setValidationError(researchOnly ? "请输入具体研究方向，例如：黄芪 免疫调节。" : "搜索关键词不能为空，请选择或输入中药名。");
      inputRef.current?.focus();
      return;
    }
    setValidationError("");
    updateUrlParams(nextMode, trimmedQuery);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setMode(nextMode);
    setError("");
    xmlRef.current = "";
    setXml("");
    setLoading(true);

    const localHerb = herbs.find((herb) => herb.name === trimmedQuery || herb.pinyin === trimmedQuery.toLowerCase());
    try {
      const response = await fetch("/api/ai-herb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: trimmedQuery,
          mode: nextMode,
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
      setError(caught instanceof Error ? caught.message : "AI 生成失败，请稍后重试。");
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
      mode,
      createdAt: new Date().toLocaleString("zh-CN"),
      xml
    };
    const next = [saved, ...history.filter((item) => item.query !== query || item.mode !== mode)].slice(0, 8);
    setHistory(next);
    saveHistory(next);
  }

  const emptyPrompts = researchOnly
    ? researchPrompts.slice(0, 3)
    : ["枸杞子 功效", "陈皮 炮制", "黄芪 免疫"];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      
      {/* 左侧：输入及本地查询区 */}
      <Card className="flex flex-col justify-between border border-primary/10 bg-white/45 backdrop-blur-md shadow-sm rounded-2xl p-6 sm:p-8">
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-3 border-b border-primary/5 pb-5">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#b98f46]">
                {researchOnly ? "AI research stream / 研学术" : "Herb search / 本草集"}
              </p>
              <CardTitle className="mt-2 font-serif text-xl font-bold text-foreground">
                {researchOnly ? "中药最新研究成果" : "中药现代检测与功能检索"}
              </CardTitle>
            </div>
            <Badge variant="outline" className="font-mono text-[9px] font-bold border-primary/15 bg-primary/5 text-primary">
              XML Stream API
            </Badge>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              runAi(researchOnly ? "research" : "herb");
            }} 
            className="flex flex-col gap-1.5"
          >
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground/80" aria-hidden="true" />
                <Input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    if (validationError) setValidationError("");
                  }}
                  className="h-11 pl-10 pr-4 rounded-xl border-primary/10 bg-white/60 focus:border-primary/30 text-sm placeholder:text-muted-foreground/50"
                  placeholder={researchOnly ? "输入研究方向，例如：黄芪 免疫调节…" : "输入中药名、拼音或功效，例如：枸杞子…"}
                  spellCheck={false}
                  autoComplete="off"
                  inputMode="search"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="h-11 rounded-xl px-5 shadow-md shadow-primary/15 font-semibold focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  {loading ? (
                    <Loader2 className="mr-1.5 size-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Sparkles aria-hidden="true" className="mr-1.5 size-4" />
                  )}
                  {researchOnly ? "生成速递" : "AI 解析"}
                </Button>
                {loading && (
                  <Button 
                    type="button"
                    variant="destructive" 
                    onClick={stopGeneration} 
                    className="h-11 rounded-xl px-4 shadow-sm"
                    aria-label="停止生成"
                  >
                    <Square className="size-3.5 fill-current" aria-hidden="true" />
                    <span className="sr-only sm:not-sr-only sm:ml-2">停止</span>
                  </Button>
                )}
              </div>
            </div>
            {validationError && (
              <p id="search-error" className="text-xs text-destructive font-semibold mt-1 flex items-center gap-1 pl-1" aria-live="polite">
                ⚠️ {validationError}
              </p>
            )}
          </form>

          {!researchOnly && (
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 block">
                Local botanical specimens / 本地本草切片
              </span>
              <div className="grid gap-3 sm:grid-cols-2" aria-label="本地中药结果">
                {matches.map((herb) => (
                  <button
                    key={herb.id}
                    type="button"
                    className="group rounded-xl border border-primary/10 bg-white/50 p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:bg-white/80 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    onClick={() => {
                      setQuery(herb.name);
                      setValidationError("");
                      setXml("");
                      runAi(mode, herb.name);
                    }}
                  >
                    <div className="flex items-center gap-1.5 justify-between">
                      <strong className="font-serif text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {herb.name}
                      </strong>
                      <span className="font-mono text-[9px] font-medium text-muted-foreground bg-primary/[0.03] px-1.5 py-0.5 rounded">
                        {herb.pinyin}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground font-medium text-pretty line-clamp-2">
                      {herb.brief}
                    </p>
                    <p className="mt-2.5 text-[10px] text-primary/80 font-bold tracking-wide line-clamp-1">
                      {herb.keywords.join(" · ")}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {researchOnly && (
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 block">
                Suggested research direction / 推荐科研方向
              </span>
              <div className="flex flex-wrap gap-2.5">
                {researchPrompts.map((prompt) => (
                  <Button 
                    key={prompt} 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setQuery(prompt)}
                    className="rounded-lg border-primary/10 bg-white/40 text-xs font-semibold text-muted-foreground/90 hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 提示小图 */}
        <div className="mt-8 flex items-center gap-3 border-t border-primary/5 pt-5 text-[11px] text-muted-foreground/60 leading-normal">
          <BookmarkCheck className="size-4 text-[#b98f46]" />
          <span>查询时，系统将无缝结合本地专家级本草数据库，并向人工智能投喂定制的光电多光谱交叉参数。</span>
        </div>
      </Card>

      {/* 右侧：AI 结构化卡片流式生成区 */}
      <div
        className="min-h-[320px] contain-[layout_style]"
        aria-live="polite"
        aria-busy={loading}
        aria-label="AI 智能输出报表"
      >
        <AnimatePresence mode="wait">
          {error && (
            <motion.div key="error" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Alert variant="destructive" className="rounded-2xl border-destructive/20 bg-destructive/[0.02]">
                <AlertTitle className="font-serif font-bold">生成失败</AlertTitle>
                <AlertDescription className="text-sm leading-relaxed">{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {!card && !error && !loading && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Card className="border border-primary/10 bg-white/45 backdrop-blur-md shadow-sm rounded-2xl p-6 sm:p-8">
                <CardContent className="flex flex-col gap-5 sm:flex-row pt-6">
                  <Image
                    src="/images/mascot/yaoguang-assistant.png"
                    width={80}
                    height={80}
                    alt=""
                    className="size-16 shrink-0 rounded-2xl drop-shadow-md"
                  />
                  <div className="space-y-4">
                    <p className="font-sans text-sm leading-relaxed text-muted-foreground/90">
                      {researchOnly
                        ? "请输入或在左侧选择推荐研究方向。我的光谱雷达已校准完毕，将以流式结构化 XML 卡片输出最新科研前沿与成果速递。"
                        : "请选择特定药材或输入您感兴趣的本草。我将提取本地优质专家信息，结合大语言模型深度提炼性味、归经与光电多维解析。"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {emptyPrompts.map((prompt) => (
                        <Button 
                          key={prompt} 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setQuery(prompt)}
                          className="rounded-lg border-primary/10 bg-white/40 text-xs hover:bg-primary/5 hover:text-primary transition-colors"
                        >
                          {prompt}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {(loading && !xml) && (
            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Card className="border border-primary/10 bg-white/45 backdrop-blur-md shadow-sm rounded-2xl p-6 sm:p-8 space-y-4">
                <CardHeader className="space-y-3 p-0 pb-4 border-b border-primary/5">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-7 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4 p-0 pt-4">
                  <Skeleton className="h-16 w-full" />
                  <div className="grid grid-cols-2 gap-3">
                    <Skeleton className="h-14" />
                    <Skeleton className="h-14" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {card && (
            <motion.article
              key={`${query}-${mode}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
            >
              <Card className="gold-corner-hollow gold-fine-frame relative overflow-hidden border border-primary/10 bg-[#091510] text-[#cfe0d6] shadow-xl rounded-2xl p-6 sm:p-8">

                {/* 背景高级呼吸暗光，与 SiteFooter 保持高度呼应 */}
                <div 
                  className="pointer-events-none absolute inset-0 opacity-15"
                  style={{
                    background: `
                      radial-gradient(circle at 85% 15%, rgba(185, 143, 70, 0.15) 0%, transparent 45%),
                      radial-gradient(circle at 15% 85%, rgba(45, 106, 69, 0.15) 0%, transparent 45%)
                    `
                  }}
                  aria-hidden="true"
                />

                <div className="flex flex-col md:flex-row gap-6 relative z-10">
                  
                  {/* 左侧：动态视觉展示与双重切换控制 */}
                  <div className="w-full md:w-[180px] shrink-0 flex flex-col items-center gap-4">
                    <div className="w-full aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black/45 relative shadow-inner flex items-center justify-center group/visual">
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
                                className="w-full h-full text-white flex items-center justify-center svg-container [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full"
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
                              <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#091510]">
                                <img
                                  src={wikiImageSrc}
                                  alt={card.title}
                                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-2 text-center p-4">
                                <div className="size-11 rounded-full bg-white/5 flex items-center justify-center text-[#b98f46] border border-white/10 shadow-sm">
                                  <Image
                                    src="/images/mascot/yaoguang-assistant.png"
                                    width={32}
                                    height={32}
                                    alt="YaoGuang assistant fallback"
                                    className="rounded-full"
                                  />
                                </div>
                                <span className="text-[10px] text-[#9cb3a4] leading-relaxed font-serif">
                                  {card.imageSearchQuery ? `未找到 ${card.imageSearchQuery} 标本` : "暂无标本图片"}
                                </span>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* 双态扁平滑动开关组件 */}
                    <div className="relative w-full h-9 rounded-xl bg-white/5 border border-white/10 p-0.5 flex items-center select-none shadow-sm">
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
                          viewMode === "svg" ? "text-white" : "text-[#9cb3a4] hover:text-white"
                        }`}
                      >
                        数字谱图 (SVG)
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode("image")}
                        className={`flex-1 text-center font-serif text-[10px] font-bold tracking-wide relative z-10 transition-colors duration-200 ${
                          viewMode === "image" ? "text-white" : "text-[#9cb3a4] hover:text-white"
                        }`}
                      >
                        本草标本 (图片)
                      </button>
                    </div>
                  </div>

                  {/* 右侧：原有的卡片解析详细内容 */}
                  <div className="flex-1 min-w-0">
                    <CardHeader className="p-0 pb-5 border-b border-white/5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 space-y-2">
                          <FieldLabel label="Herb Analysis Card" done={fields?.title.done ?? false} streaming={streaming} />
                          <CardTitle className="font-serif text-2xl font-bold text-white tracking-tight">
                            {card.title}
                          </CardTitle>
                          {(card.subtitle || streaming) && (
                            <CardDescription className="text-xs text-[#9cb3a4] font-serif tracking-wide italic">
                              {card.subtitle}
                              {streaming && !fields?.subtitle.done && fields?.subtitle.value && (
                                <span className="inline-block h-3.5 w-1 bg-[#b98f46] animate-pulse ml-0.5" />
                              )}
                            </CardDescription>
                          )}
                        </div>
                        <Button 
                          variant="secondary" 
                          size="icon" 
                          aria-label="保存报告卡片" 
                          onClick={persistCard} 
                          disabled={loading}
                          className="size-9 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-50"
                        >
                          <Save className="size-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6 p-0 pt-6">
                      
                      {/* Summary / 概述卡 */}
                      <div>
                        <FieldLabel label="Summary / 提要" done={fields?.summary.done ?? false} streaming={streaming} />
                        {!fields?.summary.value && streaming ? (
                          <Skeleton className="h-14 w-full bg-white/5" />
                        ) : (
                          <p className="font-sans text-sm leading-relaxed text-[#cfe0d6] text-pretty">
                            {card.summary || "分析中…"}
                            {streaming && !fields?.summary.done && card.summary && (
                              <span className="inline-block h-3.5 w-1 bg-[#b98f46] animate-pulse ml-0.5" />
                            )}
                          </p>
                        )}
                      </div>

                      {/* Properties / 药理属性金石网格 */}
                      {(card.properties.length > 0 || (streaming && !fields?.properties.done)) && (
                        <>
                          <Separator className="bg-white/5" />
                          <div>
                            <FieldLabel label="Properties / 药性属性" done={fields?.properties.done ?? false} streaming={streaming} />
                            {card.properties.length === 0 ? (
                              <div className="grid grid-cols-2 gap-3">
                                <Skeleton className="h-14 bg-white/5" />
                                <Skeleton className="h-14 bg-white/5" />
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 gap-3">
                                {card.properties.map((item) => (
                                  <div key={item.label} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]">
                                    <span className="font-mono text-[10px] font-extrabold uppercase tracking-widest text-[#b98f46]">
                                      {item.label}
                                    </span>
                                    <p className="mt-1.5 font-serif text-sm leading-relaxed text-white font-medium">
                                      {item.value}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </>
                      )}

                      {/* Points / 点析条目 */}
                      {card.points.length > 0 && (
                        <div className="space-y-3">
                          <FieldLabel label="Key Insights / 核心剖析" done={true} streaming={false} />
                          <ul className="space-y-3 text-sm leading-relaxed">
                            {card.points.map((point) => (
                              <li key={point} className="border-l-2 border-[#b98f46]/70 pl-3.5 text-[#cfe0d6] font-sans">
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Research / 科研证据（光电赋能核心） */}
                      {(card.researchStatus || card.researchDetail) && (
                        <div className="flex gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 shadow-inner transition-colors hover:bg-white/[0.04]">
                          <BookOpenCheck className="size-5 shrink-0 text-[#b98f46]" aria-hidden="true" />
                          <div>
                            <strong className="font-serif text-sm font-bold text-white block">
                              {card.researchStatus}
                            </strong>
                            <p className="mt-1.5 font-sans text-xs leading-relaxed text-[#9cb3a4]">
                              {card.researchDetail}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Safety / 禁忌预警 */}
                      {card.safety && (
                        <Alert variant="destructive" className="rounded-xl border-destructive/20 bg-destructive/10 text-[#f87171]">
                          <AlertDescription className="text-xs leading-relaxed font-semibold">
                            ⚠️ 禁忌提醒：{card.safety}
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Sources / 权威文献索引 */}
                      {card.sources.length > 0 && (
                        <div className="space-y-2.5">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 block">
                            References / 权威文献参考
                          </span>
                          <motion.div
                            className="flex flex-wrap gap-2"
                            initial="hidden"
                            animate="visible"
                            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                          >
                            {card.sources.map((source) => (
                              <motion.div key={source} variants={{ hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } }}>
                                <Badge variant="outline" className="border-white/10 bg-white/5 text-xs text-[#9cb3a4] font-sans rounded">
                                  {source}
                                </Badge>
                              </motion.div>
                            ))}
                          </motion.div>
                        </div>
                      )}
                    </CardContent>
                  </div>
                </div>

              </Card>
            </motion.article>
          )}
        </AnimatePresence>
      </div>

      {/* 历史保存区 */}
      {!researchOnly && history.length > 0 && (
        <ScrollArea className="lg:col-span-2 mt-4">
          <div className="flex gap-3 pb-2.5">
            {history.map((item) => (
              <Button
                key={item.id}
                variant="outline"
                className="h-auto min-w-[170px] shrink-0 flex-col items-start gap-1 px-4 py-3 rounded-xl border-primary/10 bg-white/40 hover:bg-primary/5 hover:border-primary/20 hover:text-primary transition-all text-left"
                onClick={() => {
                  setQuery(item.query);
                  setMode(item.mode);
                  setXml(item.xml);
                }}
              >
                <strong className="font-serif text-sm font-bold text-foreground block line-clamp-1">{item.query}</strong>
                <span className="font-mono text-[10px] tabular-nums text-muted-foreground/60 mt-1">{item.createdAt}</span>
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="bg-primary/5" />
        </ScrollArea>
      )}
    </div>
  );
}

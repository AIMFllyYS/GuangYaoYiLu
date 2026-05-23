"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/sections/SectionHead";
import { cn } from "@/lib/utils";
import { growthArc } from "@/lib/content";

export function ArcTimeline() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(reduce === true);

  useEffect(() => {
    if (reduce) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reduce]);

  return (
    <section id="arc" className="relative border-y border-primary/10 bg-card/15 py-20 md:py-24">
      {/* 顶部微流光装饰 */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#b98f46]/40 to-transparent" />
      
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <Reveal>
          <SectionHead
            eyebrow="Growth arc"
            title="三色成长弧：从初识白到药草绿"
            description="我们以“初识白、思政红、药草绿”三色作为特色团日的主线路径，有机串联支部成长的多维阶段，实现网页叙事与答辩 PPT、总结书的深层视觉共振。"
          />
        </Reveal>

        <div ref={ref} className="relative mt-12">
          
          {/* 精美的光学波导曲线（SVG 动画） */}
          <div className="pointer-events-none absolute inset-x-0 top-[20px] hidden h-[120px] w-full md:block" aria-hidden="true">
            <svg
              viewBox="0 0 800 120"
              className="h-full w-full"
              preserveAspectRatio="none"
            >
              {/* 底层细虚线，象征光纤或坐标轨道 */}
              <path
                d="M 40 60 Q 200 20, 400 60 T 760 60"
                fill="none"
                stroke="rgba(185, 143, 70, 0.15)"
                strokeWidth="1.5"
                strokeDasharray="4,4"
              />
              {/* 主流光实线 */}
              <motion.path
                d="M 40 60 Q 200 20, 400 60 T 760 60"
                fill="none"
                stroke="url(#arc-gradient)"
                strokeWidth="3.5"
                strokeLinecap="round"
                initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0.3 }}
                animate={{ pathLength: drawn ? 1 : 0, opacity: drawn ? 1 : 0.8 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              />
              
              <defs>
                <linearGradient id="arc-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#b98f46" stopOpacity="0.5" />
                  <stop offset="50%" stopColor="#ae262b" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#2d6a45" stopOpacity="0.8" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* 三色成长里程卡片网格 */}
          <div className="grid gap-6 md:grid-cols-3">
            {growthArc.map((node, index) => {
              // 精确的主题色设定
              const stageColor = node.color === "#F6F1E2" ? "#b98f46" : node.color;
              
              return (
                <Reveal key={node.id} delay={index * 0.1}>
                  <article
                    className={cn(
                      "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-primary/10 bg-white/45 p-6 shadow-sm transition-all duration-300 backdrop-blur-md hover:-translate-y-1.5 hover:shadow-md hover:border-primary/15 hover:bg-white/60"
                    )}
                    style={{ 
                      borderTop: `4px solid ${stageColor}`
                    }}
                  >
                    {/* 卡片背侧微妙的气氛微光 */}
                    <div 
                      className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-10 blur-xl transition-all duration-500 group-hover:scale-125"
                      style={{ backgroundColor: stageColor }}
                    />

                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <span
                          className="font-serif text-xs font-black uppercase tracking-widest"
                          style={{ color: stageColor }}
                        >
                          {node.phase}
                        </span>
                        <span className="font-mono text-xs tabular-nums text-muted-foreground/80 font-semibold">
                          {node.date}
                        </span>
                      </div>
                      
                      <h3 className="mt-4 font-serif text-lg font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
                        {node.title}
                      </h3>
                      
                      <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground/90 text-pretty">
                        {node.summary}
                      </p>
                    </div>

                    {/* 标签与修饰 */}
                    <div className="mt-6 flex flex-wrap gap-2">
                      {node.keywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="rounded-full border border-primary/5 bg-primary/[0.02] px-2.5 py-0.5 text-xs text-muted-foreground font-medium transition-colors group-hover:bg-primary/[0.05] group-hover:text-primary"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>

                    {/* 卡片右上角点缀圆点 */}
                    {!reduce && drawn && (
                      <motion.span
                        className="absolute right-4 top-4 size-1.5 rounded-full"
                        style={{ backgroundColor: stageColor }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 + index * 0.15, type: "spring", stiffness: 300, damping: 20 }}
                      />
                    )}
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

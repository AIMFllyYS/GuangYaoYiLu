"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, Sparkles, Navigation } from "lucide-react";
import { ParallaxLayer } from "@/components/motion/ScrollProgress";
import { StaggerChildren, StaggerItem } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { themeLine } from "@/lib/content";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-[1.1fr_0.9fr] sm:px-8 lg:px-12 md:py-24"
    >
      {/* 极美环境光斑，与 SiteFooter 的流光呼应 */}
      <div
        className="pointer-events-none absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-primary/10 blur-3xl opacity-60"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-accent/8 blur-3xl opacity-40"
        aria-hidden="true"
      />

      {/* 左侧：严谨宏大的学术与人文叙事 */}
      <StaggerChildren className="relative z-10 max-w-2xl space-y-6">
        <StaggerItem>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5 text-[#b98f46]" />
            <span>华中科技大学 · 联合特色团日特别呈献</span>
          </div>
        </StaggerItem>
        
        <StaggerItem>
          <div className="space-y-2">
            <h1 className="font-serif text-[4rem] font-black leading-[1.05] tracking-tight text-foreground md:text-[5.5rem] lg:text-[6rem]">
              光药医路
            </h1>
            <p className="font-sans text-xs font-bold uppercase tracking-[0.3em] text-primary/80 md:text-sm pl-1">
              Guang Yao Yi Lu Joint League Branch
            </p>
          </div>
        </StaggerItem>

        {/* 诗句牌匾：中式朱印与宣纸质感结合 */}
        <StaggerItem>
          <div className="relative overflow-hidden rounded-xl border border-[#b98f46]/35 bg-white/45 p-6 shadow-sm shadow-[#b98f46]/5 backdrop-blur-md md:p-8">
            {/* 顶角国风装饰边框 */}
            <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-[#b98f46]" />
            <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-[#b98f46]" />
            <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-[#b98f46]" />
            <div className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-[#b98f46]" />
            
            <p className="font-serif text-lg font-bold leading-relaxed text-foreground sm:text-xl md:text-2xl tracking-wide text-pretty">
              “{themeLine}”
            </p>
            <div className="mt-2.5 flex items-center gap-2 text-xs text-muted-foreground/80">
              <span className="h-1 w-1 rounded-full bg-[#b98f46]" />
              <span>同济医学 · 光电赋能 · 药耀同行</span>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <p className="max-w-xl text-pretty font-sans text-base leading-relaxed text-muted-foreground">
            我们由药学、光电、基础医学三个支部的 <strong className="text-foreground font-semibold">75位同济与喻家山学子</strong> 融聚而成。
            通过让近红外、拉曼光谱与医学原理成为认识本草现代化的一束光，将青年力量切实倾注于文化科普和社区服务中。
          </p>
        </StaggerItem>

        <StaggerItem>
          <div className="flex flex-wrap gap-4 pt-2">
            <Button asChild size="lg" className="h-12 px-6 rounded-xl shadow-lg shadow-primary/20">
              <Link href="#herb-lab">
                <Search aria-hidden="true" className="mr-2 size-4" />
                智能本草实验室
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-6 rounded-xl border-primary/10 hover:bg-primary/5">
              <Link href="#quiz">进入趣味问答</Link>
            </Button>
          </div>
        </StaggerItem>
      </StaggerChildren>

      {/* 右侧：高度精密的光学坐标系、传统药匾与Q版瑶光助手 */}
      <ParallaxLayer className="relative mx-auto flex min-h-[460px] w-full max-w-lg items-center justify-center md:min-h-[520px]" factor={0.12}>
        {/* 背景光学坐标十字准星，象征光电学科 */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-15" aria-hidden="true">
          <div className="h-full w-px bg-gradient-to-b from-transparent via-[#b98f46] to-transparent" />
          <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-[#b98f46] to-transparent" />
          {/* 精密的圆环轨道 */}
          <div className="absolute h-72 w-72 rounded-full border border-dashed border-[#b98f46]" />
          <div className="absolute h-96 w-96 rounded-full border border-double border-[#b98f46]/40" />
        </div>

        {/* 1. 后置本草金石底牌 */}
        <div 
          className="absolute inset-8 rounded-2xl border border-[#b98f46]/20 bg-gradient-to-br from-card/90 to-background/50 shadow-inner backdrop-blur-md" 
          aria-hidden="true" 
        />

        {/* 2. 悬浮的暗色精美药盒徽标 (3D 景深) */}
        <div className="absolute right-[5%] top-[10%] w-[68%] rotate-[3deg] overflow-hidden rounded-2xl bg-[#070c08] shadow-2xl shadow-primary/30 ring-1 ring-white/10 transition-transform duration-500 hover:rotate-0 hover:scale-[1.01]">
          <Image
            src="/images/brand/guangyao-logo-dark.jpg"
            width={480}
            height={480}
            alt="光药医路深色 LOGO"
            className="h-auto w-full opacity-90"
            priority
          />
        </div>

        {/* 3. 精美装饰小印章 */}
        <div className="absolute right-[8%] bottom-[32%] z-20 flex h-10 w-10 rotate-12 items-center justify-center rounded-lg bg-[#ae262b] text-xs font-serif font-black text-[#f6f1e2] shadow-lg ring-1 ring-white/10">
          光药
        </div>

        {/* 4. 前置 Q 版瑶光助手，带阴影和浮动效果 */}
        <div className="absolute bottom-[2%] left-[2%] z-10 w-[58%] transition-transform duration-500 hover:scale-[1.03]">
          <Image
            src="/images/mascot/yaoguang-assistant.png"
            width={420}
            height={420}
            alt="Q版瑶光助手"
            className="h-auto w-full drop-shadow-[0_16px_32px_rgba(45,106,69,0.3)]"
            priority
          />
        </div>
      </ParallaxLayer>
    </section>
  );
}

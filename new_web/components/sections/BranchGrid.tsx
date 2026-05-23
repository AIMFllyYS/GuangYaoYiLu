"use client";

import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/sections/SectionHead";
import { Card, CardContent } from "@/components/ui/card";
import { branches } from "@/lib/content";
import { User, Users, ShieldAlert, Sparkles } from "lucide-react";

export function BranchGrid() {
  return (
    <section id="union" className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
      <Reveal>
        <SectionHead
          eyebrow="Three branches"
          title="三色同行：从三个班，到一个「光药医路」共同体"
          description="药学中外2503班（传承创新）、光电2506班（技术硬核）、基医强基2501班（生命关怀）三支先锋力量通过让拉曼光谱、近红外与生命医学相结合，融聚成75位青年并肩同行的宏大画卷。"
        />
      </Reveal>

      <div className="mt-8 grid gap-8 md:grid-cols-3">
        {branches.map((branch, index) => (
          <Reveal key={branch.name} delay={index * 0.1}>
            <Card
              className="gold-corner-hollow glass-panel group relative overflow-hidden border border-primary/10 bg-white/45 shadow-sm transition-all duration-300"
              style={{ borderTop: `4px solid ${branch.color}` }}
            >
              {/* 各专业背景微妙的彩色流光晕 */}
              <div 
                className="pointer-events-none absolute -right-6 -top-6 h-20 w-24 rounded-full opacity-[0.04] blur-xl"
                style={{ backgroundColor: branch.color }}
              />

              {/* 极其精致的图片展示框，带宣纸边框金角感 */}
              <div className="relative h-52 overflow-hidden border-b border-primary/5">
                <Image
                  src={branch.image}
                  width={560}
                  height={360}
                  alt={branch.short}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                {/* 图片上的微妙微暗渐变遮罩 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-80" />
                
                {/* 图片角上的极简徽章 */}
                <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-white/95 z-10">
                  <span 
                    className="inline-block h-2 w-2 rounded-full" 
                    style={{ backgroundColor: branch.color }} 
                  />
                  <span className="font-serif text-xs font-black uppercase tracking-widest drop-shadow-sm">
                    {branch.short}
                  </span>
                </div>
              </div>

              <CardContent className="space-y-4 p-6">
                <h3 className="font-serif text-lg font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
                  {branch.name}
                </h3>
                
                <p className="font-sans text-xs leading-relaxed text-muted-foreground/90 font-medium">
                  {branch.intro}
                </p>

                {/* 国风信息图网格 */}
                <div className="grid grid-cols-2 gap-2 bg-primary/[0.02] border border-primary/5 rounded-xl p-3 text-[11px] leading-normal font-semibold text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Users className="size-3.5 text-[#b98f46] shrink-0" />
                    <span>👥 {branch.memberCount}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="size-3.5 text-[#b98f46] shrink-0" />
                    <span>支书: {branch.leader}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5 border-t border-primary/5 pt-1.5 mt-0.5">
                    <Sparkles className="size-3.5 text-[#ae262b] shrink-0" />
                    <span className="text-foreground/90 line-clamp-1">{branch.role}</span>
                  </div>
                </div>
                
                <div className="space-y-3 pt-1">
                  {/* 学术关注方向 */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#b98f46] block">Focus Area / 学术与实践方向</span>
                    <p className="font-sans text-xs leading-relaxed text-muted-foreground/80 font-bold">
                      {branch.focus}
                    </p>
                  </div>
                  
                  {/* 各支部在特色团日中的宣言 */}
                  <div className="relative border-l-2 border-primary/20 pl-3.5 py-0.5">
                    <p className="font-serif text-xs italic leading-relaxed text-[#b98f46] font-semibold">
                      “{branch.note}”
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

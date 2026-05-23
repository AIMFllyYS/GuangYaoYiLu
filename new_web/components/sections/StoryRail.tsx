"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { X, Search } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { activityHighlights } from "@/lib/content";

export function StoryRail() {
  const [selectedItem, setSelectedItem] = useState<typeof activityHighlights[number] | null>(null);

  return (
    <section aria-label="活动特色实践画廊" className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
      {/* 画廊引导说明 */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-primary/10 pb-4 md:flex-row md:items-end">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#b98f46]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#b98f46]/60 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#b98f46]"></span>
          </span>
          <span>Activity Highlights / 实践剪影</span>
        </div>
        <p className="text-xs text-muted-foreground/80 font-medium">
          ← 左右滑动浏览，点击卡片可查看高清大图纪实 →
        </p>
      </div>

      <ScrollArea className="w-full story-rail-mask pb-2">
        <div className="flex snap-x snap-mandatory gap-6 pb-4">
          {activityHighlights.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.05} className="snap-start">
              <button
                type="button"
                onClick={() => setSelectedItem(item)}
                className="block text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl"
              >
                <Card className="gold-corner-hollow glass-panel group relative w-[290px] shrink-0 overflow-hidden border border-primary/10 bg-white/40 shadow-sm transition-all duration-300 sm:w-[320px]">
                  
                  {/* 顶角国风装饰线 */}
                  <div className="absolute top-0 left-0 h-1.5 w-1.5 border-t border-l border-[#b98f46] z-10" />
                  <div className="absolute top-0 right-0 h-1.5 w-1.5 border-t border-r border-[#b98f46] z-10" />

                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={item.image}
                      width={620}
                      height={420}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                    {/* 图片上的磨砂渐变遮罩 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-80" />
                    
                    {/* 放大镜微标提示 */}
                    <div className="absolute top-3.5 right-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                      <Search className="size-3.5 text-white" />
                    </div>
                  </div>

                  <CardContent className="space-y-2 p-5">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#ae262b]" />
                      <h3 className="font-serif text-base font-bold text-foreground transition-colors group-hover:text-primary">
                        {item.title}
                      </h3>
                    </div>
                    <p className="font-sans text-xs leading-relaxed text-muted-foreground/90 text-pretty sm:text-sm line-clamp-2">
                      {item.text}
                    </p>
                  </CardContent>
                </Card>
              </button>
            </Reveal>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="bg-primary/5" />
      </ScrollArea>

      {/* 高定 Lightbox 灯箱大图交互 */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          >
            {/* 点击背景关闭 */}
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-transparent cursor-default focus:outline-none"
              tabIndex={-1}
              aria-hidden="true"
            />

            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative max-w-4xl w-full overflow-hidden rounded-2xl border border-white/10 bg-[#091510] text-white shadow-2xl z-10"
            >
              {/* 关闭按钮 */}
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b98f46]"
                aria-label="关闭大图"
              >
                <X className="size-5" />
              </button>

              <div className="relative h-[65vh] w-full bg-black/40">
                <Image
                  src={selectedItem.image}
                  fill
                  alt={selectedItem.title}
                  className="object-contain"
                  priority
                />
              </div>

              {/* 信息底座栏 */}
              <div className="gold-fine-frame border-t border-white/5 bg-[#070e0a] p-6 relative">
                <div className="absolute top-0 left-0 h-1.5 w-1.5 border-t border-l border-[#b98f46]" />
                <div className="absolute bottom-0 right-0 h-1.5 w-1.5 border-b border-r border-[#b98f46]" />

                <div className="relative z-10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#b98f46]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ae262b]" />
                    <span>Real-world practice / 实践高清纪实</span>
                  </div>
                  <h4 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide">
                    {selectedItem.title}
                  </h4>
                  <p className="font-sans text-xs sm:text-sm leading-relaxed text-[#cfe0d6] text-pretty">
                    {selectedItem.text}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Sparkles, Navigation } from "lucide-react";
import { useEffect, useState } from "react";
import { StaggerItem, StaggerChildren } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/content";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("#home");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector(item.href))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setActive(`#${visible.target.id}`);
        }
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0, 0.2, 0.4] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const linkClass = (href: string) =>
    cn(
      "relative px-4 py-1.5 text-sm transition-all duration-300 rounded-md font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      active === href
        ? "text-primary font-bold bg-primary/5"
        : "text-muted-foreground/90 hover:text-primary hover:bg-primary/[0.02]"
    );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-background/90 py-2.5 shadow-[0_4px_30px_rgba(47,55,43,0.03)] border-b border-primary/10 backdrop-blur-xl"
          : "bg-transparent py-5 border-b border-transparent backdrop-blur-none"
      )}
    >
      {/* 顶部三色极细渐变流光线 - 象征联合支部 */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#f6f1e2] via-[#ae262b]/70 via-[#2d6a45] to-[#b98f46] transition-opacity duration-500",
          scrolled ? "opacity-100" : "opacity-0"
        )}
        aria-hidden="true"
      />

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 sm:px-8 lg:px-12">
        
        {/* 左侧：精美标志与高校印记 */}
        <Link 
          href="#home" 
          className="group inline-flex items-center gap-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg" 
          aria-label="光药医路主页"
        >
          <div className="relative">
            <Image
              src="/images/brand/guangyao-logo-light.jpg"
              width={42}
              height={42}
              alt=""
              className="rounded-xl shadow-md border border-primary/15 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-[6deg]"
              priority
            />
            {/* 迷你呼吸状态灯 */}
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#b98f46]/60 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#b98f46]"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-base font-black tracking-tight text-foreground sm:text-lg">
                光药医路
              </span>
              <span className="hidden rounded-full border border-primary/20 bg-primary/5 px-1.5 py-0.5 font-mono text-[9px] font-bold text-primary sm:inline-block">
                HUST
              </span>
            </div>
            <span className="text-[10px] tracking-wide text-muted-foreground/80 font-medium">
              联合团支部互动站
            </span>
          </div>
        </Link>

        {/* 中间：高端桌面导航（带下划线跟随时滑效果） */}
        <nav className="hidden items-center gap-1.5 lg:flex" aria-label="页面导航">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className={linkClass(item.href)}
              aria-current={active === item.href ? "page" : undefined}
            >
              <span className="relative z-10">{item.label}</span>
              {active === item.href && (
                <span className="absolute inset-0 rounded-md bg-primary/[0.05] transition-transform" />
              )}
            </Link>
          ))}
        </nav>

        {/* 右侧：行动按钮 / 移动端菜单 */}
        <div className="flex items-center gap-3">
          <Button 
            asChild 
            variant="outline" 
            size="sm" 
            className="hidden border-primary/20 bg-primary/[0.02] text-primary hover:bg-primary/5 sm:inline-flex"
          >
            <Link href="#herb-lab">
              <Navigation className="size-3.5 mr-1" />
              智能实验室
            </Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="border-primary/10 hover:bg-primary/5 lg:hidden focus-visible:ring-2 focus-visible:ring-primary" 
                aria-label="打开导航菜单"
              >
                <Menu className="size-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-l border-primary/15 bg-background/98 p-6 backdrop-blur-xl">
              <SheetHeader className="border-b border-primary/10 pb-5 text-left">
                <SheetTitle className="flex items-center gap-2 font-serif text-lg font-bold">
                  <Sparkles className="size-5 text-[#b98f46]" />
                  光药医路导航
                </SheetTitle>
              </SheetHeader>
              <StaggerChildren className="mt-6 flex flex-col gap-2">
                {navItems.map((item) => (
                  <StaggerItem key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "block rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 hover:translate-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        active === item.href
                          ? "bg-primary/10 font-bold text-primary border-l-4 border-[#b98f46]"
                          : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerChildren>
              
              {/* 移动端侧边底栏装饰 */}
              <div className="absolute bottom-8 left-6 right-6 border-t border-primary/5 pt-6 text-center text-[10px] text-muted-foreground/60">
                <p>华中科技大学 · 联合团支部</p>
                <p className="mt-1">金光青黛同济兴，本草杏林华夏清</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

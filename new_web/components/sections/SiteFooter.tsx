import Image from "next/image";
import Link from "next/link";
import { 
  ExternalLink, 
  ShieldCheck, 
  Compass, 
  Users, 
  Flame, 
  Leaf, 
  Sparkles,
  MapPin,
  Calendar,
  GraduationCap
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { footerBranches, footerNavGroups, siteInfo, themeLine } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer 
      id="contact" 
      className="relative mt-16 overflow-hidden bg-[#091510] text-[#e3ece6] border-t border-white/5"
    >
      {/* 顶部三色流光渐变线（白、红、绿、金）- 象征联合团支部的多维融合 */}
      <div 
        className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#f6f1e2]/40 via-[#ae262b]/80 via-[#2d6a45] to-[#b98f46]/90"
        aria-hidden="true"
      />

      {/* 背景微妙的高级暗流光 - 呼吸感的环境光，增加空间深度 */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background: `
            radial-gradient(circle at 15% 15%, rgba(185, 143, 70, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 85% 75%, rgba(45, 106, 69, 0.12) 0%, transparent 45%),
            radial-gradient(circle at 50% 50%, rgba(174, 38, 43, 0.05) 0%, transparent 50%)
          `
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
        
        {/* ==================== 顶部：三色特色实践印记 (Tri-Color Milestones) ==================== */}
        <div className="mb-16 lg:mb-20">
          <div className="flex flex-col items-start justify-between gap-4 border-b border-white/5 pb-6 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#b98f46]">Three Colors of Growth</span>
              <h3 className="mt-1 font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl">
                三色成长印记
              </h3>
            </div>
            <p className="max-w-md text-sm text-[#9cb3a4] leading-relaxed">
              我们以“初识白”、“思政红”、“药草绿”三色交织为实践路径，在跨学科融合的特色团日中，写下属于青年的成长篇章。
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            
            {/* 1. 初识白 · 联合之序 */}
            <div className="group relative rounded-xl border border-white/5 bg-white/[0.01] p-6 transition-all duration-300 hover:border-[#f6f1e2]/25 hover:bg-white/[0.03] hover:shadow-[0_8px_30px_rgb(246,241,226,0.02)]">
              <div className="absolute top-0 right-0 -mr-2 -mt-2 h-14 w-14 rounded-full bg-[#f6f1e2]/[0.02] blur-md transition-all duration-300 group-hover:bg-[#f6f1e2]/[0.05]" />
              
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#f6f1e2]/20 bg-[#f6f1e2]/5 text-[#f6f1e2] transition-transform duration-300 group-hover:scale-110">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <span className="text-xs font-medium text-[#f6f1e2]/60">第一阶段</span>
                  <h4 className="font-serif text-lg font-bold text-[#f6f1e2]">初识白 · 破冰融聚</h4>
                </div>
              </div>
              
              <p className="mt-4 font-sans text-sm leading-relaxed text-[#9cb3a4] transition-colors duration-300 group-hover:text-[#cfe0d6]">
                “味冰之夜，融破坚冰。”我们跨越药学、光电、基医的学科藩篱，在冷冬里破冰相识、温暖融聚，写下“从三个班，到一个集体”的真挚序章。
              </p>
              
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-[#f6f1e2]/5 px-2.5 py-0.5 text-xs text-[#f6f1e2]/80 border border-[#f6f1e2]/10">
                  破冰相识
                </span>
                <span className="inline-flex items-center rounded-full bg-[#f6f1e2]/5 px-2.5 py-0.5 text-xs text-[#f6f1e2]/80 border border-[#f6f1e2]/10">
                  跨界交流
                </span>
              </div>
            </div>

            {/* 2. 思政红 · 青年之责 */}
            <div className="group relative rounded-xl border border-white/5 bg-white/[0.01] p-6 transition-all duration-300 hover:border-[#ae262b]/30 hover:bg-[#ae262b]/[0.02] hover:shadow-[0_8px_30px_rgb(174,38,43,0.03)]">
              <div className="absolute top-0 right-0 -mr-2 -mt-2 h-14 w-14 rounded-full bg-[#ae262b]/[0.02] blur-md transition-all duration-300 group-hover:bg-[#ae262b]/[0.05]" />
              
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#ae262b]/20 bg-[#ae262b]/10 text-[#f87171] transition-transform duration-300 group-hover:scale-110">
                  <Flame className="size-5" />
                </div>
                <div>
                  <span className="text-xs font-medium text-[#f87171]/60">第二阶段</span>
                  <h4 className="font-serif text-lg font-bold text-[#f87171]">思政红 · 思想引领</h4>
                </div>
              </div>
              
              <p className="mt-4 font-sans text-sm leading-relaxed text-[#9cb3a4] transition-colors duration-300 group-hover:text-[#cfe0d6]">
                “红专并进，志愿同行。”以联合团课夯实信仰根基，以红建社区服务承接思政主线。走入街巷服务群众，在真实劳动中把青年责任落到实处。
              </p>
              
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-[#ae262b]/10 px-2.5 py-0.5 text-xs text-[#f87171] border border-[#ae262b]/20">
                  联合团课
                </span>
                <span className="inline-flex items-center rounded-full bg-[#ae262b]/10 px-2.5 py-0.5 text-xs text-[#f87171] border border-[#ae262b]/20">
                  社区志愿
                </span>
              </div>
            </div>

            {/* 3. 药草绿 · 守正创新 */}
            <div className="group relative rounded-xl border border-white/5 bg-white/[0.01] p-6 transition-all duration-300 hover:border-[#2d6a45]/30 hover:bg-[#2d6a45]/[0.03] hover:shadow-[0_8px_30px_rgb(45,106,69,0.03)] sm:col-span-2 lg:col-span-1">
              <div className="absolute top-0 right-0 -mr-2 -mt-2 h-14 w-14 rounded-full bg-[#2d6a45]/[0.02] blur-md transition-all duration-300 group-hover:bg-[#2d6a45]/[0.05]" />
              
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#2d6a45]/20 bg-[#2d6a45]/10 text-[#4ade80] transition-transform duration-300 group-hover:scale-110">
                  <Leaf className="size-5" />
                </div>
                <div>
                  <span className="text-xs font-medium text-[#4ade80]/60">第三阶段</span>
                  <h4 className="font-serif text-lg font-bold text-[#4ade80]">药草绿 · 守正之新</h4>
                </div>
              </div>
              
              <p className="mt-4 font-sans text-sm leading-relaxed text-[#9cb3a4] transition-colors duration-300 group-hover:text-[#cfe0d6]">
                “本草馨香，科技赋能。”走进叶开泰研学感悟文化厚重，于校内开展中草药嘉年华科普。融合光电光谱分析，为中医药现代化注入蓬勃科技力量。
              </p>
              
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-[#2d6a45]/10 px-2.5 py-0.5 text-xs text-[#4ade80] border border-[#2d6a45]/20">
                  本草路演
                </span>
                <span className="inline-flex items-center rounded-full bg-[#2d6a45]/10 px-2.5 py-0.5 text-xs text-[#4ade80] border border-[#2d6a45]/20">
                  光谱检测
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* ==================== 中部：多栏学术风网格排版 (Structured Academic Columns) ==================== */}
        <div className="grid gap-12 border-t border-white/5 pt-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          
          {/* 第 1 栏：品牌宣言与详细信息（宽栏，占 5/12） */}
          <div className="space-y-6 md:col-span-2 lg:col-span-5 lg:pr-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative shrink-0">
                <Image
                  src="/images/brand/guangyao-logo-light.jpg"
                  width={60}
                  height={60}
                  alt="光药医路徽标"
                  className="rounded-xl border border-white/10 ring-4 ring-black/30 shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#b98f46] text-[10px] font-bold text-[#091510] shadow">
                  印
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#b98f46] sm:text-xs">
                  GUANG YAO YI LU · EST. 2025
                </span>
                <h2 className="font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {siteInfo.name}
                </h2>
                <p className="text-xs text-[#9cb3a4]">
                  {siteInfo.fullName}
                </p>
              </div>
            </div>

            {/* 核心诗句 - 艺术感中式排版 */}
            <div className="relative border-l-2 border-[#b98f46]/70 pl-4 py-1">
              <p className="font-serif text-base italic leading-relaxed text-[#f6f1e2] tracking-wide">
                “{themeLine}”
              </p>
            </div>

            {/* 详细元信息列表 */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs text-[#8ca395]">
              <div className="flex items-center gap-2">
                <GraduationCap className="size-4 text-[#b98f46] shrink-0" />
                <span>{siteInfo.university}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-[#b98f46] shrink-0" />
                <span className="tabular-nums">{siteInfo.activity}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="size-4 text-[#b98f46] shrink-0" />
                <span>{siteInfo.tagline}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-[#b98f46] shrink-0" />
                <span>{siteInfo.location} · {siteInfo.memberCount}</span>
              </div>
            </div>

            {/* 联合高校标识区 */}
            <div className="flex items-center gap-4 border-t border-white/5 pt-6">
              <Image
                src="/images/brand/hust-logo.png"
                width={140}
                height={42}
                alt="华中科技大学"
                className="h-9 w-auto brightness-0 invert opacity-85 transition-opacity hover:opacity-100"
              />
              <div className="text-[10px] text-[#8ca395] leading-normal border-l border-white/10 pl-4">
                <p className="font-medium text-white">指导单位</p>
                <p className="mt-0.5">{siteInfo.supervisor}</p>
              </div>
            </div>
          </div>

          {/* 第 2 栏：联合支部构架（中栏，占 3/12，学术条理） */}
          <div className="space-y-4 lg:col-span-3 lg:border-l lg:border-white/5 lg:pl-8">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-[#b98f46]" />
              <h3 className="font-serif text-sm font-bold uppercase tracking-widest text-white">
                联合支部架构
              </h3>
            </div>
            <ul className="space-y-3">
              {footerBranches.map((branch, idx) => (
                <li 
                  key={branch} 
                  className="group flex items-start gap-2.5 text-sm leading-relaxed text-[#9cb3a4]"
                >
                  <span className="mt-1.5 flex h-1.5 w-1.5 shrink-0 rounded-full bg-[#b98f46]/60 transition-colors group-hover:bg-[#b98f46]" />
                  <span className="transition-colors group-hover:text-white">
                    {branch}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* 导航分组（拼合占 4/12，栏间有细线分割） */}
          {footerNavGroups.map((group, idx) => (
            <div 
              key={group.title} 
              className={`space-y-4 lg:col-span-2 lg:border-l lg:border-white/5 lg:pl-8`}
            >
              <div className="flex items-center gap-2">
                <Compass className="size-4 text-[#b98f46]" />
                <h3 className="font-serif text-sm font-bold uppercase tracking-widest text-white">
                  {group.title}
                </h3>
              </div>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 text-sm text-[#9cb3a4] transition-all duration-200 hover:text-white hover:translate-x-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b98f46] focus-visible:ring-offset-2 focus-visible:ring-offset-[#091610]"
                    >
                      <span className="h-[1px] w-0 bg-[#b98f46] transition-all duration-300 group-hover:w-2" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* ==================== 底部：免责声明与保护提示区 ==================== */}
        <div className="mt-16 grid gap-6 border-t border-white/5 pt-12 md:grid-cols-2 lg:gap-8">
          
          <div className="flex gap-4 rounded-xl border border-white/5 bg-white/[0.01] p-5 shadow-inner transition-colors hover:bg-white/[0.02]">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#b98f46]" aria-hidden="true" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">中医药科普安全声明</h4>
              <p className="text-xs leading-relaxed text-[#8ca395] text-pretty">
                本站内容旨在弘扬本草智慧、促进中医药文化科普与联合支部特色实践展示。本站提供之药理信息均源自经典医药典籍或现代科普文献，绝不构成任何医学建议、临床诊断、用药指导或处方。若您有具体健康诉求、慢病调理、过敏反应等情况，必须遵照医嘱，前往正规医疗机构咨询执业医师。
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.01] p-5 shadow-inner transition-colors hover:bg-white/[0.02]">
            <div className="space-y-1 text-xs leading-relaxed text-[#8ca395]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">版权与合作说明</h4>
              <p className="text-pretty">{siteInfo.contactNote}</p>
              <p className="mt-2 text-pretty">{siteInfo.rightsNote}</p>
            </div>
          </div>

        </div>

        {/* ==================== 底边：著作权与外部友情链接 ==================== */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/5 pt-8 text-xs text-[#7d9486] md:flex-row md:items-center md:justify-between">
          <p className="font-sans tracking-wide">
            &copy; <span className="tabular-nums">{siteInfo.yearRange}</span> {siteInfo.university} {siteInfo.fullName}。保留所有权利。
          </p>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link
              href="https://www.hust.edu.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b98f46] focus-visible:ring-offset-2 focus-visible:ring-offset-[#091610]"
              aria-label="访问华中科技大学官网（在新窗口打开）"
            >
              华中科技大学官网
              <ExternalLink className="size-3.5 opacity-80" aria-hidden="true" />
            </Link>
            
            <span className="hidden h-3 w-px bg-white/10 sm:inline" />
            
            <span className="inline-flex items-center gap-1 text-[#b98f46] font-medium">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#b98f46]/60 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#b98f46]"></span>
              </span>
              学术赋能 · 药耀同行
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}

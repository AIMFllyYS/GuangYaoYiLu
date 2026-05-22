"use client";

import Image from "next/image";
import { Menu, Microscope, Phone, Search, ShieldCheck, Sparkles, X } from "lucide-react";
import { FunQuiz } from "@/components/FunQuiz";
import { HerbLab } from "@/components/HerbLab";
import { activityHighlights, branches, funFacts, navItems, themeLine } from "@/lib/content";
import { useState } from "react";

export function HomeExperience() {
  const [open, setOpen] = useState(false);

  return (
    <main>
      <header className="site-nav">
        <a className="brand-mark" href="#home" aria-label="光药医路主页">
          <Image src="/images/brand/guangyao-logo-light.jpg" width={44} height={44} alt="光药医路 LOGO" priority />
          <span>光药医路</span>
        </a>
        <nav className={open ? "nav-links open" : "nav-links"} aria-label="页面导航">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>
        <button className="menu-button" onClick={() => setOpen((value) => !value)} aria-label="切换导航">
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </header>

      <section id="home" className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">联合团支部 · 中医药文化互动站</p>
          <h1>光药医路</h1>
          <p className="theme-line">{themeLine}</p>
          <p className="hero-lead">
            药学、光电、基础医学三支部同频协作，把本草文化、现代科技和青年服务组织成一个可查询、可互动、可持续更新的线上体验。
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#herb-lab">
              <Search aria-hidden="true" />
              开始查中药
            </a>
            <a className="ghost-action" href="#quiz">
              进入问答
            </a>
          </div>
        </div>
        <div className="hero-visual" aria-label="瑶光助手">
          <div className="logo-panel">
            <Image src="/images/brand/guangyao-logo-dark.jpg" width={420} height={420} alt="光药医路深色 LOGO" priority />
          </div>
          <Image className="mascot" src="/images/mascot/yaoguang-assistant.png" width={420} height={420} alt="Q版瑶光助手" priority />
        </div>
      </section>

      <section id="union" className="section-band">
        <div className="section-head">
          <p className="eyebrow">Three branches</p>
          <h2>从三个班，到一个“光药医路”共同体</h2>
          <p>首页按导航分区展开，三条专业线分别承接本草、光电和医学基础，再汇入中医药文化传承主线。</p>
        </div>
        <div className="branch-grid">
          {branches.map((branch) => (
            <article key={branch.name} className="branch-card" style={{ "--branch": branch.color } as React.CSSProperties}>
              <Image src={branch.image} width={560} height={360} alt={branch.short} />
              <div>
                <span>{branch.short}</span>
                <h3>{branch.name}</h3>
                <p>{branch.focus}</p>
                <small>{branch.note}</small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="story-rail" aria-label="活动特色">
        {activityHighlights.map((item) => (
          <article key={item.title}>
            <Image src={item.image} width={620} height={420} alt={item.title} />
            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </section>

      <section id="herb-lab" className="interactive-section">
        <div className="section-head compact">
          <p className="eyebrow">Local data + AI XML</p>
          <h2>中药查询，先本地检索，再 AI 分层解析</h2>
          <p>本地内置常见中药资料；AI 只负责科普摘要、结构化 XML 卡片和研究线索，不保存到云端。</p>
        </div>
        <HerbLab />
      </section>

      <section id="knowledge" className="knowledge-section">
        <div className="section-head compact">
          <p className="eyebrow">Small facts</p>
          <h2>中药趣味知识介绍</h2>
        </div>
        <div className="fact-grid">
          {funFacts.map((fact, index) => (
            <article key={fact}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{fact}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="quiz" className="quiz-section">
        <FunQuiz />
        <div className="mascot-note">
          <Image src="/images/mascot/yaoguang-assistant.png" width={300} height={300} alt="瑶光助手提示" />
          <div>
            <Sparkles aria-hidden="true" />
            <h3>瑶光助手</h3>
            <p>我会把复杂概念拆成可读卡片，也会在健康相关问题上提醒边界。问答成绩只保存在本机浏览器。</p>
          </div>
        </div>
      </section>

      <section id="research" className="interactive-section research-section">
        <div className="section-head compact">
          <p className="eyebrow">Research watch</p>
          <h2>中药最新研究成果</h2>
          <p>后端会调用小米 MiMo，并在研究模式下尝试启用联网检索工具；返回内容会标注是否需要进一步核验最新文献。</p>
        </div>
        <HerbLab researchOnly />
      </section>

      <section className="ethics-band" aria-label="安全说明">
        <ShieldCheck aria-hidden="true" />
        <p>本站内容用于中医药文化科普与团支部展示，不构成医疗建议、诊断或处方。涉及用药、慢病、孕期、儿童、过敏等情况，请咨询专业医生或药师。</p>
      </section>

      <footer id="contact" className="site-footer">
        <div>
          <Image src="/images/brand/guangyao-logo-light.jpg" width={72} height={72} alt="光药医路 LOGO" />
          <h2>联系我们</h2>
          <p>药学（中外合作办学）2503 × 光电2506 × 基础医学（强基计划实验班）2501 联合团支部</p>
        </div>
        <a className="footer-contact" href="mailto:contact@example.com">
          <Phone aria-hidden="true" />
          团支部联系方式可在部署前替换
        </a>
        <div className="footer-tags">
          <span>十四字主题</span>
          <span>光药医路</span>
          <span>瑶光助手</span>
          <span>本地存储</span>
          <span>MiMo AI</span>
          <span>Next.js 16.2</span>
          <span>EdgeOne Pages</span>
          <span>
            <Microscope aria-hidden="true" />
            中医药现代化
          </span>
        </div>
      </footer>
    </main>
  );
}

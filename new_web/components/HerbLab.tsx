"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpenCheck, Brain, Loader2, Save, Search, Sparkles } from "lucide-react";
import { herbs, researchPrompts, type Herb } from "@/lib/content";

type AiCard = {
  title: string;
  subtitle: string;
  summary: string;
  properties: Array<{ label: string; value: string }>;
  points: string[];
  researchStatus: string;
  researchDetail: string;
  safety: string;
  sources: string[];
};

type SavedCard = AiCard & {
  id: string;
  query: string;
  mode: "herb" | "research";
  createdAt: string;
};

const historyKey = "guangyao-ai-history";

function tagText(xml: string, tag: string) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return decodeXml(match?.[1]?.trim() || "");
}

function decodeXml(value: string) {
  return value
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", "\"")
    .replaceAll("&apos;", "'");
}

function parseItems(xml: string) {
  const items: Array<{ label: string; value: string }> = [];
  const regex = /<item\s+label="([^"]+)"[^>]*>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(xml))) {
    items.push({ label: decodeXml(match[1]), value: decodeXml(match[2].trim()) });
  }
  return items;
}

function parseList(xml: string, tag: string) {
  const values: string[] = [];
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi");
  let match: RegExpExecArray | null;
  while ((match = regex.exec(xml))) values.push(decodeXml(match[1].trim()));
  return values;
}

function parseAiCard(xml: string): AiCard {
  return {
    title: tagText(xml, "title") || "瑶光解析生成中",
    subtitle: tagText(xml, "subtitle"),
    summary: tagText(xml, "summary"),
    properties: parseItems(xml),
    points: parseList(xml, "point"),
    researchStatus: tagText(xml, "status"),
    researchDetail: tagText(xml, "detail"),
    safety: tagText(xml, "safety"),
    sources: parseList(xml, "source")
  };
}

function loadHistory() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(historyKey) || "[]") as SavedCard[];
  } catch {
    return [];
  }
}

function saveHistory(cards: SavedCard[]) {
  localStorage.setItem(historyKey, JSON.stringify(cards.slice(0, 8)));
}

function localContextFor(herb?: Herb) {
  if (!herb) return "";
  return `${herb.name}：${herb.brief}；性味：${herb.taste}，${herb.nature}；归经：${herb.channels}；提示：${herb.caution}`;
}

export function HerbLab({ researchOnly = false }: { researchOnly?: boolean }) {
  const [query, setQuery] = useState(researchOnly ? researchPrompts[0] : "枸杞子");
  const [xml, setXml] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<SavedCard[]>([]);
  const [mode, setMode] = useState<"herb" | "research">(researchOnly ? "research" : "herb");

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return herbs.slice(0, 4);
    return herbs
      .filter((herb) => {
        return (
          herb.name.includes(query.trim()) ||
          herb.pinyin.includes(q) ||
          herb.keywords.some((keyword) => keyword.includes(query.trim()))
        );
      })
      .slice(0, 4);
  }, [query]);

  const card = useMemo(() => (xml ? parseAiCard(xml) : null), [xml]);

  async function runAi(nextMode = mode, nextQuery = query) {
    setMode(nextMode);
    setError("");
    setXml("");
    setLoading(true);

    const localHerb = herbs.find((herb) => herb.name === nextQuery || herb.pinyin === nextQuery.toLowerCase());
    try {
      const response = await fetch("/api/ai-herb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: nextQuery,
          mode: nextMode,
          localContext: localContextFor(localHerb)
        })
      });

      if (!response.ok || !response.body) {
        throw new Error(await response.text());
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let nextXml = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        nextXml += decoder.decode(value, { stream: true });
        setXml(nextXml);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "AI 生成失败，请稍后重试。");
    } finally {
      setLoading(false);
    }
  }

  function persistCard() {
    if (!card) return;
    const saved: SavedCard = {
      ...card,
      id: `${Date.now()}`,
      query,
      mode,
      createdAt: new Date().toLocaleString("zh-CN")
    };
    const next = [saved, ...history.filter((item) => item.query !== query || item.mode !== mode)].slice(0, 8);
    setHistory(next);
    saveHistory(next);
  }

  return (
    <div className={researchOnly ? "research-lab" : "herb-lab"}>
      <div className="lab-console">
        <div className="console-head">
          <div>
            <p className="eyebrow">{researchOnly ? "AI research stream" : "Herb search"}</p>
            <h3>{researchOnly ? "中药最新研究成果" : "中药功能查询搜索"}</h3>
          </div>
          <span className="xml-chip">XML 流式卡片</span>
        </div>

        <div className="search-row">
          <Search aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={researchOnly ? "输入研究方向，如 黄芪 免疫调节" : "输入中药名、拼音或关键词"}
          />
          <button className="primary-action" onClick={() => runAi(researchOnly ? "research" : "herb")} disabled={loading}>
            {loading ? <Loader2 className="spin" aria-hidden="true" /> : <Sparkles aria-hidden="true" />}
            <span>{researchOnly ? "生成速递" : "AI 解析"}</span>
          </button>
        </div>

        {!researchOnly && (
          <div className="local-results" aria-label="本地中药结果">
            {matches.map((herb) => (
              <button
                key={herb.id}
                className="local-herb"
                onClick={() => {
                  setQuery(herb.name);
                  setXml("");
                }}
              >
                <strong>{herb.name}</strong>
                <span>{herb.brief}</span>
                <small>{herb.keywords.join(" / ")}</small>
              </button>
            ))}
          </div>
        )}

        {researchOnly && (
          <div className="prompt-pills">
            {researchPrompts.map((prompt) => (
              <button key={prompt} onClick={() => setQuery(prompt)}>
                {prompt}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="ai-output">
        {error && <div className="error-box">{error}</div>}
        {!card && !error && (
          <div className="empty-card">
            <Brain aria-hidden="true" />
            <p>{researchOnly ? "选择研究方向后，瑶光助手会用 XML 流式生成研究卡。" : "本地搜索先给出基础资料，AI 会继续生成结构化解释卡。"}</p>
          </div>
        )}
        {card && (
          <article className="ai-card">
            <div className="ai-card-top">
              <div>
                <p className="eyebrow">Yaoguang XML card</p>
                <h4>{card.title}</h4>
                <p>{card.subtitle}</p>
              </div>
              <button className="icon-action" aria-label="保存卡片" onClick={persistCard}>
                <Save aria-hidden="true" />
              </button>
            </div>
            <p className="summary">{card.summary || "内容生成中..."}</p>
            <div className="property-grid">
              {card.properties.map((item) => (
                <div key={item.label}>
                  <span>{item.label}</span>
                  <p>{item.value}</p>
                </div>
              ))}
            </div>
            <ul className="insight-list">
              {card.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            {(card.researchStatus || card.researchDetail) && (
              <div className="research-note">
                <BookOpenCheck aria-hidden="true" />
                <div>
                  <strong>{card.researchStatus}</strong>
                  <p>{card.researchDetail}</p>
                </div>
              </div>
            )}
            {card.safety && <p className="safety">{card.safety}</p>}
            {card.sources.length > 0 && (
              <div className="source-line">
                {card.sources.map((source) => (
                  <span key={source}>{source}</span>
                ))}
              </div>
            )}
          </article>
        )}
      </div>

      {!researchOnly && history.length > 0 && (
        <div className="history-strip">
          {history.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setQuery(item.query);
                setMode(item.mode);
                setXml(`<yaoguangCard><title>${item.title}</title><subtitle>${item.subtitle}</subtitle><summary>${item.summary}</summary></yaoguangCard>`);
              }}
            >
              <strong>{item.query}</strong>
              <span>{item.createdAt}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

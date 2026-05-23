export type AiCard = {
  title: string;
  subtitle: string;
  visual?: string;
  imageSearchQuery?: string;
  summary: string;
  properties: Array<{ label: string; value: string }>;
  points: string[];
  researchStatus: string;
  researchDetail: string;
  safety: string;
  sources: string[];
};

export type SavedCard = AiCard & {
  id: string;
  query: string;
  mode: "herb" | "research";
  createdAt: string;
  xml: string;
};

export const historyKey = "guangyao-ai-history";

function decodeXml(value: string) {
  return value
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", "\"")
    .replaceAll("&apos;", "'");
}

function tagText(xml: string, tag: string) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return decodeXml(match?.[1]?.trim() || "");
}

function tagClosed(xml: string, tag: string) {
  return new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, "i").test(xml);
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

export function parseAiCard(xml: string): AiCard {
  return {
    title: tagText(xml, "title") || "瑶光解析生成中",
    subtitle: tagText(xml, "subtitle"),
    visual: tagText(xml, "visual"),
    imageSearchQuery: tagText(xml, "imageSearchQuery"),
    summary: tagText(xml, "summary"),
    properties: parseItems(xml),
    points: parseList(xml, "point"),
    researchStatus: tagText(xml, "status"),
    researchDetail: tagText(xml, "detail"),
    safety: tagText(xml, "safety"),
    sources: parseList(xml, "source")
  };
}

export function fieldStates(xml: string) {
  return {
    title: { value: tagText(xml, "title"), done: tagClosed(xml, "title") },
    subtitle: { value: tagText(xml, "subtitle"), done: tagClosed(xml, "subtitle") },
    visual: { value: tagText(xml, "visual"), done: tagClosed(xml, "visual") },
    imageSearchQuery: { value: tagText(xml, "imageSearchQuery"), done: tagClosed(xml, "imageSearchQuery") },
    summary: { value: tagText(xml, "summary"), done: tagClosed(xml, "summary") },
    properties: { value: parseItems(xml), done: /<\/yaoguangCard>/i.test(xml) && parseItems(xml).length > 0 },
    points: { value: parseList(xml, "point"), done: tagClosed(xml, "insights") || parseList(xml, "point").length > 0 },
    research: {
      value: { status: tagText(xml, "status"), detail: tagText(xml, "detail") },
      done: tagClosed(xml, "status") || tagClosed(xml, "detail")
    },
    safety: { value: tagText(xml, "safety"), done: tagClosed(xml, "safety") },
    sources: { value: parseList(xml, "source"), done: tagClosed(xml, "sources") || parseList(xml, "source").length > 0 }
  };
}

export function loadHistory() {
  if (typeof window === "undefined") return [] as SavedCard[];
  try {
    return JSON.parse(localStorage.getItem(historyKey) || "[]") as SavedCard[];
  } catch {
    return [];
  }
}

export function saveHistory(cards: SavedCard[]) {
  localStorage.setItem(historyKey, JSON.stringify(cards.slice(0, 8)));
}

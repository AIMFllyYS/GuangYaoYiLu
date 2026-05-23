import { DECK_HEIGHT, DECK_WIDTH, type DeckSpec, type SlideElement } from "./types";

export type ValidationIssue = {
  level: "error" | "warning" | "info";
  slideId: string;
  elementId?: string;
  message: string;
};

export function validateDeck(deck: DeckSpec): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const slide of deck.slides) {
    const keyCounts = new Map<string, number>();
    for (const element of slide.elements) {
      const key = element.morphKey;
      if (key) {
        keyCounts.set(key, (keyCounts.get(key) ?? 0) + 1);
      }

      if (!element.pptx.objectName) {
        issues.push({
          level: "error",
          slideId: slide.id,
          elementId: element.id,
          message: "缺少 PPTX objectName，PowerPoint 选择窗格无法稳定复刻。"
        });
      }

      if (!element.morphKey) {
        issues.push({
          level: "info",
          slideId: slide.id,
          elementId: element.id,
          message: "未设置 morphKey；该对象只作为静态或普通切换对象处理。"
        });
      }

      if (element.type === "text" && insideSlide(element) && (element.x + element.w > DECK_WIDTH || element.y + element.h > DECK_HEIGHT)) {
        issues.push({
          level: "warning",
          slideId: slide.id,
          elementId: element.id,
          message: "画布内文本框越界，PPTX 手工复刻时可能被裁切。"
        });
      }

      if (usesComplexCss(element)) {
        issues.push({
          level: "warning",
          slideId: slide.id,
          elementId: element.id,
          message: "使用了复杂 CSS 视觉效果；转 PPTX 时需要手工用形状或渐变近似。"
        });
      }
    }

    for (const [key, count] of keyCounts) {
      if (count > 1) {
        issues.push({
          level: "error",
          slideId: slide.id,
          message: `morphKey ${key} 在同一页重复 ${count} 次，Morph 匹配会混乱。`
        });
      }
    }
  }

  for (let index = 1; index < deck.slides.length; index += 1) {
    const previous = deck.slides[index - 1];
    const current = deck.slides[index];
    if (!previous || !current) {
      continue;
    }
    const previousKeys = new Set(previous.elements.map((element) => element.morphKey).filter(Boolean));
    const currentKeys = new Set(current.elements.map((element) => element.morphKey).filter(Boolean));
    const shared = [...currentKeys].filter((key) => previousKeys.has(key));

    if (current.transition?.type === "morph" && shared.length === 0) {
      issues.push({
        level: "warning",
        slideId: current.id,
        message: "该页声明 Morph，但与上一页没有共享 morphKey。"
      });
    }
  }

  return issues;
}

function insideSlide(element: SlideElement) {
  return element.x >= 0 && element.y >= 0 && element.x < DECK_WIDTH && element.y < DECK_HEIGHT;
}

function usesComplexCss(element: SlideElement) {
  const fill = element.style.fill ?? "";
  const shadow = element.style.shadow ?? "";
  return fill.includes("gradient(") || shadow.includes("rgba(");
}


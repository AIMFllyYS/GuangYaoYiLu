import { useEffect, useMemo, useRef } from "react";
import { computeMorphSteps } from "../deck/morph";
import type { DeckSpec, SlideElement, SlideSpec } from "../deck/types";

type MorphOverlayProps = {
  deck: DeckSpec;
  from: SlideSpec;
  to: SlideSpec;
  durationMs: number;
  onDone: () => void;
};

export function MorphOverlay({ deck, from, to, durationMs, onDone }: MorphOverlayProps) {
  const steps = useMemo(() => computeMorphSteps(from, to), [from, to]);
  const refs = useRef(new Map<string, HTMLElement>());

  useEffect(() => {
    const animations: Animation[] = [];
    const easing = to.transition?.easing ?? "cubic-bezier(.22,1,.36,1)";

    for (const step of steps) {
      const node = refs.current.get(step.key);
      if (!node) {
        continue;
      }

      const fromElement = step.from ?? offCanvasStart(step.to, deck.size.width);
      const toElement = step.to ?? offCanvasEnd(step.from, deck.size.width);

      if (!fromElement || !toElement) {
        continue;
      }

      animations.push(
        node.animate([frameFor(fromElement), frameFor(toElement)], {
          duration: durationMs,
          easing,
          fill: "both"
        })
      );
    }

    const timeout = window.setTimeout(onDone, durationMs + 34);

    return () => {
      window.clearTimeout(timeout);
      animations.forEach((animation) => animation.cancel());
    };
  }, [deck.size.width, durationMs, onDone, steps, to.transition?.easing]);

  return (
    <div className="morph-overlay" aria-hidden="true">
      <div className="slide-bleed">
        {steps.map((step) => {
          const element = step.to ?? step.from;
          if (!element) {
            return null;
          }

          return (
            <MorphElement
              key={step.key}
              element={element}
              setRef={(node) => {
                if (node) {
                  refs.current.set(step.key, node);
                } else {
                  refs.current.delete(step.key);
                }
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function MorphElement({ element, setRef }: { element: SlideElement; setRef: (node: HTMLElement | null) => void }) {
  const style = {
    left: `${element.x}px`,
    top: `${element.y}px`,
    width: `${element.w}px`,
    height: `${element.h}px`,
    opacity: element.opacity,
    zIndex: element.z,
    transform: `rotate(${element.rotate}deg)`,
    color: element.style.color,
    fontFamily: element.style.fontFamily,
    fontSize: element.style.fontSize,
    fontWeight: element.style.fontWeight,
    lineHeight: element.style.lineHeight,
    textAlign: element.style.textAlign,
    background: element.style.fill,
    border: `${element.style.strokeWidth ?? 0}px solid ${element.style.stroke ?? "transparent"}`,
    borderRadius: element.type === "ellipse" ? "999px" : `${element.style.borderRadius ?? 0}px`,
    boxShadow: element.style.shadow ?? "none"
  };

  if (element.type === "text") {
    return (
      <div ref={setRef} className="morph-element morph-text" style={style}>
        {element.content}
      </div>
    );
  }

  if (element.type === "image") {
    return (
      <img
        ref={setRef}
        className="morph-element morph-asset"
        src={element.asset}
        alt=""
        style={{ ...style, objectFit: element.style.objectFit ?? "cover" }}
      />
    );
  }

  if (element.type === "icon") {
    return (
      <div ref={setRef} className="morph-element morph-icon" style={style}>
        {element.asset}
      </div>
    );
  }

  return <div ref={setRef} className={`morph-element morph-${element.type}`} style={style} />;
}

function frameFor(element: SlideElement): Keyframe {
  return {
    left: `${element.x}px`,
    top: `${element.y}px`,
    width: `${element.w}px`,
    height: `${element.h}px`,
    opacity: element.opacity,
    transform: `rotate(${element.rotate}deg)`,
    color: element.style.color,
    fontSize: element.style.fontSize ? `${element.style.fontSize}px` : undefined,
    background: element.style.fill
  };
}

function offCanvasStart(element: SlideElement | undefined, deckWidth: number): SlideElement | undefined {
  if (!element) {
    return undefined;
  }
  return {
    ...element,
    x: element.x < deckWidth / 2 ? element.x - 280 : element.x + 280,
    opacity: 0
  };
}

function offCanvasEnd(element: SlideElement | undefined, deckWidth: number): SlideElement | undefined {
  if (!element) {
    return undefined;
  }
  return {
    ...element,
    x: element.x < deckWidth / 2 ? element.x - 320 : element.x + 320,
    opacity: 0
  };
}

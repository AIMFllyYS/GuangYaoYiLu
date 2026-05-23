import type { CSSProperties, PointerEvent } from "react";
import type { DeckSpec, SlideElement, SlideSpec } from "../deck/types";

type SceneRendererProps = {
  deck: DeckSpec;
  slide: SlideSpec;
  selectedId?: string;
  mode?: "editor" | "show";
  onSelect?: (id: string) => void;
};

export function SceneRenderer({ deck, slide, selectedId, mode = "editor", onSelect }: SceneRendererProps) {
  const sortedElements = [...slide.elements].sort((a, b) => a.z - b.z);

  return (
    <div
      className={mode === "show" ? "scene-world is-show" : "scene-world"}
      style={{ "--deck-width": deck.size.width, "--deck-height": deck.size.height } as CSSProperties}
    >
      <div className="pasteboard-grid" />
      <div className="slide-frame" style={{ background: slide.background }}>
        <div className="slide-bleed" aria-label={slide.title}>
          {sortedElements.map((element) => (
            <SceneElement
              key={element.id}
              element={element}
              selected={selectedId === element.id}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
      {mode === "editor" ? (
        <div className="stage-rulers" aria-hidden="true">
          <span>1920 x 1080 slide frame</span>
          <span>pasteboard supports off-canvas Morph objects</span>
        </div>
      ) : null}
    </div>
  );
}

type SceneElementProps = {
  element: SlideElement;
  selected?: boolean;
  onSelect?: (id: string) => void;
};

function SceneElement({ element, selected, onSelect }: SceneElementProps) {
  if (element.visible === false) {
    return null;
  }

  const commonStyle: CSSProperties = {
    left: `${element.x}px`,
    top: `${element.y}px`,
    width: `${element.w}px`,
    height: `${element.h}px`,
    opacity: element.opacity,
    zIndex: element.z,
    transform: `rotate(${element.rotate}deg)`,
    pointerEvents: element.locked ? "none" : "auto",
    "--element-fill": element.style.fill,
    "--element-stroke": element.style.stroke,
    "--element-stroke-width": `${element.style.strokeWidth ?? 0}px`,
    "--element-color": element.style.color,
    "--element-radius": `${element.style.borderRadius ?? 0}px`,
    "--element-shadow": element.style.shadow ?? "none"
  } as CSSProperties;

  const className = selected ? "scene-element is-selected" : "scene-element";
  const handlePointerDown = (event: PointerEvent) => {
    event.stopPropagation();
    onSelect?.(element.id);
  };

  if (element.type === "text") {
    return (
      <div
        className={`${className} scene-text`}
        data-element-id={element.id}
        data-morph-key={element.morphKey}
        style={{
          ...commonStyle,
          color: element.style.color,
          fontFamily: element.style.fontFamily,
          fontSize: element.style.fontSize,
          fontWeight: element.style.fontWeight,
          lineHeight: element.style.lineHeight,
          textAlign: element.style.textAlign
        }}
        onPointerDown={handlePointerDown}
      >
        {element.content}
      </div>
    );
  }

  if (element.type === "image") {
    return (
      <img
        className={`${className} scene-asset`}
        data-element-id={element.id}
        data-morph-key={element.morphKey}
        style={{
          ...commonStyle,
          objectFit: element.style.objectFit ?? "cover",
          borderRadius: element.style.borderRadius
        }}
        src={element.asset}
        alt={element.alt ?? element.name}
        onPointerDown={handlePointerDown}
      />
    );
  }

  if (element.type === "icon") {
    return (
      <div
        className={`${className} scene-icon`}
        data-element-id={element.id}
        data-morph-key={element.morphKey}
        style={commonStyle}
        onPointerDown={handlePointerDown}
        aria-label={element.alt ?? element.name}
      >
        {element.asset}
      </div>
    );
  }

  if (element.type === "group") {
    return (
      <div
        className={`${className} scene-group`}
        data-element-id={element.id}
        data-morph-key={element.morphKey}
        style={commonStyle}
        onPointerDown={handlePointerDown}
      >
        {element.children.map((child) => (
          <SceneElement key={child.id} element={child} onSelect={onSelect} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${className} scene-shape scene-${element.type}`}
      data-element-id={element.id}
      data-morph-key={element.morphKey}
      style={commonStyle}
      onPointerDown={handlePointerDown}
      aria-label={element.name}
    />
  );
}

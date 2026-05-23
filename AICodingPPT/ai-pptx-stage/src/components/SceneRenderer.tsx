import { useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import type { DeckSpec, SlideElement, SlideSpec } from "../deck/types";

type SceneRendererProps = {
  deck: DeckSpec;
  slide: SlideSpec;
  selectedId?: string;
  mode?: "editor" | "show";
  onSelect?: (id: string) => void;
  onMoveElement?: (id: string, dx: number, dy: number) => void;
};

export function SceneRenderer({ deck, slide, selectedId, mode = "editor", onSelect, onMoveElement }: SceneRendererProps) {
  const sortedElements = [...slide.elements].sort((a, b) => a.z - b.z);
  const dragRef = useRef<{ id: string; lastX: number; lastY: number } | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const startDrag = (id: string, event: PointerEvent<HTMLElement>) => {
    if (mode !== "editor") {
      return;
    }
    dragRef.current = {
      id,
      lastX: event.clientX,
      lastY: event.clientY
    };
    setDraggingId(id);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveDrag = (event: PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || !onMoveElement) {
      return;
    }
    const dx = (event.clientX - drag.lastX) * 2;
    const dy = (event.clientY - drag.lastY) * 2;
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
    onMoveElement(drag.id, dx, dy);
  };

  const endDrag = () => {
    dragRef.current = null;
    setDraggingId(null);
  };

  const sceneClassName = [
    "scene-world",
    mode === "show" ? "is-show" : "",
    draggingId ? "is-dragging" : ""
  ].filter(Boolean).join(" ");

  return (
    <div
      className={sceneClassName}
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
              dragging={draggingId === element.id}
              onSelect={onSelect}
              onStartDrag={startDrag}
              onDrag={moveDrag}
              onEndDrag={endDrag}
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
  dragging?: boolean;
  onSelect?: (id: string) => void;
  onStartDrag?: (id: string, event: PointerEvent<HTMLElement>) => void;
  onDrag?: (event: PointerEvent<HTMLElement>) => void;
  onEndDrag?: () => void;
};

function SceneElement({ element, selected, dragging, onSelect, onStartDrag, onDrag, onEndDrag }: SceneElementProps) {
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

  const className = [
    "scene-element",
    selected ? "is-selected" : "",
    dragging ? "is-dragging" : "",
    element.locked ? "is-locked" : ""
  ].filter(Boolean).join(" ");
  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    event.stopPropagation();
    onSelect?.(element.id);
    if (!element.locked) {
      onStartDrag?.(element.id, event);
    }
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
        onPointerMove={onDrag}
        onPointerUp={onEndDrag}
        onPointerCancel={onEndDrag}
        onLostPointerCapture={onEndDrag}
        aria-grabbed={dragging}
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
        onPointerMove={onDrag}
        onPointerUp={onEndDrag}
        onPointerCancel={onEndDrag}
        onLostPointerCapture={onEndDrag}
        aria-grabbed={dragging}
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
        onPointerMove={onDrag}
        onPointerUp={onEndDrag}
        onPointerCancel={onEndDrag}
        onLostPointerCapture={onEndDrag}
        aria-label={element.alt ?? element.name}
        aria-grabbed={dragging}
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
        onPointerMove={onDrag}
        onPointerUp={onEndDrag}
        onPointerCancel={onEndDrag}
        onLostPointerCapture={onEndDrag}
        aria-grabbed={dragging}
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
      onPointerMove={onDrag}
      onPointerUp={onEndDrag}
      onPointerCancel={onEndDrag}
      onLostPointerCapture={onEndDrag}
      aria-label={element.name}
      aria-grabbed={dragging}
    />
  );
}

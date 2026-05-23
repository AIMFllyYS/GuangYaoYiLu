import { useCallback, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { InspectorPanel } from "./components/InspectorPanel";
import { LayerPanel } from "./components/LayerPanel";
import { MorphOverlay } from "./components/MorphOverlay";
import { sampleDeck } from "./deck/sampleDeck";
import { SceneRenderer } from "./components/SceneRenderer";
import { TopToolbar } from "./components/TopToolbar";
import { findElement, nudgeElement, setLayerDirection, updateElement } from "./deck/editing";
import { slidePptxChecklist } from "./deck/exporters";
import { validateDeck } from "./deck/validation";
import type { SlideSpec } from "./deck/types";

type MorphState = {
  id: number;
  from: SlideSpec;
  to: SlideSpec;
  durationMs: number;
};

const ZOOM_LEVELS = [0.35, 0.4, 0.5, 0.6, 0.75, 0.9, 1] as const;
const FIT_ZOOM = 0.5;

export default function App() {
  const [deck, setDeck] = useState(sampleDeck);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSlide = deck.slides[currentIndex] ?? deck.slides[0];
  const [selectedId, setSelectedId] = useState<string | undefined>(currentSlide.elements[0]?.id);
  const [showMode, setShowMode] = useState(false);
  const [morphState, setMorphState] = useState<MorphState | null>(null);
  const [zoom, setZoom] = useState<number>(FIT_ZOOM);
  const selectedElement = useMemo(() => findElement(currentSlide, selectedId), [currentSlide, selectedId]);
  const validationIssues = useMemo(() => validateDeck(deck), [deck]);
  const slideChecklist = useMemo(() => slidePptxChecklist(deck, currentSlide), [deck, currentSlide]);
  const zoomLabel = `${Math.round(zoom * 100)}%`;
  const stageStyle = {
    "--stage-zoom": zoom,
    "--stage-width": `${deck.size.width * zoom}px`,
    "--stage-height": `${deck.size.height * zoom}px`
  } as CSSProperties;

  const finishMorph = useCallback(() => {
    setMorphState(null);
  }, []);

  const goToSlide = useCallback((nextIndex: number) => {
    const bounded = (nextIndex + deck.slides.length) % deck.slides.length;
    const targetSlide = deck.slides[bounded];

    if (!targetSlide || targetSlide.id === currentSlide.id) {
      return;
    }

    const durationMs = targetSlide.transition?.durationMs ?? 760;
    setMorphState({
      id: Date.now(),
      from: currentSlide,
      to: targetSlide,
      durationMs
    });
    setCurrentIndex(bounded);
    setSelectedId(targetSlide.elements[0]?.id);
  }, [currentSlide, deck.slides]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        goToSlide(currentIndex + 1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToSlide(currentIndex - 1);
      }
      if (event.key === "Escape") {
        setShowMode(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, goToSlide]);

  const handleMoveElement = (id: string, dx: number, dy: number) => {
    if (showMode) {
      return;
    }
    setDeck((current) => nudgeElement(current, currentSlide.id, id, dx, dy));
  };

  const changeZoom = (direction: "in" | "out" | "fit") => {
    if (direction === "fit") {
      setZoom(FIT_ZOOM);
      return;
    }

    setZoom((current) => {
      const currentIndex = ZOOM_LEVELS.findIndex((level) => level === current);
      const safeIndex = currentIndex === -1 ? ZOOM_LEVELS.findIndex((level) => level === FIT_ZOOM) : currentIndex;
      const nextIndex = direction === "in" ? Math.min(ZOOM_LEVELS.length - 1, safeIndex + 1) : Math.max(0, safeIndex - 1);
      return ZOOM_LEVELS[nextIndex] ?? FIT_ZOOM;
    });
  };

  const handleMoveLayer = (id: string, direction: "up" | "down" | "top" | "bottom") => {
    setDeck((current) => setLayerDirection(current, currentSlide.id, id, direction));
  };

  const handleToggleVisibility = (id: string) => {
    const element = findElement(currentSlide, id);
    if (!element) {
      return;
    }
    setDeck((current) => updateElement(current, currentSlide.id, id, { visible: element.visible === false }));
  };

  const handleToggleLock = (id: string) => {
    const element = findElement(currentSlide, id);
    if (!element) {
      return;
    }
    setDeck((current) => updateElement(current, currentSlide.id, id, { locked: !element.locked }));
  };

  return (
    <main className="editor-frame">
      <TopToolbar
        currentIndex={currentIndex}
        total={deck.slides.length}
        slideTitle={currentSlide.title}
        zoomLabel={zoomLabel}
        onPrev={() => goToSlide(currentIndex - 1)}
        onNext={() => goToSlide(currentIndex + 1)}
        showMode={showMode}
        onToggleShow={() => setShowMode((current) => !current)}
        onZoomIn={() => changeZoom("in")}
        onZoomOut={() => changeZoom("out")}
        onZoomFit={() => changeZoom("fit")}
        canZoomIn={zoom < ZOOM_LEVELS[ZOOM_LEVELS.length - 1]}
        canZoomOut={zoom > ZOOM_LEVELS[0]}
      />
      <section className={showMode ? "editor-grid is-show-mode" : "editor-grid"}>
        <LayerPanel
          slide={currentSlide}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onMoveLayer={handleMoveLayer}
          onToggleVisibility={handleToggleVisibility}
          onToggleLock={handleToggleLock}
        />
        <section className="stage-shell" style={stageStyle} aria-label="AI PPTX stage preview">
          <SceneRenderer
            deck={deck}
            slide={currentSlide}
            zoom={zoom}
            selectedId={showMode ? undefined : selectedId}
            mode={showMode ? "show" : "editor"}
            onSelect={showMode ? undefined : setSelectedId}
            onMoveElement={handleMoveElement}
          />
          {morphState ? (
            <MorphOverlay
              key={morphState.id}
              deck={deck}
              from={morphState.from}
              to={morphState.to}
              durationMs={morphState.durationMs}
              onDone={finishMorph}
            />
          ) : null}
        </section>
        <InspectorPanel
          slide={currentSlide}
          element={selectedElement}
          slideChecklist={slideChecklist}
          issues={validationIssues}
        />
      </section>
    </main>
  );
}

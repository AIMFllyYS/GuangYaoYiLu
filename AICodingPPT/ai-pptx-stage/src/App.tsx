import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { InspectorPanel } from "./components/InspectorPanel";
import { LayerPanel } from "./components/LayerPanel";
import { MorphOverlay } from "./components/MorphOverlay";
import { SceneRenderer } from "./components/SceneRenderer";
import { TopToolbar } from "./components/TopToolbar";
import { findElement, nudgeElement, setLayerDirection, updateElement } from "./deck/editing";
import { slidePptxChecklist } from "./deck/exporters";
import { validateDeck } from "./deck/validation";
import { deckEntries, defaultDeckId, getDeckEntry } from "./decks";
import type { SlideSpec } from "./deck/types";

type MorphState = {
  id: number;
  from: SlideSpec;
  to: SlideSpec;
  durationMs: number;
};

const ZOOM_LEVELS = [0.35, 0.4, 0.5, 0.6, 0.75, 0.9, 1] as const;
const FIT_ZOOM = 0.5;

function shouldKeepShortcutLocal(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(target.closest("input, textarea, select, button, [contenteditable='true']"));
}

export default function App() {
  const [selectedDeckId, setSelectedDeckId] = useState(defaultDeckId);
  const [deck, setDeck] = useState(() => getDeckEntry(defaultDeckId).deck);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSlide = deck.slides[currentIndex] ?? deck.slides[0];
  const [selectedId, setSelectedId] = useState<string | undefined>(currentSlide.elements[0]?.id);
  const [showMode, setShowMode] = useState(false);
  const [morphState, setMorphState] = useState<MorphState | null>(null);
  const [zoom, setZoom] = useState<number>(FIT_ZOOM);
  const stageRef = useRef<HTMLElement | null>(null);
  const editorZoomRef = useRef<number | null>(null);
  const selectedElement = useMemo(() => findElement(currentSlide, selectedId), [currentSlide, selectedId]);
  const validationIssues = useMemo(() => validateDeck(deck), [deck]);
  const validationCounts = useMemo(
    () => {
      const slideIssues = validationIssues.filter((issue) => issue.slideId === currentSlide.id);

      return {
        slideErrors: slideIssues.filter((issue) => issue.level === "error").length,
        slideWarnings: slideIssues.filter((issue) => issue.level === "warning").length,
        totalErrors: validationIssues.filter((issue) => issue.level === "error").length,
        totalWarnings: validationIssues.filter((issue) => issue.level === "warning").length
      };
    },
    [currentSlide.id, validationIssues]
  );
  const slideChecklist = useMemo(() => slidePptxChecklist(deck, currentSlide), [deck, currentSlide]);
  const deckOptions = useMemo(() => deckEntries.map((entry) => ({ id: entry.id, title: entry.title })), []);
  const zoomLabel = `${Math.round(zoom * 100)}%`;
  const stageStyle = {
    "--stage-zoom": zoom,
    "--stage-width": `${deck.size.width * zoom}px`,
    "--stage-height": `${deck.size.height * zoom}px`
  } as CSSProperties;

  const finishMorph = useCallback(() => {
    setMorphState(null);
  }, []);

  const fullscreenFitZoom = useCallback(() => {
    const viewportWidth = window.screen?.width || window.innerWidth;
    const viewportHeight = window.screen?.height || window.innerHeight;
    return Math.min(viewportWidth / deck.size.width, viewportHeight / deck.size.height);
  }, [deck.size.height, deck.size.width]);

  const restoreEditorZoom = useCallback(() => {
    setZoom(editorZoomRef.current ?? FIT_ZOOM);
    editorZoomRef.current = null;
  }, []);

  const enterShowPreview = useCallback(async () => {
    const stage = stageRef.current;
    editorZoomRef.current = zoom;
    setZoom(fullscreenFitZoom());
    setShowMode(true);

    if (!stage?.requestFullscreen) {
      return;
    }

    try {
      await stage.requestFullscreen();
    } catch {
      restoreEditorZoom();
      setShowMode(false);
    }
  }, [fullscreenFitZoom, restoreEditorZoom, zoom]);

  const exitShowPreview = useCallback(async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    setShowMode(false);
    restoreEditorZoom();
  }, [restoreEditorZoom]);

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
      if (event.key !== "Escape" && shouldKeepShortcutLocal(event.target)) {
        return;
      }

      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        goToSlide(currentIndex + 1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToSlide(currentIndex - 1);
      }
      if (event.key === "Escape") {
        void exitShowPreview();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, exitShowPreview, goToSlide]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setShowMode(false);
        restoreEditorZoom();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [restoreEditorZoom]);

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

  const handleDeckChange = (deckId: string) => {
    const nextEntry = getDeckEntry(deckId);
    setSelectedDeckId(nextEntry.id);
    setDeck(nextEntry.deck);
    setCurrentIndex(0);
    setSelectedId(nextEntry.deck.slides[0]?.elements[0]?.id);
    setMorphState(null);
    setShowMode(false);
    setZoom(FIT_ZOOM);
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
      <a className="skip-link" href="#stage-preview">
        跳转到舞台
      </a>
      <TopToolbar
        deckId={selectedDeckId}
        deckOptions={deckOptions}
        currentIndex={currentIndex}
        total={deck.slides.length}
        slideTitle={currentSlide.title}
        zoomLabel={zoomLabel}
        validationCounts={validationCounts}
        onPrev={() => goToSlide(currentIndex - 1)}
        onNext={() => goToSlide(currentIndex + 1)}
        onDeckChange={handleDeckChange}
        showMode={showMode}
        onToggleShow={() => {
          if (showMode) {
            void exitShowPreview();
            return;
          }
          void enterShowPreview();
        }}
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
        <section
          id="stage-preview"
          ref={stageRef}
          className="stage-shell"
          style={stageStyle}
          tabIndex={-1}
          aria-label="AI PPTX stage preview"
        >
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
          deck={deck}
          slide={currentSlide}
          element={selectedElement}
          slideChecklist={slideChecklist}
          issues={validationIssues}
        />
      </section>
    </main>
  );
}

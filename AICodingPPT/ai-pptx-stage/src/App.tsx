import { useMemo, useState } from "react";
import { InspectorPanel } from "./components/InspectorPanel";
import { LayerPanel } from "./components/LayerPanel";
import { sampleDeck } from "./deck/sampleDeck";
import { SceneRenderer } from "./components/SceneRenderer";
import { TopToolbar } from "./components/TopToolbar";
import { findElement, nudgeElement, setLayerDirection, updateElement } from "./deck/editing";

export default function App() {
  const [deck, setDeck] = useState(sampleDeck);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSlide = deck.slides[currentIndex] ?? deck.slides[0];
  const [selectedId, setSelectedId] = useState<string | undefined>(currentSlide.elements[0]?.id);
  const selectedElement = useMemo(() => findElement(currentSlide, selectedId), [currentSlide, selectedId]);

  const goToSlide = (nextIndex: number) => {
    const bounded = (nextIndex + deck.slides.length) % deck.slides.length;
    setCurrentIndex(bounded);
    setSelectedId(deck.slides[bounded]?.elements[0]?.id);
  };

  const handleMoveElement = (id: string, dx: number, dy: number) => {
    setDeck((current) => nudgeElement(current, currentSlide.id, id, dx, dy));
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
        zoomLabel="50%"
        onPrev={() => goToSlide(currentIndex - 1)}
        onNext={() => goToSlide(currentIndex + 1)}
      />
      <section className="editor-grid">
        <LayerPanel
          slide={currentSlide}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onMoveLayer={handleMoveLayer}
          onToggleVisibility={handleToggleVisibility}
          onToggleLock={handleToggleLock}
        />
        <section className="stage-shell" aria-label="AI PPTX stage preview">
          <SceneRenderer
            deck={deck}
            slide={currentSlide}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onMoveElement={handleMoveElement}
          />
        </section>
        <InspectorPanel slide={currentSlide} element={selectedElement} />
      </section>
    </main>
  );
}

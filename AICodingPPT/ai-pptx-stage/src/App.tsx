import { sampleDeck } from "./deck/sampleDeck";
import { SceneRenderer } from "./components/SceneRenderer";

export default function App() {
  const firstSlide = sampleDeck.slides[0];

  return (
    <main className="app-frame">
      <header className="topbar">
        <div>
          <p className="eyebrow">AI-native PPTX Scene System</p>
          <h1>{sampleDeck.title}</h1>
        </div>
        <dl className="deck-facts compact">
          <div>
            <dt>Canvas</dt>
            <dd>
              {sampleDeck.size.width}x{sampleDeck.size.height}
            </dd>
          </div>
          <div>
            <dt>Slides</dt>
            <dd>{sampleDeck.slides.length}</dd>
          </div>
          <div>
            <dt>Source</dt>
            <dd>TypeScript</dd>
          </div>
        </dl>
      </header>
      <section className="stage-shell" aria-label="AI PPTX stage preview">
        <SceneRenderer deck={sampleDeck} slide={firstSlide} />
      </section>
    </main>
  );
}

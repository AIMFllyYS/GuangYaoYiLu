import { sampleDeck } from "./deck/sampleDeck";

export default function App() {
  return (
    <main className="app-shell">
      <section className="welcome-panel">
        <p className="eyebrow">AI-native PPTX Scene System</p>
        <h1>{sampleDeck.title}</h1>
        <p className="lede">
          TypeScript 是作品源文件；浏览器负责预览、调参、图层管理、Morph 验证和 PPTX
          手工复刻参数展示。
        </p>
        <dl className="deck-facts">
          <div>
            <dt>Canvas</dt>
            <dd>
              {sampleDeck.size.width} x {sampleDeck.size.height}
            </dd>
          </div>
          <div>
            <dt>Slides</dt>
            <dd>{sampleDeck.slides.length}</dd>
          </div>
          <div>
            <dt>Mode</dt>
            <dd>TS-first Morph prototype</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}


import { ClipboardList } from "lucide-react";
import { pptxParameterLines, toPptxInches } from "../deck/pptx";
import type { SlideElement, SlideSpec } from "../deck/types";

type InspectorPanelProps = {
  slide: SlideSpec;
  element?: SlideElement;
};

export function InspectorPanel({ slide, element }: InspectorPanelProps) {
  return (
    <aside className="side-panel inspector-panel" aria-label="参数面板">
      <div className="panel-title">
        <div>
          <span className="panel-kicker">Inspector</span>
          <h2>TS / PPTX 参数</h2>
        </div>
        <ClipboardList size={17} aria-hidden="true" />
      </div>
      {!element ? (
        <div className="empty-state">
          <p>选择一个元素后，这里会展示 TypeScript 源数据、PPTX 英寸参数和选择窗格命名建议。</p>
        </div>
      ) : (
        <div className="inspector-content">
          <section>
            <h3>AI Source</h3>
            <ParamGrid
              rows={[
                ["slide", slide.id],
                ["id", element.id],
                ["type", element.type],
                ["morphKey", element.morphKey ?? "-"],
                ["name", element.name],
                ["z", String(element.z)],
                ["locked", String(Boolean(element.locked))],
                ["visible", String(element.visible !== false)]
              ]}
            />
          </section>
          <section>
            <h3>Geometry</h3>
            <ParamGrid
              rows={[
                ["x", String(element.x)],
                ["y", String(element.y)],
                ["w", String(element.w)],
                ["h", String(element.h)],
                ["rotate", `${element.rotate}deg`],
                ["opacity", String(element.opacity)]
              ]}
            />
          </section>
          <section>
            <h3>PPTX Manual Sync</h3>
            <ParamGrid rows={pptxParameterLines(element).map((line) => line.split(": ") as [string, string])} />
            <PptxHint element={element} />
          </section>
        </div>
      )}
    </aside>
  );
}

function ParamGrid({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="param-grid">
      {rows.map(([key, value]) => (
        <div key={key}>
          <dt>{key}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function PptxHint({ element }: { element: SlideElement }) {
  const inches = toPptxInches(element);

  return (
    <div className="sync-hint">
      <strong>{element.pptx.objectName}</strong>
      <p>{element.pptx.copyHint}</p>
      <p>
        PowerPoint 位置：左 {inches.left}in，上 {inches.top}in，宽 {inches.width}in，高 {inches.height}in。
      </p>
    </div>
  );
}


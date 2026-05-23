import { useState } from "react";
import { AlertTriangle, CheckCircle2, Clipboard, ClipboardCheck, ClipboardList, Info, Ruler, TerminalSquare } from "lucide-react";
import { elementPatchSnippet } from "../deck/exporters";
import { pptxParameterLines, toPptxInches } from "../deck/pptx";
import type { SlideElement, SlideSpec } from "../deck/types";
import type { ValidationIssue } from "../deck/validation";

type InspectorPanelProps = {
  slide: SlideSpec;
  element?: SlideElement;
  slideChecklist: string;
  issues: ValidationIssue[];
};

export function InspectorPanel({ slide, element, slideChecklist, issues }: InspectorPanelProps) {
  const slideIssues = issues.filter((issue) => issue.slideId === slide.id);

  return (
    <aside className="side-panel inspector-panel" aria-label="参数面板">
      <div className="panel-title">
        <div>
          <span className="panel-kicker">Inspector</span>
          <h2>TS / PPTX 参数</h2>
        </div>
        <ClipboardList size={17} aria-hidden="true" />
      </div>
      <div className="inspector-content">
        <section>
          <h3>
            <ClipboardList size={14} aria-hidden="true" />
            PPTX Manual Sync
          </h3>
          <CopyButton label="复制当前页 PPTX 清单" value={slideChecklist} />
        </section>
        {!element ? (
          <div className="empty-state">
            <p>选择一个元素后，这里会展示 TypeScript 源数据、PPTX 英寸参数和选择窗格命名建议。</p>
          </div>
        ) : (
          <>
            <section>
              <h3>
                <TerminalSquare size={14} aria-hidden="true" />
                AI Source
              </h3>
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
              <CopyButton label="复制 TS patch" value={elementPatchSnippet(slide, element)} />
            </section>
            <section>
              <h3>
                <Ruler size={14} aria-hidden="true" />
                Geometry
              </h3>
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
              <h3>
                <ClipboardList size={14} aria-hidden="true" />
                Selection Pane
              </h3>
              <ParamGrid rows={pptxParameterLines(element).map((line) => line.split(": ") as [string, string])} />
              <PptxHint element={element} />
            </section>
          </>
        )}
        <section>
          <h3>
            <CheckCircle2 size={14} aria-hidden="true" />
            Validation
          </h3>
          <ValidationReport issues={slideIssues} />
        </section>
      </div>
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

function CopyButton({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <button className={copied ? "copy-button is-copied" : "copy-button"} type="button" onClick={copy} aria-live="polite">
      {copied ? <ClipboardCheck size={14} /> : <Clipboard size={14} />}
      {copied ? "已复制" : label}
    </button>
  );
}

function ValidationReport({ issues }: { issues: ValidationIssue[] }) {
  if (issues.length === 0) {
    return <p className="validation-empty">当前页没有发现校验问题。</p>;
  }

  return (
    <ul className="validation-list">
      {issues.map((issue, index) => (
        <li key={`${issue.slideId}-${issue.elementId ?? "slide"}-${index}`} className={`validation-${issue.level}`}>
          <strong>
            <SeverityIcon level={issue.level} />
            {issue.level}
          </strong>
          <span>{issue.elementId ?? issue.slideId}</span>
          <p>{issue.message}</p>
        </li>
      ))}
    </ul>
  );
}

function SeverityIcon({ level }: { level: ValidationIssue["level"] }) {
  if (level === "error") {
    return <AlertTriangle size={13} aria-hidden="true" />;
  }

  if (level === "warning") {
    return <Info size={13} aria-hidden="true" />;
  }

  return <CheckCircle2 size={13} aria-hidden="true" />;
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

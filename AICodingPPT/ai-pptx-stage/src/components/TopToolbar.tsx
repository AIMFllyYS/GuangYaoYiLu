import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Info,
  Maximize2,
  MonitorPlay,
  MousePointer2,
  ScanLine,
  ZoomIn,
  ZoomOut
} from "lucide-react";

type TopToolbarProps = {
  deckId: string;
  deckOptions: Array<{ id: string; title: string }>;
  currentIndex: number;
  total: number;
  slideTitle: string;
  zoomLabel: string;
  validationCounts: {
    slideErrors: number;
    slideWarnings: number;
    totalErrors: number;
    totalWarnings: number;
  };
  showMode: boolean;
  onPrev: () => void;
  onNext: () => void;
  onDeckChange: (deckId: string) => void;
  onToggleShow: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomFit: () => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
};

export function TopToolbar({
  deckId,
  deckOptions,
  currentIndex,
  total,
  slideTitle,
  zoomLabel,
  validationCounts,
  showMode,
  onPrev,
  onNext,
  onDeckChange,
  onToggleShow,
  onZoomIn,
  onZoomOut,
  onZoomFit,
  canZoomIn,
  canZoomOut
}: TopToolbarProps) {
  const hasErrors = validationCounts.totalErrors > 0;
  const hasWarnings = validationCounts.totalWarnings > 0;
  const validationIsClean = !hasErrors && !hasWarnings;
  const validationLabel = hasErrors
    ? `校验错误 ${validationCounts.totalErrors}`
    : hasWarnings
      ? `PPTX 提醒 本页 ${validationCounts.slideWarnings}`
      : "校验通过";
  const validationAriaLabel = hasErrors
    ? `当前页 ${validationCounts.slideErrors} 个错误，总计 ${validationCounts.totalErrors} 个错误`
    : hasWarnings
      ? `当前页 ${validationCounts.slideWarnings} 个 PPTX 复刻提醒，总计 ${validationCounts.totalWarnings} 个提醒`
      : "没有校验错误或警告";

  return (
    <header className="top-toolbar" aria-label="编辑工具栏">
      <div className="toolbar-group title-group">
        <span className="app-mark">A</span>
        <div>
          <span className="panel-kicker">AI PPTX Stage</span>
          <strong>{slideTitle}</strong>
        </div>
      </div>
      <label className="deck-select-shell">
        <span>Deck</span>
        <select value={deckId} onChange={(event) => onDeckChange(event.target.value)} aria-label="选择 PPT deck">
          {deckOptions.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {entry.title}
            </option>
          ))}
        </select>
      </label>
      <div className="toolbar-cluster" aria-label="页面导航">
        <button className="icon-button" type="button" onClick={onPrev} title="上一页" aria-label="上一页">
          <ChevronLeft size={18} />
        </button>
        <span className="slide-counter" aria-label={`当前第 ${currentIndex + 1} 页，共 ${total} 页`}>
          {currentIndex + 1} / {total}
        </span>
        <button className="icon-button" type="button" onClick={onNext} title="下一页" aria-label="下一页">
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="toolbar-group status-group" aria-label="编辑状态">
        <span className={showMode ? "status-pill is-live" : "status-pill"}>
          <MonitorPlay size={14} aria-hidden="true" />
          {showMode ? "放映裁切" : "编辑预览"}
        </span>
        <span className="status-pill">
          <ScanLine size={14} aria-hidden="true" />
          16:9
        </span>
        <span className="zoom-label">缩放 {zoomLabel}</span>
        <span
          className={validationIsClean ? "status-pill is-clean" : hasErrors ? "status-pill is-error" : "status-pill is-warning"}
          aria-label={validationAriaLabel}
        >
          {validationIsClean ? (
            <CheckCircle2 size={14} aria-hidden="true" />
          ) : hasErrors ? (
            <AlertTriangle size={14} aria-hidden="true" />
          ) : (
            <Info size={14} aria-hidden="true" />
          )}
          {validationLabel}
        </span>
      </div>
      <div className="toolbar-group tool-group" aria-label="舞台工具">
        <button className="icon-button is-active" type="button" title="选择工具" aria-label="选择工具">
          <MousePointer2 size={18} />
        </button>
        <button
          className={showMode ? "icon-button is-active" : "icon-button"}
          type="button"
          title={showMode ? "退出全屏放映" : "全屏放映预览"}
          aria-label={showMode ? "退出全屏放映预览" : "进入全屏放映预览"}
          onClick={onToggleShow}
        >
          <MonitorPlay size={18} />
        </button>
        <button className="icon-button" type="button" title="适合窗口" aria-label="适合窗口" onClick={onZoomFit}>
          <Maximize2 size={18} />
        </button>
        <button className="icon-button" type="button" title="缩小" aria-label="缩小" onClick={onZoomOut} disabled={!canZoomOut}>
          <ZoomOut size={18} />
        </button>
        <button className="icon-button" type="button" title="放大" aria-label="放大" onClick={onZoomIn} disabled={!canZoomIn}>
          <ZoomIn size={18} />
        </button>
      </div>
    </header>
  );
}

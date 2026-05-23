import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  MonitorPlay,
  MousePointer2,
  ScanLine,
  ZoomIn,
  ZoomOut
} from "lucide-react";

type TopToolbarProps = {
  currentIndex: number;
  total: number;
  slideTitle: string;
  zoomLabel: string;
  showMode: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToggleShow: () => void;
};

export function TopToolbar({
  currentIndex,
  total,
  slideTitle,
  zoomLabel,
  showMode,
  onPrev,
  onNext,
  onToggleShow
}: TopToolbarProps) {
  return (
    <header className="top-toolbar" aria-label="编辑工具栏">
      <div className="toolbar-group title-group">
        <span className="app-mark">A</span>
        <div>
          <span className="panel-kicker">AI PPTX Stage</span>
          <strong>{slideTitle}</strong>
        </div>
      </div>
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
      </div>
      <div className="toolbar-group tool-group" aria-label="舞台工具">
        <button className="icon-button is-active" type="button" title="选择工具" aria-label="选择工具">
          <MousePointer2 size={18} />
        </button>
        <button
          className={showMode ? "icon-button is-active" : "icon-button"}
          type="button"
          title={showMode ? "退出放映裁切" : "放映裁切预览"}
          aria-label={showMode ? "退出放映裁切预览" : "进入放映裁切预览"}
          onClick={onToggleShow}
        >
          <MonitorPlay size={18} />
        </button>
        <button className="icon-button" type="button" title="适合窗口" aria-label="适合窗口">
          <Maximize2 size={18} />
        </button>
        <button className="icon-button" type="button" title="缩小" aria-label="缩小">
          <ZoomOut size={18} />
        </button>
        <button className="icon-button" type="button" title="放大" aria-label="放大">
          <ZoomIn size={18} />
        </button>
      </div>
    </header>
  );
}

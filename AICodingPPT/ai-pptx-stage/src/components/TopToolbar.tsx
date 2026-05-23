import { ChevronLeft, ChevronRight, Maximize2, MousePointer2, Play, ZoomIn, ZoomOut } from "lucide-react";

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
      <div className="toolbar-group">
        <button type="button" onClick={onPrev} title="上一页">
          <ChevronLeft size={18} />
        </button>
        <span className="slide-counter">
          {currentIndex + 1} / {total}
        </span>
        <button type="button" onClick={onNext} title="下一页">
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="toolbar-group">
        <button type="button" title="选择工具">
          <MousePointer2 size={18} />
        </button>
        <button
          type="button"
          className={showMode ? "is-active" : undefined}
          title={showMode ? "退出放映裁切" : "放映裁切预览"}
          onClick={onToggleShow}
        >
          <Play size={18} />
        </button>
        <button type="button" title="适合窗口">
          <Maximize2 size={18} />
        </button>
        <button type="button" title="缩小">
          <ZoomOut size={18} />
        </button>
        <span className="zoom-label">{zoomLabel}</span>
        <button type="button" title="放大">
          <ZoomIn size={18} />
        </button>
      </div>
    </header>
  );
}

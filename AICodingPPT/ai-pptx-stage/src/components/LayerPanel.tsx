import { ArrowDown, ArrowUp, Eye, EyeOff, Lock, LockOpen, Search } from "lucide-react";
import type { SlideElement, SlideSpec } from "../deck/types";

type LayerPanelProps = {
  slide: SlideSpec;
  selectedId?: string;
  onSelect: (id: string) => void;
  onMoveLayer: (id: string, direction: "up" | "down" | "top" | "bottom") => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
};

export function LayerPanel({
  slide,
  selectedId,
  onSelect,
  onMoveLayer,
  onToggleVisibility,
  onToggleLock
}: LayerPanelProps) {
  const layers = [...slide.elements].sort((a, b) => b.z - a.z);

  return (
    <aside className="side-panel layer-panel" aria-label="图层面板">
      <div className="panel-title">
        <div>
          <span className="panel-kicker">Layers</span>
          <h2>图层</h2>
        </div>
        <Search size={17} aria-hidden="true" />
      </div>
      <div className="slide-meta">
        <span>{slide.id}</span>
        <strong>{slide.title}</strong>
      </div>
      <div className="layer-list">
        {layers.map((element) => (
          <LayerRow
            key={element.id}
            element={element}
            selected={selectedId === element.id}
            onSelect={onSelect}
            onMoveLayer={onMoveLayer}
            onToggleVisibility={onToggleVisibility}
            onToggleLock={onToggleLock}
          />
        ))}
      </div>
    </aside>
  );
}

type LayerRowProps = {
  element: SlideElement;
  selected: boolean;
  onSelect: (id: string) => void;
  onMoveLayer: (id: string, direction: "up" | "down" | "top" | "bottom") => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
};

function LayerRow({ element, selected, onSelect, onMoveLayer, onToggleVisibility, onToggleLock }: LayerRowProps) {
  return (
    <div className={selected ? "layer-row is-active" : "layer-row"}>
      <button className="layer-main" type="button" onClick={() => onSelect(element.id)}>
        <span className={`layer-type layer-type-${element.type}`}>{element.type}</span>
        <span className="layer-copy">
          <strong>{element.name}</strong>
          <small>{element.morphKey ?? element.id}</small>
        </span>
      </button>
      <div className="layer-actions">
        <button type="button" title="上移一层" onClick={() => onMoveLayer(element.id, "up")}>
          <ArrowUp size={14} />
        </button>
        <button type="button" title="下移一层" onClick={() => onMoveLayer(element.id, "down")}>
          <ArrowDown size={14} />
        </button>
        <button type="button" title={element.visible === false ? "显示" : "隐藏"} onClick={() => onToggleVisibility(element.id)}>
          {element.visible === false ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
        <button type="button" title={element.locked ? "解锁" : "锁定"} onClick={() => onToggleLock(element.id)}>
          {element.locked ? <Lock size={14} /> : <LockOpen size={14} />}
        </button>
      </div>
    </div>
  );
}


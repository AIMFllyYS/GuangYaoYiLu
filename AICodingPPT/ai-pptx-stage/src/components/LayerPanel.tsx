import {
  ChevronsDown,
  ChevronsUp,
  Circle,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Lock,
  LockOpen,
  Minus,
  Search,
  Shapes,
  Square,
  TextCursorInput,
  Type
} from "lucide-react";
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
        <span className="panel-tool-indicator" aria-hidden="true">
          <Search size={15} />
          {slide.elements.length}
        </span>
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
  const TypeIcon = typeIcon[element.type] ?? Shapes;

  return (
    <div className={selected ? "layer-row is-active" : "layer-row"} data-layer-type={element.type}>
      <button className="layer-main" type="button" onClick={() => onSelect(element.id)} aria-pressed={selected}>
        <span className={`layer-type layer-type-${element.type}`} title={element.type}>
          <TypeIcon size={14} aria-hidden="true" />
        </span>
        <span className="layer-copy">
          <strong>{element.name}</strong>
          <small>
            <span className="morph-key">{element.morphKey ?? "no morphKey"}</span>
            <span className="layer-id">{element.id}</span>
          </small>
        </span>
      </button>
      <div className="layer-actions">
        <button type="button" title="置顶" aria-label={`${element.name} 置顶`} onClick={() => onMoveLayer(element.id, "top")}>
          <ChevronsUp size={14} />
        </button>
        <button type="button" title="置底" aria-label={`${element.name} 置底`} onClick={() => onMoveLayer(element.id, "bottom")}>
          <ChevronsDown size={14} />
        </button>
        <button
          type="button"
          className={element.visible === false ? "is-muted" : undefined}
          title={element.visible === false ? "显示" : "隐藏"}
          aria-label={element.visible === false ? `显示 ${element.name}` : `隐藏 ${element.name}`}
          onClick={() => onToggleVisibility(element.id)}
        >
          {element.visible === false ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
        <button
          type="button"
          className={element.locked ? "is-locked" : undefined}
          title={element.locked ? "解锁" : "锁定"}
          aria-label={element.locked ? `解锁 ${element.name}` : `锁定 ${element.name}`}
          onClick={() => onToggleLock(element.id)}
        >
          {element.locked ? <Lock size={14} /> : <LockOpen size={14} />}
        </button>
      </div>
    </div>
  );
}

const typeIcon: Record<SlideElement["type"], typeof Type> = {
  text: Type,
  image: ImageIcon,
  rect: Square,
  ellipse: Circle,
  line: Minus,
  icon: TextCursorInput,
  group: Shapes
};

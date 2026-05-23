export const DECK_WIDTH = 1920;
export const DECK_HEIGHT = 1080;
export const PPTX_WIDE_WIDTH_IN = 13.333;
export const PPTX_WIDE_HEIGHT_IN = 7.5;

export type ElementType = "text" | "rect" | "ellipse" | "line" | "image" | "icon" | "group";

export type TransitionType = "morph" | "cut" | "fade";

export type MorphRule = "match" | "fadeIn" | "fadeOut" | "enterFromCanvas" | "exitToCanvas";

export type ElementStyle = {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  color?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  lineHeight?: number;
  borderRadius?: number;
  shadow?: string;
  objectFit?: "cover" | "contain" | "fill";
  textAlign?: "left" | "center" | "right";
};

export type PptxSync = {
  objectName: string;
  shapeType: "TextBox" | "Rectangle" | "Ellipse" | "Line" | "Picture" | "Icon" | "Group";
  copyHint: string;
  morphRole: "matched" | "enter" | "exit" | "static";
  notes?: string;
};

export type BaseElement = {
  id: string;
  morphKey?: string;
  name: string;
  type: ElementType;
  x: number;
  y: number;
  w: number;
  h: number;
  rotate: number;
  opacity: number;
  z: number;
  locked?: boolean;
  visible?: boolean;
  style: ElementStyle;
  pptx: PptxSync;
};

export type TextElement = BaseElement & {
  type: "text";
  content: string;
};

export type ShapeElement = BaseElement & {
  type: "rect" | "ellipse" | "line";
};

export type AssetElement = BaseElement & {
  type: "image" | "icon";
  asset: string;
  alt?: string;
};

export type GroupElement = BaseElement & {
  type: "group";
  children: SlideElement[];
};

export type SlideElement = TextElement | ShapeElement | AssetElement | GroupElement;

export type SlideTransition = {
  type: TransitionType;
  durationMs: number;
  easing: string;
  textMorph?: "object" | "word" | "char";
  rules?: Record<string, MorphRule>;
};

export type SlideSpec = {
  id: string;
  title: string;
  background: string;
  elements: SlideElement[];
  transition?: SlideTransition;
};

export type DeckSpec = {
  id: string;
  title: string;
  size: {
    width: number;
    height: number;
  };
  theme: {
    name: string;
    fontSans: string;
    fontSerif: string;
    colors: Record<string, string>;
  };
  slides: SlideSpec[];
};

export type BuilderInput = {
  id: string;
  morphKey?: string;
  name?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rotate?: number;
  opacity?: number;
  z?: number;
  locked?: boolean;
  visible?: boolean;
  style?: ElementStyle;
  pptx?: Partial<PptxSync>;
};


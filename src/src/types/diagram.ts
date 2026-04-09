export type SymbolCategory = 'general' | 'electrical';
export type ToolType =
'select' |
'pan' |
'connect' |
'rectangle' |
'ellipse' |
'diamond' |
'arrow-right' |
'arrow-left' |
'arrow-up' |
'arrow-down' |
'arrow-bidirectional' |
'resistor' |
'capacitor' |
'voltage-source' |
'ground' |
'radio' |
'monocell-battery' |
'multicell-battery';

export interface PortDefinition {
  id: string;
  label: string;
  position: 'top' | 'right' | 'bottom' | 'left';
  normalizedX: number; // 0 to 1
  normalizedY: number; // 0 to 1
}

export interface NodeStyle {
  fill: string;
  stroke: string;
  strokeWidth: number;
  borderRadius?: number;
  fontSize?: number;
  fontColor?: string;
}

export interface DiagramNode {
  id: string;
  type: string;
  category: SymbolCategory;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  label: string;
  style: NodeStyle;
  ports: PortDefinition[];
}

export interface EdgeStyle {
  stroke: string;
  strokeWidth: number;
  strokeDasharray?: string;
}

export interface Point {
  x: number;
  y: number;
}

export interface DiagramEdge {
  id: string;
  sourceNodeId: string;
  sourcePortId: string;
  targetNodeId: string;
  targetPortId: string;
  style: EdgeStyle;
  waypoints?: Point[];
}

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

export interface SymbolDefinition {
  type: string;
  category: SymbolCategory;
  label: string;
  defaultWidth: number;
  defaultHeight: number;
  ports: PortDefinition[];
  icon: string; // SVG path data for stencil thumbnail
}

export interface DiagramState {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  viewport: Viewport;
  selectedNodeIds: string[];
  selectedEdgeIds: string[];
  activeTool: ToolType;
  hoveredNodeId: string | null;
  hoveredPortId: string | null;
  connectingFrom: {nodeId: string;portId: string;} | null;
  connectionPreview: Point | null;
  snapToGrid: boolean;
  gridSize: number;
  undoStack: {nodes: DiagramNode[];edges: DiagramEdge[];}[];
  redoStack: {nodes: DiagramNode[];edges: DiagramEdge[];}[];

  // Actions
  addNode: (node: DiagramNode) => void;
  removeNode: (id: string) => void;
  updateNode: (id: string, partial: Partial<DiagramNode>) => void;
  moveNode: (id: string, x: number, y: number) => void;
  resizeNode: (
  id: string,
  width: number,
  height: number,
  x: number,
  y: number)
  => void;

  addEdge: (edge: DiagramEdge) => void;
  removeEdge: (id: string) => void;
  updateEdge: (id: string, partial: Partial<DiagramEdge>) => void;

  setViewport: (viewport: Partial<Viewport>) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  fitToScreen: () => void;

  selectNode: (id: string, multi?: boolean) => void;
  selectEdge: (id: string, multi?: boolean) => void;
  clearSelection: () => void;
  selectAll: () => void;

  setActiveTool: (tool: ToolType) => void;
  setHoveredNode: (id: string | null) => void;
  setHoveredPort: (id: string | null) => void;

  startConnection: (nodeId: string, portId: string) => void;
  updateConnectionPreview: (point: Point | null) => void;
  completeConnection: (nodeId: string, portId: string) => void;
  cancelConnection: () => void;

  undo: () => void;
  redo: () => void;
  pushUndo: () => void;

  clearCanvas: () => void;
  loadFromStorage: () => void;
  saveToStorage: () => void;
  setSnapToGrid: (snap: boolean) => void;
}
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { DiagramState, DiagramNode, DiagramEdge, Point } from '../types/diagram';
import { demoNodes, demoEdges } from '../utils/demoContent';

const STORAGE_KEY = 'diagram-editor-state';

const initialState = {
  nodes: demoNodes,
  edges: demoEdges,
  viewport: { x: 0, y: 0, zoom: 1 },
  selectedNodeIds: [],
  selectedEdgeIds: [],
  activeTool: 'select' as const,
  hoveredNodeId: null,
  hoveredPortId: null,
  connectingFrom: null,
  connectionPreview: null,
  snapToGrid: true,
  gridSize: 10,
  undoStack: [],
  redoStack: []
};

export const useDiagramStore = create<DiagramState>()(
  immer((set, get) => ({
    ...initialState,

    pushUndo: () => {
      set((state) => {
        state.undoStack.push({
          nodes: JSON.parse(JSON.stringify(state.nodes)),
          edges: JSON.parse(JSON.stringify(state.edges))
        });
        state.redoStack = [];
      });
    },

    addNode: (node) => {
      get().pushUndo();
      set((state) => {
        state.nodes.push(node);
        state.selectedNodeIds = [node.id];
        state.selectedEdgeIds = [];
      });
      get().saveToStorage();
    },

    removeNode: (id) => {
      get().pushUndo();
      set((state) => {
        state.nodes = state.nodes.filter((n) => n.id !== id);
        state.edges = state.edges.filter(
          (e) => e.sourceNodeId !== id && e.targetNodeId !== id
        );
        state.selectedNodeIds = state.selectedNodeIds.filter(
          (nid) => nid !== id
        );
      });
      get().saveToStorage();
    },

    updateNode: (id, partial) => {
      get().pushUndo();
      set((state) => {
        const node = state.nodes.find((n) => n.id === id);
        if (node) {
          Object.assign(node, partial);
        }
      });
      get().saveToStorage();
    },

    moveNode: (id, x, y) => {
      set((state) => {
        const node = state.nodes.find((n) => n.id === id);
        if (node) {
          node.x = x;
          node.y = y;
        }
      });
    },

    resizeNode: (id, width, height, x, y) => {
      set((state) => {
        const node = state.nodes.find((n) => n.id === id);
        if (node) {
          node.width = Math.max(20, width);
          node.height = Math.max(20, height);
          node.x = x;
          node.y = y;
        }
      });
    },

    addEdge: (edge) => {
      get().pushUndo();
      set((state) => {
        state.edges.push(edge);
      });
      get().saveToStorage();
    },

    removeEdge: (id) => {
      get().pushUndo();
      set((state) => {
        state.edges = state.edges.filter((e) => e.id !== id);
        state.selectedEdgeIds = state.selectedEdgeIds.filter(
          (eid) => eid !== id
        );
      });
      get().saveToStorage();
    },

    updateEdge: (id, partial) => {
      get().pushUndo();
      set((state) => {
        const edge = state.edges.find((e) => e.id === id);
        if (edge) {
          Object.assign(edge, partial);
        }
      });
      get().saveToStorage();
    },

    setViewport: (viewport) => {
      set((state) => {
        state.viewport = { ...state.viewport, ...viewport };
      });
    },

    zoomIn: () => {
      set((state) => {
        state.viewport.zoom = Math.min(state.viewport.zoom * 1.2, 5);
      });
    },

    zoomOut: () => {
      set((state) => {
        state.viewport.zoom = Math.max(state.viewport.zoom / 1.2, 0.1);
      });
    },

    fitToScreen: () => {
      set((state) => {
        state.viewport = { x: 0, y: 0, zoom: 1 };
      });
    },

    selectNode: (id, multi = false) => {
      set((state) => {
        if (multi) {
          if (!state.selectedNodeIds.includes(id)) {
            state.selectedNodeIds.push(id);
          }
        } else {
          state.selectedNodeIds = [id];
          state.selectedEdgeIds = [];
        }
      });
    },

    selectEdge: (id, multi = false) => {
      set((state) => {
        if (multi) {
          if (!state.selectedEdgeIds.includes(id)) {
            state.selectedEdgeIds.push(id);
          }
        } else {
          state.selectedEdgeIds = [id];
          state.selectedNodeIds = [];
        }
      });
    },

    clearSelection: () => {
      set((state) => {
        state.selectedNodeIds = [];
        state.selectedEdgeIds = [];
      });
    },

    selectAll: () => {
      set((state) => {
        state.selectedNodeIds = state.nodes.map((n) => n.id);
        state.selectedEdgeIds = state.edges.map((e) => e.id);
      });
    },

    setActiveTool: (tool) => {
      set((state) => {
        state.activeTool = tool;
        if (tool !== 'connect') {
          state.connectingFrom = null;
          state.connectionPreview = null;
        }
      });
    },

    setHoveredNode: (id) => {
      set((state) => {
        state.hoveredNodeId = id;
      });
    },

    setHoveredPort: (id) => {
      set((state) => {
        state.hoveredPortId = id;
      });
    },

    startConnection: (nodeId, portId) => {
      set((state) => {
        state.connectingFrom = { nodeId, portId };
        // Don't override arrow tools
        const isArrow = [
        'arrow-right',
        'arrow-left',
        'arrow-up',
        'arrow-down',
        'arrow-bidirectional'].
        includes(state.activeTool);
        if (!isArrow) {
          state.activeTool = 'connect';
        }
      });
    },

    updateConnectionPreview: (point) => {
      set((state) => {
        state.connectionPreview = point;
      });
    },

    completeConnection: (targetNodeId, targetPortId) => {
      const { connectingFrom, activeTool } = get();
      if (
      connectingFrom && (
      connectingFrom.nodeId !== targetNodeId ||
      connectingFrom.portId !== targetPortId))
      {
        const newEdge: DiagramEdge = {
          id: `edge-${Date.now()}`,
          sourceNodeId: connectingFrom.nodeId,
          sourcePortId: connectingFrom.portId,
          targetNodeId,
          targetPortId,
          style: { stroke: '#000000', strokeWidth: 2 }
        };
        get().addEdge(newEdge);
      }
      // Arrow tools stay active so user can keep connecting
      const isArrow = [
      'arrow-right',
      'arrow-left',
      'arrow-up',
      'arrow-down',
      'arrow-bidirectional'].
      includes(activeTool);
      set((state) => {
        state.connectingFrom = null;
        state.connectionPreview = null;
        if (!isArrow) {
          state.activeTool = 'select';
        }
      });
    },

    cancelConnection: () => {
      set((state) => {
        state.connectingFrom = null;
        state.connectionPreview = null;
        state.activeTool = 'select';
      });
    },

    undo: () => {
      set((state) => {
        if (state.undoStack.length > 0) {
          const prevState = state.undoStack.pop()!;
          state.redoStack.push({
            nodes: JSON.parse(JSON.stringify(state.nodes)),
            edges: JSON.parse(JSON.stringify(state.edges))
          });
          state.nodes = prevState.nodes;
          state.edges = prevState.edges;
          state.selectedNodeIds = [];
          state.selectedEdgeIds = [];
        }
      });
      get().saveToStorage();
    },

    redo: () => {
      set((state) => {
        if (state.redoStack.length > 0) {
          const nextState = state.redoStack.pop()!;
          state.undoStack.push({
            nodes: JSON.parse(JSON.stringify(state.nodes)),
            edges: JSON.parse(JSON.stringify(state.edges))
          });
          state.nodes = nextState.nodes;
          state.edges = nextState.edges;
          state.selectedNodeIds = [];
          state.selectedEdgeIds = [];
        }
      });
      get().saveToStorage();
    },

    clearCanvas: () => {
      get().pushUndo();
      set((state) => {
        state.nodes = [];
        state.edges = [];
        state.selectedNodeIds = [];
        state.selectedEdgeIds = [];
      });
      get().saveToStorage();
    },

    loadFromStorage: () => {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
          const parsed = JSON.parse(data);
          set((state) => {
            state.nodes = parsed.nodes || [];
            state.edges = parsed.edges || [];
          });
        }
      } catch (e) {
        console.error('Failed to load diagram from storage', e);
      }
    },

    saveToStorage: () => {
      const { nodes, edges } = get();
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges }));
    },

    setSnapToGrid: (snap) => {
      set((state) => {
        state.snapToGrid = snap;
      });
    }
  }))
);
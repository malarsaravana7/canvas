import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useDiagramStore } from '../store/diagramStore';
import { NodeRenderer } from './canvas/NodeRenderer';
import {
  EdgeRenderer,
  EdgeArrowhead,
  ConnectionPreview } from
'./canvas/EdgeRenderer';
import { SelectionBox } from './canvas/SelectionBox';
import { SYMBOL_DEFINITIONS } from '../symbols/definitions';
import { DiagramNode, Point, ToolType } from '../types/diagram';
import {
  snapToGrid,
  findPortAtPosition,
  findNodeAtPosition,
  getPortIdForArrowDirection,
  isPointInRect } from
'../utils/geometry';
export function Canvas() {
  const svgRef = useRef<SVGSVGElement>(null);
  const {
    nodes,
    edges,
    viewport,
    activeTool,
    selectedNodeIds,
    connectingFrom,
    snapToGrid: shouldSnap,
    gridSize,
    setViewport,
    clearSelection,
    addNode,
    setActiveTool,
    updateConnectionPreview,
    cancelConnection,
    completeConnection,
    selectNode,
    startConnection
  } = useDiagramStore();
  const [isPanning, setIsPanning] = useState(false);
  const [isSpacePanning, setIsSpacePanning] = useState(false);
  const [spaceHeld, setSpaceHeld] = useState(false);
  const [selectionBox, setSelectionBox] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);
  const panStart = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0
  });
  const screenToWorld = useCallback(
    (clientX: number, clientY: number): Point => {
      const svg = svgRef.current;
      if (!svg)
      return {
        x: 0,
        y: 0
      };
      const rect = svg.getBoundingClientRect();
      return {
        x: (clientX - rect.left - viewport.x) / viewport.zoom,
        y: (clientY - rect.top - viewport.y) / viewport.zoom
      };
    },
    [viewport]
  );
  // Keyboard: space for pan
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Skip shortcuts when user is typing in an input or textarea
      const tag = (e.target as HTMLElement)?.tagName;
      const isTyping =
      tag === 'INPUT' ||
      tag === 'TEXTAREA' ||
      (e.target as HTMLElement)?.isContentEditable;
      if (e.code === 'Space' && !e.repeat && !isTyping) {
        e.preventDefault();
        setSpaceHeld(true);
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isTyping) {
        const state = useDiagramStore.getState();
        state.selectedNodeIds.forEach((id) => state.removeNode(id));
        state.selectedEdgeIds.forEach((id) => state.removeEdge(id));
      }
      if (e.key === 'Escape') {
        useDiagramStore.getState().cancelConnection();
        useDiagramStore.getState().setActiveTool('select');
      }
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        useDiagramStore.getState().undo();
      }
      if (e.ctrlKey && (e.key === 'y' || e.shiftKey && e.key === 'Z')) {
        e.preventDefault();
        useDiagramStore.getState().redo();
      }
      if (e.ctrlKey && e.key === 'a' && !isTyping) {
        e.preventDefault();
        useDiagramStore.getState().selectAll();
      }
      if (e.key === 'g' && !isTyping) {
        const s = useDiagramStore.getState();
        s.setSnapToGrid(!s.snapToGrid);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') setSpaceHeld(false);
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      const newZoom = Math.min(5, Math.max(0.1, viewport.zoom * zoomFactor));
      const scale = newZoom / viewport.zoom;
      setViewport({
        zoom: newZoom,
        x: mouseX - (mouseX - viewport.x) * scale,
        y: mouseY - (mouseY - viewport.y) * scale
      });
    },
    [viewport, setViewport]
  );
  const isPlacementTool = (tool: ToolType) =>
  [
  'rectangle',
  'ellipse',
  'diamond',
  'resistor',
  'capacitor',
  'voltage-source',
  'ground'].
  includes(tool);
  const isArrowTool = (tool: ToolType) =>
  [
  'arrow-right',
  'arrow-left',
  'arrow-up',
  'arrow-down',
  'arrow-bidirectional'].
  includes(tool);
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button === 1 || activeTool === 'pan' || spaceHeld) {
        setIsPanning(true);
        if (spaceHeld) setIsSpacePanning(true);
        panStart.current = {
          x: e.clientX,
          y: e.clientY,
          vx: viewport.x,
          vy: viewport.y
        };
        return;
      }
      const world = screenToWorld(e.clientX, e.clientY);
      // Connection tool: check if clicking on a port
      if (activeTool === 'connect') {
        const portHit = findPortAtPosition(nodes, world, 15);
        if (portHit) {
          startConnection(portHit.nodeId, portHit.portId);
        }
        return;
      }
      // Arrow tools: click on nodes to connect them
      if (isArrowTool(activeTool)) {
        const hitNode = findNodeAtPosition(nodes, world);
        if (hitNode) {
          if (!connectingFrom) {
            // First click: start connection from source node
            const sourcePortId = getPortIdForArrowDirection(
              activeTool,
              'source'
            );
            const port =
            hitNode.ports.find((p) => p.id === sourcePortId) ||
            hitNode.ports[0];
            startConnection(hitNode.id, port.id);
          } else {
            // Second click: complete connection to target node
            const targetPortId = getPortIdForArrowDirection(
              activeTool,
              'target'
            );
            const port =
            hitNode.ports.find((p) => p.id === targetPortId) ||
            hitNode.ports[0];
            completeConnection(hitNode.id, port.id);
          }
        }
        return;
      }
      // Placement tools
      if (isPlacementTool(activeTool)) {
        const def = SYMBOL_DEFINITIONS[activeTool];
        if (!def) return;
        let px = world.x - def.defaultWidth / 2;
        let py = world.y - def.defaultHeight / 2;
        if (shouldSnap) {
          px = snapToGrid(px, gridSize);
          py = snapToGrid(py, gridSize);
        }
        const newNode: DiagramNode = {
          id: `node-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          type: def.type,
          category: def.category,
          x: px,
          y: py,
          width: def.defaultWidth,
          height: def.defaultHeight,
          label: def.label,
          style: {
            fill: '#ffffff',
            stroke: '#000000',
            strokeWidth: 2,
            fontSize: 12,
            fontColor: '#374151'
          },
          ports: [...def.ports]
        };
        addNode(newNode);
        setActiveTool('select');
        return;
      }
      // Select tool: start selection box on empty space
      if (activeTool === 'select') {
        clearSelection();
        setSelectionBox({
          startX: world.x,
          startY: world.y,
          endX: world.x,
          endY: world.y
        });
      }
    },
    [
    activeTool,
    spaceHeld,
    viewport,
    screenToWorld,
    nodes,
    shouldSnap,
    gridSize,
    addNode,
    setActiveTool,
    clearSelection,
    startConnection,
    connectingFrom,
    completeConnection]

  );
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (isPanning) {
        const dx = e.clientX - panStart.current.x;
        const dy = e.clientY - panStart.current.y;
        setViewport({
          x: panStart.current.vx + dx,
          y: panStart.current.vy + dy
        });
        return;
      }
      if (connectingFrom) {
        const world = screenToWorld(e.clientX, e.clientY);
        updateConnectionPreview(world);
        return;
      }
      if (selectionBox) {
        const world = screenToWorld(e.clientX, e.clientY);
        setSelectionBox((prev) =>
        prev ?
        {
          ...prev,
          endX: world.x,
          endY: world.y
        } :
        null
        );
      }
    },
    [
    isPanning,
    connectingFrom,
    selectionBox,
    screenToWorld,
    setViewport,
    updateConnectionPreview]

  );
  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (isPanning) {
        setIsPanning(false);
        setIsSpacePanning(false);
        return;
      }
      if (connectingFrom) {
        // Arrow tools use click-click (not drag), so don't cancel on pointer up
        if (isArrowTool(activeTool)) {
          return;
        }
        const world = screenToWorld(e.clientX, e.clientY);
        const portHit = findPortAtPosition(nodes, world, 15);
        if (portHit) {
          completeConnection(portHit.nodeId, portHit.portId);
        } else {
          cancelConnection();
        }
        return;
      }
      if (selectionBox) {
        // Select nodes within box
        const box = {
          x: Math.min(selectionBox.startX, selectionBox.endX),
          y: Math.min(selectionBox.startY, selectionBox.endY),
          width: Math.abs(selectionBox.endX - selectionBox.startX),
          height: Math.abs(selectionBox.endY - selectionBox.startY)
        };
        if (box.width > 5 || box.height > 5) {
          nodes.forEach((node) => {
            const nodeCenter = {
              x: node.x + node.width / 2,
              y: node.y + node.height / 2
            };
            if (isPointInRect(nodeCenter, box)) {
              selectNode(node.id, true);
            }
          });
        }
        setSelectionBox(null);
      }
    },
    [
    isPanning,
    connectingFrom,
    selectionBox,
    screenToWorld,
    nodes,
    completeConnection,
    cancelConnection,
    selectNode]

  );
  // Drop handler for stencil drag
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const symbolType = e.dataTransfer.getData('symbol-type');
      if (!symbolType || symbolType.startsWith('arrow-')) return;
      const def = SYMBOL_DEFINITIONS[symbolType];
      if (!def) return;
      const world = screenToWorld(e.clientX, e.clientY);
      let px = world.x - def.defaultWidth / 2;
      let py = world.y - def.defaultHeight / 2;
      if (shouldSnap) {
        px = snapToGrid(px, gridSize);
        py = snapToGrid(py, gridSize);
      }
      const newNode: DiagramNode = {
        id: `node-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: def.type,
        category: def.category,
        x: px,
        y: py,
        width: def.defaultWidth,
        height: def.defaultHeight,
        label: def.label,
        style: {
          fill: '#ffffff',
          stroke: '#000000',
          strokeWidth: 2,
          fontSize: 12,
          fontColor: '#374151'
        },
        ports: [...def.ports]
      };
      addNode(newNode);
    },
    [screenToWorld, shouldSnap, gridSize, addNode]
  );
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);
  const cursorClass =
  isPanning || isSpacePanning ?
  'cursor-grabbing' :
  activeTool === 'pan' || spaceHeld ?
  'cursor-grab' :
  activeTool === 'connect' || isArrowTool(activeTool) ?
  'cursor-crosshair' :
  isPlacementTool(activeTool) ?
  'cursor-cell' :
  'cursor-default';
  return (
    <svg
      ref={svgRef}
      className={`w-full h-full bg-gray-50 ${cursorClass} select-none`}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDrop={handleDrop}
      onDragOver={handleDragOver}>
      
      {/* Grid pattern */}
      <defs>
        <pattern
          id="smallGrid"
          width={gridSize}
          height={gridSize}
          patternUnits="userSpaceOnUse"
          patternTransform={`translate(${viewport.x % (gridSize * viewport.zoom)}, ${viewport.y % (gridSize * viewport.zoom)}) scale(${viewport.zoom})`}>
          
          <path
            d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={0.5 / viewport.zoom} />
          
        </pattern>
        <pattern
          id="grid"
          width={gridSize * 5}
          height={gridSize * 5}
          patternUnits="userSpaceOnUse"
          patternTransform={`translate(${viewport.x % (gridSize * 5 * viewport.zoom)}, ${viewport.y % (gridSize * 5 * viewport.zoom)}) scale(${viewport.zoom})`}>
          
          <rect
            width={gridSize * 5}
            height={gridSize * 5}
            fill="url(#smallGrid)" />
          
          <path
            d={`M ${gridSize * 5} 0 L 0 0 0 ${gridSize * 5}`}
            fill="none"
            stroke="#d1d5db"
            strokeWidth={0.8 / viewport.zoom} />
          
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* World transform group */}
      <g
        transform={`translate(${viewport.x}, ${viewport.y}) scale(${viewport.zoom})`}>
        
        {/* Edge lines (below nodes) */}
        {edges.map((edge) =>
        <EdgeRenderer key={edge.id} edge={edge} nodes={nodes} />
        )}

        {/* Connection preview */}
        <ConnectionPreview nodes={nodes} />

        {/* Nodes */}
        {nodes.map((node) =>
        <NodeRenderer key={node.id} node={node} />
        )}

        {/* Edge arrowheads (above nodes so they're always visible) */}
        {edges.map((edge) =>
        <EdgeArrowhead key={`arrow-${edge.id}`} edge={edge} nodes={nodes} />
        )}

        {/* Selection box */}
        {selectionBox &&
        <SelectionBox
          startX={selectionBox.startX}
          startY={selectionBox.startY}
          endX={selectionBox.endX}
          endY={selectionBox.endY} />

        }
      </g>
    </svg>);

}
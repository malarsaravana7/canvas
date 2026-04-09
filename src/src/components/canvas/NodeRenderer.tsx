import React, { useState, useRef, Component } from 'react';
import { DiagramNode } from '../../types/diagram';
import { useDiagramStore } from '../../store/diagramStore';
import { GeneralSymbolRenderer } from '../symbols/GeneralSymbols';
import { ElectricalSymbolRenderer } from '../symbols/ElectricalSymbols';
import { PortRenderer } from './PortRenderer';
import { snapToGrid } from '../../utils/geometry';
const isBlockShape = (type: string): boolean =>
[
'rectangle',
'rounded-rectangle',
'ellipse',
'diamond',
'container'].
includes(type);
interface NodeRendererProps {
  node: DiagramNode;
}
export const NodeRenderer: React.FC<NodeRendererProps> = ({ node }) => {
  const {
    selectedNodeIds,
    hoveredNodeId,
    selectNode,
    setHoveredNode,
    moveNode,
    pushUndo,
    activeTool,
    gridSize,
    snapToGrid: shouldSnap,
    saveToStorage
  } = useDiagramStore();
  const isSelected = selectedNodeIds.includes(node.id);
  const isHovered = hoveredNodeId === node.id;
  const isArrowToolActive = [
  'arrow-right',
  'arrow-left',
  'arrow-up',
  'arrow-down',
  'arrow-bidirectional'].
  includes(activeTool);
  const showPorts =
  isSelected || isHovered || activeTool === 'connect' || isArrowToolActive;
  const dragStartPos = useRef({
    x: 0,
    y: 0,
    nodeX: 0,
    nodeY: 0
  });
  const handlePointerDown = (e: React.PointerEvent) => {
    if (activeTool === 'connect' || isArrowToolActive) return;
    e.stopPropagation();
    selectNode(node.id, e.shiftKey);
    if (activeTool === 'select') {
      dragStartPos.current = {
        x: e.clientX,
        y: e.clientY,
        nodeX: node.x,
        nodeY: node.y
      };
      const handlePointerMove = (moveEvent: PointerEvent) => {
        const zoom = useDiagramStore.getState().viewport.zoom;
        const dx = (moveEvent.clientX - dragStartPos.current.x) / zoom;
        const dy = (moveEvent.clientY - dragStartPos.current.y) / zoom;
        let newX = dragStartPos.current.nodeX + dx;
        let newY = dragStartPos.current.nodeY + dy;
        if (shouldSnap) {
          newX = snapToGrid(newX, gridSize);
          newY = snapToGrid(newY, gridSize);
        }
        moveNode(node.id, newX, newY);
      };
      const handlePointerUp = () => {
        pushUndo();
        saveToStorage();
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
  };
  const SymbolComponent =
  node.category === 'electrical' ?
  ElectricalSymbolRenderer :
  GeneralSymbolRenderer;
  return (
    <g
      transform={`translate(${node.x}, ${node.y}) ${node.rotation ? `rotate(${node.rotation}, ${node.width / 2}, ${node.height / 2})` : ''}`}
      onPointerDown={handlePointerDown}
      onPointerEnter={() => setHoveredNode(node.id)}
      onPointerLeave={() => setHoveredNode(null)}
      className="cursor-pointer">
      
      {/* Selection highlight */}
      {isSelected &&
      <rect
        x={-3}
        y={-3}
        width={node.width + 6}
        height={node.height + 6}
        fill="none"
        stroke="#3b82f6"
        strokeWidth={2}
        strokeDasharray="6 3"
        rx={2} />

      }

      {/* Hover highlight */}
      {isHovered && !isSelected &&
      <rect
        x={-2}
        y={-2}
        width={node.width + 4}
        height={node.height + 4}
        fill="none"
        stroke="#93c5fd"
        strokeWidth={1.5}
        rx={2} />

      }

      {/* Hit area for easier clicking */}
      <rect
        width={node.width}
        height={node.height}
        fill="transparent"
        stroke="none" />
      

      {/* Symbol */}
      <SymbolComponent node={node} />

      {/* Label: inside for general block shapes, below for electrical/arrows */}
      {isBlockShape(node.type) ?
      <text
        x={node.width / 2}
        y={node.type === 'container' ? 16 : node.height / 2}
        textAnchor="middle"
        dominantBaseline={node.type === 'container' ? 'central' : 'central'}
        fontSize={node.style.fontSize || 12}
        fill={node.style.fontColor || '#374151'}
        className="select-none pointer-events-none">
        
          {node.label}
        </text> :

      <text
        x={node.width / 2}
        y={node.height + 16}
        textAnchor="middle"
        fontSize={node.style.fontSize || 12}
        fill={node.style.fontColor || '#374151'}
        className="select-none pointer-events-none">
        
          {node.label}
        </text>
      }

      {/* Ports */}
      {node.ports.map((port) =>
      <PortRenderer
        key={port.id}
        node={node}
        port={port}
        isVisible={showPorts} />

      )}

      {/* Resize handles */}
      {isSelected && <ResizeHandles node={node} />}
    </g>);

};
/* Resize handles sub-component */
interface ResizeHandlesProps {
  node: DiagramNode;
}
const ResizeHandles: React.FC<ResizeHandlesProps> = ({ node }) => {
  const { resizeNode, updateNode, pushUndo, saveToStorage, viewport } =
  useDiagramStore();
  const handleSize = 6;
  const handles = [
  {
    id: 'se',
    cx: node.width,
    cy: node.height,
    cursor: 'nwse-resize'
  },
  {
    id: 'sw',
    cx: 0,
    cy: node.height,
    cursor: 'nesw-resize'
  },
  {
    id: 'ne',
    cx: node.width,
    cy: 0,
    cursor: 'nesw-resize'
  },
  {
    id: 'nw',
    cx: 0,
    cy: 0,
    cursor: 'nwse-resize'
  },
  {
    id: 'n',
    cx: node.width / 2,
    cy: 0,
    cursor: 'ns-resize'
  },
  {
    id: 's',
    cx: node.width / 2,
    cy: node.height,
    cursor: 'ns-resize'
  },
  {
    id: 'e',
    cx: node.width,
    cy: node.height / 2,
    cursor: 'ew-resize'
  },
  {
    id: 'w',
    cx: 0,
    cy: node.height / 2,
    cursor: 'ew-resize'
  }];

  const handleResizeStart = (e: React.PointerEvent, handleId: string) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = node.width;
    const startH = node.height;
    const startNX = node.x;
    const startNY = node.y;
    const onMove = (me: PointerEvent) => {
      const zoom = viewport.zoom;
      const dx = (me.clientX - startX) / zoom;
      const dy = (me.clientY - startY) / zoom;
      let newW = startW;
      let newH = startH;
      let newX = startNX;
      let newY = startNY;
      if (handleId.includes('e')) newW = Math.max(20, startW + dx);
      if (handleId.includes('w')) {
        newW = Math.max(20, startW - dx);
        newX = startNX + startW - newW;
      }
      if (handleId.includes('s')) newH = Math.max(20, startH + dy);
      if (handleId.includes('n')) {
        newH = Math.max(20, startH - dy);
        newY = startNY + startH - newH;
      }
      resizeNode(node.id, newW, newH, newX, newY);
    };
    const onUp = () => {
      pushUndo();
      saveToStorage();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };
  const handleRotateStart = (e: React.PointerEvent) => {
    e.stopPropagation();
    const rect = (e.target as Element).getBoundingClientRect();
    // Estimate center of node in screen coordinates
    // The rotation handle is at (width/2, -24) in local space
    const handleScreenX = rect.left + rect.width / 2;
    const handleScreenY = rect.top + rect.height / 2;
    // Distance from handle to center in local space is height/2 + 24
    const localDist = node.height / 2 + 24;
    const screenDist = localDist * viewport.zoom;
    // We can approximate the center of the node in screen space
    // by using the current rotation
    const currentRotRad = (node.rotation || 0) * Math.PI / 180;
    const centerScreenX = handleScreenX + Math.sin(currentRotRad) * screenDist;
    const centerScreenY = handleScreenY + Math.cos(currentRotRad) * screenDist;
    const onMove = (me: PointerEvent) => {
      const dx = me.clientX - centerScreenX;
      const dy = me.clientY - centerScreenY;
      // Calculate angle in degrees
      let angle = Math.atan2(dy, dx) * (180 / Math.PI);
      // Adjust so that pointing straight up is 0 degrees
      angle += 90;
      if (angle < 0) angle += 360;
      // Snap to 15 degrees if shift is held
      if (me.shiftKey) {
        angle = Math.round(angle / 15) * 15;
      }
      updateNode(node.id, {
        rotation: Math.round(angle)
      });
    };
    const onUp = () => {
      pushUndo();
      saveToStorage();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };
  return (
    <>
      {/* Rotation Handle */}
      <line
        x1={node.width / 2}
        y1={0}
        x2={node.width / 2}
        y2={-24}
        stroke="#3b82f6"
        strokeWidth={1}
        strokeDasharray="2 2" />
      
      <circle
        cx={node.width / 2}
        cy={-24}
        r={5}
        fill="#ffffff"
        stroke="#3b82f6"
        strokeWidth={1.5}
        style={{
          cursor: 'grab'
        }}
        onPointerDown={handleRotateStart} />
      

      {/* Resize Handles */}
      {handles.map((h) =>
      <rect
        key={h.id}
        x={h.cx - handleSize / 2}
        y={h.cy - handleSize / 2}
        width={handleSize}
        height={handleSize}
        fill="#ffffff"
        stroke="#3b82f6"
        strokeWidth={1.5}
        style={{
          cursor: h.cursor
        }}
        onPointerDown={(e) => handleResizeStart(e, h.id)} />

      )}
    </>);

};
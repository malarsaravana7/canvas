import React from 'react';
import { useDiagramStore } from '../store/diagramStore';
import { GridIcon } from 'lucide-react';
const toolHints: Record<string, string> = {
  select:
  'Click to select · Drag to move · Shift+click multi-select · Del to delete',
  pan: 'Click and drag to pan the canvas',
  connect: 'Click a port and drag to another port to create a wire',
  rectangle: 'Click on canvas to place a Rectangle',
  ellipse: 'Click on canvas to place an Ellipse',
  diamond: 'Click on canvas to place a Diamond',
  resistor: 'Click on canvas to place a Resistor',
  capacitor: 'Click on canvas to place a Capacitor',
  'voltage-source': 'Click on canvas to place a Voltage Source',
  ground: 'Click on canvas to place a Ground symbol',
  'arrow-right': 'Click source block, then click target block to connect (→)',
  'arrow-left': 'Click source block, then click target block to connect (←)',
  'arrow-up': 'Click source block, then click target block to connect (↑)',
  'arrow-down': 'Click source block, then click target block to connect (↓)',
  'arrow-bidirectional': 'Click first block, then second block to connect (↔)'
};
export function StatusBar() {
  const {
    activeTool,
    viewport,
    selectedNodeIds,
    selectedEdgeIds,
    snapToGrid,
    setSnapToGrid
  } = useDiagramStore();
  const totalSelected = selectedNodeIds.length + selectedEdgeIds.length;
  const zoomPercent = Math.round(viewport.zoom * 100);
  return (
    <footer className="flex items-center justify-between px-3 h-7 bg-gray-800 border-t border-gray-700 text-[11px] text-gray-400 shrink-0 select-none">
      <div className="flex items-center gap-3">
        <span className="text-gray-300 font-medium capitalize">
          {activeTool.includes('-') ?
          activeTool.
          split('-').
          map((w) => w.charAt(0).toUpperCase() + w.slice(1)).
          join(' ') :
          activeTool.charAt(0).toUpperCase() + activeTool.slice(1)}
        </span>
      </div>

      <div className="hidden sm:block text-gray-500 truncate max-w-md">
        {toolHints[activeTool] || 'Space+drag to pan'}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setSnapToGrid(!snapToGrid)}
          title="Toggle snap to grid (G)"
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors ${snapToGrid ? 'text-blue-400 bg-gray-700' : 'text-gray-500 hover:text-gray-300'}`}>
          
          <GridIcon size={12} />
          <span>Snap</span>
        </button>
        {totalSelected > 0 && <span>{totalSelected} selected</span>}
        <span className="text-gray-300 font-mono">{zoomPercent}%</span>
      </div>
    </footer>);

}
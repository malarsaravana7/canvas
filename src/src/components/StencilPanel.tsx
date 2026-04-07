import React, { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon, SearchIcon } from 'lucide-react';
import { SYMBOL_DEFINITIONS } from '../symbols/definitions';
import { useDiagramStore } from '../store/diagramStore';
import { DiagramNode, SymbolDefinition } from '../types/diagram';
import { snapToGrid } from '../utils/geometry';
interface StencilTileProps {
  definition: SymbolDefinition;
}
const StencilTile: React.FC<StencilTileProps> = ({ definition }) => {
  const {
    addNode,
    viewport,
    snapToGrid: shouldSnap,
    gridSize,
    setActiveTool
  } = useDiagramStore();
  const handleDragStart = (e: React.DragEvent) => {
    if (isArrowType) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('symbol-type', definition.type);
    e.dataTransfer.effectAllowed = 'copy';
  };
  const isArrowType = definition.type.startsWith('arrow-');
  const handleClick = () => {
    // Arrow stencils activate connection mode instead of placing a node
    if (isArrowType) {
      setActiveTool(definition.type as any);
      return;
    }
    // Place at center of viewport
    const centerX = (window.innerWidth / 2 - viewport.x - 240) / viewport.zoom;
    const centerY = (window.innerHeight / 2 - viewport.y - 44) / viewport.zoom;
    let px = centerX - definition.defaultWidth / 2;
    let py = centerY - definition.defaultHeight / 2;
    if (shouldSnap) {
      px = snapToGrid(px, gridSize);
      py = snapToGrid(py, gridSize);
    }
    const newNode: DiagramNode = {
      id: `node-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: definition.type,
      category: definition.category,
      x: px,
      y: py,
      width: definition.defaultWidth,
      height: definition.defaultHeight,
      label: definition.label,
      style: {
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: 2,
        fontSize: 12,
        fontColor: '#374151'
      },
      ports: [...definition.ports]
    };
    addNode(newNode);
    setActiveTool('select');
  };
  return (
    <div
      draggable={!isArrowType}
      onDragStart={handleDragStart}
      onClick={handleClick}
      className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-colors ${isArrowType ? 'border-blue-200 bg-blue-50 hover:border-blue-400 hover:bg-blue-100 cursor-pointer' : 'border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50 cursor-grab active:cursor-grabbing'}`}
      title={
      isArrowType ?
      `Click to connect blocks with ${definition.label}` :
      `Drag or click to add ${definition.label}`
      }>
      
      <svg
        width="36"
        height="36"
        viewBox="0 0 32 32"
        className="text-gray-700"
        dangerouslySetInnerHTML={{
          __html: definition.icon
        }} />
      
      <span className="text-[10px] text-gray-600 leading-tight text-center truncate w-full">
        {definition.label}
      </span>
    </div>);

};
interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}
const Section: React.FC<SectionProps> = ({
  title,
  children,
  defaultOpen = true
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 w-full px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:bg-gray-100 rounded transition-colors">
        
        {open ? <ChevronDownIcon size={14} /> : <ChevronRightIcon size={14} />}
        {title}
      </button>
      {open &&
      <div className="grid grid-cols-2 gap-1.5 px-1.5 pb-2">{children}</div>
      }
    </div>);

};
export function StencilPanel() {
  const [search, setSearch] = useState('');
  const allDefs = Object.values(SYMBOL_DEFINITIONS);
  const filtered = search ?
  allDefs.filter((d) =>
  d.label.toLowerCase().includes(search.toLowerCase())
  ) :
  allDefs;
  const generalShapes = filtered.filter(
    (d) => d.category === 'general' && !d.type.startsWith('arrow-')
  );
  const arrows = filtered.filter((d) => d.type.startsWith('arrow-'));
  const electrical = filtered.filter((d) => d.category === 'electrical');
  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-hidden">
      <div className="px-2 pt-2 pb-1">
        <div className="relative">
          <SearchIcon
            size={14}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
          
          <input
            type="text"
            placeholder="Search symbols..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 bg-gray-50" />
          
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-1 pb-2">
        {generalShapes.length > 0 &&
        <Section title="Shapes">
            {generalShapes.map((def) =>
          <StencilTile key={def.type} definition={def} />
          )}
          </Section>
        }
        {arrows.length > 0 &&
        <Section title="Connectors">
            {arrows.map((def) =>
          <StencilTile key={def.type} definition={def} />
          )}
          </Section>
        }
        {electrical.length > 0 &&
        <Section title="Electrical">
            {electrical.map((def) =>
          <StencilTile key={def.type} definition={def} />
          )}
          </Section>
        }
        {filtered.length === 0 &&
        <p className="text-xs text-gray-400 text-center mt-4">
            No symbols match "{search}"
          </p>
        }
      </div>
    </aside>);

}
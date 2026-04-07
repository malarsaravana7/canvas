import React from 'react';
import { useDiagramStore } from '../store/diagramStore';
export function InspectorPanel() {
  const {
    nodes,
    edges,
    selectedNodeIds,
    selectedEdgeIds,
    updateNode,
    updateEdge,
    pushUndo,
    saveToStorage
  } = useDiagramStore();
  const selectedNodes = nodes.filter((n) => selectedNodeIds.includes(n.id));
  const selectedEdges = edges.filter((e) => selectedEdgeIds.includes(e.id));
  const commitChange = () => {
    pushUndo();
    saveToStorage();
  };
  if (selectedNodes.length === 0 && selectedEdges.length === 0) {
    return (
      <aside className="w-60 bg-white border-l border-gray-200 flex flex-col shrink-0">
        <div className="px-3 py-3 border-b border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Properties
          </h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs text-gray-400">No selection</p>
        </div>
      </aside>);

  }
  if (selectedNodes.length === 1) {
    const node = selectedNodes[0];
    const handleChange = (field: string, value: string | number) => {
      if (field === 'label') {
        updateNode(node.id, {
          label: value as string
        });
      } else if (field === 'x') {
        updateNode(node.id, {
          x: Number(value)
        });
      } else if (field === 'y') {
        updateNode(node.id, {
          y: Number(value)
        });
      } else if (field === 'width') {
        updateNode(node.id, {
          width: Math.max(20, Number(value))
        });
      } else if (field === 'height') {
        updateNode(node.id, {
          height: Math.max(20, Number(value))
        });
      } else if (field === 'fill') {
        updateNode(node.id, {
          style: {
            ...node.style,
            fill: value as string
          }
        });
      } else if (field === 'stroke') {
        updateNode(node.id, {
          style: {
            ...node.style,
            stroke: value as string
          }
        });
      } else if (field === 'strokeWidth') {
        updateNode(node.id, {
          style: {
            ...node.style,
            strokeWidth: Number(value)
          }
        });
      }
    };
    return (
      <aside className="w-60 bg-white border-l border-gray-200 flex flex-col shrink-0 overflow-y-auto">
        <div className="px-3 py-3 border-b border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Properties
          </h3>
        </div>

        <div className="p-3 space-y-3 text-xs">
          {/* Type */}
          <div>
            <label className="block text-gray-400 mb-0.5">Type</label>
            <div className="px-2 py-1 bg-gray-50 rounded text-gray-600 capitalize">
              {node.type} ({node.category})
            </div>
          </div>

          {/* Label */}
          <div>
            <label className="block text-gray-400 mb-0.5">Label</label>
            <input
              type="text"
              value={node.label}
              onChange={(e) => handleChange('label', e.target.value)}
              onBlur={commitChange}
              className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400" />
            
          </div>

          {/* Position */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-gray-400 mb-0.5">X</label>
              <input
                type="number"
                value={Math.round(node.x)}
                onChange={(e) => handleChange('x', e.target.value)}
                onBlur={commitChange}
                className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400" />
              
            </div>
            <div>
              <label className="block text-gray-400 mb-0.5">Y</label>
              <input
                type="number"
                value={Math.round(node.y)}
                onChange={(e) => handleChange('y', e.target.value)}
                onBlur={commitChange}
                className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400" />
              
            </div>
          </div>

          {/* Size */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-gray-400 mb-0.5">Width</label>
              <input
                type="number"
                value={Math.round(node.width)}
                onChange={(e) => handleChange('width', e.target.value)}
                onBlur={commitChange}
                className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400" />
              
            </div>
            <div>
              <label className="block text-gray-400 mb-0.5">Height</label>
              <input
                type="number"
                value={Math.round(node.height)}
                onChange={(e) => handleChange('height', e.target.value)}
                onBlur={commitChange}
                className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400" />
              
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-gray-400 mb-0.5">Fill</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={node.style.fill}
                  onChange={(e) => handleChange('fill', e.target.value)}
                  onBlur={commitChange}
                  className="w-6 h-6 rounded border border-gray-200 cursor-pointer" />
                
                <span className="text-gray-500">{node.style.fill}</span>
              </div>
            </div>
            <div>
              <label className="block text-gray-400 mb-0.5">Stroke</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={node.style.stroke}
                  onChange={(e) => handleChange('stroke', e.target.value)}
                  onBlur={commitChange}
                  className="w-6 h-6 rounded border border-gray-200 cursor-pointer" />
                
                <span className="text-gray-500">{node.style.stroke}</span>
              </div>
            </div>
          </div>

          {/* Stroke Width */}
          <div>
            <label className="block text-gray-400 mb-0.5">Stroke Width</label>
            <input
              type="number"
              min={0.5}
              max={10}
              step={0.5}
              value={node.style.strokeWidth}
              onChange={(e) => handleChange('strokeWidth', e.target.value)}
              onBlur={commitChange}
              className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400" />
            
          </div>

          {/* Ports info */}
          <div>
            <label className="block text-gray-400 mb-0.5">
              Ports ({node.ports.length})
            </label>
            <div className="flex flex-wrap gap-1">
              {node.ports.map((p) =>
              <span
                key={p.id}
                className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px]">
                
                  {p.label}
                </span>
              )}
            </div>
          </div>
        </div>
      </aside>);

  }
  // Edge selected
  if (selectedEdges.length === 1 && selectedNodes.length === 0) {
    const edge = selectedEdges[0];
    const handleEdgeChange = (field: string, value: string | number) => {
      if (field === 'stroke') {
        updateEdge(edge.id, {
          style: {
            ...edge.style,
            stroke: value as string
          }
        });
      } else if (field === 'strokeWidth') {
        updateEdge(edge.id, {
          style: {
            ...edge.style,
            strokeWidth: Number(value)
          }
        });
      } else if (field === 'dash') {
        updateEdge(edge.id, {
          style: {
            ...edge.style,
            strokeDasharray: edge.style.strokeDasharray ? undefined : '6 3'
          }
        });
      }
    };
    return (
      <aside className="w-60 bg-white border-l border-gray-200 flex flex-col shrink-0 overflow-y-auto">
        <div className="px-3 py-3 border-b border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Wire Properties
          </h3>
        </div>
        <div className="p-3 space-y-3 text-xs">
          <div>
            <label className="block text-gray-400 mb-0.5">Stroke Color</label>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={edge.style.stroke}
                onChange={(e) => handleEdgeChange('stroke', e.target.value)}
                className="w-6 h-6 rounded border border-gray-200 cursor-pointer" />
              
              <span className="text-gray-500">{edge.style.stroke}</span>
            </div>
          </div>
          <div>
            <label className="block text-gray-400 mb-0.5">Stroke Width</label>
            <input
              type="number"
              min={0.5}
              max={10}
              step={0.5}
              value={edge.style.strokeWidth}
              onChange={(e) => handleEdgeChange('strokeWidth', e.target.value)}
              className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400" />
            
          </div>
          <div>
            <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
              <input
                type="checkbox"
                checked={!!edge.style.strokeDasharray}
                onChange={() => handleEdgeChange('dash', '')}
                className="rounded" />
              
              Dashed
            </label>
          </div>
        </div>
      </aside>);

  }
  // Multiple selection
  return (
    <aside className="w-60 bg-white border-l border-gray-200 flex flex-col shrink-0">
      <div className="px-3 py-3 border-b border-gray-100">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Properties
        </h3>
      </div>
      <div className="p-3 text-xs text-gray-500">
        <p>
          {selectedNodes.length} node{selectedNodes.length !== 1 ? 's' : ''}{' '}
          {selectedEdges.length > 0 &&
          `and ${selectedEdges.length} edge${selectedEdges.length !== 1 ? 's' : ''} `}
          selected
        </p>
      </div>
    </aside>);

}
import React, { useEffect } from 'react';
import { Toolbar } from './src/components/Toolbar';
import { StencilPanel } from './src/components/StencilPanel';
import { Canvas } from './src/components/Canvas';
import { InspectorPanel } from './src/components/InspectorPanel';
import { StatusBar } from './src/components/StatusBar';
import { useDiagramStore } from './src/store/diagramStore';
export function App() {
  const loadFromStorage = useDiagramStore((s) => s.loadFromStorage);
  useEffect(() => {
    // Load saved state if available; otherwise demo content is already in the store
    try {
      const saved = localStorage.getItem('diagram-editor-state');
      if (saved) {
        loadFromStorage();
      }
    } catch {

      // Demo content stays as default
    }}, [loadFromStorage]);
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-100">
      <Toolbar />
      <div className="flex flex-1 min-h-0">
        <StencilPanel />
        <main className="flex-1 min-w-0 relative">
          <Canvas />
        </main>
        <InspectorPanel />
      </div>
      <StatusBar />
    </div>);

}
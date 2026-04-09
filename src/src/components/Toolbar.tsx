import React from 'react';
import {
  MousePointer2Icon,
  HandIcon,
  LinkIcon,
  ZoomInIcon,
  ZoomOutIcon,
  MaximizeIcon,
  Undo2Icon,
  Redo2Icon,
  Trash2Icon,
  SquareIcon,
  CircleIcon,
  DiamondIcon } from
'lucide-react';
import { useDiagramStore } from '../store/diagramStore';
import { ToolType } from '../types/diagram';
interface ToolButtonProps {
  tool?: ToolType;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
}
const ToolButton: React.FC<ToolButtonProps> = ({
  tool,
  icon,
  label,
  onClick,
  isActive
}) => {
  const { activeTool, setActiveTool } = useDiagramStore();
  const active = isActive ?? (tool ? activeTool === tool : false);
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (tool) {
      setActiveTool(tool);
    }
  };
  return (
    <button
      onClick={handleClick}
      title={label}
      className={`flex items-center justify-center w-8 h-8 rounded transition-colors ${active ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
      
      {icon}
    </button>);

};
const Separator = () => <div className="w-px h-6 bg-gray-600 mx-1" />;
const ElectricalIcon: React.FC<{
  path: string;
}> = ({ path }) =>
<svg
  width="16"
  height="16"
  viewBox="0 0 32 32"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinejoin="round"
  dangerouslySetInnerHTML={{
    __html: path
  }} />;


export function Toolbar() {
  const {
    zoomIn,
    zoomOut,
    fitToScreen,
    undo,
    redo,
    clearCanvas,
    undoStack,
    redoStack
  } = useDiagramStore();
  return (
    <header className="flex items-center gap-1 px-3 h-11 bg-gray-800 border-b border-gray-700 shrink-0">
      <span className="text-sm font-semibold text-white mr-3 tracking-tight">
        Diagram Editor
      </span>

      <Separator />

      {/* Selection & Navigation */}
      <ToolButton
        tool="select"
        icon={<MousePointer2Icon size={16} />}
        label="Select (V)" />
      
      <ToolButton
        tool="pan"
        icon={<HandIcon size={16} />}
        label="Pan (Space+Drag)" />
      
      <ToolButton
        tool="connect"
        icon={<LinkIcon size={16} />}
        label="Wire / Connect" />
      

      <Separator />

      {/* General Shapes */}
      <ToolButton
        tool="rectangle"
        icon={<SquareIcon size={16} />}
        label="Rectangle" />
      
      <ToolButton
        tool="ellipse"
        icon={<CircleIcon size={16} />}
        label="Ellipse" />
      
      <ToolButton
        tool="diamond"
        icon={<DiamondIcon size={16} />}
        label="Diamond" />
      

      <Separator />

      {/* Electrical */}
      <ToolButton
        tool="resistor"
        icon={
        <ElectricalIcon path='<path d="M2,16 L8,16 L10,10 L14,22 L18,10 L22,22 L24,16 L30,16"/>' />
        }
        label="Resistor" />
      
      <ToolButton
        tool="capacitor"
        icon={
        <ElectricalIcon path='<path d="M4,16 L12,16 M20,16 L28,16 M12,8 L12,24 M20,8 L20,24"/>' />
        }
        label="Capacitor" />
      
      <ToolButton
        tool="voltage-source"
        icon={
        <ElectricalIcon path='<circle cx="16" cy="16" r="10"/><path d="M16,10 L16,14 M14,12 L18,12 M14,20 L18,20"/>' />
        }
        label="Voltage Source" />
      
      <ToolButton
        tool="ground"
        icon={
        <ElectricalIcon path='<path d="M16,4 L16,14 M8,14 L24,14 M11,19 L21,19 M14,24 L18,24"/>' />
        }
        label="Ground" />
      
      <ToolButton
        tool="radio"
        icon={
        <ElectricalIcon path='<path d="M16,4 L16,18"/><circle cx="16" cy="20" r="6"/><path d="M24,12 A10,10 0 0,0 24,28"/><path d="M27,9 A14,14 0 0,0 27,31"/>' />
        }
        label="Radio" />
      
      <ToolButton
        tool="monocell-battery"
        icon={
        <ElectricalIcon path='<path d="M16,4 L16,12 M8,12 L24,12 M11,16 L21,16 M16,16 L16,28"/>' />
        }
        label="Monocell Battery" />
      
      <ToolButton
        tool="multicell-battery"
        icon={
        <ElectricalIcon path='<path d="M16,2 L16,7 M8,7 L24,7 M11,10 L21,10 M8,13 L24,13 M11,16 L21,16 M8,19 L24,19 M11,22 L21,22 M16,22 L16,28"/>' />
        }
        label="Multicell Battery" />
      

      <Separator />

      {/* View */}
      <ToolButton
        icon={<ZoomInIcon size={16} />}
        label="Zoom In"
        onClick={zoomIn} />
      
      <ToolButton
        icon={<ZoomOutIcon size={16} />}
        label="Zoom Out"
        onClick={zoomOut} />
      
      <ToolButton
        icon={<MaximizeIcon size={16} />}
        label="Fit to Screen"
        onClick={fitToScreen} />
      

      <Separator />

      {/* Actions */}
      <ToolButton
        icon={<Undo2Icon size={16} />}
        label="Undo (Ctrl+Z)"
        onClick={undo}
        isActive={false} />
      
      <ToolButton
        icon={<Redo2Icon size={16} />}
        label="Redo (Ctrl+Y)"
        onClick={redo}
        isActive={false} />
      
      <ToolButton
        icon={<Trash2Icon size={16} />}
        label="Clear Canvas"
        onClick={clearCanvas}
        isActive={false} />
      
    </header>);

}
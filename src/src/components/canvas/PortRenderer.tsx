import React from 'react';
import { DiagramNode, PortDefinition } from '../../types/diagram';
import { useDiagramStore } from '../../store/diagramStore';
interface PortRendererProps {
  node: DiagramNode;
  port: PortDefinition;
  isVisible: boolean;
}
export const PortRenderer: React.FC<PortRendererProps> = ({
  node,
  port,
  isVisible
}) => {
  const { hoveredPortId, startConnection, completeConnection, connectingFrom } =
  useDiagramStore();
  const isHovered = hoveredPortId === port.id;
  const isConnecting =
  connectingFrom?.nodeId === node.id && connectingFrom?.portId === port.id;
  const cx = port.normalizedX * node.width;
  const cy = port.normalizedY * node.height;
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    startConnection(node.id, port.id);
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (connectingFrom) {
      completeConnection(node.id, port.id);
    }
  };
  const handlePointerEnter = () => {
    useDiagramStore.getState().setHoveredPort(port.id);
  };
  const handlePointerLeave = () => {
    useDiagramStore.getState().setHoveredPort(null);
  };
  if (!isVisible && !isHovered && !isConnecting) return null;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={isHovered ? 6 : 4}
      fill={isHovered || isConnecting ? '#3b82f6' : '#ffffff'}
      stroke="#2563eb"
      strokeWidth={2}
      className="cursor-crosshair transition-all duration-150"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave} />);


};
import React from 'react';
import { DiagramEdge, DiagramNode, PortDefinition } from '../../types/diagram';
import { getPortPosition } from '../../utils/geometry';
import { useDiagramStore } from '../../store/diagramStore';
interface EdgeRendererProps {
  edge: DiagramEdge;
  nodes: DiagramNode[];
}
/** Smart orthogonal routing that respects port directions */
function computeEdgeGeometry(edge: DiagramEdge, nodes: DiagramNode[]) {
  const sourceNode = nodes.find((n) => n.id === edge.sourceNodeId);
  const targetNode = nodes.find((n) => n.id === edge.targetNodeId);
  if (!sourceNode || !targetNode) return null;
  const sourcePort = sourceNode.ports.find((p) => p.id === edge.sourcePortId);
  const targetPort = targetNode.ports.find((p) => p.id === edge.targetPortId);
  if (!sourcePort || !targetPort) return null;
  const start = getPortPosition(sourceNode, sourcePort);
  const end = getPortPosition(targetNode, targetPort);
  const points = computeOrthogonalRoute(start, end, sourcePort, targetPort);
  // Remove degenerate zero-length segments
  const cleaned: {
    x: number;
    y: number;
  }[] = [points[0]];
  for (let i = 1; i < points.length; i++) {
    const prev = cleaned[cleaned.length - 1];
    if (
    Math.abs(points[i].x - prev.x) > 0.1 ||
    Math.abs(points[i].y - prev.y) > 0.1)
    {
      cleaned.push(points[i]);
    }
  }
  // Ensure we always have at least 2 points
  if (cleaned.length < 2) {
    cleaned.push({
      x: end.x,
      y: end.y
    });
  }
  // Compute arrow direction from the last actual segment
  const last = cleaned[cleaned.length - 1];
  const prev = cleaned[cleaned.length - 2];
  const dx = last.x - prev.x;
  const dy = last.y - prev.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const angle = len > 0 ? Math.atan2(dy, dx) : 0;
  // Build path string
  const pathD = cleaned.
  map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).
  join(' ');
  return {
    pathD,
    end: last,
    angle
  };
}
function computeOrthogonalRoute(
start: {
  x: number;
  y: number;
},
end: {
  x: number;
  y: number;
},
sourcePort: PortDefinition,
targetPort: PortDefinition)
: {
  x: number;
  y: number;
}[] {
  const STUB = 20; // minimum distance to extend from port before turning
  // Get the direction each port faces outward
  const srcDir = getPortDirection(sourcePort);
  const tgtDir = getPortDirection(targetPort);
  // Extend stub points from each port
  const srcStub = {
    x: start.x + srcDir.dx * STUB,
    y: start.y + srcDir.dy * STUB
  };
  const tgtStub = {
    x: end.x + tgtDir.dx * STUB,
    y: end.y + tgtDir.dy * STUB
  };
  const srcHorizontal = srcDir.dx !== 0;
  const tgtHorizontal = tgtDir.dx !== 0;
  if (srcHorizontal && tgtHorizontal) {
    // Both horizontal: route H-V-H
    const midX = (srcStub.x + tgtStub.x) / 2;
    return [
    start,
    srcStub,
    {
      x: midX,
      y: srcStub.y
    },
    {
      x: midX,
      y: tgtStub.y
    },
    tgtStub,
    end];

  } else if (!srcHorizontal && !tgtHorizontal) {
    // Both vertical: route V-H-V
    const midY = (srcStub.y + tgtStub.y) / 2;
    return [
    start,
    srcStub,
    {
      x: srcStub.x,
      y: midY
    },
    {
      x: tgtStub.x,
      y: midY
    },
    tgtStub,
    end];

  } else if (srcHorizontal && !tgtHorizontal) {
    // Source horizontal, target vertical: route H then V
    // Connect via an L-bend or Z-bend
    return [
    start,
    srcStub,
    {
      x: tgtStub.x,
      y: srcStub.y
    },
    tgtStub,
    end];

  } else {
    // Source vertical, target horizontal: route V then H
    return [
    start,
    srcStub,
    {
      x: srcStub.x,
      y: tgtStub.y
    },
    tgtStub,
    end];

  }
}
function getPortDirection(port: PortDefinition): {
  dx: number;
  dy: number;
} {
  switch (port.position) {
    case 'right':
      return {
        dx: 1,
        dy: 0
      };
    case 'left':
      return {
        dx: -1,
        dy: 0
      };
    case 'bottom':
      return {
        dx: 0,
        dy: 1
      };
    case 'top':
      return {
        dx: 0,
        dy: -1
      };
    default:
      return {
        dx: 1,
        dy: 0
      };
  }
}
export const EdgeRenderer: React.FC<EdgeRendererProps> = ({ edge, nodes }) => {
  const { selectedEdgeIds, selectEdge } = useDiagramStore();
  const isSelected = selectedEdgeIds.includes(edge.id);
  const geo = computeEdgeGeometry(edge, nodes);
  if (!geo) return null;
  const color = isSelected ? '#3b82f6' : edge.style.stroke;
  return (
    <g>
      {/* Fat invisible hit area */}
      <path
        d={geo.pathD}
        fill="none"
        stroke="transparent"
        strokeWidth={12}
        className="cursor-pointer"
        onPointerDown={(e) => {
          e.stopPropagation();
          selectEdge(edge.id, e.shiftKey);
        }} />
      
      <path
        d={geo.pathD}
        fill="none"
        stroke={color}
        strokeWidth={isSelected ? 2.5 : edge.style.strokeWidth}
        strokeDasharray={edge.style.strokeDasharray}
        className="pointer-events-none" />
      
    </g>);

};
/** Renders ONLY the arrowhead — used in a layer above nodes */
export const EdgeArrowhead: React.FC<EdgeRendererProps> = ({ edge, nodes }) => {
  const { selectedEdgeIds } = useDiagramStore();
  const isSelected = selectedEdgeIds.includes(edge.id);
  const geo = computeEdgeGeometry(edge, nodes);
  if (!geo) return null;
  const arrowSize = 10;
  const color = isSelected ? '#3b82f6' : edge.style.stroke;
  const { end, angle } = geo;
  const ax1 = end.x - arrowSize * Math.cos(angle - Math.PI / 6);
  const ay1 = end.y - arrowSize * Math.sin(angle - Math.PI / 6);
  const ax2 = end.x - arrowSize * Math.cos(angle + Math.PI / 6);
  const ay2 = end.y - arrowSize * Math.sin(angle + Math.PI / 6);
  return (
    <polygon
      points={`${end.x},${end.y} ${ax1},${ay1} ${ax2},${ay2}`}
      fill={color}
      stroke={color}
      strokeWidth={1}
      className="pointer-events-none" />);


};
interface ConnectionPreviewProps {
  nodes: DiagramNode[];
}
export const ConnectionPreview: React.FC<ConnectionPreviewProps> = ({
  nodes
}) => {
  const { connectingFrom, connectionPreview } = useDiagramStore();
  if (!connectingFrom || !connectionPreview) return null;
  const sourceNode = nodes.find((n) => n.id === connectingFrom.nodeId);
  if (!sourceNode) return null;
  const sourcePort = sourceNode.ports.find(
    (p) => p.id === connectingFrom.portId
  );
  if (!sourcePort) return null;
  const start = getPortPosition(sourceNode, sourcePort);
  return (
    <line
      x1={start.x}
      y1={start.y}
      x2={connectionPreview.x}
      y2={connectionPreview.y}
      stroke="#3b82f6"
      strokeWidth={2}
      strokeDasharray="6 3"
      className="pointer-events-none" />);


};
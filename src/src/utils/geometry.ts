import { DiagramNode, Point, PortDefinition } from '../types/diagram';

export const getPortPosition = (
node: DiagramNode,
port: PortDefinition)
: Point => {
  return {
    x: node.x + port.normalizedX * node.width,
    y: node.y + port.normalizedY * node.height
  };
};

export const isPointInRect = (
point: Point,
rect: {x: number;y: number;width: number;height: number;})
: boolean => {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height);

};

export const snapToGrid = (value: number, gridSize: number): number => {
  return Math.round(value / gridSize) * gridSize;
};

export const distance = (p1: Point, p2: Point): number => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

export const findPortAtPosition = (
nodes: DiagramNode[],
point: Point,
threshold: number = 15)
: {nodeId: string;portId: string;} | null => {
  for (const node of nodes) {
    for (const port of node.ports) {
      const portPos = getPortPosition(node, port);
      if (distance(point, portPos) <= threshold) {
        return { nodeId: node.id, portId: port.id };
      }
    }
  }
  return null;
};

export const findNodeAtPosition = (
nodes: DiagramNode[],
point: Point)
: DiagramNode | null => {
  // Iterate in reverse so topmost (last-drawn) node is found first
  for (let i = nodes.length - 1; i >= 0; i--) {
    const node = nodes[i];
    if (
    point.x >= node.x &&
    point.x <= node.x + node.width &&
    point.y >= node.y &&
    point.y <= node.y + node.height)
    {
      return node;
    }
  }
  return null;
};

export const getPortIdForArrowDirection = (
arrowType: string,
role: 'source' | 'target')
: string => {
  switch (arrowType) {
    case 'arrow-right':
      return role === 'source' ? 'right' : 'left';
    case 'arrow-left':
      return role === 'source' ? 'left' : 'right';
    case 'arrow-up':
      return role === 'source' ? 'top' : 'bottom';
    case 'arrow-down':
      return role === 'source' ? 'bottom' : 'top';
    case 'arrow-bidirectional':
      return role === 'source' ? 'right' : 'left';
    default:
      return role === 'source' ? 'right' : 'left';
  }
};

// Simple orthogonal routing for edges
export const getOrthogonalPath = (start: Point, end: Point): string => {
  const midX = start.x + (end.x - start.x) / 2;
  return `M ${start.x} ${start.y} L ${midX} ${start.y} L ${midX} ${end.y} L ${end.x} ${end.y}`;
};
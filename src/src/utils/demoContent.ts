import { DiagramNode, DiagramEdge } from '../types/diagram';
import { SYMBOL_DEFINITIONS } from '../symbols/definitions';

const defaultStyle = {
  fill: '#ffffff',
  stroke: '#000000',
  strokeWidth: 2,
  fontSize: 14,
  fontColor: '#000000'
};

export const demoNodes: DiagramNode[] = [
{
  id: 'node-v1',
  type: 'voltage-source',
  category: 'electrical',
  x: 150,
  y: 250,
  width: 60,
  height: 60,
  label: 'V1',
  style: { ...defaultStyle },
  ports: SYMBOL_DEFINITIONS['voltage-source'].ports
},
{
  id: 'node-r1',
  type: 'resistor',
  category: 'electrical',
  x: 350,
  y: 260,
  width: 100,
  height: 40,
  label: 'R1',
  style: { ...defaultStyle },
  ports: SYMBOL_DEFINITIONS['resistor'].ports
},
{
  id: 'node-c1',
  type: 'capacitor',
  category: 'electrical',
  x: 370,
  y: 400,
  width: 60,
  height: 60,
  label: 'C1',
  style: { ...defaultStyle },
  ports: SYMBOL_DEFINITIONS['capacitor'].ports
},
{
  id: 'node-sensor',
  type: 'rectangle',
  category: 'general',
  x: 550,
  y: 240,
  width: 120,
  height: 80,
  label: 'Sensor Block',
  style: { ...defaultStyle, fill: '#f0f9ff', stroke: '#0284c7' },
  ports: SYMBOL_DEFINITIONS['rectangle'].ports
},
{
  id: 'node-mcu',
  type: 'rectangle',
  category: 'general',
  x: 750,
  y: 240,
  width: 120,
  height: 80,
  label: 'MCU',
  style: { ...defaultStyle, fill: '#fdf4ff', stroke: '#c026d3' },
  ports: SYMBOL_DEFINITIONS['rectangle'].ports
},
{
  id: 'node-gnd1',
  type: 'ground',
  category: 'electrical',
  x: 380,
  y: 500,
  width: 40,
  height: 50,
  label: 'GND',
  style: { ...defaultStyle },
  ports: SYMBOL_DEFINITIONS['ground'].ports
},
{
  id: 'node-gnd2',
  type: 'ground',
  category: 'electrical',
  x: 790,
  y: 400,
  width: 40,
  height: 50,
  label: 'GND',
  style: { ...defaultStyle },
  ports: SYMBOL_DEFINITIONS['ground'].ports
}];


const edgeStyle = { stroke: '#000000', strokeWidth: 2 };

export const demoEdges: DiagramEdge[] = [
{
  id: 'edge-1',
  sourceNodeId: 'node-v1',
  sourcePortId: 'top',
  targetNodeId: 'node-r1',
  targetPortId: 'left',
  style: { ...edgeStyle }
},
{
  id: 'edge-2',
  sourceNodeId: 'node-r1',
  sourcePortId: 'right',
  targetNodeId: 'node-sensor',
  targetPortId: 'left',
  style: { ...edgeStyle }
},
{
  id: 'edge-3',
  sourceNodeId: 'node-sensor',
  sourcePortId: 'right',
  targetNodeId: 'node-mcu',
  targetPortId: 'left',
  style: { ...edgeStyle }
},
{
  id: 'edge-4',
  sourceNodeId: 'node-c1',
  sourcePortId: 'bottom',
  targetNodeId: 'node-gnd1',
  targetPortId: 'top',
  style: { ...edgeStyle }
},
{
  id: 'edge-5',
  sourceNodeId: 'node-mcu',
  sourcePortId: 'bottom',
  targetNodeId: 'node-gnd2',
  targetPortId: 'top',
  style: { ...edgeStyle }
},
{
  id: 'edge-6',
  sourceNodeId: 'node-v1',
  sourcePortId: 'bottom',
  targetNodeId: 'node-c1',
  targetPortId: 'left',
  style: { ...edgeStyle }
}];
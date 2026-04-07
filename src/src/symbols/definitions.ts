import { SymbolDefinition, PortDefinition } from '../types/diagram';

const createGeneralPorts = (): PortDefinition[] => [
{
  id: 'top',
  label: 'Top',
  position: 'top',
  normalizedX: 0.5,
  normalizedY: 0
},
{
  id: 'right',
  label: 'Right',
  position: 'right',
  normalizedX: 1,
  normalizedY: 0.5
},
{
  id: 'bottom',
  label: 'Bottom',
  position: 'bottom',
  normalizedX: 0.5,
  normalizedY: 1
},
{
  id: 'left',
  label: 'Left',
  position: 'left',
  normalizedX: 0,
  normalizedY: 0.5
}];


export const SYMBOL_DEFINITIONS: Record<string, SymbolDefinition> = {
  // General Symbols
  rectangle: {
    type: 'rectangle',
    category: 'general',
    label: 'Rectangle',
    defaultWidth: 120,
    defaultHeight: 80,
    ports: createGeneralPorts(),
    icon: '<rect x="4" y="8" width="24" height="16" fill="none" stroke="currentColor" stroke-width="2"/>'
  },
  'rounded-rectangle': {
    type: 'rounded-rectangle',
    category: 'general',
    label: 'Rounded Rect',
    defaultWidth: 120,
    defaultHeight: 80,
    ports: createGeneralPorts(),
    icon: '<rect x="4" y="8" width="24" height="16" rx="4" fill="none" stroke="currentColor" stroke-width="2"/>'
  },
  ellipse: {
    type: 'ellipse',
    category: 'general',
    label: 'Ellipse',
    defaultWidth: 120,
    defaultHeight: 80,
    ports: createGeneralPorts(),
    icon: '<ellipse cx="16" cy="16" rx="12" ry="8" fill="none" stroke="currentColor" stroke-width="2"/>'
  },
  diamond: {
    type: 'diamond',
    category: 'general',
    label: 'Diamond',
    defaultWidth: 120,
    defaultHeight: 100,
    ports: createGeneralPorts(),
    icon: '<polygon points="16,4 28,16 16,28 4,16" fill="none" stroke="currentColor" stroke-width="2"/>'
  },
  container: {
    type: 'container',
    category: 'general',
    label: 'Container',
    defaultWidth: 200,
    defaultHeight: 150,
    ports: createGeneralPorts(),
    icon: '<rect x="2" y="4" width="28" height="24" fill="none" stroke="currentColor" stroke-width="2"/><line x1="2" y1="10" x2="30" y2="10" stroke="currentColor" stroke-width="2"/>'
  },
  'arrow-right': {
    type: 'arrow-right',
    category: 'general',
    label: 'Arrow Right',
    defaultWidth: 100,
    defaultHeight: 14,
    ports: [
    {
      id: 'left',
      label: 'Left',
      position: 'left',
      normalizedX: 0,
      normalizedY: 0.5
    },
    {
      id: 'right',
      label: 'Right',
      position: 'right',
      normalizedX: 1,
      normalizedY: 0.5
    }],

    icon: '<path d="M4,16 L24,16 M24,16 L18,10 M24,16 L18,22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  'arrow-left': {
    type: 'arrow-left',
    category: 'general',
    label: 'Arrow Left',
    defaultWidth: 100,
    defaultHeight: 14,
    ports: [
    {
      id: 'left',
      label: 'Left',
      position: 'left',
      normalizedX: 0,
      normalizedY: 0.5
    },
    {
      id: 'right',
      label: 'Right',
      position: 'right',
      normalizedX: 1,
      normalizedY: 0.5
    }],

    icon: '<path d="M28,16 L8,16 M8,16 L14,10 M8,16 L14,22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  'arrow-up': {
    type: 'arrow-up',
    category: 'general',
    label: 'Arrow Up',
    defaultWidth: 14,
    defaultHeight: 100,
    ports: [
    {
      id: 'top',
      label: 'Top',
      position: 'top',
      normalizedX: 0.5,
      normalizedY: 0
    },
    {
      id: 'bottom',
      label: 'Bottom',
      position: 'bottom',
      normalizedX: 0.5,
      normalizedY: 1
    }],

    icon: '<path d="M16,28 L16,8 M16,8 L10,14 M16,8 L22,14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  'arrow-down': {
    type: 'arrow-down',
    category: 'general',
    label: 'Arrow Down',
    defaultWidth: 14,
    defaultHeight: 100,
    ports: [
    {
      id: 'top',
      label: 'Top',
      position: 'top',
      normalizedX: 0.5,
      normalizedY: 0
    },
    {
      id: 'bottom',
      label: 'Bottom',
      position: 'bottom',
      normalizedX: 0.5,
      normalizedY: 1
    }],

    icon: '<path d="M16,4 L16,24 M16,24 L10,18 M16,24 L22,18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  'arrow-bidirectional': {
    type: 'arrow-bidirectional',
    category: 'general',
    label: 'Bidirectional',
    defaultWidth: 100,
    defaultHeight: 14,
    ports: [
    {
      id: 'left',
      label: 'Left',
      position: 'left',
      normalizedX: 0,
      normalizedY: 0.5
    },
    {
      id: 'right',
      label: 'Right',
      position: 'right',
      normalizedX: 1,
      normalizedY: 0.5
    }],

    icon: '<path d="M8,16 L24,16 M8,16 L14,10 M8,16 L14,22 M24,16 L18,10 M24,16 L18,22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },

  // Electrical Symbols
  resistor: {
    type: 'resistor',
    category: 'electrical',
    label: 'Resistor',
    defaultWidth: 100,
    defaultHeight: 40,
    ports: [
    {
      id: 'left',
      label: 'Left',
      position: 'left',
      normalizedX: 0,
      normalizedY: 0.5
    },
    {
      id: 'right',
      label: 'Right',
      position: 'right',
      normalizedX: 1,
      normalizedY: 0.5
    }],

    icon: '<path d="M2,16 L8,16 L10,10 L14,22 L18,10 L22,22 L24,16 L30,16" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>'
  },
  capacitor: {
    type: 'capacitor',
    category: 'electrical',
    label: 'Capacitor',
    defaultWidth: 60,
    defaultHeight: 60,
    ports: [
    {
      id: 'left',
      label: 'Left',
      position: 'left',
      normalizedX: 0,
      normalizedY: 0.5
    },
    {
      id: 'right',
      label: 'Right',
      position: 'right',
      normalizedX: 1,
      normalizedY: 0.5
    }],

    icon: '<path d="M4,16 L14,16 M18,16 L28,16 M14,8 L14,24 M18,8 L18,24" fill="none" stroke="currentColor" stroke-width="2"/>'
  },
  'voltage-source': {
    type: 'voltage-source',
    category: 'electrical',
    label: 'Voltage Source',
    defaultWidth: 60,
    defaultHeight: 60,
    ports: [
    {
      id: 'top',
      label: 'Top',
      position: 'top',
      normalizedX: 0.5,
      normalizedY: 0
    },
    {
      id: 'bottom',
      label: 'Bottom',
      position: 'bottom',
      normalizedX: 0.5,
      normalizedY: 1
    }],

    icon: '<circle cx="16" cy="16" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16,10 L16,14 M14,12 L18,12 M14,20 L18,20" fill="none" stroke="currentColor" stroke-width="1.5"/>'
  },
  ground: {
    type: 'ground',
    category: 'electrical',
    label: 'Ground',
    defaultWidth: 40,
    defaultHeight: 50,
    ports: [
    {
      id: 'top',
      label: 'Top',
      position: 'top',
      normalizedX: 0.5,
      normalizedY: 0
    }],

    icon: '<path d="M16,4 L16,16 M8,16 L24,16 M11,20 L21,20 M14,24 L18,24" fill="none" stroke="currentColor" stroke-width="2"/>'
  }
};
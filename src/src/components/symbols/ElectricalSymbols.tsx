import React from 'react';
import { DiagramNode } from '../../types/diagram';
interface SymbolProps {
  node: DiagramNode;
}
export const ResistorShape: React.FC<SymbolProps> = ({ node }) => {
  const { width, height, style } = node;
  const cy = height / 2;
  const step = width / 6;
  const amp = height / 3;
  const d = `M 0 ${cy} L ${step} ${cy} L ${step * 1.5} ${cy - amp} L ${step * 2.5} ${cy + amp} L ${step * 3.5} ${cy - amp} L ${step * 4.5} ${cy + amp} L ${step * 5} ${cy} L ${width} ${cy}`;
  return (
    <path
      d={d}
      fill="none"
      stroke={style.stroke}
      strokeWidth={style.strokeWidth}
      strokeLinejoin="round" />);


};
export const CapacitorShape: React.FC<SymbolProps> = ({ node }) => {
  const { width, height, style } = node;
  const cx = width / 2;
  const cy = height / 2;
  const gap = width * 0.15;
  const plateHeight = height * 0.6;
  return (
    <g>
      <line
        x1={0}
        y1={cy}
        x2={cx - gap}
        y2={cy}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth} />
      
      <line
        x1={cx + gap}
        y1={cy}
        x2={width}
        y2={cy}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth} />
      
      <line
        x1={cx - gap}
        y1={cy - plateHeight / 2}
        x2={cx - gap}
        y2={cy + plateHeight / 2}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth} />
      
      <line
        x1={cx + gap}
        y1={cy - plateHeight / 2}
        x2={cx + gap}
        y2={cy + plateHeight / 2}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth} />
      
    </g>);

};
export const VoltageSourceShape: React.FC<SymbolProps> = ({ node }) => {
  const { width, height, style } = node;
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(width, height) * 0.4;
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth} />
      
      {/* Plus */}
      <line
        x1={cx}
        y1={cy - r * 0.6}
        x2={cx}
        y2={cy - r * 0.2}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth} />
      
      <line
        x1={cx - r * 0.2}
        y1={cy - r * 0.4}
        x2={cx + r * 0.2}
        y2={cy - r * 0.4}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth} />
      
      {/* Minus */}
      <line
        x1={cx - r * 0.2}
        y1={cy + r * 0.4}
        x2={cx + r * 0.2}
        y2={cy + r * 0.4}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth} />
      
      {/* Leads */}
      <line
        x1={cx}
        y1={0}
        x2={cx}
        y2={cy - r}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth} />
      
      <line
        x1={cx}
        y1={cy + r}
        x2={cx}
        y2={height}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth} />
      
    </g>);

};
export const GroundShape: React.FC<SymbolProps> = ({ node }) => {
  const { width, height, style } = node;
  const cx = width / 2;
  const cy = height * 0.4;
  return (
    <g>
      <line
        x1={cx}
        y1={0}
        x2={cx}
        y2={cy}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth} />
      
      <line
        x1={cx - width * 0.4}
        y1={cy}
        x2={cx + width * 0.4}
        y2={cy}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth} />
      
      <line
        x1={cx - width * 0.25}
        y1={cy + height * 0.2}
        x2={cx + width * 0.25}
        y2={cy + height * 0.2}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth} />
      
      <line
        x1={cx - width * 0.1}
        y1={cy + height * 0.4}
        x2={cx + width * 0.1}
        y2={cy + height * 0.4}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth} />
      
    </g>);

};
export const ElectricalSymbolRenderer: React.FC<SymbolProps> = ({ node }) => {
  switch (node.type) {
    case 'resistor':
      return <ResistorShape node={node} />;
    case 'capacitor':
      return <CapacitorShape node={node} />;
    case 'voltage-source':
      return <VoltageSourceShape node={node} />;
    case 'ground':
      return <GroundShape node={node} />;
    default:
      return <ResistorShape node={node} />;
  }
};
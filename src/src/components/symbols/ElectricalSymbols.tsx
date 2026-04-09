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
export const RadioShape: React.FC<SymbolProps> = ({ node }) => {
  const { width, height, style } = node;
  const cx = width / 2;
  // Antenna mast from top to body center
  const bodyY = height * 0.45;
  const bodyR = Math.min(width, height) * 0.2;
  // Wave arcs on the right side
  const arcR1 = bodyR + width * 0.15;
  const arcR2 = bodyR + width * 0.3;
  return (
    <g>
      {/* Antenna mast */}
      <line
        x1={cx}
        y1={0}
        x2={cx}
        y2={bodyY - bodyR}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth} />
      
      {/* Antenna crossbar */}
      <line
        x1={cx - width * 0.2}
        y1={height * 0.08}
        x2={cx + width * 0.2}
        y2={height * 0.08}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth} />
      
      {/* Body circle */}
      <circle
        cx={cx}
        cy={bodyY}
        r={bodyR}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth} />
      
      {/* Lead from body to bottom */}
      <line
        x1={cx}
        y1={bodyY + bodyR}
        x2={cx}
        y2={height}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth} />
      
      {/* Radio wave arc 1 */}
      <path
        d={`M ${cx + arcR1 * 0.7},${bodyY - arcR1 * 0.7} A ${arcR1},${arcR1} 0 0,1 ${cx + arcR1 * 0.7},${bodyY + arcR1 * 0.7}`}
        fill="none"
        stroke={style.stroke}
        strokeWidth={style.strokeWidth * 0.75} />
      
      {/* Radio wave arc 2 */}
      <path
        d={`M ${cx + arcR2 * 0.7},${bodyY - arcR2 * 0.7} A ${arcR2},${arcR2} 0 0,1 ${cx + arcR2 * 0.7},${bodyY + arcR2 * 0.7}`}
        fill="none"
        stroke={style.stroke}
        strokeWidth={style.strokeWidth * 0.75} />
      
    </g>);

};
export const MonocellBatteryShape: React.FC<SymbolProps> = ({ node }) => {
  const { width, height, style } = node;
  const cx = width / 2;
  const cy = height / 2;
  const longPlateW = width * 0.7;
  const shortPlateW = width * 0.35;
  const gap = height * 0.08;
  return (
    <g>
      {/* Top lead */}
      <line
        x1={cx}
        y1={0}
        x2={cx}
        y2={cy - gap}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth} />
      
      {/* Long plate (positive) */}
      <line
        x1={cx - longPlateW / 2}
        y1={cy - gap}
        x2={cx + longPlateW / 2}
        y2={cy - gap}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth} />
      
      {/* Short plate (negative) */}
      <line
        x1={cx - shortPlateW / 2}
        y1={cy + gap}
        x2={cx + shortPlateW / 2}
        y2={cy + gap}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth + 1} />
      
      {/* Bottom lead */}
      <line
        x1={cx}
        y1={cy + gap}
        x2={cx}
        y2={height}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth} />
      
      {/* Plus indicator */}
      <line
        x1={cx + longPlateW / 2 + 3}
        y1={cy - gap - 4}
        x2={cx + longPlateW / 2 + 3}
        y2={cy - gap + 4}
        stroke={style.stroke}
        strokeWidth={1} />
      
      <line
        x1={cx + longPlateW / 2 - 1}
        y1={cy - gap}
        x2={cx + longPlateW / 2 + 7}
        y2={cy - gap}
        stroke={style.stroke}
        strokeWidth={1} />
      
    </g>);

};
export const MulticellBatteryShape: React.FC<SymbolProps> = ({ node }) => {
  const { width, height, style } = node;
  const cx = width / 2;
  const cellCount = 3;
  const longPlateW = width * 0.7;
  const shortPlateW = width * 0.35;
  const cellSpacing = height * 0.12;
  const totalCellHeight = cellCount * cellSpacing * 2;
  const startY = (height - totalCellHeight) / 2;
  return (
    <g>
      {/* Top lead */}
      <line
        x1={cx}
        y1={0}
        x2={cx}
        y2={startY}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth} />
      
      {/* Cells */}
      {Array.from({
        length: cellCount
      }).map((_, i) => {
        const cellY = startY + i * cellSpacing * 2;
        return (
          <g key={i}>
            {/* Long plate (positive) */}
            <line
              x1={cx - longPlateW / 2}
              y1={cellY}
              x2={cx + longPlateW / 2}
              y2={cellY}
              stroke={style.stroke}
              strokeWidth={style.strokeWidth} />
            
            {/* Short plate (negative) */}
            <line
              x1={cx - shortPlateW / 2}
              y1={cellY + cellSpacing}
              x2={cx + shortPlateW / 2}
              y2={cellY + cellSpacing}
              stroke={style.stroke}
              strokeWidth={style.strokeWidth + 1} />
            
            {/* Connector between cells */}
            {i < cellCount - 1 &&
            <line
              x1={cx}
              y1={cellY + cellSpacing}
              x2={cx}
              y2={cellY + cellSpacing * 2}
              stroke={style.stroke}
              strokeWidth={style.strokeWidth} />

            }
          </g>);

      })}
      {/* Bottom lead */}
      <line
        x1={cx}
        y1={startY + (cellCount - 1) * cellSpacing * 2 + cellSpacing}
        x2={cx}
        y2={height}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth} />
      
      {/* Plus indicator at top */}
      <line
        x1={cx + longPlateW / 2 + 3}
        y1={startY - 4}
        x2={cx + longPlateW / 2 + 3}
        y2={startY + 4}
        stroke={style.stroke}
        strokeWidth={1} />
      
      <line
        x1={cx + longPlateW / 2 - 1}
        y1={startY}
        x2={cx + longPlateW / 2 + 7}
        y2={startY}
        stroke={style.stroke}
        strokeWidth={1} />
      
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
    case 'radio':
      return <RadioShape node={node} />;
    case 'monocell-battery':
      return <MonocellBatteryShape node={node} />;
    case 'multicell-battery':
      return <MulticellBatteryShape node={node} />;
    default:
      return <ResistorShape node={node} />;
  }
};
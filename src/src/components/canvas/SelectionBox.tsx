import React from 'react';
interface SelectionBoxProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}
export const SelectionBox: React.FC<SelectionBoxProps> = ({
  startX,
  startY,
  endX,
  endY
}) => {
  const x = Math.min(startX, endX);
  const y = Math.min(startY, endY);
  const w = Math.abs(endX - startX);
  const h = Math.abs(endY - startY);
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      fill="rgba(59, 130, 246, 0.08)"
      stroke="#3b82f6"
      strokeWidth={1}
      strokeDasharray="4 2"
      className="pointer-events-none" />);


};
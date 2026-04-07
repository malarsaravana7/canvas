import React from 'react';
import { DiagramNode } from '../../types/diagram';
interface SymbolProps {
  node: DiagramNode;
}
export const RectangleShape: React.FC<SymbolProps> = ({ node }) => {
  const { width, height, style } = node;
  return (
    <rect
      width={width}
      height={height}
      fill={style.fill}
      stroke={style.stroke}
      strokeWidth={style.strokeWidth}
      rx={node.type === 'rounded-rectangle' ? 12 : 0} />);


};
export const EllipseShape: React.FC<SymbolProps> = ({ node }) => {
  const { width, height, style } = node;
  return (
    <ellipse
      cx={width / 2}
      cy={height / 2}
      rx={width / 2}
      ry={height / 2}
      fill={style.fill}
      stroke={style.stroke}
      strokeWidth={style.strokeWidth} />);


};
export const DiamondShape: React.FC<SymbolProps> = ({ node }) => {
  const { width, height, style } = node;
  const points = `${width / 2},0 ${width},${height / 2} ${width / 2},${height} 0,${height / 2}`;
  return (
    <polygon
      points={points}
      fill={style.fill}
      stroke={style.stroke}
      strokeWidth={style.strokeWidth} />);


};
export const ContainerShape: React.FC<SymbolProps> = ({ node }) => {
  const { width, height, style } = node;
  return (
    <g>
      <rect
        width={width}
        height={height}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth} />
      
      <line
        x1={0}
        y1={24}
        x2={width}
        y2={24}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth} />
      
    </g>);

};
export const ArrowRightShape: React.FC<SymbolProps> = ({ node }) => {
  const { width, height, style } = node;
  const cy = height / 2;
  const headSize = Math.min(height * 0.8, width * 0.15);
  return (
    <path
      d={`M 0 ${cy} L ${width - headSize} ${cy} M ${width - headSize} ${cy - headSize} L ${width} ${cy} L ${width - headSize} ${cy + headSize}`}
      fill="none"
      stroke={style.stroke}
      strokeWidth={style.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round" />);


};
export const ArrowLeftShape: React.FC<SymbolProps> = ({ node }) => {
  const { width, height, style } = node;
  const cy = height / 2;
  const headSize = Math.min(height * 0.8, width * 0.15);
  return (
    <path
      d={`M ${width} ${cy} L ${headSize} ${cy} M ${headSize} ${cy - headSize} L 0 ${cy} L ${headSize} ${cy + headSize}`}
      fill="none"
      stroke={style.stroke}
      strokeWidth={style.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round" />);


};
export const ArrowUpShape: React.FC<SymbolProps> = ({ node }) => {
  const { width, height, style } = node;
  const cx = width / 2;
  const headSize = Math.min(width * 0.8, height * 0.15);
  return (
    <path
      d={`M ${cx} ${height} L ${cx} ${headSize} M ${cx - headSize} ${headSize} L ${cx} 0 L ${cx + headSize} ${headSize}`}
      fill="none"
      stroke={style.stroke}
      strokeWidth={style.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round" />);


};
export const ArrowDownShape: React.FC<SymbolProps> = ({ node }) => {
  const { width, height, style } = node;
  const cx = width / 2;
  const headSize = Math.min(width * 0.8, height * 0.15);
  return (
    <path
      d={`M ${cx} 0 L ${cx} ${height - headSize} M ${cx - headSize} ${height - headSize} L ${cx} ${height} L ${cx + headSize} ${height - headSize}`}
      fill="none"
      stroke={style.stroke}
      strokeWidth={style.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round" />);


};
export const ArrowBidirectionalShape: React.FC<SymbolProps> = ({ node }) => {
  const { width, height, style } = node;
  const cy = height / 2;
  const headSize = Math.min(height * 0.8, width * 0.15);
  return (
    <path
      d={`M ${headSize} ${cy} L ${width - headSize} ${cy} M ${headSize} ${cy - headSize} L 0 ${cy} L ${headSize} ${cy + headSize} M ${width - headSize} ${cy - headSize} L ${width} ${cy} L ${width - headSize} ${cy + headSize}`}
      fill="none"
      stroke={style.stroke}
      strokeWidth={style.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round" />);


};
export const GeneralSymbolRenderer: React.FC<SymbolProps> = ({ node }) => {
  switch (node.type) {
    case 'rectangle':
    case 'rounded-rectangle':
      return <RectangleShape node={node} />;
    case 'ellipse':
      return <EllipseShape node={node} />;
    case 'diamond':
      return <DiamondShape node={node} />;
    case 'container':
      return <ContainerShape node={node} />;
    case 'arrow-right':
      return <ArrowRightShape node={node} />;
    case 'arrow-left':
      return <ArrowLeftShape node={node} />;
    case 'arrow-up':
      return <ArrowUpShape node={node} />;
    case 'arrow-down':
      return <ArrowDownShape node={node} />;
    case 'arrow-bidirectional':
      return <ArrowBidirectionalShape node={node} />;
    default:
      return <RectangleShape node={node} />;
  }
};
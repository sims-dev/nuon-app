import React from 'react';
import GraduationCapSvg from '../assets/icons/graduation-cap.svg';

export default function GraduationCapIcon({ width = 34, height = 34, color = '#FFFFFF' }) {
  return React.createElement(GraduationCapSvg, { width, height, fill: color, stroke: color });
}

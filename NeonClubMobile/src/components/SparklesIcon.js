import React from 'react';
import SparklesSvg from '../assets/icons/sparkles.svg';

export default function SparklesIcon({ width = 34, height = 34, color = '#FFFFFF' }) {
  return React.createElement(SparklesSvg, { width, height, fill: 'none', stroke: color });
}

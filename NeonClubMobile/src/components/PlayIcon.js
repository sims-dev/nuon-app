import React from 'react';
import PlaySvg from '../assets/icons/play.svg';

export default function PlayIcon({ width = 34, height = 34, color = '#FFFFFF' }) {
  return React.createElement(PlaySvg, { width, height, fill: 'none', stroke: color });
}

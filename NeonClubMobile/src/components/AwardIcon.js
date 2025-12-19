import React from 'react';
import AwardSvg from '../assets/icons/award.svg';

export default function AwardIcon({ width = 34, height = 34, color = '#FFFFFF' }) {
  return React.createElement(AwardSvg, { width, height, fill: 'none', stroke: color });
}

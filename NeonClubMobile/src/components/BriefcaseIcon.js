import React from 'react';
import BriefcaseSvg from '../assets/icons/briefcase.svg';

export default function BriefcaseIcon({ width = 34, height = 34, color = '#FFFFFF' }) {
  return React.createElement(BriefcaseSvg, { width, height, fill: 'none', stroke: color });
}

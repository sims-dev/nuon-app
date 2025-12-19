import React from 'react';
import GiftSvg from '../assets/icons/gift.svg';

export default function GiftIcon({ width = 34, height = 34, color = '#FFFFFF' }) {
  return React.createElement(GiftSvg, { width, height, fill: 'none', stroke: color });
}

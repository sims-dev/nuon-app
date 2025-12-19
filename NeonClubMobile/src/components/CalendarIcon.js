import React from 'react';
import CalendarSvg from '../assets/icons/calendar.svg';

export default function CalendarIcon({ width = 34, height = 34, color = '#FFFFFF' }) {
  return React.createElement(CalendarSvg, { width, height, fill: 'none', stroke: color });
}

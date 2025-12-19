import React from 'react';
import UsersSvg from '../assets/icons/users.svg';

export default function UsersIcon({ width = 34, height = 34, color = '#FFFFFF' }) {
  return React.createElement(UsersSvg, { width, height, fill: 'none', stroke: color });
}

import React from 'react';
import UserSvg from '../assets/icons/user.svg';

export default function UserIcon({ width = 34, height = 34, color = '#FFFFFF' }) {
  return React.createElement(UserSvg, { width, height, fill: 'none', stroke: color });
}

import React from 'react';
import NeonCard from './NeonCard';

const Card = ({ children, style, className }) => {
  return <NeonCard style={style}>{children}</NeonCard>;
};

const CardContent = ({ children, style }) => {
  return <NeonCard style={style}>{children}</NeonCard>;
};

export { Card, CardContent };
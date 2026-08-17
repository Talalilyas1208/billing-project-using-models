import React from 'react';
import { Card } from 'antd';

export default function CardComponent({ children, style, ...rest }) {
  return (
    <Card style={style} {...rest}>
      {children}
    </Card>
  );
}

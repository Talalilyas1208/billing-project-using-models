import React from 'react';
import { Col, Input } from 'antd';

export default function Invoicecol() {
  return (
    <Col span={20}>
      <Input placeholder="Additional detail..." size="large" />
    </Col>
  );
}

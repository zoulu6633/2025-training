import React from 'react';
import { useParams } from 'react-router-dom';

function ProductDetail() {
  const { id } = useParams();
  return <h3>商品详情：{id}</h3>;
}

export default ProductDetail;
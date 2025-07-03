import React from 'react';
import { Link } from 'react-router-dom';

function Products() {
  return (
    <div>
      <h2>商品列表</h2>
      <ul>
        <li>
          <Link to="/products/1">商品1</Link>
        </li>
        <li>
          <Link to="/products/2">商品2</Link>
        </li>
      </ul>
    </div>
  );
}

export default Products;
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <nav>
        <Link to="/products">商品列表</Link> |{' '}
        <Link to="/profile">用户中心</Link>
      </nav>
    </div>
  );
}

export default Home;
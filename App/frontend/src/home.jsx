import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

function Home() {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`搜索：${keyword}`);
  };

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  return (
    <div>
      {/* 搜索框 */}
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="搜索商品"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          style={{ padding: '0.5rem', fontSize: '1rem', width: '240px' }}
        />
        <button type="submit">搜索</button>
      </form>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* 左侧分类 */}
        <aside>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li><button onClick={() => handleCategoryClick('数码产品')}>数码产品</button></li>
            <li><button onClick={() => handleCategoryClick('服饰鞋包')}>服饰鞋包</button></li>
            <li><button onClick={() => handleCategoryClick('家居生活')}>家居生活</button></li>
            <li><button onClick={() => handleCategoryClick('美妆个护')}>美妆个护</button></li>
          </ul>
        </aside>
        {/* 右侧内容区（嵌套路由出口） */}
        <main style={{ flex: 1, paddingLeft: '2rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Home;
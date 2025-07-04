import { useLocation } from 'react-router-dom';

function Products() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get('category');

  return (
    <div>
      <h2>商品列表</h2>
      {category && <div>当前分类：{category}</div>}
      {/* 根据 category 展示不同商品 */}
    </div>
  );
}

export default Products;
import React, { useEffect, useState } from "react";
import api from "./api";

const categories = [
  { c_id: "", c_name: "全部" },
  { c_id: "1", c_name: "数码产品" },
  { c_id: "2", c_name: "家居生活" },
  { c_id: "3", c_name: "美食饮品" },
  // ...可根据实际分类扩展
];

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [msg, setMsg] = useState("");
  const [selected, setSelected] = useState("");

  const fetchProducts = (c_id = "") => {
    const url = c_id ? `/shop/search?c_id=${c_id}` : "/shop/search";
    api.get(url)
      .then(res => setProducts(res.data.data))
      .catch(err => setMsg("获取失败：" + (err.response?.data?.message || err.message)));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCategory = (c_id) => {
    setSelected(c_id);
    fetchProducts(c_id);
  };

  return (
    <div>
      <h2>商品列表</h2>
      <div style={{ marginBottom: 16 }}>
        {categories.map(cat => (
          <button
            key={cat.c_id}
            style={{ marginRight: 8, background: selected === cat.c_id ? "#1890ff" : "#eee", color: selected === cat.c_id ? "#fff" : "#000" }}
            onClick={() => handleCategory(cat.c_id)}
          >
            {cat.c_name}
          </button>
        ))}
      </div>
      {msg && <div style={{ color: "red" }}>{msg}</div>}
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th><th>名称</th><th>价格</th><th>库存</th><th>卖家</th><th>分类</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.product_id}>
              <td>{p.product_id}</td>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.stock}</td>
              <td>{p.seller?.name || p.seller_id}</td>
              <td>{p.category?.c_name || p.c_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
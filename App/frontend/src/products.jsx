import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "./api";

const categories = [
  { c_id: "", c_name: "全部" },
  { c_id: "1", c_name: "数码产品" },
  { c_id: "2", c_name: "家居生活" },
  { c_id: "3", c_name: "美食饮品" },
  { c_id: "4", c_name: "美妆护肤" },
];

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [msg, setMsg] = useState("");
  const [selected, setSelected] = useState("");
  const [search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const fetchProducts = (c_id = "", keyword = "") => {
    let url = c_id ? `/shop/search/category/${c_id}` : "/shop/search";
    if (keyword) url += `?keyword=${encodeURIComponent(keyword)}`;
    api.get(url)
      .then(res => setProducts(res.data.data))
      .catch(err => setMsg("获取失败：" + (err.response?.data?.message || err.message)));
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category") || "";
    setSelected(category);
    fetchProducts(category);
  }, [location.search]);


  return (
    <div className="page-content">
      {/* 左侧分类栏 */}
      <div className="category-bar">
        {categories.map(cat => (
          <button
            key={cat.c_id}
            className={selected === cat.c_id ? "selected" : ""}
            onClick={() => {
              setSelected(cat.c_id);
              setSearch(""); // 新增
              fetchProducts(cat.c_id, "");
            }}
          >
            {cat.c_name}
          </button>
        ))}
      </div>
      {/* 右侧商品表格 */}
      <div className="product-table-container">
        <h2>商品列表</h2>
        {msg && <div style={{ color: "red", marginBottom: 16 }}>{msg}</div>}
        <form
          style={{ display: "flex", alignItems: "center", marginBottom: 20 }}
          onSubmit={e => { e.preventDefault(); fetchProducts(selected, search); }}
        >
          <input
            type="text"
            placeholder="输入商品名称搜索"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              height: 36,
              fontSize: 16,
              borderRadius: 6,
              border: "1px solid #e0e6ed",
              padding: "0 12px",
              marginRight: 12,
              width: 220
            }}
          />
          <button
            type="submit"
            style={{
              height: 36,
              padding: "0 20px",
              background: "#5b86e5",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              fontSize: 16,
              cursor: "pointer"
            }}
          >搜索</button>
        </form>
        <table className="product-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>名称</th>
              <th>价格</th>
              <th>库存</th>
              <th>卖家</th>
              <th>分类</th>
              <th>操作</th>
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
                <td>
                  <button
                    style={{
                      padding: "6px 16px",
                      background: "#5b86e5",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer"
                    }}
                    onClick={() => navigate(`/product/${p.product_id}`)}
                  >详情</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>     
    </div>
  );
}
import React, { useState } from "react";
import api from "./api";

export default function AddProduct() {
  const [form, setForm] = useState({
    product_id: "",
    name: "",
    price: "",
    seller_id: "",
    stock: "",
    c_id: ""
  });
  const [msg, setMsg] = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post("/shop/add", form);
      setMsg("添加成功");
    } catch (err) {
      setMsg("添加失败：" + (err.response?.data?.message || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>添加商品</h2>
      <input name="product_id" placeholder="商品ID" value={form.product_id} onChange={handleChange} required /><br />
      <input name="name" placeholder="名称" value={form.name} onChange={handleChange} required /><br />
      <input name="price" type="number" placeholder="价格" value={form.price} onChange={handleChange} required /><br />
      <input name="seller_id" type="number" placeholder="卖家ID" value={form.seller_id} onChange={handleChange} required /><br />
      <input name="stock" type="number" placeholder="库存" value={form.stock} onChange={handleChange} required /><br />
      <input name="c_id" placeholder="分类ID" value={form.c_id} onChange={handleChange} required /><br />
      <button type="submit">添加</button>
      <div style={{ color: "red" }}>{msg}</div>
    </form>
  );
}
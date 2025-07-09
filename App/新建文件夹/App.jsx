import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import ProductList from "./ProductList";
import AddProduct from "./AddProduct";
import OrderList from "./OrderList";

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: 16, background: "#eee" }}>
        <Link to="/">商品</Link> | <Link to="/add">添加商品</Link> | <Link to="/orders">订单</Link> | <Link to="/login">登录</Link> | <Link to="/register">注册</Link>
      </nav>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/add" element={<AddProduct />} />
        <Route path="/orders" element={<OrderList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
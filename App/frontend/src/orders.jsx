import React, { useEffect, useState } from "react";
import api from "./api";

export default function Orders() { 
  const [orders, setOrders] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get("/order/")
      .then(res => {
        const data = Array.isArray(res.data?.data) ? res.data.data : [];
        setOrders(data);
      })
      .catch(err => setMsg("获取订单失败：" + (err.response?.data?.message || err.message)));
  }, []);

  return (
    <div className="page-content">
      <div className="category-bar" style={{ visibility: "hidden" }}>
        {/* 占位，保持与商品页一致 */}
      </div>
      <div className="product-table-container">
        <h2>我的订单</h2>
        {msg && <div style={{ color: "red", marginBottom: 16 }}>{msg}</div>}
        <table className="product-table">
          <thead>
            <tr>
              <th>订单号</th>
              <th>商品</th>
              <th>数量</th>
              <th>总价</th>
              <th>下单时间</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: 16 }}>暂无订单</td></tr>
            ) : (
              orders.map(o => (
                <tr key={o.order_id}>
                  <td>{o.order_id}</td>
                  <td>{o.product?.name || o.product_id}</td>
                  <td>{o.quantity}</td>
                  <td>{o.total_price}</td>
                  <td>{o.created_at ? new Date(o.created_at).toLocaleString() : ""}</td>
                  <td>{o.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
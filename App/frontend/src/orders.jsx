import React, { useEffect, useState } from "react";
import api from "./api";
import "./styles.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get("/order/")
      .then(res => setOrders(res.data.data || []))
      .catch(() => setMsg("获取订单失败"));
  }, []);

  return (
    <div className="page-content">
      <div className="product-table-container">
        <h2>我的订单</h2>
        {msg && <div className={msg.includes("失败") ? "msg-error" : "msg-success"}>{msg}</div>}
        <table className="product-table">
          <thead>
            <tr>
              <th>订单号</th>
              <th>商品</th>
              <th>数量</th>
              <th>总价</th>
              <th>收货地址</th>
              <th>电话</th>
              <th>状态</th>
              <th>下单时间</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: 16 }}>暂无订单</td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.order_id}>
                  <td>{order.order_id}</td>
                  <td>{order.product?.name || order.product_id}</td>
                  <td>{order.quantity}</td>
                  <td>¥{order.total_price}</td>
                  <td>{order.address}</td>
                  <td>{order.phone}</td>
                  <td>
                    <span className={`status-badge ${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{order.created_at}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
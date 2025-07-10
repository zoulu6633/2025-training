import React, { useState, useEffect } from 'react';
import api from './api.jsx';
import "./styles.css";

const statusMap = {
  pending: { label: '待处理', variant: 'secondary' },
  confirmed: { label: '已确认', variant: 'default' },
  shipped: { label: '已发货', variant: 'default' },
  delivered: { label: '已送达', variant: 'default' },
  cancelled: { label: '已取消', variant: 'destructive' }
};

const statusOptions = [
  { value: '待处理', label: '待处理' },
  { value: '已确认', label: '已确认' },
  { value: '已发货', label: '已发货' },
  { value: '已送达', label: '已送达' },
  { value: '已取消', label: '已取消' }
];


export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [msg, setMsg] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditStatusDialogOpen, setIsEditStatusDialogOpen] = useState(false);
  const [editStatus, setEditStatus] = useState('');


const fetchSellerOrders = async () => {
  try {
    const res = await api.get("/order/seller");
    const data = Array.isArray(res.data?.data) ? res.data.data : [];
    setOrders(data);
  } catch (err) {
    setMsg("获取订单失败：" + (err.response?.data?.message || err.message));
  }
};

// 在 useEffect 中调用
useEffect(() => {
  fetchSellerOrders();
}, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('zh-CN');
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      await api.put(`/order/${selectedOrder.order_id}/status`, {
        status: newStatus
      });
      setMsg("订单状态更新成功");
      setIsDialogOpen(false);
      fetchSellerOrders();
    } catch (err) {
      setMsg("更新失败：" + (err.response?.data?.message || err.message));
    }
  };

  const handleUpdateOrderStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder || !editStatus) return;

    try {
      await api.put(`/order/${selectedOrder.order_id}/status`, {
        status: editStatus
      });
      setMsg("订单状态更新成功");
      setIsEditStatusDialogOpen(false);
      fetchSellerOrders();
    } catch (err) {
      setMsg("更新失败：" + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="page-content">
      <div className="category-bar" style={{ visibility: "hidden" }}></div>
      <div className="product-table-container">
        <h2>卖家订单管理</h2>
        {msg && <div className={msg.includes("失败") ? "msg-error" : "msg-success"}>{msg}</div>}
        <table className="product-table">
          <thead>
            <tr>
              <th>订单号</th>
              <th>商品</th>
              <th>买家</th>
              <th>数量</th>
              <th>总价</th>
              <th>下单时间</th>
              <th>收货地址</th>
              <th>电话</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: "center", padding: 16 }}>暂无订单</td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.order_id}>
                  <td>{order.order_id}</td>
                  <td>
                    {order.product?.name || order.product_id}
                    {order.product_id && <div className="text-sm text-gray-500">ID: {order.product_id}</div>}
                  </td>
                  <td>{order.user?.name || order.user_id}</td>
                  <td>{order.quantity}</td>
                  <td>¥{order.total_price}</td>
                  <td>{formatDate(order.created_at)}</td>
                  <td>{order.address}</td>
                  <td>{order.phone}</td>
                  <td>
                    <span className={`status-badge ${order.status}`}>
                      {statusMap[order.status]?.label || order.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => {
                        setSelectedOrder(order);
                        setNewStatus(order.status);
                        setIsDialogOpen(true);
                      }}
                    >
                      修改状态
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {isDialogOpen && (
        <div className="dialog-mask">
          <form onSubmit={handleUpdateOrderStatus} className="dialog-content">
            <h3 className="dialog-title">修改订单状态</h3>
            <select name="status" value={editStatus} onChange={e => setEditStatus(e.target.value)} required className="form-input">
              <option value="">请选择状态</option>
              <option value="待处理">待处理</option>
              <option value="已发货">已发货</option>
              <option value="已完成">已完成</option>
              <option value="已取消">已取消</option>
            </select>
            <div className="dialog-actions">
              <button type="button" onClick={() => setIsDialogOpen(false)} className="btn-cancel">取消</button>
              <button type="submit" className="btn-confirm">保存</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
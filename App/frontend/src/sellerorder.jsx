import React, { useState, useEffect } from 'react';
import api from './api.jsx';

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
      <div className="category-bar" style={{ visibility: "hidden" }}>
        {/* 占位，保持与商品页一致 */}
      </div>
      <div className="product-table-container">
        <h2>卖家订单管理</h2>
        {msg && <div style={{ color: msg.includes("失败") ? "red" : "green", marginBottom: 16 }}>{msg}</div>}
        
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

      {/* 编辑状态对话框 */}
      {isDialogOpen && (
        <div
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <form
            onSubmit={handleUpdateOrderStatus}
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: "32px 32px 24px 32px",
              minWidth: 340,
              boxShadow: "0 6px 32px #5b86e533",
              display: "flex",
              flexDirection: "column",
              gap: 18,
              alignItems: "stretch",
            }}
          >
            <h3 style={{
              margin: 0,
              marginBottom: 12,
              fontWeight: 700,
              fontSize: 22,
              color: "#5b86e5",
              textAlign: "center"
            }}>修改订单状态</h3>
            <select
              name="status"
              value={editStatus}
              onChange={e => setEditStatus(e.target.value)}
              required
              style={{
                padding: "10px 12px",
                borderRadius: 7,
                border: "1.5px solid #e0e6ed",
                fontSize: 15,
              }}
            >
              <option value="">请选择状态</option>
              <option value="待处理">待处理</option>
              <option value="已发货">已发货</option>
              <option value="已完成">已完成</option>
              <option value="已取消">已取消</option>
            </select>
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: 7,
                  border: "none",
                  background: "#e0e6ed",
                  color: "#333",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer"
                }}
              >取消</button>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: 7,
                  border: "none",
                  background: "linear-gradient(90deg, #36d1c4 0%, #5b86e5 100%)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer"
                }}
              >保存</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
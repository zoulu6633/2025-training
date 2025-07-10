import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "./api";
import "./styles.css";

const backendUrl = "http://localhost:8080";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [msg, setMsg] = useState("");
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [showAddrDialog, setShowAddrDialog] = useState(false);
  const [selectedAddrId, setSelectedAddrId] = useState(null);

  useEffect(() => {
    api.get(`/shop/search/product/${id}`)
      .then(res => setProduct(res.data.data))
      .catch(err => setMsg("获取商品详情失败：" + (err.response?.data?.message || err.message)));
  }, [id]);

  useEffect(() => {
    api.get('/user/profile').then(res => {
      setAddresses(res.data.data.addresses || []);
    });
  }, []);

  if (msg) return <div style={{ color: "red", margin: 32 }}>{msg}</div>;
  if (!product) return <div style={{ margin: 32 }}>加载中...</div>;

  console.log("product.image_url:", product.image_url, product);

  return (
    <div className="page-content" style={{ maxWidth: 700, margin: "40px auto", background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px #e0e6ed", padding: 40, display: "flex", gap: 32, alignItems: "flex-start" }}>
      {/* 商品图片 */}
      <div style={{ flex: "0 0 260px", textAlign: "center" }}>
        <img
          src={backendUrl + product.image_url}
          alt={product.name}
          onError={e => { e.target.src = "/default.png"; }}
          style={{ width: 240, height: 240, objectFit: "cover", borderRadius: 12, background: "#f6f8fa", marginBottom: 12 }}
        />
        <div style={{ fontWeight: 700, fontSize: 22, marginTop: 8 }}>{product.name}</div>
      </div>
      {/* 商品信息 */}
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: 16, fontSize: 18 }}>
          <span style={{ marginRight: 24 }}>商品ID：{product.product_id}</span>
          <span>分类：{product.category?.c_name || product.c_id}</span>
        </div>
        <div style={{ marginBottom: 16, fontSize: 18 }}>
          价格：<span style={{ color: "#e55b5b", fontWeight: 700 }}>¥{product.price}</span>
          <span style={{ marginLeft: 24 }}>库存：{product.stock}</span>
        </div>
        <div style={{ marginBottom: 16, fontSize: 18 }}>
          卖家：{product.seller?.name || product.seller_id}
        </div>
        <div style={{ marginBottom: 18, color: "#555", fontSize: 16 }}>
          <strong>商家描述：</strong>
          <div style={{ whiteSpace: "pre-wrap", marginTop: 6 }}>{product.description || "暂无描述"}</div>
        </div>
        <button className="btn btn-secondary" style={{ marginTop: 12, marginBottom: 12 }} onClick={() => setShowAddrDialog(true)}>购买</button>
        <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => navigate(-1)}>返回</button>
      </div>
      {/* 地址选择弹窗 */}
      {showAddrDialog && (
        <div className="dialog-mask">
          <div className="dialog-content">
            <h3 className="dialog-title">选择收货地址</h3>
            <ul className="address-list">
              {addresses.map(addr => (
                <li key={addr.id}>
                  <label>
                    <input type="radio" name="address" value={addr.id} checked={selectedAddrId === addr.id} onChange={() => setSelectedAddrId(addr.id)} />
                    <span style={{ marginLeft: 8 }}>{addr.receiver}，{addr.phone}，{addr.address || addr.detail}</span>
                  </label>
                </li>
              ))}
            </ul>
            <div className="dialog-actions">
              <button className="btn-cancel" onClick={() => setShowAddrDialog(false)}>取消</button>
              <button className="btn-confirm" onClick={() => { if (!selectedAddrId) return alert("请选择地址"); setShowAddrDialog(false); setBuyDialogOpen(true); }}>确定</button>
            </div>
          </div>
        </div>
      )}
      {/* 购买弹窗 */}
      {buyDialogOpen && (
        <div className="dialog-mask">
          <form onSubmit={async e => {
            e.preventDefault();
            try {
              await api.post("/order/create", {
                product_id: product.product_id,
                quantity: buyQuantity,
                address_id: selectedAddrId // 新增：带上地址id
              });
              alert("下单成功！");
              setBuyDialogOpen(false);
            } catch (err) {
              alert("下单失败：" + (err.response?.data?.message || err.message));
            }
          }} className="dialog-content">
            <h3 className="dialog-title">确认购买</h3>
            <div style={{ fontSize: 16, marginBottom: 8 }}>
              商品：{product.name}<br />
              价格：¥{product.price}<br />
              库存：{product.stock}
            </div>
            <label style={{ marginBottom: 4 }}>购买数量</label>
            <input
              type="number"
              min={1}
              max={product.stock}
              value={buyQuantity}
              onChange={e => setBuyQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
              className="form-input"
              required
            />
            <div className="dialog-actions">
              <button type="button" className="btn-cancel" onClick={() => setBuyDialogOpen(false)}>取消</button>
              <button type="submit" className="btn-confirm">付款</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
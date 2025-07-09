import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "./api";

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
    <div
      className="page-content"
      style={{
        maxWidth: 700,
        margin: "40px auto",
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 4px 24px #e0e6ed",
        padding: 40,
        display: "flex",
        gap: 32,
        alignItems: "flex-start"
      }}
    >
      {/* 左侧图片 */}
      <div style={{ flex: "0 0 260px", textAlign: "center" }}>
        <img
          src={backendUrl + product.image_url}
          alt={product.name}
          onError={e => { e.target.src = "/default.png"; }}
          style={{
            width: 240,
            height: 240,
            objectFit: "cover",
            borderRadius: 12,
            background: "#f6f8fa",
            marginBottom: 12
          }}
        />
        <div style={{ fontWeight: 700, fontSize: 22, marginTop: 8 }}>{product.name}</div>
      </div>

      {/* 右侧信息 */}
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
        <button
          style={{
            marginTop: 12,
            marginBottom: 12,
            padding: "10px 32px",
            borderRadius: 8,
            border: "none",
            background: "#36d1c4",
            color: "#fff",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer"
          }}
          onClick={() => setShowAddrDialog(true)}
        >购买</button>
        <button
          style={{
            marginTop: 24,
            padding: "10px 32px",
            borderRadius: 8,
            border: "none",
            background: "#5b86e5",
            color: "#fff",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer"
          }}
          onClick={() => navigate(-1)}
        >返回</button>
      </div>

      {/* 地址选择弹窗 */}
      {showAddrDialog && (
        <div style={{
          position: "fixed", left: 0, top: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
        }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, minWidth: 320 }}>
            <h3 style={{ marginBottom: 16 }}>选择收货地址</h3>
            <ul style={{ marginBottom: 16 }}>
              {addresses.map(addr => (
                <li key={addr.id} style={{ marginBottom: 8 }}>
                  <label>
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddrId === addr.id}
                      onChange={() => setSelectedAddrId(addr.id)}
                    />
                    <span style={{ marginLeft: 8 }}>
                      {addr.receiver}，{addr.phone}，{addr.address || addr.detail}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setShowAddrDialog(false)}
                style={{ flex: 1, padding: "10px 0", borderRadius: 7, border: "none", background: "#e0e6ed", color: "#333", fontWeight: 600, fontSize: 16, cursor: "pointer" }}
              >取消</button>
              <button
                onClick={() => {
                  if (!selectedAddrId) return alert("请选择地址");
                  setShowAddrDialog(false);
                  setBuyDialogOpen(true); // 新增：打开购买弹窗
                }}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 7, border: "none",
                  background: "linear-gradient(90deg, #36d1c4 0%, #5b86e5 100%)",
                  color: "#fff", fontWeight: 600, fontSize: 16, cursor: "pointer"
                }}
              >确定</button>
            </div>
          </div>
        </div>
      )}

      {/* 购买对话框 */}
      {buyDialogOpen && (
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
            onSubmit={async e => {
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
            }}
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
            }}>确认购买</h3>
            <div style={{fontSize: 16, marginBottom: 8}}>
              商品：{product.name}<br />
              价格：¥{product.price}<br />
              库存：{product.stock}
            </div>
            <label style={{marginBottom: 4}}>购买数量</label>
            <input
              type="number"
              min={1}
              max={product.stock}
              value={buyQuantity}
              onChange={e => setBuyQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
              style={{
                padding: "10px 12px",
                borderRadius: 7,
                border: "1.5px solid #e0e6ed",
                fontSize: 15,
                marginBottom: 12
              }}
              required
            />
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button
                type="button"
                onClick={() => setBuyDialogOpen(false)}
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
              >付款</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
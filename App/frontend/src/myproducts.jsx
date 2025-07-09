import React, { useState, useEffect } from 'react';
import api from './api.jsx';

const categories = [
  { c_id: "1", c_name: "数码产品" },
  { c_id: "2", c_name: "家居生活" },
  { c_id: "3", c_name: "美食饮品" },
  { c_id: "4", c_name: "美妆护肤" },
];

export default function MyProducts() {
  const [products, setProducts] = useState([]);
  const [msg, setMsg] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    product_id: "",
    name: "",
    price: "",
    stock: "",
    c_id: "",
    image_url: "",
    images: [], // 新增：多图
    description: "" // 新增
  });
  const [uploading, setUploading] = useState(false);

  const fetchMyProducts = async () => {
    try {
      const response = await api.get('/shop/myproducts');
      setProducts(response.data.data || []);
    } catch (err) {
      setMsg('获取商品失败：' + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCategoryChange = (e) => {
    setFormData({
      ...formData,
      c_id: e.target.value
    });
  };

  const resetForm = () => {
    setFormData({
      product_id: "",
      name: "",
      price: "",
      stock: "",
      c_id: "",
      image_url: "",
      images: [], // 新增：多图
      description: "" 
    });
  };

  // 添加商品
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/shop/add', {
        product_id: formData.product_id,
        name: formData.name,
        price: parseInt(formData.price),
        stock: parseInt(formData.stock),
        c_id: formData.c_id,
        image_url: formData.images[0] || "", // 主图可用第一张
        images: formData.images,             // 多图
        description: formData.description
      });
      setMsg('商品添加成功！');
      setIsAddDialogOpen(false);
      resetForm();
      fetchMyProducts();
    } catch (err) {
      setMsg('添加失败：' + (err.response?.data?.message || err.message));
    }
  };

  // 编辑商品
  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/shop/update/${editingProduct.product_id}`, {
        product_id: formData.product_id,
        name: formData.name,
        price: parseInt(formData.price),
        stock: parseInt(formData.stock),
        c_id: formData.c_id,
        image_url: formData.image_url,
        description: formData.description // 新增
      });
      setMsg('商品更新成功！');
      setIsEditDialogOpen(false);
      setEditingProduct(null);
      resetForm();
      fetchMyProducts();
    } catch (err) {
      setMsg('更新失败：' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('确定要删除这个商品吗？')) return;
    try {
      await api.delete(`/shop/delete/${productId}`);
      setMsg('商品删除成功！');
      fetchMyProducts();
    } catch (err) {
      setMsg('删除失败：' + (err.response?.data?.message || err.message));
    }
  };

  // 图片上传事件
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    setUploading(true);
    try {
      // 假设后端有 /upload 接口，返回 { url: "图片地址" }
      const res = await api.post("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setFormData({ ...formData, image_url: res.data.url });
    } catch (err) {
      alert("图片上传失败");
    }
    setUploading(false);
  };

  const handleImagesChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploading(true);
    let urls = [];
    for (const file of files) {
      const form = new FormData();
      form.append("file", file);
      try {
        const res = await api.post("/upload", form, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        urls.push(res.data.url);
      } catch (err) {
        alert("图片上传失败");
      }
    }
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...urls],
      image_url: prev.images[0] || urls[0] || "" // 主图为第一张
    }));
    setUploading(false);
  };

  // 打开编辑弹窗
  const openEditDialog = (product) => {
    setEditingProduct(product);
    setFormData({
      product_id: product.product_id,
      name: product.name,
      price: product.price?.toString() || "",
      stock: product.stock?.toString() || "",
      c_id: product.c_id || product.category?.c_id || "",
      image_url: product.image_url || "",
      description: product.description || "" // 新增
    });
    setIsEditDialogOpen(true);
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  return (
    <div className="page-content">
      <div className="category-bar" style={{ visibility: "hidden" }}>
        {/* 占位，保持与商品页一致 */}
      </div>
      <div className="product-table-container">
        <div className="flex justify-between items-center mb-4">
          <h2>我的商品</h2>
          <button className="edit-btn" onClick={openAddDialog}>添加商品</button>
        </div>

        {msg && <div style={{ color: msg.includes("失败") ? "red" : "green", marginBottom: 16 }}>{msg}</div>}

        <table className="product-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>名称</th>
              <th>价格</th>
              <th>库存</th>
              <th>分类</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 16 }}>暂无商品</td>
              </tr>
            ) : (
              products.map(product => (
                <tr key={product.product_id}>
                  <td>{product.product_id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.stock}</td>
                  <td>{product.category?.c_name || product.c_id}</td>
                  <td>
                    <button className="edit-btn" onClick={() => openEditDialog(product)}>编辑</button>
                    <button className="edit-btn" style={{ marginLeft: 8 }} onClick={() => handleDeleteProduct(product.product_id)}>删除</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 添加商品对话框 */}
      {isAddDialogOpen && (
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
            onSubmit={handleAddProduct}
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
            }}>添加新商品</h3>
            <input
              name="product_id"
              placeholder="商品ID"
              value={formData.product_id}
              onChange={handleInputChange}
              required
              style={{
                padding: "10px 12px",
                borderRadius: 7,
                border: "1.5px solid #e0e6ed",
                fontSize: 15,
              }}
            />
            <input
              name="name"
              placeholder="商品名称"
              value={formData.name}
              onChange={handleInputChange}
              required
              style={{
                padding: "10px 12px",
                borderRadius: 7,
                border: "1.5px solid #e0e6ed",
                fontSize: 15,
              }}
            />
            <input
              name="price"
              type="number"
              step="0.01"
              placeholder="价格"
              value={formData.price}
              onChange={handleInputChange}
              required
              style={{
                padding: "10px 12px",
                borderRadius: 7,
                border: "1.5px solid #e0e6ed",
                fontSize: 15,
              }}
            />
            <input
              name="stock"
              type="number"
              placeholder="库存"
              value={formData.stock}
              onChange={handleInputChange}
              required
              style={{
                padding: "10px 12px",
                borderRadius: 7,
                border: "1.5px solid #e0e6ed",
                fontSize: 15,
              }}
            />
            {/* 表单 select */}
            <select
              name="c_id"
              value={formData.c_id}
              onChange={handleCategoryChange}
              required
              style={{
                padding: "10px 12px",
                borderRadius: 7,
                border: "1.5px solid #e0e6ed",
                fontSize: 15,
              }}
            >
              <option value="">请选择分类</option>
              {categories.map(category => (
                <option key={category.c_id} value={category.c_id}>{category.c_name}</option>
              ))}
            </select>
            {/* 图片上传控件 */}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
            />
            {formData.images.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                {formData.images.map((url, idx) => (
                  <img key={idx} src={url} alt="商品图片" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 6 }} />
                ))}
              </div>
            )}
            {uploading && <div>图片上传中...</div>}
            {/* 新增商品描述输入框 */}
            <textarea
              name="description"
              placeholder="商品描述"
              value={formData.description}
              onChange={handleInputChange}
              style={{
                padding: "10px 12px",
                borderRadius: 7,
                border: "1.5px solid #e0e6ed",
                fontSize: 15,
                minHeight: 60,
                marginBottom: 8
              }}
            />
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button
                type="button"
                onClick={() => setIsAddDialogOpen(false)}
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
              >添加</button>
            </div>
          </form>
        </div>
      )}

      {/* 编辑商品对话框 */}
      {isEditDialogOpen && (
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
            onSubmit={handleEditProduct}
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
            }}>编辑商品</h3>
            <input
              name="name"
              placeholder="商品名称"
              value={formData.name}
              onChange={handleInputChange}
              required
              style={{
                padding: "10px 12px",
                borderRadius: 7,
                border: "1.5px solid #e0e6ed",
                fontSize: 15,
              }}
            />
            <input
              name="price"
              type="number"
              step="0.01"
              placeholder="价格"
              value={formData.price}
              onChange={handleInputChange}
              required
              style={{
                padding: "10px 12px",
                borderRadius: 7,
                border: "1.5px solid #e0e6ed",
                fontSize: 15,
              }}
            />
            <input
              name="stock"
              type="number"
              placeholder="库存"
              value={formData.stock}
              onChange={handleInputChange}
              required
              style={{
                padding: "10px 12px",
                borderRadius: 7,
                border: "1.5px solid #e0e6ed",
                fontSize: 15,
              }}
            />
            <select
              name="c_id"
              value={formData.c_id}
              onChange={handleCategoryChange}
              required
              style={{
                padding: "10px 12px",
                borderRadius: 7,
                border: "1.5px solid #e0e6ed",
                fontSize: 15,
              }}
            >
              <option value="">请选择分类</option>
              {categories.map(category => (
                <option key={category.c_id} value={category.c_id}>{category.c_name}</option>
              ))}
            </select>
            {/* 图片上传控件 */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ marginBottom: 8 }}
            />
            {formData.image_url && (
              <img src={formData.image_url} alt="商品图片" style={{ width: 120, marginBottom: 8 }} />
            )}
            {uploading && <div>图片上传中...</div>}
            {/* 新增商品描述输入框 */}
            <textarea
              name="description"
              placeholder="商品描述"
              value={formData.description}
              onChange={handleInputChange}
              style={{
                padding: "10px 12px",
                borderRadius: 7,
                border: "1.5px solid #e0e6ed",
                fontSize: 15,
                minHeight: 60,
                marginBottom: 8
              }}
            />
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button
                type="button"
                onClick={() => setIsEditDialogOpen(false)}
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
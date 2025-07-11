import React, { useEffect, useState } from "react";
import api from "./api";
import "./styles.css";

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
    description: ""
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
        image_url: formData.image_url,
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
        description: formData.description
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

  // 单图上传
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    setUploading(true);
    try {
      const res = await api.post("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setFormData({ ...formData, image_url: res.data.url });
    } catch (err) {
      alert("图片上传失败");
    }
    setUploading(false);
  };

  // 打开编辑弹窗
  const openEditDialog = (product) => {
    setEditingProduct(product);
    setFormData({
      product_id: product.product_id || "",
      name: product.name || "",
      price: product.price?.toString() || "",
      stock: product.stock?.toString() || "",
      c_id: product.c_id || product.category?.c_id || "",
      image_url: product.image_url || "",
      description: product.description || ""
    });
    setIsEditDialogOpen(true);
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  return (
    <div className="page-content">
      <div className="category-bar" style={{ visibility: "hidden" }}></div>
      <div className="product-table-container">
        <div className="flex justify-between items-center mb-4">
          <h2>我的商品</h2>
          <button className="edit-btn" onClick={openAddDialog}>添加商品</button>
        </div>
        {msg && <div className={msg.includes("失败") ? "msg-error" : "msg-success"}>{msg}</div>}
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
      {/* 添加商品弹窗 */}
      {isAddDialogOpen && (
        <div className="dialog-mask">
          <form onSubmit={handleAddProduct} className="dialog-content">
            <h3 className="dialog-title">添加新商品</h3>
            <input name="product_id" placeholder="商品ID" value={formData.product_id} onChange={handleInputChange} required className="form-input" />
            <input name="name" placeholder="商品名称" value={formData.name} onChange={handleInputChange} required className="form-input" />
            <input name="price" type="number" step="0.01" placeholder="价格" value={formData.price} onChange={handleInputChange} required className="form-input" />
            <input name="stock" type="number" placeholder="库存" value={formData.stock} onChange={handleInputChange} required className="form-input" />
            <select name="c_id" value={formData.c_id} onChange={handleCategoryChange} required className="form-input">
              <option value="">请选择分类</option>
              {categories.map(category => (
                <option key={category.c_id} value={category.c_id}>{category.c_name}</option>
              ))}
            </select>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {formData.image_url && (
              <div className="product-images-preview">
                <img src={formData.image_url} alt="商品主图" />
              </div>
            )}
            {uploading && <div>图片上传中...</div>}
            <textarea name="description" placeholder="商品描述" value={formData.description} onChange={handleInputChange} className="form-input" />
            <div className="dialog-actions">
              <button type="button" onClick={() => setIsAddDialogOpen(false)} className="btn-cancel">取消</button>
              <button type="submit" className="btn-confirm">添加</button>
            </div>
          </form>
        </div>
      )}
      {/* 编辑商品弹窗 */}
      {isEditDialogOpen && (
        <div className="dialog-mask">
          <form onSubmit={handleEditProduct} className="dialog-content">
            <h3 className="dialog-title">编辑商品</h3>
            <input
              name="product_id"
              placeholder="商品ID"
              value={formData.product_id}
              onChange={handleInputChange}
              required
              className="form-input"
              disabled
            />
            <input name="name" placeholder="商品名称" value={formData.name} onChange={handleInputChange} required className="form-input" />
            <input name="price" type="number" step="0.01" placeholder="价格" value={formData.price} onChange={handleInputChange} required className="form-input" />
            <input name="stock" type="number" placeholder="库存" value={formData.stock} onChange={handleInputChange} required className="form-input" />
            <select name="c_id" value={formData.c_id} onChange={handleCategoryChange} required className="form-input">
              <option value="">请选择分类</option>
              {categories.map(category => (
                <option key={category.c_id} value={category.c_id}>{category.c_name}</option>
              ))}
            </select>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {formData.image_url && (
              <div className="product-images-preview">
                <img src={formData.image_url} alt="主图" />
              </div>
            )}
            <textarea name="description" placeholder="商品描述" value={formData.description} onChange={handleInputChange} className="form-input" />
            <div className="dialog-actions">
              <button type="button" onClick={() => setIsEditDialogOpen(false)} className="btn-cancel">取消</button>
              <button type="submit" className="btn-confirm">保存</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
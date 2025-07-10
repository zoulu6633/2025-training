import React, { useEffect, useState } from "react";
import api from "./api";
import "./styles.css";

export default function Profile() {
  const [user, setUser] = useState({ name: "", email: "", age: "", addresses: [] });
  const [editing, setEditing] = useState(false);
  const [address, setAddress] = useState({ receiver: "", phone: "", detail: "" });
  const [msg, setMsg] = useState("");
  const [pwdDialogOpen, setPwdDialogOpen] = useState(false);
  const [pwdForm, setPwdForm] = useState({ oldPwd: "", newPwd: "", confirmPwd: "" });

  useEffect(() => {
    api.get("/user/profile").then(res => setUser(res.data.data)).catch(() => setMsg("获取信息失败"));
  }, []);

  const handleChange = e => setUser({ ...user, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      await api.put("/user/profile", {
        name: user.name,
        email: user.email,
        age: Number(user.age)
      });
      setEditing(false);
      setMsg("保存成功");
    } catch (err) {
      setMsg("保存失败");
    }
  };

  const handleAddAddress = async e => {
    e.preventDefault();
    try {
      const res = await api.post("/user/address", {
        ...address,
        address: address.detail
      });
      setUser(u => ({ ...u, addresses: [...u.addresses, res.data.data] }));
      setAddress({ receiver: "", phone: "", detail: "" });
      setMsg("添加地址成功");
    } catch {
      setMsg("添加地址失败");
    }
  };

  return (
    <div className="profile-container">
      <h2>个人信息</h2>
      {msg && (
        <div className={msg.includes("失败") ? "msg-error" : "msg-success"}>{msg}</div>
      )}
      <div style={{ marginBottom: 18 }}>
        <label className="form-label">用户名：</label>
        <input
          name="name"
          value={user.name}
          disabled={!editing}
          onChange={handleChange}
          className="form-input"
          style={{ width: 220 }}
        />
      </div>
      <div style={{ marginBottom: 18 }}>
        <label className="form-label">邮箱：</label>
        <input
          name="email"
          value={user.email}
          disabled={!editing}
          onChange={handleChange}
          className="form-input"
          style={{ width: 220 }}
        />
      </div>
      <div style={{ marginBottom: 18 }}>
        <label className="form-label">年龄：</label>
        <input
          name="age"
          type="number"
          value={user.age}
          disabled={!editing}
          onChange={handleChange}
          className="form-input"
          style={{ width: 100 }}
        />
      </div>
      <div style={{ marginBottom: 22 }}>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="btn btn-primary"
          >编辑</button>
        ) : (
          <button
            onClick={handleSave}
            className="btn btn-secondary"
          >保存</button>
        )}
        <button
          onClick={() => setPwdDialogOpen(true)}
          className="btn btn-gray"
          style={{ marginLeft: 16 }}
        >修改密码</button>
      </div>
      <h3 className="section-title">收货地址</h3>
      <ul className="address-list">
        {user.addresses.map((addr, idx) => (
          <li key={addr.id}>
            <span>
              <span style={{ fontWeight: 600 }}>{addr.receiver}</span>，{addr.phone}，{addr.address || addr.detail}
            </span>
            <button
              className="edit-btn"
              style={{ marginLeft: 12, padding: "4px 14px", borderRadius: 6, background: "#e55b5b" }}
              onClick={async () => {
                if (!window.confirm("确定要删除该地址吗？")) return;
                try {
                  await api.delete(`/user/address/${addr.id}`);
                  setUser(u => ({
                    ...u,
                    addresses: u.addresses.filter(a => a.id !== addr.id)
                  }));
                  setMsg("删除成功");
                } catch {
                  setMsg("删除失败");
                }
              }}
            >删除</button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddAddress} className="address-form">
        <div className="form-row">
          <input
            placeholder="收件人"
            value={address.receiver}
            onChange={e => setAddress({ ...address, receiver: e.target.value })}
            required
            className="form-input"
            style={{ width: 110 }}
          />
          <input
            placeholder="电话"
            value={address.phone}
            onChange={e => setAddress({ ...address, phone: e.target.value })}
            required
            className="form-input"
            style={{ width: 120 }}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <input
            placeholder="详细地址"
            value={address.detail}
            onChange={e => setAddress({ ...address, detail: e.target.value })}
            required
            className="form-input"
            style={{ width: 320 }}
          />
        </div>
        <button type="submit" className="btn btn-secondary">添加地址</button>
      </form>
      {pwdDialogOpen && (
        <div className="dialog-mask">
          <form
            onSubmit={async e => {
              e.preventDefault();
              if (pwdForm.newPwd !== pwdForm.confirmPwd) {
                setMsg("两次新密码不一致");
                return;
              }
              try {
                await api.put("/user/password", {
                  old_password: pwdForm.oldPwd,
                  new_password: pwdForm.newPwd
                });
                setMsg("密码修改成功");
                setPwdDialogOpen(false);
                setPwdForm({ oldPwd: "", newPwd: "", confirmPwd: "" });
              } catch {
                setMsg("密码修改失败");
              }
            }}
            className="dialog-content"
          >
            <h3 style={{ margin: 0, marginBottom: 12, fontWeight: 700, fontSize: 20, color: "#5b86e5", textAlign: "center" }}>修改密码</h3>
            <input
              type="password"
              placeholder="原密码"
              value={pwdForm.oldPwd}
              onChange={e => setPwdForm(f => ({ ...f, oldPwd: e.target.value }))}
              required
              className="form-input"
            />
            <input
              type="password"
              placeholder="新密码"
              value={pwdForm.newPwd}
              onChange={e => setPwdForm(f => ({ ...f, newPwd: e.target.value }))}
              required
              className="form-input"
            />
            <input
              type="password"
              placeholder="确认新密码"
              value={pwdForm.confirmPwd}
              onChange={e => setPwdForm(f => ({ ...f, confirmPwd: e.target.value }))}
              required
              className="form-input"
            />
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button
                type="button"
                onClick={() => setPwdDialogOpen(false)}
                className="btn btn-gray"
                style={{ flex: 1, padding: "10px 0" }}
              >取消</button>
              <button
                type="submit"
                className="btn btn-secondary"
                style={{ flex: 1, padding: "10px 0" }}
              >保存</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
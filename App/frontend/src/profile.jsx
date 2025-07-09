import React, { useEffect, useState } from "react";
import api from "./api";

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
      await api.put("/user/profile", user);
      setEditing(false);
      setMsg("保存成功");
    } catch {
      setMsg("保存失败");
    }
  };

  const handleAddAddress = async e => {
    e.preventDefault();
    try {
      // 兼容后端字段
      const res = await api.post("/user/address", {
        ...address,
        address: address.detail // 新增这一行
      });
      setUser(u => ({ ...u, addresses: [...u.addresses, res.data.data] }));
      setAddress({ receiver: "", phone: "", detail: "" });
      setMsg("添加地址成功");
    } catch {
      setMsg("添加地址失败");
    }
  };

  return (
    <div style={{
      maxWidth: 500,
      margin: "40px auto",
      background: "#fff",
      borderRadius: 18,
      boxShadow: "0 6px 32px #e0e6ed",
      padding: 36,
      fontFamily: "微软雅黑, Arial, sans-serif"
    }}>
      <h2 style={{
        marginBottom: 28,
        fontWeight: 800,
        fontSize: 28,
        color: "#333",
        letterSpacing: 2
      }}>个人信息</h2>
      {msg && <div style={{
        color: msg.includes("失败") ? "#e55b5b" : "#36d1c4",
        marginBottom: 18,
        fontWeight: 600,
        fontSize: 16
      }}>{msg}</div>}
      <div style={{ marginBottom: 18 }}>
        <label style={{ display: "inline-block", width: 70, color: "#555", fontWeight: 600 }}>用户名：</label>
        <input
          name="name"
          value={user.name}
          disabled={!editing}
          onChange={handleChange}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1.5px solid #e0e6ed",
            width: 220,
            background: editing ? "#f8fbff" : "#f6f8fa",
            fontSize: 16,
            color: "#333"
          }}
        />
      </div>
      <div style={{ marginBottom: 18 }}>
        <label style={{ display: "inline-block", width: 70, color: "#555", fontWeight: 600 }}>邮箱：</label>
        <input
          name="email"
          value={user.email}
          disabled={!editing}
          onChange={handleChange}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1.5px solid #e0e6ed",
            width: 220,
            background: editing ? "#f8fbff" : "#f6f8fa",
            fontSize: 16,
            color: "#333"
          }}
        />
      </div>
      <div style={{ marginBottom: 18 }}>
        <label style={{ display: "inline-block", width: 70, color: "#555", fontWeight: 600 }}>年龄：</label>
        <input
          name="age"
          type="number"
          value={user.age}
          disabled={!editing}
          onChange={handleChange}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1.5px solid #e0e6ed",
            width: 100,
            background: editing ? "#f8fbff" : "#f6f8fa",
            fontSize: 16,
            color: "#333"
          }}
        />
      </div>
      <div style={{ marginBottom: 22 }}>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            style={{
              padding: "10px 32px",
              borderRadius: 8,
              background: "#5b86e5",
              color: "#fff",
              border: "none",
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
              letterSpacing: 2
            }}>编辑</button>
        ) : (
          <button
            onClick={handleSave}
            style={{
              padding: "10px 32px",
              borderRadius: 8,
              background: "#36d1c4",
              color: "#fff",
              border: "none",
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
              letterSpacing: 2
            }}>保存</button>
        )}
        <button
          onClick={() => setPwdDialogOpen(true)}
          style={{
            marginLeft: 16,
            padding: "10px 32px",
            borderRadius: 8,
            background: "#e0e6ed",
            color: "#333",
            border: "none",
            fontWeight: 700,
            fontSize: 16,
            cursor: "pointer",
            letterSpacing: 2
          }}
        >修改密码</button>
      </div>
      <h3 style={{
        marginTop: 36,
        marginBottom: 16,
        fontWeight: 700,
        fontSize: 20,
        color: "#444"
      }}>收货地址</h3>
      <ul style={{ marginBottom: 18, paddingLeft: 0 }}>
        {user.addresses.map((addr, idx) => (
          <li key={addr.id} style={{
            marginBottom: 10,
            listStyle: "none",
            background: "#f6f8fa",
            borderRadius: 7,
            padding: "10px 16px",
            fontSize: 15,
            color: "#333",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <span>
              <span style={{ fontWeight: 600 }}>{addr.receiver}</span>，{addr.phone}，{addr.address || addr.detail}
            </span>
            <button
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
              style={{
                marginLeft: 12,
                padding: "4px 14px",
                borderRadius: 6,
                background: "#e55b5b",
                color: "#fff",
                border: "none",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer"
              }}
            >删除</button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddAddress} style={{
        marginTop: 10,
        background: "#f8fbff",
        borderRadius: 10,
        padding: "18px 16px"
      }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <input
            placeholder="收件人"
            value={address.receiver}
            onChange={e => setAddress({ ...address, receiver: e.target.value })}
            required
            style={{
              padding: "10px 12px",
              borderRadius: 7,
              border: "1.5px solid #e0e6ed",
              width: 110,
              fontSize: 15,
              background: "#fff",
              color: "#222" // 文字改为黑色
            }}
          />
          <input
            placeholder="电话"
            value={address.phone}
            onChange={e => setAddress({ ...address, phone: e.target.value })}
            required
            style={{
              padding: "10px 12px",
              borderRadius: 7,
              border: "1.5px solid #e0e6ed",
              width: 120,
              fontSize: 15,
              background: "#fff",
              color: "#222" // 文字改为黑色
            }}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <input
            placeholder="详细地址"
            value={address.detail}
            onChange={e => setAddress({ ...address, detail: e.target.value })}
            required
            style={{
              padding: "10px 12px",
              borderRadius: 7,
              border: "1.5px solid #e0e6ed",
              width: 320,
              fontSize: 15,
              background: "#fff",
              color: "#222" // 文字改为黑色
            }}
          />
        </div>
        <button type="submit" style={{
          padding: "10px 32px",
          borderRadius: 8,
          background: "linear-gradient(90deg, #36d1c4 0%, #5b86e5 100%)",
          color: "#fff",
          border: "none",
          fontWeight: 700,
          fontSize: 16,
          cursor: "pointer",
          letterSpacing: 2
        }}>添加地址</button>
      </form>
      {pwdDialogOpen && (
        <div style={{
          position: "fixed", left: 0, top: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
        }}>
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
            style={{
              background: "#fff", borderRadius: 14, padding: 32, minWidth: 320,
              boxShadow: "0 6px 32px #5b86e533", display: "flex", flexDirection: "column", gap: 16
            }}
          >
            <h3 style={{ margin: 0, marginBottom: 12, fontWeight: 700, fontSize: 20, color: "#5b86e5", textAlign: "center" }}>修改密码</h3>
            <input
              type="password"
              placeholder="原密码"
              value={pwdForm.oldPwd}
              onChange={e => setPwdForm(f => ({ ...f, oldPwd: e.target.value }))}
              required
              style={{ padding: "10px 12px", borderRadius: 7, border: "1.5px solid #e0e6ed", fontSize: 15 }}
            />
            <input
              type="password"
              placeholder="新密码"
              value={pwdForm.newPwd}
              onChange={e => setPwdForm(f => ({ ...f, newPwd: e.target.value }))}
              required
              style={{ padding: "10px 12px", borderRadius: 7, border: "1.5px solid #e0e6ed", fontSize: 15 }}
            />
            <input
              type="password"
              placeholder="确认新密码"
              value={pwdForm.confirmPwd}
              onChange={e => setPwdForm(f => ({ ...f, confirmPwd: e.target.value }))}
              required
              style={{ padding: "10px 12px", borderRadius: 7, border: "1.5px solid #e0e6ed", fontSize: 15 }}
            />
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button
                type="button"
                onClick={() => setPwdDialogOpen(false)}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 7, border: "none",
                  background: "#e0e6ed", color: "#333", fontWeight: 600, fontSize: 16, cursor: "pointer"
                }}
              >取消</button>
              <button
                type="submit"
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 7, border: "none",
                  background: "linear-gradient(90deg, #36d1c4 0%, #5b86e5 100%)",
                  color: "#fff", fontWeight: 600, fontSize: 16, cursor: "pointer"
                }}
              >保存</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
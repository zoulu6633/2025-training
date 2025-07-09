import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ handleLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const response = await res.json();
      console.log("Login response:", response); // 调试输出
      // 这里根据后端实际返回结构调整
      if (response.code === 200 && response.data) {
        handleLogin(response.data);  // 传递token给父组件
        navigate("/"); // 登录成功后跳转到首页
      } else {
        setMsg(response.message || "登录失败");
      }
    } catch (err) { 
      setMsg("网络错误");
    }
  };

  return (
    <div style={{
      position: "fixed", left: 0, top: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          borderRadius: 18,
          padding: "40px 36px 32px 36px",
          minWidth: 340,
          boxShadow: "0 6px 32px #5b86e533",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <h2 style={{
          margin: 0,
          marginBottom: 28,
          fontWeight: 700,
          fontSize: 26,
          color: "#5b86e5",
          letterSpacing: 2,
          textAlign: "center"
        }}>用户登录</h2>
        <input
          type="text"
          placeholder="用户名"
          value={username} // 改为 username
          onChange={e => setUsername(e.target.value)} // 改为 setUsername
          style={{
            width: "100%",
            marginBottom: 18,
            padding: "12px 14px",
            fontSize: 16,
            borderRadius: 8,
            border: "1.5px solid #e0e6ed",
            outline: "none",
            transition: "border 0.2s",
            boxSizing: "border-box"
          }}
          onFocus={e => e.target.style.border = "1.5px solid #5b86e5"}
          onBlur={e => e.target.style.border = "1.5px solid #e0e6ed"}
        />
        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            width: "100%",
            marginBottom: 18,
            padding: "12px 14px",
            fontSize: 16,
            borderRadius: 8,
            border: "1.5px solid #e0e6ed",
            outline: "none",
            transition: "border 0.2s",
            boxSizing: "border-box"
          }}
          onFocus={e => e.target.style.border = "1.5px solid #5b86e5"}
          onBlur={e => e.target.style.border = "1.5px solid #e0e6ed"}
        />
        {msg && <div style={{ color: "#e74c3c", marginBottom: 12, width: "100%", textAlign: "center" }}>{msg}</div>}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px 0",
            fontSize: 17,
            background: "linear-gradient(90deg, #36d1c4 0%, #5b86e5 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            letterSpacing: 1,
            marginBottom: 10,
            cursor: "pointer",
            transition: "background 0.2s"
          }}
        >登录</button>
        <div style={{ width: "100%", textAlign: "right" }}>
          <span
            style={{ color: "#5b86e5", cursor: "pointer", fontSize: 15 }}
            onClick={() => navigate("/register")}
          >
            没有账号？去注册
          </span>
        </div>
      </form>
    </div>
  );
}
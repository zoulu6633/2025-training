import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import "./styles.css";

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
    <div className="login-modal">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>用户登录</h2>
        {msg && <div className={msg.includes("失败") ? "msg-error" : "msg-success"}>{msg}</div>}
        <input
          type="text"
          placeholder="用户名"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">登录</button>
        <div className="to-register" onClick={() => navigate("/register")}>
          没有账号？去注册
        </div>
      </form>
    </div>
  );
}
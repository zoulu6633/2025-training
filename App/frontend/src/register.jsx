import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import "./styles.css";

export default function Register() {
  const [form, setForm] = useState({ username: "", password: "", email: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const response = await res.json();
      if (response.code === 200) {
        setMsg("注册成功，请登录");
        setTimeout(() => navigate("/login"), 1000);
      } else {
        setMsg(response.message || "注册失败");
      }
    } catch {
      setMsg("网络错误");
    }
  };

  return (
    <div className="register-modal">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>用户注册</h2>
        {msg && <div className={msg.includes("失败") ? "msg-error" : "msg-success"}>{msg}</div>}
        <input
          type="text"
          name="name"
          placeholder="用户名"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="密码"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="邮箱"
          value={form.email}
          onChange={handleChange}
          required
        />
        <button type="submit">注册</button>
        <div className="to-login" onClick={() => navigate("/login")}>
          已有账号？去登录
        </div>
      </form>
    </div>
  );
}
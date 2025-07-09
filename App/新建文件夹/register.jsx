import React, { useState } from "react";
import api from "./api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", age: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post("/register", form);
      setMsg("注册成功，去登录");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setMsg("注册失败：" + (err.response?.data?.error || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>注册</h2>
      <input name="name" placeholder="用户名" value={form.name} onChange={handleChange} required /><br />
      <input name="email" placeholder="邮箱" value={form.email} onChange={handleChange} required /><br />
      <input name="age" type="number" placeholder="年龄" value={form.age} onChange={handleChange} required /><br />
      <input name="password" type="password" placeholder="密码" value={form.password} onChange={handleChange} required /><br />
      <button type="submit">注册</button>
      <div style={{ color: "red" }}>{msg}</div>
    </form>
  );
}
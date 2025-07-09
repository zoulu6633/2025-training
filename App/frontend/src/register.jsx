import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          password,
          email,
          age: Number(age),
        }),
      });
      const response = await res.json();
      if (response.code === 200) {
        setSuccess(true);
        setMsg("注册成功，正在跳转到登录页...");
        setTimeout(() => {
          navigate("/login");
        }, 1500); // 1.5秒后跳转
      } else {
        setMsg(response.message || "注册失败");
      }
    } catch (err) {
      setMsg("网络错误");
    }
  };

  return (
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
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          borderRadius: 18,
          padding: "40px 36px 32px 36px",
          minWidth: 340,
          boxShadow: "0 6px 32px #5b86e533",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            margin: 0,
            marginBottom: 28,
            fontWeight: 700,
            fontSize: 26,
            color: "#5b86e5",
            letterSpacing: 2,
            textAlign: "center",
          }}
        >
          用户注册
        </h2>
        <input
          type="text"
          placeholder="用户名"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            marginBottom: 18,
            padding: "12px 14px",
            fontSize: 16,
            borderRadius: 8,
            border: "1.5px solid #e0e6ed",
            outline: "none",
            transition: "border 0.2s",
            boxSizing: "border-box",
          }}
          onFocus={(e) => (e.target.style.border = "1.5px solid #5b86e5")}
          onBlur={(e) => (e.target.style.border = "1.5px solid #e0e6ed")}
        />
        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            marginBottom: 18,
            padding: "12px 14px",
            fontSize: 16,
            borderRadius: 8,
            border: "1.5px solid #e0e6ed",
            outline: "none",
            transition: "border 0.2s",
            boxSizing: "border-box",
          }}
          onFocus={(e) => (e.target.style.border = "1.5px solid #5b86e5")}
          onBlur={(e) => (e.target.style.border = "1.5px solid #e0e6ed")}
        />
        <input
          type="text"
          placeholder="邮箱号"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            marginBottom: 18,
            padding: "12px 14px",
            fontSize: 16,
            borderRadius: 8,
            border: "1.5px solid #e0e6ed",
            outline: "none",
            transition: "border 0.2s",
            boxSizing: "border-box",
          }}
          onFocus={(e) => (e.target.style.border = "1.5px solid #5b86e5")}
          onBlur={(e) => (e.target.style.border = "1.5px solid #e0e6ed")}
        />
        <input
          type="number"
          placeholder="年龄"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          style={{
            width: "100%",
            marginBottom: 18,
            padding: "12px 14px",
            fontSize: 16,
            borderRadius: 8,
            border: "1.5px solid #e0e6ed",
            outline: "none",
            transition: "border 0.2s",
            boxSizing: "border-box",
          }}
          onFocus={(e) => (e.target.style.border = "1.5px solid #5b86e5")}
          onBlur={(e) => (e.target.style.border = "1.5px solid #e0e6ed")}
        />
        {msg && (
          <div
            style={{
              color: success ? "#27ae60" : "#e74c3c",
              marginBottom: 12,
              width: "100%",
              textAlign: "center",
            }}
          >
            {msg}
          </div>
        )}
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
            transition: "background 0.2s",
          }}
          disabled={success}
        >
          注册
        </button>
      </form>
    </div>
  );
}
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import Home from './home.jsx';
import Products from './products.jsx';
import ProductDetail from './productdetail.jsx';
import ProfileLayout from './profilelayout.jsx';
import Orders from './orders.jsx';
import Settings from './settings.jsx';
import RequireAuth from './requireauth.jsx';
import Login from './login.jsx';

export default function App() {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <BrowserRouter>
      <nav>
        <Link to="/">首页</Link> |{' '}
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route
          path="/profile/*"
          element={
            <RequireAuth isLogin={isLogin}>
              <ProfileLayout />
            </RequireAuth>
          }
        >
          <Route path="orders" element={<Orders />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/login" element={<Login onLogin={() => setIsLogin(true)} />} />
        <Route path="*" element={<div>404 - 页面不存在</div>} />
      </Routes>
    </BrowserRouter>
  );
}
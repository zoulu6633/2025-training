import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import './App.css'
import './index.css';
import Products from './products.jsx';
import Login from './login.jsx';
import Register from './register.jsx';
import Orders from './orders.jsx';
import Home from './home.jsx';
import SellerOrders from './sellerorder.jsx';
import MyProducts from './myproducts.jsx';
import ProductDetail from './productsdetail.jsx';
import Profile from './profile.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">加载中...</div>;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Home isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Products />} />
            <Route 
              path="/login" 
              element={
                isAuthenticated ? 
                <Navigate to="/" replace /> : 
                <Login handleLogin={handleLogin} onClose={() => window.history.back()}/>
              } 
            />
            <Route 
              path="/register" 
              element={
                isAuthenticated ? 
                <Navigate to="/" replace /> : 
                <Register />
              } 
            />
            <Route 
              path="/profile" 
              element={
                isAuthenticated ? 
                <Profile /> : 
                <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/my-products" 
              element={
                isAuthenticated ? 
                <MyProducts /> : 
                <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/orders" 
              element={
                isAuthenticated ? 
                <Orders /> : 
                <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/seller-orders" 
              element={
                isAuthenticated ? 
                <SellerOrders /> : 
                <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/product/:id" 
              element={
                isAuthenticated ? 
                <ProductDetail /> : 
                <Navigate to="/login" replace />
              } 
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

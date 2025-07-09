import React from 'react';
import { Link } from 'react-router-dom';  
import Button from '@mui/material/Button';
import { ShoppingCart, Package, ShoppingBag, User, LogOut } from 'lucide-react'; 

export default function Home({ isAuthenticated, onLogout }) {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-gray-900">
            购物商城
          </Link>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/">
                  <Button variant="ghost" size="sm">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    商品列表
                  </Button>
                </Link>
                <Link to="/my-products">
                  <Button variant="ghost" size="sm">
                    <Package className="w-4 h-4 mr-2" />
                    我的商品
                  </Button>
                </Link>
                <Link to="/orders">
                  <Button variant="ghost" size="sm">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    我的订单
                  </Button>
                </Link>
                <Link to="/seller-orders">
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    卖家订单
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="ghost" size="sm">
                    个人信息
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={onLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  退出登录
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">登录</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">注册</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
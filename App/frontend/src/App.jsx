import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './home.jsx'
import './App.css'
import Products from './products.jsx';

function App() {
  const [isLogin, setIsLogin] = useState(false);
  return (
    <BrowserRouter>
      <nav>
        <Link to="/" className='home'>首页</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="/products" element={<Products />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App

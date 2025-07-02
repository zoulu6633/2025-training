import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import './App.css';
const ThemeContext = createContext();

function useTheme() {
  const [theme, setTheme] = useState('light');
  const toggleTheme = useCallback(() => setTheme(t => (t === 'light' ? 'dark' : 'light')), []);
  useEffect(() => {
    document.body.style.background = theme === 'light' ? '#fff' : '#222';
    document.body.style.color = theme === 'light' ? '#222' : '#fff';
  }, [theme]);
  return { theme, toggleTheme };
}

function ThemeCard() {
  const { theme } = useContext(ThemeContext);
  return (
    <div >
      当前主题：{theme === 'light' ? '亮色' : '暗色'}
    </div>
  );
}

// 4. 切换主题按钮
function ThemeButton() {
  const { toggleTheme } = useContext(ThemeContext);
  const { theme } = useContext(ThemeContext);
  return (
    <button  onClick={toggleTheme}
    style ={
   {
    background: theme === 'light' ? '#fff' : '#222',
    color: theme === 'light' ? '#222' : '#fff',
    }}>
      🎨 切换主题
      </button>
  );
}

// 5. 主组件
export default function ThemeApp() {
  return (
    <ThemeContext.Provider value={useTheme()}>
      <div className='counter-container'>
        <ThemeCard />
        <ThemeButton />
      </div>
    </ThemeContext.Provider>
  );
}
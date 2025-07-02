import React, { useEffect, useCallback, useState } from 'react';
import './App.css';

// 自定义 Hook
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const addcount = useCallback(() => setCount(c => c + 1), []);
  const decount = useCallback(() => setCount(c => c - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);

  useEffect(() => {
    console.log('计数器当前值:', count);
  }, [count]);

  return { count, addcount, decount, reset };
}

export default function App() {
  const { count, addcount, decount, reset } = useCounter(0);

  return (
    <div className="counter-container">
      <h1>{count}</h1>
      <div className="btn-group">
        <button className="btn" onClick={decount}>➖ 减少</button>
        <button className="btn" onClick={reset}>🔄 重置</button>
        <button className="btn" onClick={addcount}>➕ 增加</button>
      </div>
    </div>
  );
}
import React, { createContext, useContext, useReducer, useRef, useEffect, useMemo } from 'react';

const TodoContext = createContext();

function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      if (!action.text.trim()) return state;
      return [
        ...state,
        { id: Date.now(), text: action.text, done: false }
      ];
    case 'DELETE':
      return state.filter(todo => todo.id !== action.id);
    case 'DONE':
      return state.map(todo =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo
      );
    default:
      return state;
  }
}

function TodoADD() {
  const inputRef = useRef();
  const { dispatch } = useContext(TodoContext);

  const handleAdd = () => {
    dispatch({ type: 'ADD', text: inputRef.current.value });
    inputRef.current.value = '';
    inputRef.current.focus();
  };

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="请输入任务" />
      <button onClick={handleAdd}>添加</button>
    </div>
  );
}

function TodoList() {
  const { todos, dispatch } = useContext(TodoContext);

  const todoItems = useMemo(() =>
    todos.map(todo => (
      <li key={todo.id} style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => dispatch({ type: 'DONE', id: todo.id })}
        />
        <span
          style={{
            textDecoration: todo.done ? 'line-through' : 'none'
          }}
        >
          {todo.text}
        </span>
        <button onClick={() => dispatch({ type: 'DELETE', id: todo.id })}>删除</button>
      </li>
    )),
    [todos, dispatch]
  );

  return <ul style={{ padding: 0 }}>{todoItems}</ul>;
}

export default function TodoApp() {
  const [todos, dispatch] = useReducer(todoReducer, []);
  useEffect(() => {
    console.log('Todo List已加载');
  }, []);
  return (
    <TodoContext.Provider value={{ todos, dispatch }}>
      <div>
        <h2>Todo List</h2>
        <TodoADD />
        <TodoList />
      </div>
    </TodoContext.Provider>
  );
}
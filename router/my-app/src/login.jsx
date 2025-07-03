import { useNavigate, useLocation } from 'react-router-dom';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  function handleLogin() {
    onLogin();
    navigate(from, { replace: true });
  }

  return (
    <div>
      <h2>请登录</h2>
      <button onClick={handleLogin}>登录</button>
    </div>
  );
}
export default Login;
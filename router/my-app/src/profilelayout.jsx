import { Link, Outlet } from 'react-router-dom';

function ProfileLayout() {
  return (
    <div>
      <h2>用户中心</h2>
      <nav>
        <Link to="/profile/orders">订单</Link> | <Link to="/profile/settings">设置</Link>
      </nav>
      <Outlet />
    </div>
  );
}
export default ProfileLayout;
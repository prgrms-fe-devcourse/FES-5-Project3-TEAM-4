import { Outlet } from 'react-router';

function AuthLayout() {
  return (
    <div>
      <Outlet></Outlet>
    </div>
  );
}
export default AuthLayout;

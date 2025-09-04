import AuthForm from '@/common/components/AuthForm';
import LoginForm from './components/LoginForm';
import OAuthButton from './components/OAuthButton';
import Bg from '@/common/components/Bg';
import { useLocation } from 'react-router';

function Login() {
  const location = useLocation();
  const from = (location.state as { from?: Location } | undefined)?.from ?? { pathname: '/' };
  return (
    <Bg className="flex justify-center items-center">
      <AuthForm>
        <h2 className="pt-9 text-main-white text-2xl font-bold">Login</h2>
        <LoginForm from={from.pathname} />
        <hr className="text-main-white w-[90%] md:w-83 " />
        <OAuthButton from={from.pathname} />
      </AuthForm>
    </Bg>
  );
}
export default Login;

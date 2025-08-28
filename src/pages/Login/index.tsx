import AuthForm from '@/common/components/AuthForm';
import LoginForm from './components/LoginForm';
import OAuthButton from './components/OAuthButton';
import Bg from '@/common/components/Bg';

function Login() {
  return (
    <Bg className="flex justify-center items-center">
      <AuthForm>
        <h2 className="pt-9 text-main-white text-2xl font-bold">Login</h2>
        <LoginForm />
        <hr className="text-main-white w-83" />
        <OAuthButton />
      </AuthForm>
    </Bg>
  );
}
export default Login;

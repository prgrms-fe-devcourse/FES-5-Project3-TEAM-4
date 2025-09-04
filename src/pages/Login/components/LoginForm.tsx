import { login } from '@/common/api/auth/login';
import EmailField from '@/common/components/EmailField';
import PasswordField from '@/common/components/PasswordField';
import { useAuth } from '@/common/store/authStore';
import { showAlert } from '@/common/utils/sweetalert';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

function LoginForm({ from }: { from: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setProvider = useAuth((state) => state.setProvider);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userInfo = await login(email, password);

    if (userInfo) {
      setProvider('email');
      showAlert('success', '로그인 성공', '환영합니다!', () => {
        navigate(from, { replace: true });
      });
    }
  };

  return (
    <form className="flex flex-col items-center gap-2 w-[90%]" onSubmit={handleLogin}>
      <div className="flex flex-col gap-5 pt-8 w-full items-center">
        <EmailField onChange={(email: string) => setEmail(email)} />
        <PasswordField onChange={(password: string) => setPassword(password)} />
      </div>
      <div className="flex md:justify-between md:gap-0 justify-around gap-30 md:w-83 w-full text-main-white text-xs mb-4">
        <Link to={'/auth/register'}>Register</Link>
        <Link to={'/auth/forgotPassword'}>forgot password?</Link>
      </div>

      <button
        type="submit"
        className="text-center font-semibold md:w-83 w-full h-8 text-main-white border rounded-2xl cursor-pointer text-l border-main-whit hover:text-main-black hover:bg-main-white"
      >
        Login
      </button>
    </form>
  );
}
export default LoginForm;

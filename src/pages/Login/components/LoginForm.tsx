import { login } from '@/common/api/auth/login';
import EmailField from '@/common/components/EmailField';
import PasswordField from '@/common/components/PasswordField';
import { useAuth } from '@/common/store/authstore';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setUserInfo = useAuth((state) => state.setUserInfo);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userInfo = await login(email, password);
    if (userInfo) {
      const provider = userInfo.app_metadata.provider ?? 'email';
      setUserInfo({ userId: userInfo.id, provider });
      alert('로그인 성공');
      navigate('/');
    }
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={handleLogin}>
      <div className="flex flex-col gap-5 pt-8">
        <EmailField onChange={(email: string) => setEmail(email)} />
        <PasswordField onChange={(email: string) => setPassword(email)} />
      </div>
      <div className="flex justify-between text-main-white text-xs mb-4">
        <Link to={'/auth/register'}>Register</Link>
        <a href="#">forgot password?</a>
      </div>

      <button
        type="submit"
        className="text-center w-83 h-8 text-main-white border rounded-2xl cursor-pointer text-l border-main-whit hover:text-main-black hover:bg-main-white"
      >
        Login
      </button>
    </form>
  );
}
export default LoginForm;

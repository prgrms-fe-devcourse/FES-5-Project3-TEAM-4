import EmailField from '@/common/components/EmailField';
import PasswordField from '@/common/components/PasswordField';
import { useState } from 'react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(email);
    alert(password);
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={handleLogin}>
      <div className="flex flex-col gap-5 pt-8">
        <EmailField onChange={(email: string) => setEmail(email)} />
        <PasswordField onChange={(email: string) => setPassword(email)} />
      </div>
      <div className="flex justify-between text-main-white text-xs mb-4">
        <a href="#">Register</a>
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

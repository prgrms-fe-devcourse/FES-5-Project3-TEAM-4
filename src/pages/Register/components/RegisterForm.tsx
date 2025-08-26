import { registUser } from '@/common/api/auth/register';
import AuthValidate from '@/common/components/AuthValidate';
import EmailField from '@/common/components/EmailField';
import PasswordField from '@/common/components/PasswordField';
import { useState } from 'react';

function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [validation, setValidation] = useState('');

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setValidation('비밀번호가 일치하지 않습니다.');
      return;
    }
    registUser(email, password);
  };

  return (
    <form className="flex flex-col items-center gap-20" onSubmit={handleSignUp}>
      <div className="flex flex-col gap-9">
        <EmailField onChange={(email: string) => setEmail(email)} />
        <PasswordField onChange={(email: string) => setPassword(email)} />
        <div>
          <PasswordField onChange={(email: string) => setPasswordConfirm(email)} />
          <AuthValidate validateText={validation} />
        </div>
      </div>
      <button
        type="submit"
        className="text-center w-83 h-8 text-main-white border rounded-2xl cursor-pointer text-l border-main-white hover:text-main-black hover:bg-main-white"
      >
        Sign Up
      </button>
    </form>
  );
}
export default RegisterForm;

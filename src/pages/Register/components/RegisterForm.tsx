import { registUser } from '@/common/api/auth/register';
import { insertProfile } from '@/common/api/Profile/profile';
import AuthValidate from '@/common/components/AuthValidate';
import EmailField from '@/common/components/EmailField';
import PasswordField from '@/common/components/PasswordField';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [validation, setValidation] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setValidation('비밀번호가 일치하지 않습니다.');
      return;
    }
    const registUserInfo = await registUser(email, password);
    if (registUserInfo && registUserInfo.id) {
      const res = await insertProfile(registUserInfo.id);
      if (res.ok) {
        alert('회원가입 성공');
        navigate('/auth/login');
      } else {
        alert('회원가입 실패');
        console.error('회원가입 중 오류가 발생하였습니다.');
      }
    } else {
      alert('회원가입 실패');
      console.error('회원가입 중 오류가 발생하였습니다.');
    }
  };

  return (
    <form className="flex flex-col items-center gap-20" onSubmit={handleSignUp}>
      <div className="flex flex-col gap-9">
        <EmailField onChange={(email: string) => setEmail(email)} />
        <PasswordField onChange={(email: string) => setPassword(email)} />
        <div>
          <PasswordField onChange={(email: string) => setPasswordConfirm(email)} />
          <AuthValidate validateText={validation} />
          <Link className="text-main-white" to={'/auth/login'}>
            Sign In
          </Link>
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

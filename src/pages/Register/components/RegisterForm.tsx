import { registUser } from '@/common/api/auth/register';
import AuthValidate from '@/common/components/AuthValidate';
import EmailField from '@/common/components/EmailField';
import PasswordField from '@/common/components/PasswordField';
import { showAlert } from '@/common/utils/sweetalert';
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
      showAlert('success', '회원가입되었습니다.', '', () => {
        navigate('/auth/login');
      });
    }
  };

  return (
    <form className="flex flex-col items-center gap-15 w-[90%]" onSubmit={handleSignUp}>
      <div className="flex flex-col items-center gap-9 w-83">
        <EmailField onChange={(email: string) => setEmail(email)} />
        <PasswordField onChange={(email: string) => setPassword(email)} />
        <PasswordField
          onChange={(email: string) => setPasswordConfirm(email)}
          placeholder="Confirm Password"
        />
        <div className="w-full">
          <AuthValidate validateText={validation} />
          <Link className="text-main-white" to={'/auth/login'}>
            Sign In
          </Link>
        </div>
      </div>
      <div className="flex flex-col items-center w-full">
        <button
          type="submit"
          className="text-center font-semibold md:w-83 w-[90%] h-8 text-main-white border rounded-2xl cursor-pointer text-l border-main-white hover:text-main-black hover:bg-main-white"
        >
          Sign Up
        </button>
        <p className="text-gray-400 text-xs pt-4">유효한 이메일로 회원가입 해주세요</p>
      </div>
    </form>
  );
}
export default RegisterForm;

import { registUser } from '@/common/api/auth/register';
import AuthValidate from '@/common/components/AuthValidate';
import EmailField from '@/common/components/EmailField';
import PasswordField from '@/common/components/PasswordField';
import { useState } from 'react';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setpassword] = useState('');
  const [passwordConfirm, setpasswordConfirm] = useState('');
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
    <div className="w-[100%] h-[100vh] flex justify-center items-center bg-radial-[at_99%_99%] from-[#973D5E] from-0% via-[#12082A] to-100% to-[#060325]">
      <div
        className="flex flex-col gap-9 items-center w-[500px] h-[500px] rounded-3xl bg-white/20 
            shadow-[0_4px_50px_5px_rgba(0,0,0,0.15)] 
            backdrop-blur-[16px]"
      >
        <form className="flex flex-col items-center gap-20" onSubmit={handleSignUp}>
          <h2 className="pt-9 text-main-white text-2xl font-bold">SignUp</h2>
          <div className="flex flex-col gap-9">
            <EmailField onChange={(email: string) => setEmail(email)} />
            <PasswordField onChange={(email: string) => setpassword(email)} />
            <div>
              <PasswordField onChange={(email: string) => setpasswordConfirm(email)} />
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
      </div>
    </div>
  );
}
export default Register;

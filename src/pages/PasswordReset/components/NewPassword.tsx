import { updateUser } from '@/common/api/auth/resetPassword';
import AuthValidate from '@/common/components/AuthValidate';
import PasswordField from '@/common/components/PasswordField';
import { showAlert } from '@/common/utils/sweetalert';
import { useState } from 'react';
import { useNavigate } from 'react-router';

interface Props {
  provider?: string;
}

function NewPassword({ provider }: Props) {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [validateText, setValidateText] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setValidateText('비밀번호가 일치하지 않습니다.');
      return;
    }
    const success = await updateUser(password);

    if (typeof success === 'string') {
      if (provider === 'email') {
        showAlert('success', '비밀번호 변경 성공!', '다시 로그인 해주세요', () => {
          navigate('/auth/login');
        });
      } else {
        showAlert('success', '비밀번호 생성 성공!', '지금부터 이메일 로그인이 가능해요!', () => {
          navigate('/auth/login');
        });
      }
    }
  };
  return (
    <form className="flex flex-col items-center w-83 gap-10" onSubmit={handleResetPassword}>
      <div className="flex flex-col items-center gap-5 mb-10 w-full">
        <PasswordField onChange={(password: string) => setPassword(password)} className="mb-4" />
        <PasswordField
          onChange={(password: string) => setPasswordConfirm(password)}
          className="mb-4"
          placeholder="Confirm Password"
        />
        <AuthValidate validateText={validateText} />
      </div>
      <button
        type="submit"
        className="text-center font-semibold md:w-83 w-full h-8 text-main-white border rounded-2xl cursor-pointer text-l border-main-whit hover:text-main-black hover:bg-main-white"
      >
        {provider === 'email' ? '비밀번호 변경하기' : '비밀번호 생성하기'}
      </button>
    </form>
  );
}
export default NewPassword;

import { updateUser } from '@/common/api/auth/resetPassword';
import AuthValidate from '@/common/components/AuthValidate';
import PasswordField from '@/common/components/PasswordField';
import { showAlert } from '@/common/utils/sweetalert';
import { useState } from 'react';
import { useNavigate } from 'react-router';

function NewPassword() {
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
      showAlert('success', '비밀번호 변경 성공!', '다시 로그인 해주세요', () => {
        navigate('/auth/login');
      });
    }
  };
  return (
    <form onSubmit={handleResetPassword}>
      <div className="flex flex-col gap-5 mb-10">
        <span className="text-main-white">새 비밀번호</span>
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
        className="text-center font-semibold w-83 h-8 text-main-white border rounded-2xl cursor-pointer text-l border-main-whit hover:text-main-black hover:bg-main-white"
      >
        비밀번호 변경하기
      </button>
    </form>
  );
}
export default NewPassword;

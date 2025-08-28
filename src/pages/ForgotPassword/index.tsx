import AuthForm from '@/common/components/AuthForm';
import Bg from '@/common/components/Bg';
import EmailVerify from './components/EmailVerify';

function ForgotPassword() {
  return (
    <Bg className="flex justify-center items-center">
      <AuthForm className="gap-4">
        <h2 className="pt-9 text-main-white text-2xl font-bold">Forgot Password?</h2>
        <EmailVerify />
      </AuthForm>
    </Bg>
  );
}
export default ForgotPassword;

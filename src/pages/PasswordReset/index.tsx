import AuthForm from '@/common/components/AuthForm';
import Bg from '@/common/components/Bg';
import NewPassword from './components/NewPassword';

function PasswordReset() {
  return (
    <Bg className="flex justify-center items-center">
      <AuthForm className="gap-15">
        <h2 className="pt-9 text-main-white text-2xl font-bold">New Password</h2>
        <NewPassword />
      </AuthForm>
    </Bg>
  );
}
export default PasswordReset;

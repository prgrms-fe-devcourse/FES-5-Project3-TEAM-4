import AuthForm from '@/common/components/AuthForm';
import RegisterForm from './components/RegisterForm';
import Bg from '@/common/components/Bg';

function Register() {
  return (
    <Bg className="flex justify-center items-center">
      <AuthForm>
        <h2 className="pt-9 text-main-white text-2xl font-bold">Sign Up</h2>
        <RegisterForm />
      </AuthForm>
    </Bg>
  );
}
export default Register;

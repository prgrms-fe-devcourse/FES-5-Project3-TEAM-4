import AuthForm from '@/common/components/AuthForm';
import RegisterForm from './components/RegisterForm';

function Register() {
  return (
    <div className="w-[100%] h-[100vh] flex justify-center items-center bg-radial-[at_99%_99%] from-[#973D5E] from-0% via-[#12082A] to-100% to-[#060325]">
      <AuthForm>
        <h2 className="pt-9 text-main-white text-2xl font-bold">Sign Up</h2>
        <RegisterForm />
      </AuthForm>
    </div>
  );
}
export default Register;

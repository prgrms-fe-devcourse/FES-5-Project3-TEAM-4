import LoginForm from './components/LoginForm';
import OAuthButton from './components/OAuthButton';

function Login() {
  return (
    <div className="w-[100%] h-[100vh] flex justify-center items-center bg-radial-[at_99%_99%] from-[#973D5E] from-0% via-[#12082A] to-100% to-[#060325]">
      <div
        className="flex flex-col gap-9 items-center w-[500px] h-[500px] rounded-3xl bg-white/20 
            shadow-[0_4px_50px_5px_rgba(0,0,0,0.15)] 
            backdrop-blur-[16px]"
      >
        <h2 className="pt-9 text-main-white text-2xl font-bold">Login</h2>
        <LoginForm />
        <hr className="text-main-white w-83" />
        <OAuthButton />
      </div>
    </div>
  );
}
export default Login;

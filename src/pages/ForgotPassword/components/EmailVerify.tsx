import { resetPassword } from '@/common/api/auth/resetPassword';
import EmailField from '@/common/components/EmailField';
import { useState } from 'react';

function EmailVerify() {
  const [email, setEmail] = useState('');

  const handleVerifyEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetPassword(email);
  };
  return (
    <form className="flex flex-col items-center gap-40" onSubmit={handleVerifyEmail}>
      <div>
        <p className="w-[250px] text-main-white text-xs">
          Reset your password to regain access to your account.
        </p>
      </div>
      <div className="flex flex-col gap-6">
        <EmailField onChange={(email: string) => setEmail(email)} />

        <button
          type="submit"
          className="text-center font-semibold w-83 h-8 text-main-white border rounded-2xl cursor-pointer text-l border-main-whit hover:text-main-black hover:bg-main-white"
        >
          Verify
        </button>
      </div>
    </form>
  );
}
export default EmailVerify;

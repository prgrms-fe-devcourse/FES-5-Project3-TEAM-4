import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

function AuthForm({ children }: Props) {
  return (
    <div
      className="flex flex-col gap-9 items-center w-[500px] h-[500px] rounded-3xl bg-white/20 
            shadow-[0_4px_50px_5px_rgba(0,0,0,0.15)] 
            backdrop-blur-[16px]"
    >
      {children}
    </div>
  );
}
export default AuthForm;

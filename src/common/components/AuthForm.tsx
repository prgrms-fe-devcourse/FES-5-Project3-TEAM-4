import type { ReactNode } from 'react';
import tw from '../utils/tw';

interface Props {
  children: ReactNode;
  className?: string;
}

function AuthForm({ children, className }: Props) {
  return (
    <section
      className={tw(
        'flex flex-col gap-9 items-center md:w-[500px] w-[400px] h-[500px] rounded-3xl bg-white/20 shadow-[0_4px_50px_5px_rgba(0,0,0,0.15)] backdrop-blur-[16px]',
        className
      )}
    >
      {children}
    </section>
  );
}
export default AuthForm;

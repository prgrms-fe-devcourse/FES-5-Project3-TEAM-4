import { useState } from 'react';
import tw from '../utils/tw';

interface Props {
  onChange: (email: string) => void;
  className?: string;
  placeholder?: string;
}

function PasswordField({ onChange, className, placeholder = 'Password' }: Props) {
  const [isPasswordShow, setIsPasswordShow] = useState(true);

  const handleInput = (e: React.InputEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    onChange(input.value);
  };
  const handleShowHide = () => {
    setIsPasswordShow((prev) => !prev);
  };

  return (
    <>
      <label htmlFor="password" className={tw('border-b border-b-main-white flex w-83', className)}>
        <input
          className="h-8 text-main-white focus:outline-none flex-1"
          type={isPasswordShow ? 'password' : 'text'}
          placeholder={placeholder}
          name="password"
          id="password"
          onInput={handleInput}
        />

        <button type="button" className="w-4" onClick={handleShowHide}>
          <img
            src={isPasswordShow ? '/icons/show.svg' : '/icons/hide.svg'}
            alt="비밀번호확인이미지"
          />
        </button>
      </label>
    </>
  );
}
export default PasswordField;

import { useRef, useState } from 'react';

interface Props {
  onChange: (email: string) => void;
}

function PasswordField({ onChange }: Props) {
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
      <label htmlFor="password" className="border-b border-b-main-white flex w-83">
        <input
          className="h-8 text-main-white focus:outline-none flex-1"
          type={isPasswordShow ? 'password' : 'text'}
          placeholder="Password"
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

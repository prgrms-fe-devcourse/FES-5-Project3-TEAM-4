interface Props {
  onChange: (email: string) => void;
}

function EmailField({ onChange }: Props) {
  const handleInput = (e: React.InputEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    onChange(input.value);
  };

  return (
    <label htmlFor="email" className="border-b border-b-main-white w-83">
      <input
        className="w-83 h-8 text-main-white focus:outline-none"
        type="email"
        placeholder="Email"
        name="email"
        id="email"
        required
        onInput={handleInput}
      />
    </label>
  );
}
export default EmailField;

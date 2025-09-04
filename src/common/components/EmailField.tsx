interface Props {
  onChange: (email: string) => void;
}

function EmailField({ onChange }: Props) {
  const handleInput = (e: React.InputEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    onChange(input.value);
  };

  return (
    <label htmlFor="email" className="border-b border-b-main-white md:w-83 w-full">
      <input
        className="h-8 text-main-white focus:outline-none"
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

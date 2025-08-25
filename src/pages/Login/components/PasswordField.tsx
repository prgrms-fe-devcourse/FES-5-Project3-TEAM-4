function PasswordField() {
  return (
    <label htmlFor="password" className="border-b border-b-main-white flex w-83">
      <input
        className="h-8 text-main-white focus:outline-none flex-1"
        type="password"
        placeholder="Password"
        name="password"
        id="password"
      />
      <button type="button" className="w-4">
        <img src="/icons/show.svg" alt="비밀번호확인이미지" />
      </button>
    </label>
  );
}
export default PasswordField;

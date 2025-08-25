function EmailField() {
  return (
    <label htmlFor="email" className="border-b border-b-main-white w-83">
      <input
        className="w-83 h-8 text-main-white focus:outline-none"
        type="text"
        placeholder="Email"
        name="email"
        id="email"
      />
    </label>
  );
}
export default EmailField;

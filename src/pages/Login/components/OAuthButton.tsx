function OAuthButton() {
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        className="flex gap-2 justify-center items-center w-83 h-8 text-sm bg-main-white rounded-2xl cursor-pointer"
      >
        <img src="/icons/google.svg" alt="구글 아이콘" />
        Sign in with Google
      </button>
      <button
        type="button"
        className=" flex gap-2 justify-center items-center w-83 h-8 bg-main-black text-sm text-main-white  rounded-2xl cursor-pointer"
      >
        <img src="/icons/github.svg" alt="깃허브 아이콘" /> Sign in with Github
      </button>
    </div>
  );
}
export default OAuthButton;

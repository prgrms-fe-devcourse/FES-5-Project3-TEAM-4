interface Props {
  validateText?: string;
}

function AuthValidate({ validateText }: Props) {
  return (
    <div className="pt-1 flex gap-2 items-centers">
      {validateText !== '' && <img src="/icons/info.svg" alt="경고 아이콘" />}
      <p className=" text-xs text-[#E9BC2F] ">{validateText}</p>
    </div>
  );
}
export default AuthValidate;

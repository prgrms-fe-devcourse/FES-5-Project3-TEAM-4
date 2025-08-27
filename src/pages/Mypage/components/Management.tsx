import AuthValidate from '@/common/components/AuthValidate';
import PasswordField from '@/common/components/PasswordField';

function Management() {
  return (
    <>
      <h1 className="text-main-white pt-14 text-2xl font-semibold">Management</h1>
      <div className="w-[490px] h-[410px] border border-main-black rounded-lg bg-[#151228]">
        <div className="flex flex-col items-center pt-10">
          <div className="mb-8">
            <span className="text-main-white">현재 비밀번호</span>
            <PasswordField onChange={() => alert('테스트')} />
          </div>
          <div className="mb-2">
            <span className="text-main-white">새 비밀번호</span>
            <PasswordField onChange={() => alert('테스트')} className="mb-4" />
            <PasswordField
              onChange={() => alert('테스트')}
              className="mb-4"
              placeholder="Confirm Password"
            />
            <AuthValidate />
          </div>
          <button
            className="text-main-white w-[332px] h-[34px] mb-5 bg-linear-to-r rounded-xl from-[#0E0724] to-[#EB3678]"
            type="button"
          >
            비밀번호 변경하기
          </button>
          <div className="mb-10 text-[12px]">
            <span className="text-[#BDBDBD]">비밀번호를 잊으셨나요?</span>
            <a href="" className="text-main-white underline">
              비밀번호 재설정
            </a>
          </div>
          <div>
            <a href="" className="text-[#737373] text-[12px] underline">
              회원탈퇴
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
export default Management;

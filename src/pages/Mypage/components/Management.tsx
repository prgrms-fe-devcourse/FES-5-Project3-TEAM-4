import { deleteUser } from '@/common/api/auth/deleteUser';
import { useAuth } from '@/common/store/authStore';
import { showAlert, showConfirmAlert } from '@/common/utils/sweetalert';
import NewPassword from '@/pages/PasswordReset/components/NewPassword';
import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/shallow';

function Management() {
  const { provider, reset } = useAuth(
    useShallow((state) => ({
      provider: state.provider,
      reset: state.reset,
    }))
  );
  const navigate = useNavigate();
  const handleUserOut = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    showConfirmAlert(
      '정말 탈퇴하시겠습니까?',
      '모든 기록이 사라져요. 신중하게 결정해주세요!',
      async () => {
        const user = await deleteUser();
        if (user.ok) {
          showAlert('warning', '탈퇴되었습니다', '회원 정보는 복구할 수 없습니다', () => {
            reset();
            navigate('/auth/login');
          });
        }
      }
    );
  };
  return (
    <section className="w-full lg:w-[750px] h-[90vh] lg:h-[85vh] flex flex-col xl:items-baseline items-center gap-5 pt-10">
      <h1 className="text-main-white pt-14 text-2xl font-semibold">Management</h1>
      <div className="w-full lg:w-[490px] h-[450px] border border-main-black rounded-lg bg-[#151228]">
        <div className="flex flex-col items-center pt-10">
          <NewPassword provider={provider} />
          <div className="pt-10">
            <a href="" className="text-[#737373] text-[12px] underline" onClick={handleUserOut}>
              회원탈퇴
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Management;

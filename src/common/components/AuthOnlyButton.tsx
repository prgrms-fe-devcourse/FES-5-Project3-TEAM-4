import { useLocation, useNavigate } from 'react-router';
import supabase from '@/common/api/supabase/supabase';
import { showConfirmAlert } from '@/common/utils/sweetalert';
import { Button, type ButtonProps } from '@/common/components/Button';

type Props = ButtonProps & {
  onAuthed: () => void; // 로그인 상태에서 실행할 동작
};

export default function AuthOnlyButton({ onAuthed, ...btnProps }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    btnProps.onClick?.(e);

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      await showConfirmAlert(
        '로그인이 필요합니다',
        '이 기능을 사용하려면 로그인해야 합니다.',
        () => {
          navigate('/auth/login', { state: { from: location }, replace: true });
        }
      );
      return;
    }

    onAuthed();
  };

  return <Button {...btnProps} onClick={handleClick} />;
}

import { useNavigate } from 'react-router-dom';
import PostEditor from './components/shared/PostEditor';
import { showAlert } from '@/common/utils/sweetalert';

export default function Write() {
  const nav = useNavigate();
  return (
    <PostEditor
      mode="create"
      onSubmitDone={(id) => {
        showAlert('success', '저장되었습니다.');
        nav(`/community/${id}`);
      }}
    />
  );
}

import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PostEditor from './components/shared/PostEditor';
import { selectCommunityById } from '@/common/api/Community/community';
import type { Tables } from '@/common/api/supabase/database.types';
import { showAlert } from '@/common/utils/sweetalert';

export default function Edit() {
  const nav = useNavigate();
  const { id } = useParams<{ id: string }>();
  const stateRow = (useLocation().state as { row?: Tables<'community'> } | undefined)?.row;

  const [row, setRow] = useState<Tables<'community'> | null>(stateRow ?? null);
  const [loading, setLoading] = useState(!stateRow);

  useEffect(() => {
    if (row || !id) return;
    (async () => {
      setLoading(true);
      const data = await selectCommunityById(id);
      setRow((data ?? null) as Tables<'community'> | null);
      setLoading(false);
    })();
  }, [id, row]);

  if (loading) return <div className="mt-6 text-white/70">불러오는 중…</div>;
  if (!row) return <div className="mt-6 text-white/70">게시글을 찾을 수 없습니다.</div>;

  return (
    <PostEditor
      mode="edit"
      initial={row}
      onSubmitDone={(savedId) => {
        showAlert('success', '수정되었습니다.');
        nav(`/community/${savedId}`);
      }}
    />
  );
}

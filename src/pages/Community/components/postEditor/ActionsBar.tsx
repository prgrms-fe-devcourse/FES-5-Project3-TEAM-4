import { Button } from '@/common/components/Button';
import type { PostEditorProps } from '@/common/types/community';

type ActionsBarProps = {
  isSubmitting: boolean;
  mode: PostEditorProps['mode'];
  onCancel: () => void;
};

export default function ActionsBar({ isSubmitting, mode, onCancel }: ActionsBarProps) {
  return (
    <div className="flex items-center justify-center gap-3 pt-2">
      <Button type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting ? '저장 중…' : mode === 'create' ? '저장' : '수정 완료'}
      </Button>
      <Button type="button" variant="ghost" onClick={onCancel}>
        취소
      </Button>
    </div>
  );
}

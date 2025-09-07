import { Button } from '@/common/components/Button';

type CommentActionsProps = {
  canReply: boolean;
  canEdit: boolean;
  isAuthed: boolean;
  onToggleReply: () => void;
  onToggleEdit: () => void;
  onDelete: () => void;
};

export default function CommentActions({
  canReply,
  canEdit,
  isAuthed,
  onToggleReply,
  onToggleEdit,
  onDelete,
}: CommentActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {canReply && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={!isAuthed}
          onClick={onToggleReply}
        >
          답글
        </Button>
      )}
      {canEdit && (
        <>
          <Button type="button" variant="ghost" size="sm" onClick={onToggleEdit}>
            수정
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onDelete}>
            삭제
          </Button>
        </>
      )}
    </div>
  );
}

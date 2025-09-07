import Pagination from './Pagination';
import AuthOnlyButton from '@/common/components/AuthOnlyButton';

type CommunityFooterProps = {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onClickWrite: () => void;
};

export function CommunityFooter({
  total,
  page,
  pageSize,
  onPageChange,
  onClickWrite,
}: CommunityFooterProps) {
  return (
    <div className="relative mt-8">
      <Pagination total={total} page={page} pageSize={pageSize} onPageChange={onPageChange} />
      <AuthOnlyButton
        variant="ghost"
        size="md"
        className="absolute right-0 top-1/2 -translate-y-1/2"
        onAuthed={onClickWrite}
      >
        글쓰기
      </AuthOnlyButton>
    </div>
  );
}

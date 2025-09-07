import { Button } from '@/common/components/Button';
import { FiArrowLeft } from 'react-icons/fi';

type DetailMetaBarProps = {
  createdAt: string;
  title: string;
  onBack: () => void;
};

export default function DetailMetaBar({ createdAt, title, onBack }: DetailMetaBarProps) {
  return (
    <>
      <Button
        type="button"
        onClick={onBack}
        variant="ghost"
        size="sm"
        className="inline-flex items-center gap-2"
      >
        <FiArrowLeft />
        <span className="text-sm">목록으로</span>
      </Button>

      <div className="rounded-xl bg-white/10 backdrop-blur-md px-4 py-3 border border-white/15">
        <div className="flex items-center gap-3 text-sm">
          <span className="px-2 py-0.5 rounded-md bg-white/10 text-white/80">{createdAt}</span>
          <div className="flex-1 rounded-md bg-transparent text-white/90">
            {title || '제목 없음'}
          </div>
        </div>
      </div>
    </>
  );
}

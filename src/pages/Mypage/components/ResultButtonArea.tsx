import ShareButton from '@/pages/TarotShuffle/components/ShareButton';
import { Link } from 'react-router';

interface Props {
  tarotId: string;
}
function ResultButtonArea({ tarotId }: Props) {
  const buttonClass =
    'text-main-white rounded border border-main-white px-4 py-2 hover:drop-shadow-[0_0_10px_rgba(255,255,200,0.8)] hover:scale-110';
  return (
    <div className="mb-10 flex gap-31 justify-between pt-4">
      <div className="flex gap-5 ml-4">
        <Link to={'/mypage/record'} className={buttonClass}>
          마이페이지
        </Link>
        <ShareButton tarotId={tarotId} />
      </div>
    </div>
  );
}
export default ResultButtonArea;

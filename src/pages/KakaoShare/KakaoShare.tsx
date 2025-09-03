import Bg from '@/common/components/Bg';
import RecordDetail from '../Mypage/components/RecordDetail';
import { useParams } from 'react-router';

function KakaoShare() {
  const { id } = useParams<{ id: string }>();

  return (
    <Bg className="flex justify-center items-center">
      <article className="w-[70%] h-[100vh] flex justify-center items-center relative pt-60">
        <RecordDetail tarotId={id ?? ''} type="read" />
      </article>
    </Bg>
  );
}
export default KakaoShare;

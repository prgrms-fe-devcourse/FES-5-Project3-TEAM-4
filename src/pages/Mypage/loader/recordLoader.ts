import { selectTarotRecordListByUserId } from '@/common/api/Tarot/tarot';
import { useAuth } from '@/common/store/authStore';
import { type LoaderFunctionArgs } from 'react-router-dom';

export async function recordLoader(_args: LoaderFunctionArgs) {
  const { userInfo } = useAuth.getState();

  const listData = await selectTarotRecordListByUserId(userInfo.userId);

  return listData;
}

import { selectLikeListWithCommunity } from '@/common/api/Likes/likes';
import { useAuth } from '@/common/store/authStore';
import { type LoaderFunctionArgs } from 'react-router-dom';

export async function likeLoader(_args: LoaderFunctionArgs) {
  const { userInfo } = useAuth.getState();
  const listData = await selectLikeListWithCommunity(userInfo.userId);
  return listData;
}

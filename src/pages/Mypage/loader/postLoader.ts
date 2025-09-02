import { selectCommunityListByUserId } from '@/common/api/Community/community';

import { useAuth } from '@/common/store/authStore';
import { type LoaderFunctionArgs } from 'react-router-dom';

export async function postLoader(_args: LoaderFunctionArgs) {
  const { userInfo } = useAuth.getState();
  const listData = await selectCommunityListByUserId(userInfo.userId, 'created_at', false);
  return listData;
}

import Bg from '@/common/components/Bg';
import { Outlet } from 'react-router-dom';

export default function CommunityLayout() {
  return (
    <Bg>
      <main className="pt-[120px] pb-[86px] mx-auto max-w-[960px] px-6 text-main-white">
        <Outlet />
      </main>
    </Bg>
  );
}

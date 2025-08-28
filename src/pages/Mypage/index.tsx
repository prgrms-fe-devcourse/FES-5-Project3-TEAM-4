import { Outlet } from 'react-router';

import Sidebar from './components/Sidebar';
import Bg from '@/common/components/Bg';

function Mypage() {
  return (
    <Bg className="flex justify-center items-center">
      <article className="w-[1200px] h-[100vh] flex justify-between items-start pt-17">
        <Sidebar />
        <Outlet></Outlet>
      </article>
    </Bg>
  );
}
export default Mypage;

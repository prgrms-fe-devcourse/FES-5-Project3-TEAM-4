import { Outlet } from 'react-router';

import Sidebar from './components/Sidebar';
import Bg from '@/common/components/Bg';

function Mypage() {
  return (
    <Bg className="flex justify-center items-center overflow-y-auto">
      <article className="md:w-[95%] lg:w-[1200px] flex lg:flex-row lg:gap-6 xl:justify-between xl:items-start md:flex-col md:items-center md:justify-center pt-17">
        <Sidebar />
        <Outlet></Outlet>
      </article>
    </Bg>
  );
}
export default Mypage;

import { Outlet } from 'react-router';

import Sidebar from './components/Sidebar';

function Mypage() {
  return (
    <div className="w-[100%] h-[100vh] flex justify-center items-center bg-radial-[at_99%_99%] from-[#973D5E] from-0% via-[#12082A] to-100% to-[#060325]">
      <section className="w-[1200px] h-[100vh] flex justify-between  pt-17">
        <Sidebar />
        <div className=" w-[750px] h-[800px] flex flex-col gap-5">
          <Outlet></Outlet>
        </div>
      </section>
    </div>
  );
}
export default Mypage;

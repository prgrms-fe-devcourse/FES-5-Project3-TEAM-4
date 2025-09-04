import { NavLink } from 'react-router';

const navList = [
  { to: 'management', label: 'Management', imageUrl: '/icons/management.svg' },
  { to: 'post', label: 'Post', imageUrl: '/icons/post.svg' },
  { to: 'likes', label: 'Likes', imageUrl: '/icons/likes.svg' },
  { to: 'record', label: 'Record', imageUrl: '/icons/record.svg' },
];

function Sidebar() {
  return (
    <section className="xl:pt-10 pt-4">
      <h2 className="a11y">sidebar</h2>
      <div className="md:w-full lg:w-[220px] xl:w-[280px] md:h-[200px] md:gap-4 lg:gap-14 lg:h-[80vh] rounded-xl flex flex-col bg-[#151228]">
        <div className="flex pt-8 xl:ml-4 items-center gap-7">
          <img src="/icons/profile.svg" alt="프로필 이미지" />
          <p className="text-main-white xl:text-2xl text-xl font-bold">MYPAGE</p>
        </div>
        <ul className="flex md:flex-nowrap flex-wrap justify-between lg:flex-col lg:gap-5 gap-2">
          {navList.map(({ to, label, imageUrl }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  [
                    'flex lg:w-full w-[180px] border lg:border-none h-[48px] items-center gap-4 rounded-xl',
                    'hover:bg-[#0E0724] hover:scale-110 hover:border border-main-white',
                    isActive && 'bg-linear-to-r from-[#0E0724] to-[#EB3678]',
                  ].join(' ')
                }
              >
                <img className="ml-5" src={imageUrl} alt={`${label} 이미지`} />
                <span className="text-main-white lg:text-xl text-sm">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
export default Sidebar;

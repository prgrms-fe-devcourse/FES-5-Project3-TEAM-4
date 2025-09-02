import { NavLink } from 'react-router';

const navList = [
  { to: 'management', label: 'Management', imageUrl: '/icons/management.svg' },
  { to: 'post', label: 'Post', imageUrl: '/icons/post.svg' },
  { to: 'likes', label: 'Likes', imageUrl: '/icons/likes.svg' },
  { to: 'record', label: 'Record', imageUrl: '/icons/record.svg' },
];

function Sidebar() {
  return (
    <section className="xl:pt-10 md:pt-4">
      <h2 className="a11y">sidebar</h2>
      <div className="md:w-full md:h-[200px] md:gap-4 lg:gap-14 lg:w-[220px] xl:w-[280px] lg:h-[85vh] rounded-xl flex flex-col bg-[#151228]">
        <div className="flex pt-8 xl:ml-4 items-center gap-7">
          <img src="/icons/profile.svg" alt="프로필 이미지" />
          <p className="text-main-white text-[28px] font-bold">MYPAGE</p>
        </div>
        <ul className="flex lg:flex-col lg:gap-5 md:gap-2">
          {navList.map(({ to, label, imageUrl }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  [
                    'flex lg:w-full md:w-[180px] md:border lg:border-none h-[48px] items-center gap-4  rounded-xl',
                    'hover:bg-[#0E0724] hover:scale-110 hover:border border-main-white',
                    isActive && 'bg-linear-to-r from-[#0E0724] to-[#EB3678]',
                  ].join(' ')
                }
              >
                <img className="ml-5" src={imageUrl} alt={`${label} 이미지`} />
                <span className="text-main-white text-[20px]">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
export default Sidebar;

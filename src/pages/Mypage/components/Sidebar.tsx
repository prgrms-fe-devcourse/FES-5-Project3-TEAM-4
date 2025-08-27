import { NavLink } from 'react-router';

const navList = [
  { to: 'management', label: 'Management', imageUrl: '/icons/management.svg' },
  { to: 'post', label: 'Post', imageUrl: '/icons/post.svg' },
  { to: 'likes', label: 'Likes', imageUrl: '/icons/likes.svg' },
  { to: 'record', label: 'Record', imageUrl: '/icons/record.svg' },
];

function Sidebar() {
  return (
    <div className=" w-[280px] h-[85vh] rounded-xl flex flex-col gap-14 bg-[#151228]">
      <div className="flex pt-8 ml-4 items-center gap-7">
        <img src="/icons/profile.svg" alt="프로필 이미지" />
        <p className="text-main-white text-[28px] font-bold">MYPAGE</p>
      </div>
      <ul className="flex flex-col gap-5">
        {navList.map(({ to, label, imageUrl }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                [
                  'flex w-[280px] h-[48px] items-center gap-4  rounded-xl',
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
  );
}
export default Sidebar;

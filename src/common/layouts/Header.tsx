import { Link } from 'react-router-dom';
import extractNavItem from '../utils/extractNavItem';
import { routes } from '@/router/routes';

export default function Header() {
  const navList = extractNavItem(routes.routes);

  return (
    <header className="sticky top-0 z-50 bg-[rgba(31,11,54,0.44)] text-main-white backdrop-blur-sm">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-main-white focus:text-black focus:px-3 focus:py-2 focus:rounded"
      >
        본문으로 건너뛰기
      </a>

      <div className="mx-auto max-w-[1200px] px-6 py-3 flex items-center justify-between">
        <div className="relative group z-[60]">
          <button
            type="button"
            aria-label="메뉴"
            aria-haspopup="menu"
            className="relative cursor-pointer z-[70] ml-3 inline-flex h-10 w-10 items-center justify-center rounded"
          >
            <span aria-hidden className="block h-[2px] w-6 bg-[#1F0B36]" />
            <span aria-hidden className="absolute h-[2px] w-6 -translate-y-2 bg-[#1F0B36]" />
            <span aria-hidden className="absolute h-[2px] w-6 translate-y-2 bg-[#1F0B36]" />
          </button>

          <nav
            aria-label="사이드 메뉴"
            className={[
              'absolute left-0 -top-2 w-[250px] max-w-[90vw]',
              'bg-main-white text-black/90 rounded-2xl shadow-xl',
              'transition-[clip-path] duration-700 ease-out',
              '[-webkit-clip-path:circle(24px_at_30px_24px)] [clip-path:circle(24px_at_32px_24px)]',
              'group-hover:[-webkit-clip-path:circle(390px_at_225px_24px)]',
              'group-hover:[clip-path:circle(390px_at_150px_24px)]',
              'z-[60]',
              'mt-1',
            ].join(' ')}
          >
            <div className="px-[1.2rem] py-[1.72rem] border-b border-black/10"></div>

            <ul className="px-[1rem] py-[1rem]">
              {navList.map(({ path, label, icon: Icon }) => (
                <li key={path} className="mb-2 last:mb-0">
                  <Link
                    to={path}
                    className=" flex items-center rounded-md no-underline select-none px-5 py-4 text-black/70 transition hover:bg-[#1F0B36] active:bg-[#0E071F] hover:text-main-white"
                  >
                    {Icon && <Icon className="mr-4 text-[#6B7885] w-5 h-5 " />}
                    <span className="leading-[30px]">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <Link to="/" aria-label="홈으로 이동" className="font-semibold tracking-wide text-lg">
          *TAROT#
        </Link>

        {/* TODO: auth 상태에 따라 로그인 /로그아웃 컴포넌트 연결 */}
        <button
          type="button"
          className="px-4 py-2 rounded-lg cursor-pointer bg-main-white/20 hover:bg-main-white/30 text-sm"
        >
          로그인
        </button>
      </div>
    </header>
  );
}

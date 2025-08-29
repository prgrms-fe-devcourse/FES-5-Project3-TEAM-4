import { FiSearch } from 'react-icons/fi';
import { AiOutlineHeart, AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { Link } from 'react-router';

export default function Community() {
  // 가라데이터
  const posts = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    date: '2025-08-24',
    title: '안녕하세요. 반갑습니다',
    likes: 1,
  }));

  const hoverBorderActiveGlow =
    'ring-1 ring-white/10 hover:ring-white/40 active:shadow-[0_0_20px_rgba(255,255,255,0.35)]';

  return (
    <>
      {/* 검색 */}
      <label
        htmlFor="q"
        className={`relative flex items-center rounded-full bg-white/10 backdrop-blur-md
                     ${hoverBorderActiveGlow} transition cursor-pointer`}
      >
        <input
          id="q"
          type="text"
          placeholder="검색어를 입력해주세요"
          className="w-full bg-transparent pl-4 pr-12 py-3 text-sm placeholder:text-white/60 outline-none cursor-pointer"
        />
        <button
          type="button"
          aria-label="검색"
          className="absolute right-2 inline-flex h-8 w-8 items-center justify-center rounded-full
                       hover:bg-white/10 focus-visible:outline-0 focus-visible:ring-2 focus-visible:ring-white/60 cursor-pointer"
        >
          <FiSearch size={18} />
        </button>
      </label>

      {/* 정렬 */}
      <div className="flex justify-end gap-3 mt-4 text-sm text-white/70">
        {['최신순', '오래된순', '좋아요↑', '좋아요↓'].map((t, i) => (
          <span key={t} className="flex items-center gap-3">
            <button
              type="button"
              className="px-2 py-1 rounded-md hover:text-white focus-visible:outline-0
                           focus-visible:ring-2 focus-visible:ring-white/50 cursor-pointer"
            >
              {t}
            </button>
            {i !== 3 && <span aria-hidden className="h-3 w-px bg-white/20" />}
          </span>
        ))}
      </div>

      {/* 헤더 */}
      <div className="mt-6 rounded-full bg-white/10 backdrop-blur-md px-5 py-2 text-sm text-white/70">
        <div className="grid grid-cols-[140px_1fr_80px]">
          <span>날짜</span>
          <span className="pl-4">제목</span>
          <span className="text-right">좋아요</span>
        </div>
      </div>

      {/* 리스트 */}
      <ul className="mt-4 space-y-3">
        {posts.map((post) => (
          <li key={post.id}>
            <div
              className={`grid grid-cols-[140px_1fr_80px] items-center rounded-[18px] bg-white/5 backdrop-blur-md
                            px-5 py-3 transition cursor-pointer ${hoverBorderActiveGlow}`}
              role="button"
              tabIndex={0}
            >
              <span className="text-sm text-white/80">{post.date}</span>
              <span className="text-sm pl-4 line-clamp-1">{post.title}</span>
              <button
                type="button"
                className="ml-auto inline-flex items-center gap-1 justify-end rounded-full px-2 py-1
                             text-sm text-white/80 hover:text-pink-400 focus-visible:outline-0
                             focus-visible:ring-2 focus-visible:ring-pink-400/60 cursor-pointer"
                aria-label={`좋아요 ${post.likes}`}
              >
                <AiOutlineHeart size={16} />
                {post.likes}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* 페이지네이션 + 글쓰기 */}
      <div className="relative mt-8">
        {/* 가운데 정렬된 페이지네이션 */}
        <nav aria-label="페이지네이션" className="flex justify-center items-center gap-3 min-h-8">
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80
                 hover:bg-white/15 focus-visible:outline-0 focus-visible:ring-2 focus-visible:ring-white/50
                 cursor-pointer"
            aria-label="이전 페이지"
          >
            <AiOutlineLeft />
          </button>

          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm transition cursor-pointer
                ${
                  n === 5
                    ? 'bg-pink-500 text-white shadow-[0_4px_24px_rgba(236,72,153,0.35)]'
                    : 'bg-white/15 text-white/90 hover:bg-white/25'
                }`}
              aria-current={n === 5 ? 'page' : undefined}
            >
              {n}
            </button>
          ))}

          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80
                 hover:bg-white/15 focus-visible:outline-0 focus-visible:ring-2 focus-visible:ring-white/50
                 cursor-pointer"
            aria-label="다음 페이지"
          >
            <AiOutlineRight />
          </button>
        </nav>

        {/* 오른쪽 끝 글쓰기 버튼 (페이지네이션과 같은 행) */}
        <Link
          to="/community/write"
          className="absolute right-0 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-transparent border border-white/40 
             text-white text-sm hover:border-white hover:bg-white/10 active:shadow-[0_0_8px_white] cursor-pointer"
        >
          글쓰기
        </Link>
      </div>
    </>
  );
}

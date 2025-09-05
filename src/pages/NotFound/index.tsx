import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <main className="relative min-h-dvh w-full overflow-hidden bg-[#0E0724] text-white">
      {/* Mystic gradient haze */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          backgroundImage:
            'radial-gradient(1200px 800px at 85% 10%, rgba(164,76,196,0.30), transparent 60%),' +
            'radial-gradient(1000px 700px at 15% 85%, rgba(227,105,188,0.25), transparent 60%),' +
            'radial-gradient(800px 600px at 50% 50%, rgba(195,172,126,0.12), transparent 55%)',
          filter: 'saturate(120%)',
        }}
      />

      {/* Content */}
      <section className="relative z-10 mx-auto grid min-h-dvh max-w-5xl place-items-center px-6 py-16">
        <div className="flex w-full flex-col items-center gap-10 text-center">
          {/* Header copy */}
          <div className="flex items-center gap-2">
            <span className="text-sm/6 tracking-wide text-white/80">Arcana not found</span>
          </div>

          <div className="relative h-[280px] w-[520px] max-w-[90vw] rounded-2xl border border-white/15 bg-white/10 shadow-[0_10px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl p-10 flex flex-col items-center justify-center gap-5">
            <div className="text-6xl font-black tracking-[0.2em] text-white/95">404</div>
            <p className="max-w-[42ch] text-balance text-sm text-white/75">
              Sorry, the page not found
            </p>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/"
                className="rounded-2xl bg-white/20 px-4 py-2 text-white hover:bg-white/30 flex items-center"
              >
                홈으로 가기
              </Link>
            </div>
          </div>

          {/* Footer hint */}
          <p className="text-xs text-white/50">
            에러 코드: <span className="text-white/70">ARCANA-404</span>
          </p>
        </div>
      </section>
    </main>
  );
}

export default NotFound;

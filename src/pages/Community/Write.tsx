import supabase from '@/common/api/supabase/supabase';
import { Button } from '@/common/components/Button';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

type UploadFile = { id: string; file: File };

// Supabase 탸입
type TrotRow = {
  id: string;
  profile_id: string;
  create_at: string;
  result: string;
  topic: string | null;
};

const STORAGE_BUCKET = 'community-files';

export default function Write() {
  const nav = useNavigate();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<UploadFile[]>([]);

  // 모달 상태
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<TrotRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedTarotId, setSelectedTarotId] = useState<string | null>(null);

  // 컴포넌트 최상단 상태 추가
  // 중복 제출 방지
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openPicker = () => fileRef.current?.click();

  const onPick: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const picked = Array.from(e.target.files ?? []).map((f) => ({
      id: crypto.randomUUID(),
      file: f,
    }));
    setFiles((prev) => [...prev, ...picked]);
    if (fileRef.current) fileRef.current.value = '';
  };

  // Supabase에서 trot 불러오기
  useEffect(() => {
    if (!open) return;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const {
          data: { user },
          error: authErr,
        } = await supabase.auth.getUser();
        if (authErr) throw authErr;
        if (!user) throw new Error('로그인이 필요합니다.');

        // 여기서 Tables<'trot'>[] 타입 적용
        const { data, error } = await supabase
          .from('tarot')
          .select('id, profile_id, create_at, result, topic')
          .eq('profile_id', user.id)
          .order('create_at', { ascending: false });

        if (error) throw error;
        setRows(data ?? ([] as TrotRow[]));
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : '불러오기에 실패했어요.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, [open]);

  // 모달 아이템 클릭 → 파일 첨부 + 선택한 타로 id 저장
  // result(이미지 URL/dataURL) -> File 로 변환해서 첨부에 추가
  const attachFromResult = async (r: TrotRow) => {
    try {
      const resp = await fetch(r.result);
      const blob = await resp.blob();
      const ext = blob.type.split('/')[1] || 'png';
      const safeDate = (r.create_at || '').replace(/[:\s]/g, '-');
      const file = new File([blob], `tarot-${safeDate}.${ext}`, { type: blob.type || 'image/png' });
      setFiles((prev) => [...prev, { id: crypto.randomUUID(), file }]);
      setSelectedTarotId(r.id); // 함께 저장할 tarot_id
      setOpen(false);
    } catch {
      alert('이미지를 첨부로 변환하는 데 실패했어요.');
    }
  };

  const removeFile = (id: string) => setFiles((p) => p.filter((f) => f.id !== id));

  // 저장: 입력 검증 → 파일 업로드 → community insert
  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('제목을 입력해 주세요.');
      return;
    }
    if (!content.trim()) {
      alert('내용을 입력해 주세요.');
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // 로그인 유저
      const {
        data: { user },
        error: authErr,
      } = await supabase.auth.getUser();
      if (authErr) throw authErr;
      if (!user) {
        alert('로그인이 필요합니다.');
        return;
      }

      // 업로드를 동시 처리
      const fileUrls = (
        await Promise.all(
          files.map(async ({ file }) => {
            const path = `${user.id}/${crypto.randomUUID()}-${encodeURIComponent(file.name)}`;
            const { error: upErr } = await supabase.storage
              .from(STORAGE_BUCKET)
              .upload(path, file, { cacheControl: '3600', upsert: false });
            if (upErr) return null;
            const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
            return pub?.publicUrl ?? null;
          })
        )
      ).filter((v): v is string => !!v); // null 제거

      // community insert: 배열 컬럼 사용
      const { error } = await supabase
        .from('community')
        .insert({
          profile_id: user.id,
          tarot_id: selectedTarotId, // 없으면 null 저장됨
          title,
          contents: content,
          file_urls: fileUrls.length ? fileUrls : [], // 배열로 저장
        })
        .single();

      if (error) throw error;

      alert('저장되었습니다.');
      // 초기화/이동
      setTitle('');
      setContent('');
      setFiles([]);
      setSelectedTarotId(null);
      nav('/community');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '저장에 실패했어요.';
      alert(msg);
    }
  };

  // ESC로 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <section
        className="
          rounded-2xl bg-white/5 backdrop-blur-md
          ring-1 ring-white/10 shadow-[0_12px_80px_rgba(0,0,0,0.45)]
          px-6 md:px-10 py-8 md:py-10
        "
      >
        <h1 className="text-2xl font-semibold mb-6">글쓰기</h1>
        <form onSubmit={onSubmit} className="flex flex-col gap-[var(--spacing-8,16px)]">
          {/* 제목 */}
          <div className="flex flex-col gap-[var(--spacing-4,8px)]">
            <label className="text-xs md:text-sm text-white/70">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력해 주세요"
              className="
                w-full px-4 py-2 rounded-md
                bg-transparent text-white placeholder:text-white/50
                border border-white/25 focus:border-white/60 outline-none
              "
            />
          </div>

          {/* 첨부파일 */}
          <div className="flex flex-col gap-[var(--spacing-4,8px)]">
            <label className="text-xs md:text-sm text-white/70">첨부파일</label>

            <div className="flex flex-wrap items-center gap-[var(--spacing-4,8px)]">
              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={onPick}
              />
              <Button type="button" onClick={openPicker} variant="ghost">
                파일 업로드 +
              </Button>
              <Button type="button" onClick={() => setOpen(true)} variant="ghost">
                타로 결과 불러오기 +
              </Button>

              {/* 업로드된 파일 칩 */}
              {files.length > 0 &&
                files.map(({ id, file }) => (
                  <div
                    key={id}
                    className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-white/25 bg-white/10"
                  >
                    <span className="text-xs md:text-sm line-clamp-1 max-w-[220px]">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(id)}
                      className="text-white/70 hover:text-white text-xs cursor-pointer"
                      aria-label="파일 제거"
                    >
                      ✕
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* 본문 */}
          <div className="flex flex-col gap-[var(--spacing-4,8px)]">
            <label className="text-xs md:text-sm text-white/70">글</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력해 주세요"
              className="
                w-full h-[320px] resize-none
                px-4 py-3 rounded-md
                bg-transparent text-white placeholder:text-white/50
                border border-white/25 focus:border-white/60 outline-none
              "
            />
          </div>

          {/* 액션 */}
          <div className="flex items-center justify-center gap-[var(--spacing-6,12px)] pt-[var(--spacing-6,12px)]">
            <Button type="submit" variant="ghost" disabled={isSubmitting}>
              {isSubmitting ? '저장 중…' : '저장'}
            </Button>
            <Button asChild variant="ghost">
              <Link to="/community">취소</Link>
            </Button>
          </div>
        </form>
      </section>

      {/* 모달 */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop(블러) */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          {/* 패널 */}
          <div
            className="
              relative z-10 w-[min(880px,92vw)]
              rounded-2xl bg-white/10 backdrop-blur-xl
              ring-1 ring-white/20 shadow-[0_20px_120px_rgba(0,0,0,0.6)]
              p-6
            "
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white/90 font-semibold">타로 결과 불러오기</h3>
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1 rounded-md border cursor-pointer active:shadow-[0_0_8px_white] border-white/30 text-white/80 hover:bg-white/10"
              >
                닫기
              </button>
            </div>

            {/* 스크롤 영역 */}
            <div className="max-h-[70vh] overflow-y-auto pr-1">
              {loading && <div className="py-20 text-center text-white/70">불러오는 중…</div>}
              {error && !loading && <div className="py-10 text-center text-red-300">{error}</div>}
              {!loading && !error && rows.length === 0 && (
                <div className="py-20 text-center text-white/60">저장된 결과가 없어요.</div>
              )}

              {/* 리스트 */}
              <div className="flex flex-col gap-4">
                {rows.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => attachFromResult(r)}
                    className="
                      group text-left w-full
                      rounded-xl border border-white/15 bg-white/5
                      hover:border-white active:shadow-[0_0_12px_rgba(255,255,255,0.35)]
                      overflow-hidden
                    "
                  >
                    {/* 이미지 */}
                    <div className="w-full bg-black/20">
                      {/* object-contain으로 안전 표시, 고정 높이 비슷하게 */}
                      <img
                        src={r.result}
                        alt="tarot-result"
                        className="block w-full max-h-[320px] object-contain"
                        loading="lazy"
                      />
                    </div>
                    {/* 날짜 */}
                    <div className="px-4 py-3 flex items-center justify-between">
                      <span className="text-white/80 text-sm">{formatDate(r.create_at)}</span>
                      <span className="text-white/50 text-xs">클릭하여 첨부</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** created_dt 표시용 포맷터 */
function formatDate(dt: string) {
  try {
    const d = new Date(dt);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${day} ${hh}:${mm}`;
  } catch {
    return dt;
  }
}

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/common/components/Button';
import supabase from '@/common/api/supabase/supabase';
import { showAlert } from '@/common/utils/sweetalert';
import { formatDate } from '@/common/utils/format';
import type { Tables } from '@/common/api/supabase/database.types';
import { useNavigate } from 'react-router';

type UploadFile = { id: string; file: File };

type Props = {
  mode: 'create' | 'edit';
  initial?: Tables<'community'> | null; // edit일 때만
  onSubmitDone: (savedId: string) => void;
};

const STORAGE_BUCKET = 'community-files';

export default function PostEditor({ mode, initial, onSubmitDone }: Props) {
  const nav = useNavigate();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState(initial?.title ?? '');
  const [content, setContent] = useState(initial?.contents ?? '');

  // 기존 업로드 된 파일, 새로 추가한 파일
  const [existingUrls, setExistingUrls] = useState<string[]>(
    (initial?.file_urls ?? []) as string[]
  );
  const [newFiles, setNewFiles] = useState<UploadFile[]>([]);

  // 타로
  const [open, setOpen] = useState(false);
  const [tarotLoading, setTarotLoading] = useState(false);
  const [tarotRows, setTarotRows] = useState<Tables<'tarot'>[]>([]);
  const [tarotErr, setTarotErr] = useState<string | null>(null);
  const [selectedTarotId, setSelectedTarotId] = useState<string | null>(initial?.tarot_id ?? null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const openPicker = () => fileRef.current?.click();

  const onPick: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const picked = Array.from(e.target.files ?? []).map((f) => ({
      id: crypto.randomUUID(),
      file: f,
    }));
    setNewFiles((prev) => [...prev, ...picked]);
    if (fileRef.current) fileRef.current.value = '';
  };

  const removeNewFile = (id: string) => setNewFiles((p) => p.filter((f) => f.id !== id));
  const removeExistingUrl = (url: string) => setExistingUrls((p) => p.filter((u) => u !== url));

  // 타로 리스트 모달 띄울 때 로딩
  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        setTarotLoading(true);
        setTarotErr(null);
        const {
          data: { user },
          error: authErr,
        } = await supabase.auth.getUser();
        if (authErr) throw authErr;
        if (!user) throw new Error('로그인이 필요합니다.');

        const { data, error } = await supabase
          .from('tarot')
          .select('id, profile_id, created_at, result, topic')
          .eq('profile_id', user.id)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setTarotRows(data ?? []);
      } catch (e) {
        setTarotErr(e instanceof Error ? e.message : '불러오기에 실패했어요.');
      } finally {
        setTarotLoading(false);
      }
    })();
  }, [open]);

  // 타로 결과 이미지를 파일로 첨부
  const attachFromResult = async (r: Tables<'tarot'>) => {
    try {
      if (!r.result) {
        showAlert('error', '이미지 주소가 없습니다.');
        return;
      }
      const resp = await fetch(r.result);
      const blob = await resp.blob();
      const ext = blob.type.split('/')[1] || 'png';
      const safeDate = (r.created_at || '').replace(/[:\s]/g, '-');
      const file = new File([blob], `tarot-${safeDate}.${ext}`, { type: blob.type || 'image/png' });
      setNewFiles((prev) => [...prev, { id: crypto.randomUUID(), file }]);
      setSelectedTarotId(r.id);
      setOpen(false);
    } catch {
      showAlert('error', '이미지를 첨부로 변환하는 데 실패했어요.');
    }
  };

  // 업로드 → URL 만들기
  async function uploadFiles(userId: string, files: UploadFile[]): Promise<string[]> {
    const urls = await Promise.all(
      files.map(async ({ file }) => {
        const path = `${userId}/${crypto.randomUUID()}-${encodeURIComponent(file.name)}`;
        const { error: upErr } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(path, file, { cacheControl: '3600', upsert: false });
        if (upErr) return null;
        const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
        return pub?.publicUrl ?? null;
      })
    );
    return urls.filter((u): u is string => !!u);
  }

  // 저장/수정
  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!title.trim()) return showAlert('error', '제목을 입력해 주세요.');
    if (!content.trim()) return showAlert('error', '내용을 입력해 주세요.');
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const {
        data: { user },
        error: authErr,
      } = await supabase.auth.getUser();
      if (authErr) throw authErr;
      if (!user) throw new Error('로그인이 필요합니다.');

      // 1) 새 파일 업로드
      const newUrls = await uploadFiles(user.id, newFiles);

      // 2) 최종 file_urls 구성: (남겨둔 파일) + (새 업로드 파일)
      const file_urls = [...existingUrls, ...newUrls];

      if (mode === 'create') {
        const { data, error } = await supabase
          .from('community')
          .insert({
            profile_id: user.id,
            tarot_id: selectedTarotId,
            title,
            contents: content,
            file_urls,
          })
          .select('id') // insert 후 그 행의 id 컬럼 가져오기
          .single();
        if (error) throw error;
        onSubmitDone(data.id);
      } else {
        if (!initial?.id) throw new Error('잘못된 요청입니다.');
        const { error } = await supabase
          .from('community')
          .update({
            tarot_id: selectedTarotId,
            title,
            contents: content,
            file_urls,
          })
          .eq('id', initial.id)
          .single();
        if (error) throw error;
        onSubmitDone(initial.id);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : '저장에 실패했어요.';
      showAlert('error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setExistingUrls([]);
    setNewFiles([]);
    setSelectedTarotId(null);
    setOpen(false);
    if (mode === 'create') nav('/community');
    if (mode === 'edit') nav(-1);
  };

  return (
    <>
      <section className="rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 shadow-[0_12px_80px_rgba(0,0,0,0.45)] px-6 md:px-10 py-8 md:py-10">
        <h1 className="text-2xl font-semibold mb-6">{mode === 'create' ? '글쓰기' : '글 수정'}</h1>

        <form onSubmit={onSubmit} className="flex flex-col gap-4 md:gap-6">
          {/* 제목 */}
          <div className="flex flex-col gap-2">
            <label className="text-xs md:text-sm text-white/70">제목</label>
            <input
              value={title ?? ''}
              onChange={(e) => setTitle(e.currentTarget.value)}
              placeholder="제목을 입력해 주세요"
              className="w-full px-4 py-2 rounded-md bg-transparent text-white placeholder:text-white/50 border border-white/25 focus:border-white/60 outline-none"
            />
          </div>

          {/* 첨부 파일 */}
          <div className="flex flex-col gap-2">
            <label className="text-xs md:text-sm text-white/70">첨부파일</label>

            {/* 기존 파일 URL 칩 */}
            {existingUrls.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {existingUrls.map((url) => (
                  <div
                    key={url}
                    className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-white/25 bg-white/10"
                  >
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs md:text-sm underline"
                    >
                      {url.split('/').slice(-1)[0]}
                    </a>
                    <button
                      type="button"
                      onClick={() => removeExistingUrl(url)}
                      className="text-white/70 hover:text-white text-xs cursor-pointer"
                      aria-label="파일 제거"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 새 파일 업로드 영역 */}
            <div className="flex flex-wrap items-center gap-2">
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

              {newFiles.map(({ id, file }) => (
                <div
                  key={id}
                  className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-white/25 bg-white/10"
                >
                  <span className="text-xs md:text-sm line-clamp-1 max-w-[220px]">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeNewFile(id)}
                    className="text-white/70 hover:text-white text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 본문 */}
          <div className="flex flex-col gap-2">
            <label className="text-xs md:text-sm text-white/70">글</label>
            <textarea
              value={content ?? ''}
              onChange={(e) => setContent(e.currentTarget.value)}
              placeholder="내용을 입력해 주세요"
              className="w-full h-[320px] resize-none px-4 py-3 rounded-md bg-transparent text-white placeholder:text-white/50 border border-white/25 focus:border-white/60 outline-none"
            />
          </div>

          {/* 액션 */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? '저장 중…' : mode === 'create' ? '저장' : '수정 완료'}
            </Button>
            <Button type="button" variant="ghost" onClick={handleCancel}>
              취소
            </Button>
          </div>
        </form>
      </section>

      {/* 타로 선택 모달 */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-[min(880px,92vw)] rounded-2xl bg-white/10 backdrop-blur-xl ring-1 ring-white/20 shadow-[0_20px_120px_rgba(0,0,0,0.6)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white/90 font-semibold">타로 결과 불러오기</h3>
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1 rounded-md border cursor-pointer active:shadow-[0_0_8px_white] border-white/30 text-white/80 hover:bg-white/10"
              >
                닫기
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto pr-1">
              {tarotLoading && <div className="py-20 text-center text-white/70">불러오는 중…</div>}
              {tarotErr && !tarotLoading && (
                <div className="py-10 text-center text-red-300">{tarotErr}</div>
              )}
              {!tarotLoading && !tarotErr && tarotRows.length === 0 && (
                <div className="py-20 text-center text-white/60">저장된 결과가 없어요.</div>
              )}

              <div className="flex flex-col gap-4">
                {tarotRows.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => attachFromResult(r)}
                    className="group text-left w-full rounded-xl border border-white/15 bg-white/5 hover:border-white active:shadow-[0_0_12px_rgba(255,255,255,0.35)] overflow-hidden"
                  >
                    <div className="w-full bg-black/20">
                      <img
                        src={r.result ?? ''}
                        alt="tarot-result"
                        className="block w-full max-h-[320px] object-contain"
                        loading="lazy"
                      />
                    </div>
                    <div className="px-4 py-3 flex items-center justify-between">
                      <span className="text-white/80 text-sm">
                        {formatDate(r.created_at ?? '')}
                      </span>
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

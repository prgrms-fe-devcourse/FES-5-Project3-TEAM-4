import type { Tables } from '@/common/api/supabase/database.types';
import type { UploadFile, PostEditorProps } from '@/common/types/community';
import { useState } from 'react';
import { showAlert } from '@/common/utils/sweetalert';
import { useNavigate } from 'react-router';
import { getAuthedUser } from '@/common/api/auth/auth';
import { uploadFilesToBucket } from '@/common/api/supabase/storage';
import { createCommunity, updateCommunity } from '@/common/api/Community/community';
import {
  TitleField,
  AttachmentsSection,
  ContentField,
  ActionsBar,
  TarotResultModal,
} from './index';
import { useTarotPicker } from '@/common/hooks/useTarotPicker';

// 업로드(버킷) → 공개 URL들 반환
async function uploadFiles(userId: string, files: UploadFile[]): Promise<string[]> {
  const urls = await uploadFilesToBucket(
    'community-files',
    userId,
    files.map((f) => f.file)
  );
  return urls.filter(Boolean);
}

export default function PostEditor({ mode, initial, onSubmitDone }: PostEditorProps) {
  const nav = useNavigate();

  const [title, setTitle] = useState(initial?.title ?? '');
  const [content, setContent] = useState(initial?.contents ?? '');
  const [newFiles, setNewFiles] = useState<UploadFile[]>([]);
  const [existingUrls, setExistingUrls] = useState<string[]>(
    (initial?.file_urls ?? []) as string[]
  );
  const [selectedTarotId, setSelectedTarotId] = useState<string | null>(initial?.tarot_id ?? null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const { loading: tarotLoading, rows: tarotRows, error: tarotErr } = useTarotPicker(open);

  // 타로 이미지 한 건을 첨부 파일로 변환해서 추가
  const attachFromResult = async (r: Tables<'tarot_image'>) => {
    try {
      if (!r.image_url) {
        showAlert('error', '이미지 주소가 없습니다.');
        return;
      }
      const resp = await fetch(r.image_url);
      const blob = await resp.blob();
      const ext = (blob.type?.split('/')[1] || 'png').toLowerCase();
      const safeDate = (r.created_at || '').replace(/[:\s+]/g, '-');
      const fname = `tarot-${safeDate}.${ext}`;
      const file = new File([blob], fname, { type: blob.type || 'image/png' });

      setNewFiles((prev) => [...prev, { id: crypto.randomUUID(), file }]);

      // 커뮤니티 글에는 tarot_id(FK -> tarot.id) 저장
      setSelectedTarotId(r.tarot_id ?? null);
      setOpen(false);
    } catch {
      showAlert('error', '이미지를 첨부로 변환하는 데 실패했어요.');
    }
  };

  // 저장/수정
  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!title.trim()) return showAlert('error', '제목을 입력해 주세요.');
    if (!content.trim()) return showAlert('error', '내용을 입력해 주세요.');
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const user = await getAuthedUser(); // throw on not authed
      if (!user) return;

      // 1) 새 파일 업로드
      const newUrls = await uploadFiles(user.id, newFiles);

      // 2) 최종 file_urls
      const file_urls = [...existingUrls, ...newUrls];

      if (mode === 'create') {
        const id = await createCommunity({
          profile_id: user.id,
          tarot_id: selectedTarotId,
          title,
          contents: content,
          file_urls,
        });
        onSubmitDone(id);
      } else {
        if (!initial?.id) throw new Error('잘못된 요청입니다.');
        await updateCommunity(initial.id, {
          tarot_id: selectedTarotId,
          title,
          contents: content,
          file_urls,
        });
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

  // AttachmentsSection에서 files를 추가해 달라고 올라오는 콜백
  const handleFilesAdded = (picked: UploadFile[]) => {
    setNewFiles((prev) => [...prev, ...picked]);
  };

  const removeNewFile = (id: string) => setNewFiles((p) => p.filter((f) => f.id !== id));
  const removeExistingUrl = (url: string) => setExistingUrls((p) => p.filter((u) => u !== url));

  return (
    <>
      <section className="rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 shadow-[0_12px_80px_rgba(0,0,0,0.45)] px-6 md:px-10 py-8 md:py-10">
        <h1 className="text-2xl font-semibold mb-6">{mode === 'create' ? '글쓰기' : '글 수정'}</h1>

        <form onSubmit={onSubmit} className="flex flex-col gap-4 md:gap-6">
          <TitleField value={title} onChange={setTitle} />

          <AttachmentsSection
            existingUrls={existingUrls}
            newFiles={newFiles}
            onRemoveExistingUrl={removeExistingUrl}
            onRemoveNewFile={removeNewFile}
            onOpenModal={() => setOpen(true)}
            onFilesAdded={handleFilesAdded}
          />

          <ContentField value={content} onChange={setContent} />

          <ActionsBar isSubmitting={isSubmitting} mode={mode} onCancel={handleCancel} />
        </form>
      </section>

      <TarotResultModal
        open={open}
        loading={tarotLoading}
        error={tarotErr}
        rows={tarotRows}
        onClose={() => setOpen(false)}
        onSelect={attachFromResult}
      />
    </>
  );
}

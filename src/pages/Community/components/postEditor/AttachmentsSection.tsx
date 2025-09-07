import React, { useRef } from 'react';
import { Button } from '@/common/components/Button';
import { sanitizeFilename } from '@/common/api/supabase/storage';
import type { UploadFile } from '@/common/types/community';

type AttachmentsSectionProps = {
  existingUrls: string[];
  newFiles: UploadFile[];
  onRemoveExistingUrl: (url: string) => void;
  onRemoveNewFile: (id: string) => void;
  onOpenModal: () => void;
  onFilesAdded: (files: UploadFile[]) => void;
};

export default function AttachmentsSection({
  existingUrls,
  newFiles,
  onRemoveExistingUrl,
  onRemoveNewFile,
  onOpenModal,
  onFilesAdded,
}: AttachmentsSectionProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const openPicker = () => fileRef.current?.click();

  const onPick: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const picked = Array.from(e.target.files ?? []).map((f) => ({
      id: crypto.randomUUID(),
      file: new File([f], sanitizeFilename(f.name), { type: f.type }),
    }));
    if (picked.length > 0) onFilesAdded(picked);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
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
                onClick={() => onRemoveExistingUrl(url)}
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
        <Button type="button" onClick={onOpenModal} variant="ghost">
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
              onClick={() => onRemoveNewFile(id)}
              className="text-white/70 hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

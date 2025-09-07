import type { Tables } from '@/common/api/supabase/database.types';
import { formatDate } from '@/common/utils/format';

type TarotResultModalProps = {
  open: boolean;
  loading: boolean;
  error: string | null;
  rows: Tables<'tarot_image'>[];
  onClose: () => void;
  onSelect: (row: Tables<'tarot_image'>) => void;
};

export default function TarotResultModal({
  open,
  loading,
  error,
  rows,
  onClose,
  onSelect,
}: TarotResultModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-[min(880px,92vw)] rounded-2xl bg-white/10 backdrop-blur-xl ring-1 ring-white/20 shadow-[0_20px_120px_rgba(0,0,0,0.6)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white/90 font-semibold">타로 결과 불러오기</h3>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-md border cursor-pointer active:shadow-[0_0_8px_white] border-white/30 text-white/80 hover:bg-white/10"
          >
            닫기
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent hover:scrollbar-thumb-white/60">
          {loading && <div className="py-20 text-center text-white/70">불러오는 중…</div>}
          {error && !loading && <div className="py-10 text-center text-red-300">{error}</div>}
          {!loading && !error && rows.length === 0 && (
            <div className="py-20 text-center text-white/60">저장된 결과가 없어요.</div>
          )}

          <div className="flex flex-col gap-4">
            {rows.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => onSelect(r)}
                className="group cursor-pointer text-left w-full rounded-xl border border-white/15 bg-white/5 hover:border-white active:shadow-[0_0_12px_rgba(255,255,255,0.35)] overflow-hidden"
              >
                <div className="w-full bg-black/20">
                  <img
                    src={r.image_url ?? ''}
                    alt="tarot-image"
                    className="block w-full max-h-[320px] object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="px-4 py-3 flex items-center justify-between">
                  <span className="text-white/80 text-sm">{formatDate(r.created_at)}</span>
                  <span className="text-white/50 text-xs">클릭하여 첨부</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

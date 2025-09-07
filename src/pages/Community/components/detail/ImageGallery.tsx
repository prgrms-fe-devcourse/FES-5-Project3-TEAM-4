import { useEffect, useState } from 'react';
import { Button } from '@/common/components/Button';

type ImageGalleryProps = { images: string[] };

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowLeft') setIdx((i) => (i - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % images.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, images.length]);

  if (!images.length) return null;

  return (
    <>
      <div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md p-3">
        <div className="flex flex-wrap gap-3">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => {
                setIdx(i);
                setOpen(true);
              }}
              className="group flex-1 basis-[240px] aspect-[16/9] rounded-xl overflow-hidden bg-black/20 ring-1 ring-white/10 hover:ring-white/40"
            >
              <img
                src={src}
                alt={`attachment-${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
              />
            </button>
          ))}
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-[min(96vw,1200px)] max-h-[90vh] p-3">
            <div className="flex justify-end mb-2">
              <Button type="button" onClick={() => setOpen(false)} variant="ghost" size="sm">
                닫기
              </Button>
            </div>
            <div className="relative rounded-2xl bg-white/5 ring-1 ring-white/20 overflow-hidden">
              <div className="flex items-center justify-center max-h-[78vh]">
                <img
                  src={images[idx]}
                  alt={`attachment-large-${idx + 1}`}
                  className="max-h-[78vh] w-auto object-contain"
                />
              </div>
              {images.length > 1 && (
                <>
                  <Button
                    type="button"
                    onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
                    variant="ghost"
                    size="sm"
                    className="absolute left-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-white/10 border border-white/30"
                  >
                    ‹
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setIdx((i) => (i + 1) % images.length)}
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-white/10 border border-white/30"
                  >
                    ›
                  </Button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                {images.map((thumb, i) => (
                  <button
                    key={`${thumb}-${i}`}
                    type="button"
                    onClick={() => setIdx(i)}
                    className={`h-14 w-20 rounded-md overflow-hidden ring-1 ${i === idx ? 'ring-white' : 'ring-white/20 hover:ring-white/40'}`}
                  >
                    <img
                      src={thumb}
                      alt={`thumb-${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

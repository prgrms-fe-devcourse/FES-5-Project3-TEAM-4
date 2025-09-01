import Swal from 'sweetalert2';

export const swal = Swal.mixin({
  buttonsStyling: false,
  reverseButtons: false,
  allowOutsideClick: true,
  width: 420,
  customClass: {
    container: 'backdrop-blur-[3px]',
    // ↓ !로 SweetAlert2 기본 스타일 덮어쓰기
    popup: '!rounded-2xl !border !border-white/10 !bg-main-black !text-white',
    title: '!text-center !text-xl md:!text-2xl !font-extrabold !mb-3',
    htmlContainer: '!text-sm !text-white/70',
    actions: '!gap-2',

    confirmButton:
      'inline-flex items-center cursor-pointer justify-center h-10 px-5 rounded-full font-semibold ' +
      '!text-white !border !border-transparent ' +
      'bg-gradient-to-r from-[#5B2E91] to-[#973D5E] ' +
      'hover:brightness-105',
    cancelButton:
      'inline-flex items-center justify-center h-10 px-5 rounded-full font-semibold ' +
      '!text-white/90 !border cursor-pointer !border-white/20 !bg-white/10 hover:!bg-white/15',
    denyButton:
      'inline-flex items-center cursor-pointer justify-center h-10 px-5 rounded-full font-semibold ' +
      '!text-white !border !border-transparent ' +
      'bg-gradient-to-b from-[#ff496e] to-[#d12d52] hover:brightness-105',
    validationMessage: '!text-pink-200 !text-xs !mt-1',
    icon: '!border !border-white/10 !rounded-full',
    loader: 'border-white/70 border-r-white/20 !border-t-transparent !border-b-transparent',
  },
});

export const toast = swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 1800,
  timerProgressBar: true,
  width: 'auto',
  customClass: {
    popup:
      '!rounded-xl !border !border-white/10 !bg-white/5 !backdrop-blur-md ' +
      '!text-white !shadow-[0_12px_40px_rgba(0,0,0,0.32)] !px-4 !py-3',
  },
});

/**
 * alert함수
 * @param title
 * @param text
 * @returns
 */
export const showAlert = async (
  type: 'success' | 'warning' | 'error' | 'info' = 'success',
  title: string,
  text?: string,
  onConfirm?: () => void
) => {
  const res = await swal.fire({
    title,
    html: text,
    icon: type,
    showConfirmButton: true,
    confirmButtonText: '확인',
  });
  if (res.isConfirmed && onConfirm) {
    onConfirm();
  }
  return res;
};

/**
 * confirm alert함수
 * @param title
 * @param text
 * @returns
 */
export const showConfirmAlert = async (
  title: string,
  text?: string,
  onConfirm?: () => void,
  onCancel?: () => void
) => {
  const res = await swal.fire({
    title,
    html: text,
    icon: 'question',
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: '확인',
    cancelButtonText: '취소',
    showLoaderOnConfirm: Boolean(onConfirm),
    allowOutsideClick: () => !swal.isLoading(),
  });
  if (res.isConfirmed && onConfirm) {
    onConfirm();
  }
  if (res.isDismissed && onCancel) {
    onCancel();
  }
  return res;
};

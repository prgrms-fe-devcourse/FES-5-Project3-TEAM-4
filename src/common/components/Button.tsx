// src/common/components/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import tw from '../utils/tw';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm cursor-pointer transition-colors duration-200',
  {
    variants: {
      variant: {
        solid:
          'bg-white/10 border border-white/30 text-white hover:bg-white/20 hover:border-white/60 active:shadow-[0_0_8px_white]',
        ghost:
          'bg-transparent border border-white/40 text-white hover:border-white hover:bg-white/10 active:shadow-[0_0_8px_white]',
        primary: 'bg-pink-500 text-white hover:bg-pink-600 shadow-[0_0_10px_rgba(236,72,153,0.35)]',
      },
      size: {
        sm: 'px-3 py-1 text-xs',
        md: 'px-5 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'solid',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={tw(buttonVariants({ variant, size }), className)} {...props} />;
}

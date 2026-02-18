import type { ButtonHTMLAttributes } from 'react'
import { cn } from './utils'

type Variant = 'solid' | 'glass' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
}

const variantClasses: Record<Variant, string> = {
  solid:
    'bg-accent text-slate-900 shadow-glow border border-transparent hover:brightness-110 active:translate-y-0.5',
  glass:
    'bg-white/5 border border-white/15 text-white hover:border-white/40 hover:bg-white/10',
  ghost:
    'bg-transparent border border-white/10 text-white/70 hover:text-white hover:border-white/40',
}

export const Button = ({ variant = 'solid', className, ...props }: ButtonProps) => (
  <button
    className={cn(
      'rounded-xl px-4 py-2 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60',
      variantClasses[variant],
      className,
    )}
    {...props}
  />
)

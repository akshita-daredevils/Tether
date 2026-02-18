import type { InputHTMLAttributes } from 'react'
import { cn } from './utils'

type TextInputProps = InputHTMLAttributes<HTMLInputElement>

export const TextInput = ({ className, ...props }: TextInputProps) => (
  <input
    className={cn(
      'w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:border-accent focus:outline-none',
      className,
    )}
    {...props}
  />
)

import type { ReactNode } from 'react'
import { cn } from './utils'

type BadgeProps = {
  children: ReactNode
  className?: string
}

export const Badge = ({ children, className }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/70',
      className,
    )}
  >
    {children}
  </span>
)

import { cn } from './utils'

type StatusDotProps = {
  online: boolean
}

export const StatusDot = ({ online }: StatusDotProps) => (
  <span
    className={cn(
      'inline-flex h-2.5 w-2.5 rounded-full border border-white/40',
      online ? 'bg-accent shadow-glow' : 'bg-white/20',
    )}
  />
)

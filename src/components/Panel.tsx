import type { ReactNode } from 'react'
import { cn } from './utils'

type PanelProps = {
  title?: string
  description?: string
  children: ReactNode
  className?: string
}

export const Panel = ({ title, description, children, className }: PanelProps) => (
  <section className={cn('glass-panel rounded-xl p-5 md:p-6 brutal-border', className)}>
    {title ? (
      <header className="mb-4">
        <h2>{title}</h2>
        {description ? <p className="mt-1 text-slate-300/80">{description}</p> : null}
      </header>
    ) : null}
    {children}
  </section>
)

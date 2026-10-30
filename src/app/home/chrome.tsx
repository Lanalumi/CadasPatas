import type { ReactNode } from 'react'

const panelClass =
  'flex h-full min-w-0 flex-col gap-4 rounded-3xl border border-[#755835]/20 bg-white p-6 font-poppins shadow-[0_10px_30px_rgba(58,37,11,0.05)]'

export function DashboardCard({
  title,
  description,
  children,
  className = '',
}: {
  title: string
  description?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`${panelClass} ${className}`.trim()}>
      <div>
        <h2 className="text-lg font-bold text-[#3A250B]">{title}</h2>
        {description ? <p className="mt-0.5 text-xs text-[#755835]/80">{description}</p> : null}
      </div>
      {children}
    </section>
  )
}

export function MetricCard({
  title,
  badge,
  value,
  loading = false,
  error = false,
}: {
  title: string
  badge: string
  value?: number
  loading?: boolean
  error?: boolean
}) {
  return (
    <div className="flex min-w-0 flex-col justify-between gap-4 rounded-3xl border border-[#755835]/20 bg-white p-5 font-poppins shadow-[0_10px_30px_rgba(58,37,11,0.05)] transition-all hover:border-[#755835]/40">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-[#755835]/80">{title}</span>
        <span className="shrink-0 rounded-full bg-[#755835]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#755835]">
          {badge}
        </span>
      </div>
      <div className="text-3xl font-extrabold tracking-tight text-[#3A250B]">
        {error ? '—' : loading ? '…' : value}
      </div>
      {error ? <p className="text-xs font-semibold text-[#8A3B3B]">Não foi possível carregar</p> : null}
    </div>
  )
}

export function Total({ value, className = 'text-3xl' }: { value: number; className?: string }) {
  return <p className={`font-extrabold tracking-tight text-[#3A250B] ${className}`}>{value}</p>
}

export function LoadingCard({ title }: { title: string }) {
  return (
    <DashboardCard title={title}>
      <p className="text-sm font-semibold text-[#755835]/70">Carregando…</p>
    </DashboardCard>
  )
}

export function ErrorCard({ title }: { title: string }) {
  return (
    <DashboardCard title={title}>
      <p className="text-sm font-semibold text-[#8A3B3B]">Não foi possível carregar</p>
    </DashboardCard>
  )
}

export function EmptyCopy({ children }: { children: string }) {
  return <p className="text-sm font-semibold text-[#755835]/70">{children}</p>
}

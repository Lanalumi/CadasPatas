import { Card } from '@/global/ui/Card/Card'
import type { ReactNode } from 'react'

export function DashboardCard({
  title,
  children,
  className = '',
}: {
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <Card title={title} className={`h-full min-w-0 sm:flex-col ${className}`.trim()}>
      {children}
    </Card>
  )
}

export function Total({ value, className = 'text-3xl' }: { value: number; className?: string }) {
  return <p className={`font-poppins font-bold text-[#755835] ${className}`}>{value}</p>
}

export function LoadingCard({ title }: { title: string }) {
  return (
    <DashboardCard title={title}>
      <p className="font-poppins text-sm font-semibold text-[#755835]/70">Carregando…</p>
    </DashboardCard>
  )
}

export function ErrorCard({ title }: { title: string }) {
  return (
    <DashboardCard title={title}>
      <p className="font-poppins text-sm font-semibold text-[#8A3B3B]">Não foi possível carregar</p>
    </DashboardCard>
  )
}

export function EmptyCopy({ children }: { children: string }) {
  return <p className="font-poppins text-sm font-semibold text-[#755835]/70">{children}</p>
}

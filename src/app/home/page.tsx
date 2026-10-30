import { Suspense } from 'react'
import {
  loadAdocoesDoMes,
  loadAnimaisTotal,
  loadComunidade,
  loadGatis,
  loadMedicacao,
} from '@/modules/home/server/load'
import { ErrorCard, LoadingCard, MetricCard } from './chrome'
import { AdocoesPanel, CadastrosCard, GatisPanel, MedicacaoPanel } from './interactive'

async function AnimaisMetric() {
  const result = await loadAnimaisTotal()
  if (!result.ok) return <MetricCard title="Animais" badge="Total" error />
  return <MetricCard title="Animais" badge="Total" value={result.data} />
}

async function ComunidadeMetrics() {
  const result = await loadComunidade()
  if (!result.ok) {
    return (
      <>
        <MetricCard title="Voluntários" badge="Ativos" error />
        <MetricCard title="Clínicas" badge="Cadastradas" error />
        <MetricCard title="Adotantes" badge="Cadastrados" error />
      </>
    )
  }

  return (
    <>
      <MetricCard title="Voluntários" badge="Ativos" value={result.data.voluntarios} />
      <MetricCard title="Clínicas" badge="Cadastradas" value={result.data.clinicas} />
      <MetricCard title="Adotantes" badge="Cadastrados" value={result.data.adotantes} />
    </>
  )
}

async function MedicacaoSection() {
  const result = await loadMedicacao()
  if (!result.ok) return <ErrorCard title="Medicação pendente" />
  return <MedicacaoPanel gatos={result.data} />
}

async function GatisSection() {
  const result = await loadGatis()
  if (!result.ok) return <ErrorCard title="Gatis" />
  return <GatisPanel gatis={result.data} />
}

async function AdocoesSection() {
  const result = await loadAdocoesDoMes()
  if (!result.ok) return <ErrorCard title="Adoções do mês" />
  return <AdocoesPanel adocoes={result.data} />
}

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 font-poppins sm:py-8">
      <header className="flex flex-col justify-between gap-4 border-b border-[#755835]/15 pb-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#755835]/10 text-[#755835]">
            <img src="/images/icons/paw2.svg" alt="Patinha" width={26} height={26} className="object-contain" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#3A250B]">Dashboard</h1>
            <p className="text-xs text-[#755835]/80">Visão geral e acompanhamento em tempo real do abrigo</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        <Suspense fallback={<MetricCard title="Animais" badge="Total" loading />}>
          <AnimaisMetric />
        </Suspense>
        <Suspense
          fallback={
            <>
              <MetricCard title="Voluntários" badge="Ativos" loading />
              <MetricCard title="Clínicas" badge="Cadastradas" loading />
              <MetricCard title="Adotantes" badge="Cadastrados" loading />
            </>
          }
        >
          <ComunidadeMetrics />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <CadastrosCard />
        </div>
        <div className="lg:col-span-7">
          <Suspense fallback={<LoadingCard title="Medicação pendente" />}>
            <MedicacaoSection />
          </Suspense>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <Suspense fallback={<LoadingCard title="Gatis" />}>
          <GatisSection />
        </Suspense>
        <Suspense fallback={<LoadingCard title="Adoções do mês" />}>
          <AdocoesSection />
        </Suspense>
      </div>
    </div>
  )
}

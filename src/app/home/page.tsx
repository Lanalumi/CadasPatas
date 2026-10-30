import { Suspense } from 'react'
import {
  loadAdocoesDoMes,
  loadAnimaisTotal,
  loadComunidade,
  loadGatis,
  loadMedicacao,
} from '@/modules/home/server/load'
import { DashboardCard, ErrorCard, LoadingCard, Total } from './chrome'
import { AdocoesPanel, CadastrosCard, GatisPanel, MedicacaoPanel } from './interactive'

async function AnimaisSection() {
  const result = await loadAnimaisTotal()
  if (!result.ok) return <ErrorCard title="Animais" />

  return (
    <DashboardCard title="Animais">
      <Total value={result.data} />
    </DashboardCard>
  )
}

async function ComunidadeSection() {
  const result = await loadComunidade()
  if (!result.ok) return <ErrorCard title="Comunidade" />

  const cards = [
    { title: 'Voluntários', value: result.data.voluntarios },
    { title: 'Clínicas', value: result.data.clinicas },
    { title: 'Adotantes', value: result.data.adotantes },
  ]

  return (
    <DashboardCard title="Comunidade" className="@container">
      <div className="grid grid-cols-1 gap-3 @md:grid-cols-3">
        {cards.map((card) => (
          <DashboardCard key={card.title} className="text-center" title={<span className="text-sm">{card.title}</span>}>
            <Total value={card.value} className="text-2xl" />
          </DashboardCard>
        ))}
      </div>
    </DashboardCard>
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
    <div className="flex flex-col gap-4 px-4 py-6">
      <h1 className="font-poppins text-2xl font-bold text-[#755835]">Dashboard</h1>

      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-[minmax(8rem,0.7fr)_minmax(18rem,1.5fr)_minmax(16rem,1.3fr)]">
        <Suspense fallback={<LoadingCard title="Animais" />}>
          <AnimaisSection />
        </Suspense>
        <Suspense fallback={<LoadingCard title="Comunidade" />}>
          <ComunidadeSection />
        </Suspense>
        <Suspense fallback={<LoadingCard title="Medicação pendente" />}>
          <MedicacaoSection />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-3">
        <Suspense fallback={<LoadingCard title="Gatis" />}>
          <GatisSection />
        </Suspense>
        <Suspense fallback={<LoadingCard title="Adoções do mês" />}>
          <AdocoesSection />
        </Suspense>
        <CadastrosCard />
      </div>
    </div>
  )
}

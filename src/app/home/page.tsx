'use client'

import { Button } from '@/global/ui/Button/Button'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  const metrics = [
    { title: 'Animais', value: '100', badge: 'Total' },
    { title: 'Novos Registros', value: '5', badge: 'Este mês' },
    { title: 'Voluntários Ativos', value: '6', badge: 'Ativos' },
    { title: 'Vacinas Pendentes', value: '3', badge: 'Atenção' },
  ]

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 sm:py-8 flex flex-col gap-8 font-poppins">
      
      {/* Cabeçalho do Dashboard */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#755835]/15">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#755835]/10 text-[#755835] shrink-0">
            <img src="/images/icons/paw2.svg" alt="Patinha" width={26} height={26} className="object-contain" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#3A250B] tracking-tight">Dashboard</h1>
            <p className="text-xs text-[#755835]/80">Visão geral e acompanhamento em tempo real do abrigo</p>
          </div>
        </div>
      </header>

      {/* Grade de Métricas Principais (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {metrics.map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-3xl border border-[#755835]/20 p-5 shadow-[0_10px_30px_rgba(58,37,11,0.05)] flex flex-col justify-between gap-4 hover:border-[#755835]/40 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#755835]/80">
                {item.title}
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#755835]/10 text-[#755835]">
                {item.badge}
              </span>
            </div>
            <div className="text-3xl font-extrabold text-[#3A250B] tracking-tight">
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Painel Principal: Ações Rápidas & Acompanhamento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Bloco de Ações Rápidas */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#755835]/20 p-6 shadow-[0_10px_30px_rgba(58,37,11,0.05)] flex flex-col gap-5">
          <div>
            <h2 className="text-lg font-bold text-[#3A250B]">Ações Rápidas</h2>
            <p className="text-xs text-[#755835]/80 mt-0.5">Atalhos para cadastros frequentes no abrigo</p>
          </div>

          <div className="flex flex-col gap-3">
            <Button green onClick={() => router.push('/animais/new')} icon="/images/icons/add-button.svg">
              Cadastrar Animal
            </Button>
            <Button disabled onClick={() => router.push('/voluntarios/new')} icon="/images/icons/add-button.svg">
              Cadastrar Voluntário
            </Button>
          </div>
        </div>

        {/* Painel de Acompanhamento */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#755835]/20 p-6 shadow-[0_10px_30px_rgba(58,37,11,0.05)] flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-[#3A250B]">Acompanhamento dos Animais</h2>
            <p className="text-xs text-[#755835]/80 mt-0.5">
              Acompanhe o status dos animais, vacinas, consultas e adoção
            </p>
          </div>

          {/* Destaques visuais para organizar e valorizar o espaço da tela */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#FDF8F3] rounded-2xl p-4 border border-[#755835]/15 flex flex-col gap-1">
              <span className="text-xs font-bold text-[#3A250B]">Saúde e Vacinação</span>
              <p className="text-xs text-[#755835]/80">3 animais necessitam de reforço de vacina esta semana.</p>
            </div>

            <div className="bg-[#FDF8F3] rounded-2xl p-4 border border-[#755835]/15 flex flex-col gap-1">
              <span className="text-xs font-bold text-[#3A250B]">Fichas Atualizadas</span>
              <p className="text-xs text-[#755835]/80">5 novos resgatados tiveram seus cadastros concluídos.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
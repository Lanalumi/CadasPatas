'use client'
import { Button } from '@/global/ui/Button/Button'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  return (
    <>
      <header>
        <h1 className=" font-poppins text-[#755835] font-bold text-2xl">Dashboard</h1>
      </header>
      <div className="flex flex-col gap-4 rounded-xl border border-[#3A250B]/30 bg-white shadow-[2px_4px_14px_rgba(58,37,11,0.1)] p-4 items-center justify-center">
        <div className="flex flex-row gap-4">
          <div className="flex flex-col gap-4 rounded-xl border border-[#3A250B]/30 bg-white shadow-[2px_4px_14px_rgba(58,37,11,0.1)] p-4 items-center justify-center">
            <h2 className=" font-poppins text-[#755835] font-bold text-xl">Animais</h2>
            <p className=" font-poppins text-[#755835] font-semibold text-base">100</p>
          </div>
          <div className="flex flex-col gap-4 rounded-xl border border-[#3A250B]/30 bg-white shadow-[2px_4px_14px_rgba(58,37,11,0.1)] p-4 items-center justify-center">
            <h2 className=" font-poppins text-[#755835] font-bold text-xl">Novos Registros</h2>
            <p className=" font-poppins text-[#755835] font-semibold text-base">5</p>
          </div>
          <div className="flex flex-col gap-4 rounded-xl border border-[#3A250B]/30 bg-white shadow-[2px_4px_14px_rgba(58,37,11,0.1)] p-4 items-center justify-center">
            <h2 className=" font-poppins text-[#755835] font-bold text-xl">Voluntários Ativos</h2>
            <p className=" font-poppins text-[#755835] font-semibold text-base">6</p>
          </div>
          <div className="flex flex-col gap-4 rounded-xl border border-[#3A250B]/30 bg-white shadow-[2px_4px_14px_rgba(58,37,11,0.1)] p-4 items-center justify-center">
            <h2 className=" font-poppins text-[#755835] font-bold text-xl">Vacinas Pendentes</h2>
            <p className=" font-poppins text-[#755835] font-semibold text-base">3</p>
          </div>
        </div>
        <article className="flex flex-row gap-12 items-center justify-center">
          <div className="flex flex-col gap-4 items-center justify-center">
            <Button green onClick={() => router.push('/animais/new')} icon="/images/icons/add-button.svg">
              Cadastrar Animal
            </Button>
            <Button disabled onClick={() => router.push('/voluntarios/new')} icon="/images/icons/add-button.svg">
              Cadastrar Voluntário
            </Button>
          </div>
          <div className="flex flex-col gap-4 rounded-xl border border-[#3A250B]/30 bg-white shadow-[2px_4px_14px_rgba(58,37,11,0.1)] p-4 items-center justify-center">
            <h1 className=" font-poppins text-[#755835] font-bold text-xl">Acompanhamento dos Animais</h1>
            <p className=" font-poppins text-[#755835] font-semibold text-base">
              Acompanhe o status dos animais, vacinas, consultas e adocao
            </p>
          </div>
        </article>
      </div>
    </>
  )
}

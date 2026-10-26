import { prisma } from '@/lib/db'
import { FormNewMedicacao } from './FormNewMedicacao'

function formatDate(value: Date) {
  const day = String(value.getDate()).padStart(2, '0')
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const year = value.getFullYear()

  return `${day}/${month}/${year}`
}

export default async function NovaMedicacaoPage({
  searchParams,
}: {
  searchParams: Promise<{ animalId?: string | string[]; consultaId?: string | string[] }>
}) {
  const { animalId, consultaId } = await searchParams
  const selectedAnimalId = Array.isArray(animalId) ? animalId[0] : animalId
  const selectedConsultaId = Array.isArray(consultaId) ? consultaId[0] : consultaId

  const [animais, consultas, medicamentos] = await Promise.all([
    prisma.animal.findMany({ select: { id: true, nome: true }, orderBy: { nome: 'asc' } }),
    prisma.consulta.findMany({
      orderBy: { dataAtendimento: 'desc' },
      select: {
        id: true,
        animalId: true,
        dataAtendimento: true,
        motivo: { select: { nome: true } },
      },
    }),
    prisma.medicamento.findMany({ select: { nome: true }, orderBy: { nome: 'asc' } }),
  ])

  return (
    <div className="flex max-w-[94%] flex-col items-center justify-center p-4">
      <header className="flex w-full flex-col gap-2 bg-[#FFF9F7] p-4">
        <h1 className="text-center font-poppins font-semibold text-[#755835]">Cadastro de medicação</h1>
        <div className="flex w-full flex-row items-center justify-center gap-2 text-center">
          <img src="/images/icons/paw.svg" alt="" width={24} height={24} />
          <span className="font-poppins font-semibold text-[#755835]">Nova medicação</span>
        </div>
      </header>
      <FormNewMedicacao
        animais={animais}
        consultas={consultas.map((consulta) => ({
          id: consulta.id,
          animalId: consulta.animalId,
          label: `${formatDate(consulta.dataAtendimento)} — ${consulta.motivo.nome}`,
        }))}
        medicamentos={medicamentos.map((medicamento) => medicamento.nome)}
        animalId={selectedAnimalId}
        consultaId={selectedConsultaId}
      />
    </div>
  )
}

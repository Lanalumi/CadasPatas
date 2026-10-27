import { FormNewFicha } from '@/app/saude/fichas/new/FormNewFicha'
import { prisma } from '@/lib/db'

export default async function NovaConsultaPage({
  searchParams,
}: {
  searchParams: Promise<{ animalId?: string | string[] }>
}) {
  const { animalId } = await searchParams
  const selectedAnimalId = Array.isArray(animalId) ? animalId[0] : animalId

  const [animais, clinicas, motivos] = await Promise.all([
    prisma.animal.findMany({ select: { id: true, nome: true }, orderBy: { nome: 'asc' } }),
    prisma.clinica.findMany({ select: { id: true, nome: true }, orderBy: { nome: 'asc' } }),
    prisma.motivo.findMany({ select: { nome: true }, orderBy: { nome: 'asc' } }),
  ])

  return (
    <div className="flex max-w-[94%] flex-col items-center justify-center p-4">
      <header className="flex w-full flex-col gap-2 bg-[#FFF9F7] p-4">
        <h1 className="text-center font-poppins font-semibold text-[#755835]">Registro de consulta</h1>
        <div className="flex w-full flex-row items-center justify-center gap-2 text-center">
          <img src="/images/icons/paw.svg" alt="" width={24} height={24} />
          <span className="font-poppins font-semibold text-[#755835]">Nova consulta</span>
        </div>
      </header>
      <FormNewFicha
        animais={animais}
        clinicas={clinicas}
        motivos={motivos.map((motivo) => motivo.nome)}
        animalId={selectedAnimalId}
      />
    </div>
  )
}

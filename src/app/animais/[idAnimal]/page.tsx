import { getRequestApiUrl } from '@/global/constants/api'
import { api } from '@/lib/http/api'
import FormEditAnimal from '@/modules/animais/componentes/FormEditAnimal/FormEditAnimal'
import type { Animal } from '@/modules/animais/types'
import { notFound } from 'next/navigation'
import { situacaoAnimalLabel } from '@/schemas/animalSchema'

async function loadAnimal(idAnimal: string): Promise<Animal> {
  const apiUrl = await getRequestApiUrl()

  try {
    return await api<Animal>(`${apiUrl}/animais/${idAnimal}`, { cache: 'no-store' })
  } catch {
    notFound()
  }
}

export default async function AnimalPage({ params }: { params: Promise<{ idAnimal: string }> }) {
  const { idAnimal } = await params
  const animal = await loadAnimal(idAnimal)
  const situacao = animal.situacao

  return (
    <div className="flex flex-col max-w-[94%] p-4">
      <header className="flex w-full max-w-full flex-col p-4 gap-2 bg-[#FFF9F7] ">
        <h1 className="text-center font-poppins text-[#755835] font-semibold"></h1>
        <div className="flex w-full max-w-full flex-row items-center  gap-2 ">
          <img src="/images/icons/paw.svg" alt="animal" width={24} height={24} />
          <span className="font-poppins font-bold text-2xl text-[#755835]">{animal.nome}</span>
          <div className=" border border-[#755835] bg-[#FAE588]/40 rounded-xl p-2 max-w-fit">
            <p
              className={`font-poppins text-base font-semibold text-[#755835]/90 ${
                situacao === 'abrigo' ? '' : 'opacity-40'
              }`}
            >
              {situacaoAnimalLabel[situacao]}
            </p>
          </div>
        </div>
      </header>
      <FormEditAnimal initialState={animal} id={idAnimal} />
    </div>
  )
}

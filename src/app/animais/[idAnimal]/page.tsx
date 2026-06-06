import { getRequestApiUrl } from '@/global/constants/api'
import { api } from '@/lib/http/api'
import type { Animal } from '@/modules/animais/types'
import { notFound } from 'next/navigation'

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

  return (
    <>
      <img src={animal.foto} alt={animal.nome} width={100} height={100} />
      <div>Nome: {animal.nome}</div>
      <div>
        <p>Raça: {animal.raca}</p>
        <p>Cor: {animal.cor}</p>
        <p>Sexo: {animal.sexo}</p>
        <p>Data de Nascimento: {String(animal.dataNascimento)}</p>
        <p>Chip: {animal.chip ? 'Sim' : 'Não'}</p>
        <p>Espécie: {animal.especie}</p>
        <p>Data de Chegada: {String(animal.dataChegada)}</p>
      </div>
    </>
  )
}

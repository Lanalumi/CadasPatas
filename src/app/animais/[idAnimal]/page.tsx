import { getRequestApiUrl } from '@/global/constants/api'
import { api } from '@/lib/http/api'
import type { Animal } from '@/modules/animais/types'
import { notFound } from 'next/navigation'

export default async function AnimalPage({ params }: { params: Promise<{ idAnimal: string }> }) {
  const { idAnimal } = await params
  const apiUrl = await getRequestApiUrl()

  try {
    const animal = await api<Animal>(`${apiUrl}/animais/${idAnimal}`, { cache: 'no-store' })
    return (
      <>
        <img src={animal.foto} alt={animal.nome} width={100} height={100} />
        <div>Nome: {animal.nome}</div>
        <div>
          <p>Raça: {animal.raca}</p>
          <p>Cor: {animal.cor}</p>
          <p>Sexo: {animal.sexo}</p>
          <p>Data de Nascimento: {animal.dataNascimento.toString()}</p>
          <p>Chip: {animal.chip}</p>
          <p>Espécie: {animal.especie}</p>
          <p>Data de Chegada: {animal.dataChegada.toString()}</p>
        </div>
      </>
    )
  } catch {
    notFound()
  }
}

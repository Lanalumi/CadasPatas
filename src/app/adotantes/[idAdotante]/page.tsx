import { requirePersonRole } from '@/modules/pessoas/server/loadPessoa'
import { PersonFicha } from '@/modules/pessoas/views/PersonFicha'

export default async function AdotantePage({ params }: { params: Promise<{ idAdotante: string }> }) {
  const { idAdotante } = await params
  const pessoa = await requirePersonRole(idAdotante, 'adotante')

  return <PersonFicha pessoa={pessoa} />
}

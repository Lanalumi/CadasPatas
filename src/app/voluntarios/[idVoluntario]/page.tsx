import { requirePersonRole } from '@/modules/pessoas/server/loadPessoa'
import { PersonFicha } from '@/modules/pessoas/views/PersonFicha'

export default async function VoluntarioPage({ params }: { params: Promise<{ idVoluntario: string }> }) {
  const { idVoluntario } = await params
  const pessoa = await requirePersonRole(idVoluntario, 'voluntario')

  return <PersonFicha pessoa={pessoa} />
}

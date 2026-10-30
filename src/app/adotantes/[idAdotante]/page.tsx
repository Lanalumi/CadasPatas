import { FormEditPerson } from '@/modules/pessoas/views/FormEditPerson'
import { requirePersonRole, toEditablePerson } from '@/modules/pessoas/server/loadPessoa'

export default async function AdotantePage({ params }: { params: Promise<{ idAdotante: string }> }) {
  const { idAdotante } = await params
  const pessoa = await requirePersonRole(idAdotante, 'adotante')

  return (
    <div className="flex max-w-[94%] flex-col p-4">
      <FormEditPerson initialState={toEditablePerson(pessoa)} />
    </div>
  )
}

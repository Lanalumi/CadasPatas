'use client'

import { Controller, useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/global/ui/Button/Button'
import { Field } from '@/global/ui/Field/Field'
import { TextArea } from '@/global/ui/TextArea/TextArea'
import { UpdateAnimal, Animal } from '../../types'
import { useUpdateAnimal } from '../../hooks/useUpdateAnimal'
import { updateAnimalSchema } from '@/schemas/animalSchema'
import { toast } from 'react-toastify'
import { AvatarUpload } from '@/global/ui/AvatarUpload/AvatarUpload'
import { useDeleteAnimal } from '../../hooks/useDeleteAnimal'
import { AnimalApearence } from '../AnimalApearence/AnimalApearence'
import { AnimalHealth } from '../Animalhealth/AnimalHealth'
import { LocalModal } from './LocalModal'

export type AnimalEditFormInput = Omit<UpdateAnimal, 'dataNascimento' | 'dataChegada' | 'sexo' | 'motivoSaida'> & {
  dataNascimento: string
  dataChegada: string
  sexo: 'femea' | 'macho'
  motivoSaida: string
}

function parseBrDate(value: unknown): Date | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value
  }

  if (typeof value !== 'string') {
    return null
  }

  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value.trim())
  if (!match) return null

  const day = Number(match[1])
  const month = Number(match[2])
  const year = Number(match[3])
  const date = new Date(year, month - 1, day)

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null
  }

  return date
}

function formatBrDate(value: Date | string | null): string {
  if (!value) return ''

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

function sameDate(a: Date | null, b: Date | string | null): boolean {
  if (!a && !b) return true
  if (!a || !b) return false
  return a.getTime() === new Date(b).getTime()
}

function sexoLabel(sexo: boolean): 'femea' | 'macho' {
  return sexo ? 'macho' : 'femea'
}

function formValuesFrom(animal: Animal): AnimalEditFormInput {
  return {
    nome: animal.nome,
    sexo: sexoLabel(animal.sexo),
    cor: animal.cor,
    raca: animal.raca,
    pelagem: animal.pelagem,
    dataNascimento: formatBrDate(animal.dataNascimento),
    dataChegada: formatBrDate(animal.dataChegada),
    fivFelv: animal.fivFelv,
    especie: animal.especie,
    foto: animal.foto,
    motivoSaida: animal.motivoSaida ?? '',
  }
}

export default function FormEditAnimal({
  initialState,
  id,
  onSuccess,
}: {
  initialState: Animal
  id: string
  onSuccess?: () => void
}) {
  const router = useRouter()
  const updateAnimalMutation = useUpdateAnimal()
  const [saved, setSaved] = useState(initialState)
  const [editing, setEditing] = useState(false)
  const [noChangesMessage, setNoChangesMessage] = useState<string | null>(null)
  const deleteAnimalMutation = useDeleteAnimal()
  const onDelete = async (idAnimal: string) => {
    if (!confirm('Tem certeza que deseja excluir este animal?')) return

    deleteAnimalMutation.mutate(idAnimal, {
      onSuccess: () => {
        toast.success('Animal excluído com sucesso')
        router.push('/animais')
      },
      onError: () => {
        toast.error('Erro ao excluir animal')
      },
    })
  }

  const {
    register,
    handleSubmit,
    control,
    setError,
    reset,
    formState: { isSubmitting },
  } = useForm<AnimalEditFormInput>({
    defaultValues: formValuesFrom(initialState),
  })

  const leaveEditMode = () => {
    reset(formValuesFrom(saved))
    setNoChangesMessage(null)
    setEditing(false)
  }

  const onSubmit = (values: AnimalEditFormInput) => {
    setNoChangesMessage(null)

    const dataNascimento = values.dataNascimento.trim() ? parseBrDate(values.dataNascimento) : null
    if (values.dataNascimento.trim() && !dataNascimento) {
      setError('dataNascimento', { message: 'Data inválida. Use dd/mm/aaaa' })
      toast.error('Data de nascimento inválida. Use dd/mm/aaaa')
      return
    }

    const dataChegada = parseBrDate(values.dataChegada)
    if (!dataChegada) {
      setError('dataChegada', { message: 'Data inválida. Use dd/mm/aaaa' })
      toast.error('Data de chegada inválida. Use dd/mm/aaaa')
      return
    }

    const result = updateAnimalSchema.safeParse({
      ...values,
      sexo: values.sexo === 'macho',
      dataNascimento,
      dataChegada,
      motivoSaida: values.motivoSaida.trim() || null,
    })

    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0]
        if (typeof field === 'string') {
          setError(field as keyof AnimalEditFormInput, { message: issue.message })
        }
      }

      toast.error(result.error.issues[0]?.message ?? 'Verifique os campos do formulário')
      return
    }

    const data = result.data
    const updates: Partial<UpdateAnimal> = {}
    if (data.nome !== saved.nome) {
      updates.nome = data.nome
    }
    if (data.sexo !== saved.sexo) {
      updates.sexo = data.sexo
    }
    if (data.cor !== saved.cor) {
      updates.cor = data.cor
    }
    if (data.raca !== saved.raca) {
      updates.raca = data.raca
    }
    if (data.pelagem !== saved.pelagem) {
      updates.pelagem = data.pelagem
    }
    if (!sameDate(data.dataNascimento, saved.dataNascimento)) {
      updates.dataNascimento = data.dataNascimento
    }
    if (!sameDate(data.dataChegada, saved.dataChegada)) {
      updates.dataChegada = data.dataChegada
    }
    if (data.fivFelv !== saved.fivFelv) {
      updates.fivFelv = data.fivFelv
    }
    if (data.especie !== saved.especie) {
      updates.especie = data.especie
    }
    if ((data.foto ?? null) !== (saved.foto ?? null)) {
      updates.foto = data.foto
    }
    if ((data.motivoSaida ?? '') !== (saved.motivoSaida ?? '')) {
      updates.motivoSaida = data.motivoSaida?.trim() || null
    }
    if (Object.keys(updates).length === 0) {
      setNoChangesMessage('Nenhum campo alterado')
      return
    }

    updateAnimalMutation.mutate(
      { idAnimal: id, updates },
      {
        onSuccess: (updatedAnimal: Animal) => {
          onSuccess?.()
          setSaved(updatedAnimal)
          reset(formValuesFrom(updatedAnimal))
          setEditing(false)
          toast.success('Animal atualizado com sucesso')
          router.refresh()
        },
        onError: () => {
          toast.error('Erro ao atualizar animal')
        },
      },
    )
  }

  const isLoading = updateAnimalMutation.isPending || isSubmitting

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[#3A250B]/30 bg-white shadow-[2px_4px_14px_rgba(58,37,11,0.1)] p-4 ">
      <header className="flex flex-row items-center justify-center gap-2 w-full max-w-full">
        <img src="/images/icons/paw2.svg" alt="paw" width={24} height={24} />
        <div className="flex items-center justify-center text-center ">
          <span className="text-[#755835] font-poppins font-semibold ">Dados do animal</span>
        </div>
      </header>
      {updateAnimalMutation.error && <div className="error">{updateAnimalMutation.error.message}</div>}
      {noChangesMessage && <div className="error">{noChangesMessage}</div>}
      <form className="flex max-w-full flex-col gap-4 p-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          <div className="flex min-w-0 flex-col gap-4">
            <fieldset disabled={!editing} className="m-0 min-w-0 border-0 p-0">
              <div id="animal-appearance-container" className="flex flex-col gap-4">
                <Controller
                  name="foto"
                  control={control}
                  render={({ field }) => (
                    <AvatarUpload
                      id="foto"
                      label="Foto"
                      disabled={!editing}
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  )}
                />
                <AnimalApearence register={register} editing={editing} />
              </div>
            </fieldset>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                id="voltar-button"
                type="button"
                onClick={() => router.push('/animais')}
                className="cursor-pointer rounded-[10px] border border-[#3A250B]/30 bg-[#FFF9F7] px-4 py-2 font-poppins text-[14px] font-semibold text-[#755835]"
              >
                Voltar
              </Button>
              {!editing ? (
                <Button type="button" green icon="/images/icons/edit-button.svg" onClick={() => setEditing(true)}>
                  Editar
                </Button>
              ) : (
                <>
                  {isLoading ? (
                    <Button type="submit" disabled icon="/images/icons/save-button.svg">
                      Salvando...
                    </Button>
                  ) : (
                    <Button type="submit" green icon="/images/icons/save-button.svg">
                      Salvar
                    </Button>
                  )}
                  <Button id="delete-button" type="button" red onClick={() => onDelete(saved.id)}>
                    {deleteAnimalMutation.isPending ? 'Excluindo...' : 'Excluir'}
                  </Button>
                  <Button id="cancelar-button" type="button" onClick={leaveEditMode}>
                    Cancelar
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="flex min-w-0 flex-col gap-4">
            <fieldset disabled={!editing} className="m-0 border-0 p-0">
              <Field label="Nome" {...register('nome')} id="nome" type="text" />
            </fieldset>
            <AnimalHealth control={control} animalId={id} editing={editing} />
          </div>
          <div className="flex min-w-0 flex-col gap-4">
            <fieldset disabled={!editing} className="m-0 flex flex-col border-0 p-0">
              <Field label="Data de Chegada" id="dataChegada" type="text" {...register('dataChegada')} />
              <Field label="Data de Nascimento" id="dataNascimento" type="text" {...register('dataNascimento')} />
              <TextArea
                label="Motivo de saída"
                id="motivoSaida"
                placeholder="Informe o motivo, se o animal já saiu..."
                {...register('motivoSaida')}
              />
            </fieldset>
            <LocalModal animalId={id} />
          </div>
        </div>
      </form>
    </div>
  )
}

'use client'

import { Controller, useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/global/ui/Button/Button'
import { Field } from '@/global/ui/Field/Field'
import { TextArea } from '@/global/ui/TextArea/TextArea'
import { UpdateAnimal, Animal } from '../../types'
import { useUpdateAnimal } from '../../hooks/useUpdateAnimal'
import { updateAnimalSchema } from '@/schemas/cadastroSchemas'
import { toast } from 'react-toastify'
import { Cores, Pelagens, Sexos } from '../FormNewAnimal/components/especies'
import { DropDown } from '@/global/ui/DropDown/DropDown'
import { Especies } from '../FormNewAnimal/components/especies'
import { AvatarUpload } from '@/global/ui/AvatarUpload/AvatarUpload'
import { CheckBox } from '@/global/ui/CheckBox/CheckBox'
import { useDeleteAnimal } from '../../hooks/useDeleteAnimal'

type AnimalEditFormInput = Omit<UpdateAnimal, 'dataNascimento' | 'dataChegada'> & {
  dataNascimento: string
  dataChegada: string
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

function formatBrDate(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

function sameDate(a: Date, b: Date | string): boolean {
  return a.getTime() === new Date(b).getTime()
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
    formState: { isSubmitting },
  } = useForm<AnimalEditFormInput>({
    defaultValues: {
      nome: initialState.nome,
      sexo: initialState.sexo,
      cor: initialState.cor,
      raca: initialState.raca,
      pelagem: initialState.pelagem,
      dataNascimento: formatBrDate(initialState.dataNascimento),
      dataChegada: formatBrDate(initialState.dataChegada),
      chip: initialState.chip,
      especie: initialState.especie,
      foto: initialState.foto,
      observacoes: initialState.observacoes ?? '',
    },
  })

  const onSubmit = (values: AnimalEditFormInput) => {
    setNoChangesMessage(null)

    const dataNascimento = parseBrDate(values.dataNascimento)
    if (!dataNascimento) {
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
      dataNascimento,
      dataChegada,
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
    if (data.nome !== initialState.nome) {
      updates.nome = data.nome
    }
    if (data.sexo !== initialState.sexo) {
      updates.sexo = data.sexo
    }
    if (data.cor !== initialState.cor) {
      updates.cor = data.cor
    }
    if (data.raca !== initialState.raca) {
      updates.raca = data.raca
    }
    if (data.pelagem !== initialState.pelagem) {
      updates.pelagem = data.pelagem
    }
    if (!sameDate(data.dataNascimento, initialState.dataNascimento)) {
      updates.dataNascimento = data.dataNascimento
    }
    if (!sameDate(data.dataChegada, initialState.dataChegada)) {
      updates.dataChegada = data.dataChegada
    }
    if (data.chip !== initialState.chip) {
      updates.chip = data.chip
    }
    if (data.especie !== initialState.especie) {
      updates.especie = data.especie
    }
    if (data.foto !== initialState.foto) {
      updates.foto = data.foto
    }
    if ((data.observacoes ?? '') !== (initialState.observacoes ?? '')) {
      updates.observacoes = data.observacoes?.trim() || null
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
          toast.success('Animal atualizado com sucesso')
          router.push(`/animais/${updatedAnimal.id}`)
        },
        onError: () => {
          toast.error('Erro ao atualizar animal')
        },
      },
    )
  }

  const isLoading = updateAnimalMutation.isPending || isSubmitting

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[#3A250B]/30 bg-white shadow-[2px_4px_14px_rgba(58,37,11,0.1)] p-4 items-center justify-center">
      <header className="flex flex-row items-center justify-center gap-2 w-full max-w-full">
        <img src="/images/icons/paw2.svg" alt="paw" width={24} height={24} />
        <div className="flex items-center justify-center text-center ">
          <span className="text-[#755835] font-poppins font-semibold ">Dados do animal</span>
        </div>
      </header>
      {updateAnimalMutation.error && <div className="error">{updateAnimalMutation.error.message}</div>}
      {noChangesMessage && <div className="error">{noChangesMessage}</div>}
      <form className="flex flex-col max-w-full gap-4 p-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex md:flex-row flex-col gap-4 max-w-full md:justify-center md:items-center lg:justify-start">
          <div className="flex flex-row gap-4 ">
            <div className="flex flex-row gap-4">
              <div className="flex flex-wrap flex-col gap-4">
                <Field label="Data de Chegada" id="dataChegada" type="text" {...register('dataChegada')} />
                <DropDown
                  label="Espécie"
                  options={[Especies[0].label, Especies[1].label]}
                  value={[Especies[0].value, Especies[1].value]}
                  id="especie"
                  {...register('especie')}
                />
                <DropDown
                  label="Cor"
                  options={Cores.map((cor) => cor.label)}
                  value={Cores.map((cor) => cor.value)}
                  id="cor"
                  {...register('cor')}
                />
                <Field label="Raça" id="raça" type="text" {...register('raca')} />
              </div>
              <div className="flex flex-col gap-4  ">
                <Field label="Nome" {...register('nome')} id="nome" type="text" />
                <Field label="Data de Nascimento" id="dataNascimento" type="text" {...register('dataNascimento')} />
                <Controller
                  name="sexo"
                  control={control}
                  render={({ field }) => (
                    <CheckBox
                      id="sexo"
                      title="Sexo"
                      options={Sexos}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  )}
                />
                <DropDown
                  label="Pelagem"
                  options={Pelagens.map((pelagem) => pelagem.label)}
                  value={Pelagens.map((pelagem) => pelagem.value)}
                  id="pelagem"
                  {...register('pelagem')}
                />
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <Controller
                name="foto"
                control={control}
                render={({ field }) => (
                  <AvatarUpload
                    id="foto"
                    label="Foto"
                    value={initialState.foto ?? ''}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
              <Controller
                name="chip"
                control={control}
                render={({ field }) => (
                  <CheckBox
                    id="chip"
                    title="Chip"
                    value={field.value ? 'sim' : 'nao'}
                    onChange={(selected) => field.onChange(selected === 'sim')}
                    onBlur={field.onBlur}
                    options={[
                      { label: 'Sim', value: 'sim' },
                      { label: 'Não', value: 'nao' },
                    ]}
                  />
                )}
              />
            </div>
          </div>
        </div>
        <div className="flex w-full justify-center">
          <TextArea
            label="Observações"
            id="observacoes"
            placeholder="Fale um pouco sobre o animal..."
            {...register('observacoes')}
          />
        </div>
        <div className="flex flex-wrap md:flex-row md:gap-4 lg:gap-16 items-center justify-center max-w-full">
          {isLoading ? (
            <Button type="submit" disabled icon="/images/icons/save-button.svg">
              Salvando...
            </Button>
          ) : (
            <Button type="submit" green icon="/images/icons/save-button.svg">
              Salvar
            </Button>
          )}
          <Button id="delete-button" type="button" red onClick={() => onDelete(initialState.id)}>
            {deleteAnimalMutation.isPending ? 'Excluindo...' : 'Excluir'}
          </Button>
        </div>
      </form>
    </div>
  )
}

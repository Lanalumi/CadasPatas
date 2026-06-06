'use client'

import { AvatarUpload } from '@/global/ui/AvatarUpload/AvatarUpload'
import { Button } from '@/global/ui/Button/Button'
import { CheckBox } from '@/global/ui/CheckBox/CheckBox'
import { DropDown } from '@/global/ui/DropDown/DropDown'
import { Field } from '@/global/ui/Field/Field'
import { TextArea } from '@/global/ui/TextArea/TextArea'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { CreateAnimal, CreateAnimalForm } from '../../types'
import { toast } from 'react-toastify'
import { Especies, Cores, Sexos, Pelagens } from './components/especies'
import { createAnimalSchema } from '@/schemas/cadastroSchemas'
import { useCreateAnimal } from '../../hooks/useCreateAnimal'
import { ApiError } from '@/lib/client/errors'

type AnimalFormInput = Omit<CreateAnimalForm, 'dataNascimento' | 'dataChegada'> & {
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

export const FormNewAnimal = () => {
  const router = useRouter()
  const createAnimalMutation = useCreateAnimal()

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AnimalFormInput>({
    defaultValues: {
      dataChegada: '',
      especie: '',
      raca: '',
      cor: '',
      nome: '',
      dataNascimento: '',
      sexo: 'femea',
      pelagem: '',
      foto: '',
      chip: false,
      observacoes: '',
    },
  })

  const onSubmit = (values: AnimalFormInput) => {
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

    const result = createAnimalSchema.safeParse({
      ...values,
      dataNascimento,
      dataChegada,
    })

    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0]
        if (typeof field === 'string') {
          setError(field as keyof AnimalFormInput, { message: issue.message })
        }
      }

      toast.error(result.error.issues[0]?.message ?? 'Verifique os campos do formulário')
      return
    }

    createAnimalMutation.mutate(result.data as CreateAnimal, {
      onSuccess: (createdAnimal) => {
        toast.success('Animal cadastrado com sucesso')
        // Navigate immediately without clearing form state to prevent freezing
        router.push(`/animais/${createdAnimal.id}`)
      },
      onError: (error) => {
        const message = error instanceof ApiError ? error.message : 'Erro ao cadastrar animal, tente novamente'
        toast.error(message)
      },
    })
  }

  const validationMessages = Object.values(errors)
    .map((error) => error?.message)
    .filter((message): message is string => Boolean(message))

  const isLoading = createAnimalMutation.isPending || isSubmitting

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[#3A250B]/30 bg-white shadow-[2px_4px_14px_rgba(58,37,11,0.1)] p-4 items-center justify-center">
      <header className="flex flex-row items-center justify-center gap-2 w-full max-w-full">
        <img src="/images/icons/paw2.svg" alt="paw" width={24} height={24} />
        <div className="flex items-center justify-center text-center ">
          <span className="text-[#755835] font-poppins font-semibold ">Dados do animal</span>
        </div>
      </header>
      <form className="flex flex-col max-w-full gap-4 p-4 " onSubmit={handleSubmit(onSubmit)}>
        {validationMessages.length > 0 && (
          <div
            role="alert"
            className="rounded-md border border-[#B85454]/40 bg-[#FFF0ED] px-4 py-3 text-sm text-[#8A3B3B]"
          >
            <p className="font-poppins font-semibold">Corrija os erros abaixo:</p>
            <ul className="mt-2 list-disc pl-5 font-poppins">
              {validationMessages.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex md:flex-row flex-col gap-4 max-w-full md:justify-center md:items-center lg:justify-start">
          <div className="flex flex-row gap-4 ">
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
              <Field label="Nome" id="nome" type="text" {...register('nome')} />
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
                  value={field.value ?? ''}
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

          {/* <Button green>Limpar</Button> */}
        </div>
      </form>
    </div>
  )
}

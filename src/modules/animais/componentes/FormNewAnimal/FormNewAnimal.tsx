'use client'

import { AvatarUpload } from '@/global/ui/AvatarUpload/AvatarUpload'
import { Button } from '@/global/ui/Button/Button'
import { CheckBox } from '@/global/ui/CheckBox/CheckBox'
import { DropDown } from '@/global/ui/DropDown/DropDown'
import { Field } from '@/global/ui/Field/Field'
import { TextArea } from '@/global/ui/TextArea/TextArea'
import { useRouter } from 'next/navigation'
import { Controller, FieldErrors, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateAnimal, CreateAnimalForm } from '../../types'
import { toast } from 'react-toastify'
import { Especies, Cores, Sexos, Pelagens } from './components/especies'
import { createAnimalSchema } from '@/schemas/cadastroSchemas'
import { useCreateAnimal } from '../../hooks/useCreateAnimal'
import { ApiError } from '@/lib/client/errors'

export const FormNewAnimal = () => {
  const router = useRouter()
  const createAnimalMutation = useCreateAnimal()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateAnimalForm, unknown, CreateAnimal>({
    resolver: zodResolver(createAnimalSchema),
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

  const onSubmit = (data: CreateAnimal) => {
    createAnimalMutation.mutate(data, {
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

  const onInvalid = (fieldErrors: FieldErrors<CreateAnimalForm>) => {
    const messages = Object.values(fieldErrors)
      .map((error) => error?.message)
      .filter((message): message is string => Boolean(message))

    toast.error(messages[0] ?? 'Verifique os campos do formulário')

    if (messages.length > 1) {
      toast.error(`Mais ${messages.length - 1} campo(s) com erro`)
    }
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
      <form className="flex flex-col max-w-full gap-4 p-4 " onSubmit={handleSubmit(onSubmit, onInvalid)}>
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
          <Button type="submit" green disabled={isLoading}>
            Salvar
          </Button>
          {/* <Button green>Limpar</Button> */}
        </div>
      </form>
    </div>
  )
}

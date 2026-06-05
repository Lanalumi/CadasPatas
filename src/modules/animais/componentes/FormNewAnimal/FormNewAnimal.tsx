'use client'

import { AvatarUpload } from '@/global/ui/AvatarUpload/AvatarUpload'
import { Button } from '@/global/ui/Button/Button'
import { CheckBox } from '@/global/ui/CheckBox/CheckBox'
import { DropDown } from '@/global/ui/DropDown/DropDown'
import { Field } from '@/global/ui/Field/Field'
import { TextArea } from '@/global/ui/TextArea/TextArea'
import { useRouter } from 'next/navigation'
import { FieldErrors, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateAnimal } from '../../types'
import { toast } from 'react-toastify'
import { Especies, Cores, Sexos, Pelagens } from './components/especies'
import { createAnimalSchema } from '@/schemas/cadastroSchemas'
import { useCreateAnimal } from '../../hooks/useCreateAnimal'

export const FormNewAnimal = () => {
  const router = useRouter()
  const createAnimalMutation = useCreateAnimal()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateAnimal>({
    resolver: zodResolver(createAnimalSchema),
    defaultValues: {
      dataChegada: new Date(),
      especie: '',
      raca: '',
      cor: '',
      nome: '',
      dataNascimento: new Date(),
      sexo: '',
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
      onError: () => {
        // Error handling is done by the global error handler
        toast.error('Erro ao cadastrar animal, tente novamente')
      },
    })
  }

  const onInvalid = (fieldErrors: FieldErrors<CreateAnimal>) => {
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
    <div className="flex flex-col gap-4 rounded-xl border border-[#3A250B]/30 bg-white shadow-[2px_4px_14px_rgba(58,37,11,0.1)] p-4">
      <header className="flex flex-row items-center justify-center gap-2 w-full max-w-full p-4">
        <img src="/images/icons/paw2.svg" alt="paw" width={24} height={24} />
        <div className="flex items-center justify-center text-center ">
          <span className="text-[#755835] font-poppins font-semibold ">Dados do animal</span>
        </div>
      </header>
      <form className="flex flex-col w-full max-w-full gap-4" onSubmit={handleSubmit(onSubmit, onInvalid)}>
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
        <div className="flex md:flex-row flex-col gap-4 max-w-full md:justify-center md:items-center lg:justify-start border border-red-400">
          <div className="flex flex-row gap-4 ">
            <div className="flex flex-wrap flex-col gap-4">
              <Field label="Código de Identificação" id="codigoIdentificacao" type="text" />
              <Field label="Data de Chegada" id="dataChegada" type="text" {...register('dataChegada')} />
              <DropDown
                options={[Especies[0].label, Especies[1].label]}
                value={[Especies[0].value, Especies[1].value]}
                id="especie"
                {...register('especie')}
              />
              <DropDown
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
              <CheckBox title="Sexo" id="sexo" options={Sexos} {...register('sexo')} />
              <DropDown
                options={Pelagens.map((pelagem) => pelagem.label)}
                value={Pelagens.map((pelagem) => pelagem.value)}
                id="pelagem"
                {...register('pelagem')}
              />
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <AvatarUpload label="Foto" id="foto" {...register('foto')} />
            <CheckBox
              title="Chip"
              id="chip"
              options={[
                { label: 'Sim', value: 'sim', checked: true },
                { label: 'Não', value: 'nao', checked: false },
              ]}
              {...register('chip')}
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

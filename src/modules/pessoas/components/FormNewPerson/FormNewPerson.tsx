'use client'

import { AvatarUpload, Button, CheckBox, DropDown, Field } from '@/global/ui'
import { ApiError } from '@/lib/client/errors'
import { useCreatePessoa } from '@/modules/pessoas/hooks/useCreatePessoa'
import { CreatePessoa } from '@/modules/pessoas/types'
import { createAdotanteSchema, createPersonSchema, createVoluntarioSchema } from '@/schemas/personSchema'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

const personRoles = [
  { label: 'Voluntário', value: 'voluntario' },
  { label: 'Adotante', value: 'adotante' },
] as const

type PersonFormInput = Omit<CreatePessoa, 'dataNascimento' | 'tipo'> & {
  dataNascimento: string
  tipo: string
  dataInscricao: string
  dataSaida: string
  aptoDoacao: boolean
}

export const FormNewPerson = () => {
  const router = useRouter()
  const createPessoaMutation = useCreatePessoa()

  const {
    register,
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PersonFormInput>({
    defaultValues: {
      nome: '',
      cpf: '',
      dataNascimento: '',
      endereco: '',
      telefone: '',
      email: '',
      tipo: '',
      dataInscricao: '',
      dataSaida: '',
      aptoDoacao: false,
      foto: '',
    },
  })

  const tipo = watch('tipo')

  const reportIssues = (issues: { path: PropertyKey[]; message: string }[]) => {
    for (const issue of issues) {
      const field = issue.path[0]
      if (typeof field === 'string') {
        setError(field as keyof PersonFormInput, { message: issue.message })
      }
    }

    toast.error(issues[0]?.message ?? 'Verifique os campos do formulário')
  }

  const onSubmit = (values: PersonFormInput) => {
    const saved = {
      onSuccess: (createdPessoa: { idPessoa: string }) => {
        toast.success('Pessoa cadastrada com sucesso')
        router.push(`/pessoas/${createdPessoa.idPessoa}`)
      },
      onError: (error: unknown) => {
        const message = error instanceof ApiError ? error.message : 'Erro ao cadastrar pessoa, tente novamente'
        toast.error(message)
      },
    }

    if (values.tipo === 'voluntario') {
      const result = createVoluntarioSchema.safeParse(values)
      if (!result.success) {
        reportIssues(result.error.issues)
        return
      }

      createPessoaMutation.mutate(result.data, saved)
      return
    }

    if (values.tipo === 'adotante') {
      const result = createAdotanteSchema.safeParse(values)
      if (!result.success) {
        reportIssues(result.error.issues)
        return
      }

      createPessoaMutation.mutate(result.data, saved)
      return
    }

    const result = createPersonSchema.safeParse(values)
    reportIssues(result.success ? [{ path: ['tipo'], message: 'Escolha voluntário ou adotante' }] : result.error.issues)
  }

  const validationMessages = Object.values(errors)
    .map((error) => error?.message)
    .filter((message): message is string => Boolean(message))

  const isLoading = createPessoaMutation.isPending || isSubmitting

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[#3A250B]/30 bg-white shadow-[2px_4px_14px_rgba(58,37,11,0.1)] p-4 items-center justify-center">
      <header className="flex flex-row items-center justify-center gap-2 w-full max-w-full">
        <img src="/images/icons/paw2.svg" alt="paw" width={24} height={24} />
        <div className="flex items-center justify-center text-center ">
          <span className="text-[#755835] font-poppins font-semibold ">Dados da pessoa</span>
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
              <Field label="Nome" id="nome" type="text" {...register('nome')} />
              <Field label="CPF" id="cpf" type="text" {...register('cpf')} />
              <Field
                label="Data de Nascimento"
                id="dataNascimento"
                type="text"
                placeholder="dd/mm/aaaa"
                {...register('dataNascimento')}
              />
              <Field label="Telefone" id="telefone" type="tel" {...register('telefone')} />
            </div>
            <div className="flex flex-col gap-4  ">
              <Field label="E-mail" id="email" type="email" {...register('email')} />
              <Field label="Endereço" id="endereco" type="text" {...register('endereco')} />
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
              <DropDown
                label="Tipo de pessoa"
                options={['Selecione', ...personRoles.map((role) => role.label)]}
                value={['', ...personRoles.map((role) => role.value)]}
                id="tipo"
                {...register('tipo')}
              />
            </div>
          </div>
        </div>
        {tipo === 'voluntario' && (
          <div className="flex flex-col gap-4">
            <span className="text-[#755835] font-poppins font-semibold">Dados do voluntário</span>
            <div className="flex flex-wrap gap-4">
              <Field
                label="Data de inscrição"
                id="dataInscricao"
                type="text"
                placeholder="dd/mm/aaaa"
                {...register('dataInscricao')}
              />
              <Field
                label="Data de saída"
                id="dataSaida"
                type="text"
                placeholder="dd/mm/aaaa"
                {...register('dataSaida')}
              />
            </div>
          </div>
        )}
        {tipo === 'adotante' && (
          <div className="flex flex-col gap-4">
            <span className="text-[#755835] font-poppins font-semibold">Dados do adotante</span>
            <Controller
              name="aptoDoacao"
              control={control}
              render={({ field }) => (
                <CheckBox
                  id="aptoDoacao"
                  title="Apto para doação"
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
        )}
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
        </div>
      </form>
    </div>
  )
}

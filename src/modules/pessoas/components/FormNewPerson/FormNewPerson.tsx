'use client'

import { Button, DropDown, Field } from '@/global/ui'
import { ApiError } from '@/lib/client/errors'
import { personHref, type PersonRole } from '@/modules/pessoas/personRole'
import { useCreatePessoa } from '@/modules/pessoas/hooks/useCreatePessoa'
import { createPersonSchema } from '@/schemas/personSchema'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

const personRoles = [
  { label: 'Voluntário', value: 'voluntario' },
  { label: 'Adotante', value: 'adotante' },
] as const

type PersonFormInput = {
  nome: string
  cpf: string
  dataNascimento: string
  telefone: string
  rua: string
  numero: string
  bairro: string
  cidade: string
  dataInicio: string
  dataSaida: string
  tipo: string
}

const headings: Record<PersonRole | 'pessoa', string> = {
  pessoa: 'Dados da pessoa',
  voluntario: 'Dados do voluntário',
  adotante: 'Dados do adotante',
}

export const FormNewPerson = ({ role }: { role?: PersonRole }) => {
  const router = useRouter()
  const createPessoaMutation = useCreatePessoa()

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PersonFormInput>({
    defaultValues: {
      nome: '',
      cpf: '',
      dataNascimento: '',
      telefone: '',
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      dataInicio: '',
      dataSaida: '',
      tipo: role ?? '',
    },
  })

  const selectedRole = role ?? watch('tipo')
  const tipo = selectedRole === 'voluntario' || selectedRole === 'adotante' ? selectedRole : null

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
    if (values.tipo === 'voluntario' && !values.dataInicio.trim()) {
      setError('dataInicio', { message: 'Informe a data de inscrição' })
      toast.error('Informe a data de inscrição')
      return
    }

    if (values.tipo === 'adotante' && !values.dataInicio.trim()) {
      setError('dataInicio', { message: 'Informe a data de cadastro' })
      toast.error('Informe a data de cadastro')
      return
    }

    const result = createPersonSchema.safeParse({
      ...values,
      dataSaida: values.tipo === 'voluntario' && values.dataSaida.trim() ? values.dataSaida : null,
    })

    if (!result.success) {
      reportIssues(result.error.issues)
      return
    }

    const createdRole = result.data.tipo

    createPessoaMutation.mutate(result.data, {
      onSuccess: (createdPessoa: { idPessoa: string }) => {
        toast.success(
          createdRole === 'voluntario' ? 'Voluntário cadastrado com sucesso' : 'Adotante cadastrado com sucesso',
        )
        router.push(personHref(createdPessoa.idPessoa, createdRole))
      },
      onError: (error: unknown) => {
        const message = error instanceof ApiError ? error.message : 'Erro ao cadastrar pessoa, tente novamente'
        toast.error(message)
      },
    })
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
          <span className="text-[#755835] font-poppins font-semibold ">{headings[tipo ?? 'pessoa']}</span>
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
        {role ? (
          <input type="hidden" {...register('tipo')} />
        ) : (
          <DropDown
            label="Tipo de pessoa"
            options={['Selecione', ...personRoles.map((personRoleOption) => personRoleOption.label)]}
            value={['', ...personRoles.map((personRoleOption) => personRoleOption.value)]}
            id="tipo"
            {...register('tipo')}
          />
        )}
        <div className="flex md:flex-row flex-col gap-4 max-w-full md:justify-center md:items-center lg:justify-start">
          <div className="flex flex-row gap-4 ">
            <div className="flex flex-wrap flex-col gap-4">
              <Field label="Nome" id="nome" type="text" {...register('nome')} />
              <Field label="CPF" id="cpf" type="text" {...register('cpf')} />
              <Field
                label="Data de nascimento"
                id="dataNascimento"
                type="text"
                placeholder="dd/mm/aaaa"
                {...register('dataNascimento')}
              />
              <Field label="Telefone" id="telefone" type="tel" {...register('telefone')} />
            </div>
            <div className="flex flex-col gap-4  ">
              <Field label="Rua" id="rua" type="text" {...register('rua')} />
              <Field label="Número" id="numero" type="text" {...register('numero')} />
              <Field label="Bairro" id="bairro" type="text" {...register('bairro')} />
              <Field label="Cidade" id="cidade" type="text" {...register('cidade')} />
            </div>
          </div>
        </div>
        {tipo === 'voluntario' && (
          <section className="flex flex-col gap-4 border-t border-[#3A250B]/20 pt-4">
            <h2 className="font-poppins font-semibold text-[#755835]">Dados do voluntariado</h2>
            <div className="flex flex-wrap gap-4">
              <Field
                label="Data de inscrição"
                id="dataInscricao"
                type="text"
                placeholder="dd/mm/aaaa"
                {...register('dataInicio')}
              />
              <Field
                label="Data de saída"
                id="dataSaida"
                type="text"
                placeholder="dd/mm/aaaa"
                {...register('dataSaida')}
              />
            </div>
          </section>
        )}
        {tipo === 'adotante' && (
          <section className="flex flex-col gap-4 border-t border-[#3A250B]/20 pt-4">
            <h2 className="font-poppins font-semibold text-[#755835]">Dados do adotante</h2>
            <Field
              label="Data de cadastro"
              id="dataCadastro"
              type="text"
              placeholder="dd/mm/aaaa"
              {...register('dataInicio')}
            />
          </section>
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

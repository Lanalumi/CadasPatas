'use client'

import { Button } from '@/global/ui/Button/Button'
import { Field } from '@/global/ui/Field/Field'
import { ApiError } from '@/lib/client/errors'
import { createClinicaSchema } from '@/schemas/clinicaSchema'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useCreateClinica } from '../../hooks/useCreateClinica'

type ClinicaFormInput = {
  nome: string
  cnpj: string
  telefone: string
  rua: string
  numero: string
  bairro: string
  cidade: string
}

export function FormNewClinica() {
  const router = useRouter()
  const createClinicaMutation = useCreateClinica()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ClinicaFormInput>({
    defaultValues: {
      nome: '',
      cnpj: '',
      telefone: '',
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
    },
  })

  const onSubmit = (values: ClinicaFormInput) => {
    const result = createClinicaSchema.safeParse(values)

    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0]
        if (typeof field === 'string') {
          setError(field as keyof ClinicaFormInput, { message: issue.message })
        }
      }
      toast.error(result.error.issues[0]?.message ?? 'Verifique os campos do formulário')
      return
    }

    createClinicaMutation.mutate(result.data, {
      onSuccess: () => {
        toast.success('Clínica cadastrada com sucesso')
        router.push('/clinicas')
      },
      onError: (error) => {
        toast.error(error instanceof ApiError ? error.message : 'Erro ao cadastrar clínica')
      },
    })
  }

  const validationMessages = Object.values(errors)
    .map((error) => error?.message)
    .filter((message): message is string => Boolean(message))
  const isLoading = createClinicaMutation.isPending || isSubmitting

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-[#3A250B]/30 bg-white p-4 shadow-[2px_4px_14px_rgba(58,37,11,0.1)]">
      <header className="flex w-full flex-row items-center justify-center gap-2">
        <img src="/images/icons/paw2.svg" alt="" width={24} height={24} />
        <span className="font-poppins font-semibold text-[#755835]">Dados da clínica</span>
      </header>
      <form className="flex max-w-full flex-col gap-4 p-4" onSubmit={handleSubmit(onSubmit)}>
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
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex flex-col gap-4">
            <Field label="Nome" id="nome" type="text" {...register('nome')} />
            <Field label="CNPJ" id="cnpj" type="text" {...register('cnpj')} />
            <Field label="Telefone" id="telefone" type="tel" {...register('telefone')} />
          </div>
          <div className="flex flex-col gap-4">
            <Field label="Rua" id="rua" type="text" {...register('rua')} />
            <Field label="Número" id="numero" type="text" {...register('numero')} />
            <Field label="Bairro" id="bairro" type="text" {...register('bairro')} />
            <Field label="Cidade" id="cidade" type="text" {...register('cidade')} />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {isLoading ? (
            <Button type="submit" disabled icon="/images/icons/save-button.svg">
              Salvando...
            </Button>
          ) : (
            <Button type="submit" green icon="/images/icons/save-button.svg">
              Salvar
            </Button>
          )}
          <Button type="button" onClick={() => router.push('/clinicas')}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}

'use client'

import { Button } from '@/global/ui/Button/Button'
import { Field } from '@/global/ui/Field/Field'
import { ApiError } from '@/lib/client/errors'
import { createLocalizacaoSchema } from '@/schemas/localizacaoSchema'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { useCreateGatil } from '../../hooks/useCreateGatil'

type GatilFormInput = z.infer<typeof createLocalizacaoSchema>

export function FormNewGatil() {
  const router = useRouter()
  const createGatil = useCreateGatil()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<GatilFormInput>({
    defaultValues: { tipoLocal: '', nome: '' },
  })

  const onSubmit = (values: GatilFormInput) => {
    const result = createLocalizacaoSchema.safeParse(values)

    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0]
        if (typeof field === 'string') {
          setError(field as keyof GatilFormInput, { message: issue.message })
        }
      }
      toast.error(result.error.issues[0]?.message ?? 'Verifique os campos do formulário')
      return
    }

    createGatil.mutate(result.data, {
      onSuccess: () => {
        toast.success('Gatil cadastrado com sucesso')
        router.push('/gatis')
        router.refresh()
      },
      onError: (error) => {
        toast.error(error instanceof ApiError ? error.message : 'Erro ao cadastrar gatil')
      },
    })
  }

  const validationMessages = Object.values(errors)
    .map((error) => error?.message)
    .filter((message): message is string => Boolean(message))
  const isLoading = createGatil.isPending || isSubmitting

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-[#3A250B]/30 bg-white p-4 shadow-[2px_4px_14px_rgba(58,37,11,0.1)]">
      <header className="flex w-full flex-row items-center justify-center gap-2">
        <img src="/images/icons/paw2.svg" alt="" width={24} height={24} />
        <span className="font-poppins font-semibold text-[#755835]">Dados do gatil</span>
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
        <Field label="Nome" id="nome" type="text" {...register('nome')} />
        <Field label="Tipo de local" id="tipoLocal" type="text" {...register('tipoLocal')} />
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
          <Button type="button" onClick={() => router.push('/gatis')}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}

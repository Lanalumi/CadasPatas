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
    <div className="w-full max-w-2xl mx-auto rounded-3xl border border-[#755835]/20 bg-white p-6 sm:p-8 shadow-[0_10px_30px_rgba(58,37,11,0.05)] font-poppins">
      
      {/* Cabeçalho Centralizado com Ícone e Título */}
      <header className="flex flex-col items-center justify-center text-center gap-2 pb-6 mb-6 border-b border-[#755835]/15">
        <div className="flex items-center justify-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-2xl bg-[#755835]/10 text-[#755835] shrink-0">
            <img src="/images/icons/paw2.svg" alt="Patinha" width={20} height={20} className="object-contain" />
          </div>
          <h1 className="text-xl font-bold text-[#3A250B] tracking-tight">
            Dados do gatil
          </h1>
        </div>
      </header>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        
        {/* Mensagens de Alerta de Erro */}
        {validationMessages.length > 0 && (
          <div
            role="alert"
            className="rounded-2xl border border-[#B85454]/30 bg-[#FFF0ED] p-4 text-xs text-[#8A3B3B]"
          >
            <p className="font-bold">Corrija os erros abaixo:</p>
            <ul className="mt-1.5 list-disc pl-5 font-medium flex flex-col gap-0.5">
              {validationMessages.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Grade de Formulário em 2 Colunas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nome" id="nome" type="text" {...register('nome')} />
          <Field label="Tipo de local" id="tipoLocal" type="text" {...register('tipoLocal')} />
        </div>

        {/* Botões de Ação Centralizados */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-[#755835]/15 mt-2">
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
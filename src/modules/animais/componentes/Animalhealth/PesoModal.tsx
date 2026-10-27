'use client'

import { useListQuery } from '@/global/hooks/useListQuery'
import { useMutation } from '@/global/hooks/useMutation'
import { API_URL } from '@/global/constants/api'
import { Card } from '@/global/ui/Card/Card'
import { Field } from '@/global/ui/Field/Field'
import { api } from '@/lib/http/api'
import { ApiError } from '@/lib/client/errors'
import { createPesoSchema, pesoRegistroSchema, pesoResumoSchema, type PesoRegistro, type PesoResumo } from '@/schemas/pesoSchema'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

type PesoModalProps = {
  animalId: string
  enabled?: boolean
}

function formatDate(value: Date) {
  const day = String(value.getUTCDate()).padStart(2, '0')
  const month = String(value.getUTCMonth() + 1).padStart(2, '0')
  const year = value.getUTCFullYear()

  return `${day}/${month}/${year}`
}

function formatPeso(value: number) {
  return `${value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kg`
}

function todayBr() {
  const now = new Date()
  const day = String(now.getDate()).padStart(2, '0')
  const month = String(now.getMonth() + 1).padStart(2, '0')

  return `${day}/${month}/${now.getFullYear()}`
}

type PesoFormInput = {
  quantidadePeso: string
  dataPesagem: string
}

function PesoCard({ registro }: { registro: PesoRegistro }) {
  return (
    <Card
      title={formatPeso(registro.quantidadePeso)}
      infos={[
        { label: 'Data', value: formatDate(registro.dataPesagem) },
        { label: 'Status', value: registro.status },
      ]}
    />
  )
}

export function PesoModal({ animalId, enabled = true }: PesoModalProps) {
  const queryClient = useQueryClient()
  const peso = useListQuery<PesoResumo>({
    queryKey: ['peso', animalId],
    queryFn: async () => pesoResumoSchema.parse(await api<PesoResumo>(`${API_URL}/animais/${animalId}/peso`)),
    enabled,
  })
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<PesoFormInput>({
    defaultValues: {
      quantidadePeso: '',
      dataPesagem: todayBr(),
    },
  })
  const createPeso = useMutation<PesoRegistro, ApiError, PesoFormInput>({
    mutationFn: async (values) => {
      const created = await api(`${API_URL}/animais/${animalId}/peso`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      return pesoRegistroSchema.parse(created)
    },
    onSuccess: async () => {
      toast.success('Pesagem registrada')
      reset({ quantidadePeso: '', dataPesagem: todayBr() })
      await queryClient.invalidateQueries({ queryKey: ['peso', animalId] })
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Erro ao registrar pesagem')
    },
  })

  const onSubmit = (values: PesoFormInput) => {
    const result = createPesoSchema.safeParse(values)

    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0]
        if (field === 'quantidadePeso' || field === 'dataPesagem') {
          setError(field, { message: issue.message })
        }
      }
      toast.error(result.error.issues[0]?.message ?? 'Verifique os campos do formulário')
      return
    }

    createPeso.mutate({
      quantidadePeso: String(result.data.quantidadePeso),
      dataPesagem: result.data.dataPesagem.toISOString(),
    })
  }

  const atual = peso.data?.atual ?? null
  const historico = peso.data?.historico ?? []
  const validationMessages = [errors.quantidadePeso?.message, errors.dataPesagem?.message].filter(
    (message): message is string => Boolean(message),
  )

  return (
    <div className="flex flex-col gap-4">
      <form
        onSubmit={(event) => {
          event.stopPropagation()
          void handleSubmit(onSubmit)(event)
        }}
        className="flex flex-col gap-3"
      >
        <p className="font-poppins text-sm font-semibold text-[#755835]">Nova pesagem</p>
        {validationMessages.length > 0 ? (
          <div role="alert" className="rounded-md border border-[#B85454]/40 bg-[#FFF0ED] px-3 py-2 text-sm text-[#8A3B3B]">
            <ul className="list-disc pl-5 font-poppins">
              {validationMessages.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="flex flex-wrap gap-3">
          <Field
            label="Peso (kg)"
            id={`peso-${animalId}`}
            type="text"
            inputMode="decimal"
            placeholder="0,0"
            {...register('quantidadePeso')}
          />
          <Field
            label="Data"
            id={`data-peso-${animalId}`}
            type="text"
            placeholder="dd/mm/aaaa"
            {...register('dataPesagem')}
          />
        </div>
        <button
          type="submit"
          disabled={createPeso.isPending}
          className="w-fit cursor-pointer rounded-[10px] bg-[#8AA36C] px-4 py-2 font-poppins text-sm font-semibold text-white disabled:cursor-default disabled:opacity-50"
        >
          {createPeso.isPending ? 'Salvando...' : 'Registrar'}
        </button>
      </form>
      {peso.isPending ? (
        <p className="font-poppins text-sm font-semibold text-[#755835]/70">Carregando peso...</p>
      ) : null}
      {peso.isError ? (
        <p className="font-poppins text-sm font-semibold text-[#8A3B3B]">Não foi possível carregar o peso.</p>
      ) : null}
      {peso.data && !atual ? (
        <p className="font-poppins text-sm font-semibold text-[#755835]">Nenhuma pesagem registrada.</p>
      ) : null}
      {atual ? (
        <>
          <section className="rounded-xl border border-[#3A250B]/30 bg-[#FFF9F7] p-4">
            <p className="font-poppins text-sm font-semibold text-[#755835]/70">Peso atual</p>
            <p className="font-poppins text-3xl font-bold text-[#755835]">{formatPeso(atual.quantidadePeso)}</p>
            <p className="font-poppins text-sm font-semibold text-[#755835]/70">
              Pesagem em {formatDate(atual.dataPesagem)}
            </p>
          </section>
          <section className="flex min-h-0 flex-col">
            <h2 className="shrink-0 font-poppins text-lg font-bold text-[#755835]">Histórico</h2>
            <div className="mt-3 max-h-64 min-h-0 overflow-y-auto overscroll-y-contain pr-1">
              {historico.length === 0 ? (
                <p className="font-poppins text-sm font-semibold text-[#755835]/70">Nenhuma pesagem anterior.</p>
              ) : (
                <ul className="flex w-full flex-col gap-3 pb-2">
                  {historico.map((registro) => (
                    <li key={registro.id}>
                      <PesoCard registro={registro} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </>
      ) : null}
    </div>
  )
}

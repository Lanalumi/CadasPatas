'use client'

import { Button } from '@/global/ui/Button/Button'
import { Field } from '@/global/ui/Field/Field'
import { ApiError } from '@/lib/client/errors'
import { updateLocalizacaoSchema } from '@/schemas/localizacaoSchema'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useUpdateGatil } from '../../hooks/useUpdateGatil'
import { Localizacao } from '../../types'

type GatilEditFormInput = {
  nome: string
  tipoLocal: string
  ativo: 'true' | 'false'
}

function formValuesFrom(local: Pick<Localizacao, 'nome' | 'tipoLocal' | 'ativo'>): GatilEditFormInput {
  return {
    nome: local.nome,
    tipoLocal: local.tipoLocal,
    ativo: local.ativo ? 'true' : 'false',
  }
}

export function FormEditGatil({ initialState }: { initialState: Localizacao }) {
  const router = useRouter()
  const updateGatil = useUpdateGatil()
  const [saved, setSaved] = useState(initialState)
  const [editing, setEditing] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<GatilEditFormInput>({
    defaultValues: formValuesFrom(initialState),
  })

  const leaveEditMode = () => {
    reset(formValuesFrom(saved))
    setEditing(false)
  }

  const onSubmit = (values: GatilEditFormInput) => {
    const result = updateLocalizacaoSchema.safeParse({
      nome: values.nome,
      tipoLocal: values.tipoLocal,
      ativo: values.ativo === 'true',
    })

    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0]
        if (typeof field === 'string' && field in values) {
          setError(field as keyof GatilEditFormInput, { message: issue.message })
        }
      }
      toast.error(result.error.issues[0]?.message ?? 'Verifique os campos do formulário')
      return
    }

    updateGatil.mutate(
      { id: saved.id, data: result.data },
      {
        onSuccess: (updated) => {
          setSaved(updated)
          reset(formValuesFrom(updated))
          setEditing(false)
          toast.success('Gatil atualizado')
          router.refresh()
        },
        onError: (error) => {
          toast.error(error instanceof ApiError ? error.message : 'Erro ao atualizar gatil')
        },
      },
    )
  }

  const validationMessages = Object.values(errors)
    .map((error) => error?.message)
    .filter((message): message is string => Boolean(message))
  const isLoading = updateGatil.isPending || isSubmitting

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
        <fieldset
          disabled={!editing}
          className={`m-0 flex flex-col gap-4 border-0 p-0 ${editing ? '' : 'opacity-70'}`}
        >
          <Field label="Nome" id="nome" type="text" disabled={!editing} {...register('nome')} />
          <Field label="Tipo de local" id="tipoLocal" type="text" disabled={!editing} {...register('tipoLocal')} />
          <div className="flex max-w-60 flex-col">
            <label className="font-poppins text-base font-semibold text-[#755835]" htmlFor="ativo">
              Status
            </label>
            <select
              id="ativo"
              disabled={!editing}
              className="rounded-md border border-[#3A250B]/30 bg-[#FFF9F7] p-2 font-poppins text-base font-semibold text-[#755835] outline-none disabled:cursor-not-allowed"
              {...register('ativo')}
            >
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
          </div>
        </fieldset>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {!editing ? (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="flex cursor-pointer flex-row items-center justify-center gap-2 rounded-[10px] bg-[#8AA36C] px-4 py-2 font-poppins text-[14px] font-semibold text-white"
            >
              <img src="/images/icons/edit-button.svg" alt="" width={20} height={20} />
              Editar
            </button>
          ) : (
            <>
              {isLoading ? (
                <Button type="submit" disabled icon="/images/icons/save-button.svg">
                  Salvando...
                </Button>
              ) : (
                <Button type="submit" green icon="/images/icons/save-button.svg">
                  Salvar
                </Button>
              )}
              <Button type="button" onClick={leaveEditMode}>
                Cancelar
              </Button>
            </>
          )}
        </div>
      </form>
    </div>
  )
}

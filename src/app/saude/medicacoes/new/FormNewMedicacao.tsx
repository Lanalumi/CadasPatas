'use client'

import { Button } from '@/global/ui/Button/Button'
import { Field } from '@/global/ui/Field/Field'
import { API_URL } from '@/global/constants/api'
import { useMutation } from '@/global/hooks/useMutation'
import { api } from '@/lib/http/api'
import { ApiError } from '@/lib/client/errors'
import { createMedicacaoSchema } from '@/schemas/saudeSchema'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { SelectField } from '../../SelectField'

type Option = { id: string; nome: string }
type ConsultaOption = { id: string; animalId: string; label: string }

type MedicacaoFormInput = {
  animalId: string
  consultaId: string
  medicamento: string
  tipo: string
  dosagem: string
  quantidade: string
  frequencia: string
  duracaoTratamento: string
}

export function FormNewMedicacao({
  animais,
  consultas,
  medicamentos,
  animalId,
  consultaId,
}: {
  animais: Option[]
  consultas: ConsultaOption[]
  medicamentos: string[]
  animalId?: string
  consultaId?: string
}) {
  const router = useRouter()
  const initialAnimalId = animais.some((animal) => animal.id === animalId) ? animalId : ''
  const initialConsultaId =
    initialAnimalId && consultas.some((consulta) => consulta.id === consultaId && consulta.animalId === initialAnimalId)
      ? consultaId
      : ''
  const createMedicacao = useMutation<{ id: string; consultaId: string; animalId: string }, ApiError, MedicacaoFormInput>(
    {
      mutationFn: (values) =>
        api(`${API_URL}/medicacoes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        }),
    },
  )

  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MedicacaoFormInput>({
    defaultValues: {
      animalId: initialAnimalId ?? '',
      consultaId: initialConsultaId ?? '',
      medicamento: '',
      tipo: '',
      dosagem: '',
      quantidade: '',
      frequencia: '',
      duracaoTratamento: '',
    },
  })

  const selectedAnimalId = watch('animalId')
  const consultasDoAnimal = useMemo(
    () => consultas.filter((consulta) => consulta.animalId === selectedAnimalId),
    [consultas, selectedAnimalId],
  )

  const onSubmit = (values: MedicacaoFormInput) => {
    const result = createMedicacaoSchema.safeParse({
      ...values,
      tipo: values.tipo.trim() || null,
    })

    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0]
        if (typeof field === 'string') {
          setError(field as keyof MedicacaoFormInput, { message: issue.message })
        }
      }
      toast.error(result.error.issues[0]?.message ?? 'Verifique os campos do formulário')
      return
    }

    createMedicacao.mutate(
      {
        ...values,
        quantidade: String(result.data.quantidade),
        tipo: result.data.tipo ?? '',
      },
      {
        onSuccess: (created) => {
          toast.success('Medicação cadastrada')
          router.push(`/animais/${created.animalId}/fichamedica?consulta=${created.consultaId}`)
          router.refresh()
        },
        onError: (error) => {
          toast.error(error instanceof ApiError ? error.message : 'Erro ao cadastrar medicação')
        },
      },
    )
  }

  const validationMessages = Object.values(errors)
    .map((error) => error?.message)
    .filter((message): message is string => Boolean(message))
  const isLoading = createMedicacao.isPending || isSubmitting

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-[#3A250B]/30 bg-white p-4 shadow-[2px_4px_14px_rgba(58,37,11,0.1)]">
      <header className="flex w-full flex-row items-center justify-center gap-2">
        <img src="/images/icons/paw2.svg" alt="" width={24} height={24} />
        <span className="font-poppins font-semibold text-[#755835]">Dados da medicação</span>
      </header>
      {animais.length === 0 ? (
        <p className="max-w-md text-center font-poppins text-sm font-semibold text-[#755835]">
          Cadastre um animal antes de registrar uma medicação.
        </p>
      ) : (
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
              <SelectField
                label="Animal"
                id="animalId"
                {...register('animalId', {
                  onChange: () => setValue('consultaId', ''),
                })}
              >
                <option value="">Selecione</option>
                {animais.map((animal) => (
                  <option key={animal.id} value={animal.id}>
                    {animal.nome}
                  </option>
                ))}
              </SelectField>
              <SelectField label="Consulta" id="consultaId" {...register('consultaId')} disabled={!selectedAnimalId}>
                <option value="">{selectedAnimalId ? 'Selecione' : 'Escolha o animal primeiro'}</option>
                {consultasDoAnimal.map((consulta) => (
                  <option key={consulta.id} value={consulta.id}>
                    {consulta.label}
                  </option>
                ))}
              </SelectField>
              {selectedAnimalId && consultasDoAnimal.length === 0 && (
                <p className="max-w-60 font-poppins text-sm font-semibold text-[#755835]">
                  Este animal ainda não tem consulta. A medicação entra numa consulta da ficha.
                </p>
              )}
              <Field label="Medicamento" id="medicamento" type="text" list="medicamentos" {...register('medicamento')} />
              <datalist id="medicamentos">
                {medicamentos.map((medicamento) => (
                  <option key={medicamento} value={medicamento} />
                ))}
              </datalist>
              <Field label="Tipo" id="tipo" type="text" {...register('tipo')} />
            </div>
            <div className="flex flex-col gap-4">
              <Field label="Dosagem" id="dosagem" type="text" {...register('dosagem')} />
              <Field label="Quantidade" id="quantidade" type="number" min={1} {...register('quantidade')} />
              <Field label="Frequência" id="frequencia" type="text" {...register('frequencia')} />
              <Field label="Duração do tratamento" id="duracaoTratamento" type="text" {...register('duracaoTratamento')} />
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
            <Button type="button" onClick={() => router.push('/saude')}>
              Cancelar
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

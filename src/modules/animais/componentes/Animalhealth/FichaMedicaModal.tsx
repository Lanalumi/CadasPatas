'use client'

import { useListQuery } from '@/global/hooks/useListQuery'
import { API_URL } from '@/global/constants/api'
import { api } from '@/lib/http/api'
import { latestPrescriptionSchema, type LatestPrescription } from '@/schemas/saudeSchema'
import Link from 'next/link'

type FichaMedicaModalProps = {
  animalId: string
  enabled?: boolean
}

const fields = [
  { key: 'dataInicio', label: 'Data de início' },
  { key: 'proximaDose', label: 'Próxima dose' },
  { key: 'dosagem', label: 'Dosagem' },
  { key: 'periodo', label: 'Período do dia' },
] as const

export function FichaMedicaModal({ animalId, enabled = true }: FichaMedicaModalProps) {
  const prescription = useListQuery<LatestPrescription>({
    queryKey: ['prescricao', animalId],
    queryFn: async () =>
      latestPrescriptionSchema.parse(await api<LatestPrescription>(`${API_URL}/animais/${animalId}/prescricao`)),
    enabled,
  })

  return (
    <div className="flex flex-col gap-4">
      {prescription.isPending ? (
        <p className="font-poppins text-sm font-semibold text-[#755835]/70">Carregando prescrição...</p>
      ) : null}
      {prescription.isError ? (
        <p className="font-poppins text-sm font-semibold text-[#8A3B3B]">Não foi possível carregar a prescrição.</p>
      ) : null}
      {prescription.data && prescription.data.medicamentos.length === 0 ? (
        <p className="font-poppins text-sm font-semibold text-[#755835]">Nenhuma prescrição registrada.</p>
      ) : null}
      {prescription.data?.medicamentos.map((medicamento) => (
        <article key={medicamento.id} className="rounded-md border border-[#3A250B]/30 bg-[#FFF9F7] p-3">
          <h2 className="font-poppins text-base font-bold text-[#755835]">{medicamento.nome}</h2>
          <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2">
            {fields.map((field) => (
              <div key={field.key}>
                <dt className="font-poppins text-xs font-semibold text-[#755835]/70">{field.label}</dt>
                <dd className="font-poppins text-sm font-semibold break-words text-[#755835]">
                  {medicamento[field.key]}
                </dd>
              </div>
            ))}
          </dl>
        </article>
      ))}
      <Link
        href={`/animais/${animalId}/fichamedica`}
        className="w-fit font-poppins text-sm font-semibold text-[#8AA36C] hover:underline"
      >
        Ficha médica completa
      </Link>
    </div>
  )
}

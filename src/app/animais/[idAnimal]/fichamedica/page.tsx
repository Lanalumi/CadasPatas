import { prisma } from '@/lib/db'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ClinicaInfoButton } from './ClinicaInfoButton'

function formatDate(value: Date) {
  const day = String(value.getUTCDate()).padStart(2, '0')
  const month = String(value.getUTCMonth() + 1).padStart(2, '0')
  const year = value.getUTCFullYear()

  return `${day}/${month}/${year}`
}

const prescriptionColumns = ['Nome', 'Tipo', 'Dosagem', 'Quantidade', 'Duração', 'Frequência'] as const
const historyColumns = ['Data', 'Clínica', 'Motivo', 'Observação'] as const

export default async function FichaMedicaAnimalPage({
  params,
  searchParams,
}: {
  params: Promise<{ idAnimal: string }>
  searchParams: Promise<{ consulta?: string | string[] }>
}) {
  const { idAnimal } = await params
  const { consulta: consultaParam } = await searchParams
  const requestedConsultaId = Array.isArray(consultaParam) ? consultaParam[0] : consultaParam
  const animal = await prisma.animal.findUnique({
    where: { id: idAnimal },
    select: {
      id: true,
      nome: true,
      foto: true,
      consultas: {
        orderBy: { dataAtendimento: 'desc' },
        select: {
          id: true,
          observacao: true,
          dataAtendimento: true,
          dataRetorno: true,
          motivo: { select: { nome: true } },
          clinica: {
            select: {
              nome: true,
              cnpj: true,
              telefone: true,
              rua: true,
              numero: true,
              bairro: true,
              cidade: true,
            },
          },
          prescricoes: {
            orderBy: { medicamento: { nome: 'asc' } },
            select: {
              id: true,
              tipo: true,
              dosagem: true,
              quantidade: true,
              frequencia: true,
              duracaoTratamento: true,
              medicamento: { select: { nome: true } },
            },
          },
        },
      },
    },
  })

  if (!animal) notFound()

  const foto = animal.foto?.trim()
  const consulta =
    animal.consultas.find((item) => item.id === requestedConsultaId) ?? animal.consultas[0] ?? null

  return (
    <div className="flex w-full flex-col gap-6 p-4 pr-6">
      <header className="flex items-center gap-4">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[#3A250B]/30 bg-white">
          {foto ? (
            <img src={foto} alt={`Foto de ${animal.nome}`} className="h-full w-full object-cover" />
          ) : (
            <img src="/images/icons/paw.svg" alt="" className="h-10 w-10 opacity-50" aria-hidden />
          )}
        </div>
        <div className="min-w-0">
          <p className="font-poppins text-sm font-semibold text-[#755835]/70">Ficha médica</p>
          <h1 className="truncate font-poppins text-3xl font-bold text-[#755835]">{animal.nome}</h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Link
              href={`/animais/${animal.id}`}
              className="font-poppins text-sm font-semibold text-[#8AA36C] hover:underline"
            >
              Voltar para o animal
            </Link>
            <Link
              href={`/saude/consultas/new?animalId=${animal.id}`}
              className="font-poppins text-sm font-semibold text-[#8AA36C] hover:underline"
            >
              Nova consulta
            </Link>
            {consulta ? (
              <Link
                href={`/saude/medicacoes/new?animalId=${animal.id}&consultaId=${consulta.id}`}
                className="font-poppins text-sm font-semibold text-[#8AA36C] hover:underline"
              >
                Nova medicação
              </Link>
            ) : null}
          </div>
        </div>
      </header>

      {consulta ? (
        <section className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(18rem,1fr)]">
          <article className="flex min-w-0 flex-col gap-3 rounded-xl border border-[#3A250B]/30 bg-white p-4 shadow-[2px_4px_14px_rgba(58,37,11,0.1)]">
            <h2 className="font-poppins text-lg font-bold text-[#755835]">Prescrição</h2>
            <p className="font-poppins text-sm font-semibold text-[#755835]/70">
              Medicamentos desta consulta, em {formatDate(consulta.dataAtendimento)}.
            </p>
            {consulta.prescricoes.length === 0 ? (
              <p className="font-poppins text-sm font-semibold text-[#755835]/70 md:hidden">
                Nenhuma prescrição nesta consulta
              </p>
            ) : (
              <ul className="flex flex-col gap-3 md:hidden">
                {consulta.prescricoes.map((prescricao) => (
                  <li key={prescricao.id} className="rounded-md border border-[#3A250B]/30 p-3">
                    <p className="font-poppins text-base font-bold text-[#755835]">{prescricao.medicamento.nome}</p>
                    <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2">
                      {[
                        { label: 'Tipo', value: prescricao.tipo?.trim() || '—' },
                        { label: 'Dosagem', value: prescricao.dosagem },
                        { label: 'Quantidade', value: String(prescricao.quantidade) },
                        { label: 'Duração', value: prescricao.duracaoTratamento },
                        { label: 'Frequência', value: prescricao.frequencia },
                      ].map((field) => (
                        <div key={field.label}>
                          <dt className="font-poppins text-xs font-semibold text-[#755835]/70">{field.label}</dt>
                          <dd className="font-poppins text-sm font-semibold break-words text-[#755835]">{field.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </li>
                ))}
              </ul>
            )}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full table-fixed border-collapse text-center font-poppins text-sm" aria-label="Prescrição">
                <thead>
                  <tr className="bg-[#D0DAC4] font-semibold text-[#3A250B]/70">
                    {prescriptionColumns.map((column) => (
                      <th key={column} className="border border-[#3A250B]/45 px-2 py-2 break-words">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {consulta.prescricoes.length === 0 ? (
                    <tr>
                      <td
                        colSpan={prescriptionColumns.length}
                        className="border border-[#3A250B]/45 px-3 py-4 text-[#755835]/70"
                      >
                        Nenhuma prescrição nesta consulta
                      </td>
                    </tr>
                  ) : (
                    consulta.prescricoes.map((prescricao) => (
                      <tr key={prescricao.id} className="text-[#3A250B]/70">
                        <td className="border border-[#3A250B]/45 px-2 py-2 break-words">{prescricao.medicamento.nome}</td>
                        <td className="border border-[#3A250B]/45 px-2 py-2 break-words">
                          {prescricao.tipo?.trim() || '—'}
                        </td>
                        <td className="border border-[#3A250B]/45 px-2 py-2 break-words">{prescricao.dosagem}</td>
                        <td className="border border-[#3A250B]/45 px-2 py-2 break-words">{prescricao.quantidade}</td>
                        <td className="border border-[#3A250B]/45 px-2 py-2 break-words">
                          {prescricao.duracaoTratamento}
                        </td>
                        <td className="border border-[#3A250B]/45 px-2 py-2 break-words">{prescricao.frequencia}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </article>

          <article className="flex min-w-0 flex-col gap-3 rounded-xl border border-[#3A250B]/30 bg-white p-4 shadow-[2px_4px_14px_rgba(58,37,11,0.1)]">
            <h2 className="font-poppins text-lg font-bold text-[#755835]">Consulta em exibição</h2>
            <dl className="flex flex-col gap-3">
              <div>
                <dt className="font-poppins text-sm font-semibold text-[#755835]/70">Data de atendimento</dt>
                <dd className="font-poppins text-base font-semibold text-[#755835]">
                  {formatDate(consulta.dataAtendimento)}
                </dd>
              </div>
              <div>
                <dt className="font-poppins text-sm font-semibold text-[#755835]/70">Data de retorno</dt>
                <dd className="font-poppins text-base font-semibold text-[#755835]">
                  {consulta.dataRetorno ? formatDate(consulta.dataRetorno) : '—'}
                </dd>
              </div>
              <div>
                <dt className="font-poppins text-sm font-semibold text-[#755835]/70">Motivo</dt>
                <dd className="font-poppins text-base font-semibold text-[#755835]">{consulta.motivo.nome}</dd>
              </div>
              <div>
                <dt className="font-poppins text-sm font-semibold text-[#755835]/70">Clínica</dt>
                <dd>
                  <ClinicaInfoButton clinica={consulta.clinica} />
                </dd>
              </div>
              <div>
                <dt className="font-poppins text-sm font-semibold text-[#755835]/70">Observação</dt>
                <dd className="whitespace-pre-wrap font-poppins text-base font-semibold text-[#755835]">
                  {consulta.observacao.trim() || '—'}
                </dd>
              </div>
            </dl>
          </article>
        </section>
      ) : (
        <p className="font-poppins text-sm font-semibold text-[#755835]/70">
          Nenhuma consulta nesta ficha. A primeira consulta passa a ser a primeira edição.
        </p>
      )}

      <section className="flex flex-col gap-3 rounded-xl border border-[#3A250B]/30 bg-white p-4 shadow-[2px_4px_14px_rgba(58,37,11,0.1)]">
        <h2 className="font-poppins text-lg font-bold text-[#755835]">Histórico de consultas</h2>
        <p className="font-poppins text-sm font-semibold text-[#755835]/70">
          Cada linha é uma edição da ficha. A ficha mostra a consulta selecionada.
        </p>
        {animal.consultas.length === 0 ? (
          <p className="font-poppins text-sm font-semibold text-[#755835]/70">Nenhuma edição registrada.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-collapse text-left font-poppins text-sm" aria-label="Histórico de consultas">
              <thead>
                <tr className="bg-[#D0DAC4] font-semibold text-[#3A250B]/70">
                  {historyColumns.map((column) => (
                    <th key={column} className="border border-[#3A250B]/45 px-2 py-2 break-words">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {animal.consultas.map((item) => {
                  const selected = item.id === consulta?.id
                  return (
                    <tr key={item.id} className={selected ? 'bg-[#D0DAC4]/50 text-[#3A250B]' : 'text-[#3A250B]/70'}>
                      <td className="border border-[#3A250B]/45 px-2 py-2 break-words">
                        <Link
                          href={`/animais/${animal.id}/fichamedica?consulta=${item.id}`}
                          className="font-semibold text-[#755835] hover:underline"
                        >
                          {formatDate(item.dataAtendimento)}
                        </Link>
                      </td>
                      <td className="border border-[#3A250B]/45 px-2 py-2 break-words">{item.clinica.nome}</td>
                      <td className="border border-[#3A250B]/45 px-2 py-2 break-words">{item.motivo.nome}</td>
                      <td className="border border-[#3A250B]/45 px-2 py-2 break-words">
                        {item.observacao.trim() || '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

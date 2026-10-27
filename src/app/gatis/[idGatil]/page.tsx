import { FormEditGatil } from '@/modules/gatis/components/FormEditGatil/FormEditGatil'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { notFound } from 'next/navigation'

function formatDate(value: Date) {
  const day = String(value.getUTCDate()).padStart(2, '0')
  const month = String(value.getUTCMonth() + 1).padStart(2, '0')
  const year = value.getUTCFullYear()

  return `${day}/${month}/${year}`
}

export default async function GatilPage({ params }: { params: Promise<{ idGatil: string }> }) {
  const { idGatil } = await params
  const local = await prisma.localizacao.findUnique({
    where: { id: idGatil },
    select: {
      id: true,
      nome: true,
      tipoLocal: true,
      ativo: true,
      historicos: {
        orderBy: { dataEntrada: 'desc' },
        select: {
          id: true,
          status: true,
          dataEntrada: true,
          dataSaida: true,
          animal: { select: { id: true, nome: true } },
        },
      },
    },
  })

  if (!local) notFound()

  const presentes = local.historicos.filter((historico) => !historico.dataSaida)
  const anteriores = local.historicos.filter((historico) => historico.dataSaida)
  const totalAnimais = new Set(presentes.map((historico) => historico.animal.id)).size || 0

  return (
    <div className="flex w-full max-w-3xl flex-col gap-6 p-4">
      <header className="flex flex-col gap-1">
        <p className="font-poppins text-sm font-semibold text-[#755835]/70">Gatil</p>
        <h1 className="font-poppins text-3xl font-bold text-[#755835]">{local.nome}</h1>
        <p className="font-poppins text-sm font-semibold text-[#755835]/70">
          {totalAnimais} {totalAnimais === 1 ? 'animal no local' : 'animais no local'}
        </p>
        <Link href="/gatis" className="font-poppins text-sm font-semibold text-[#8AA36C] hover:underline">
          Voltar para os gatis
        </Link>
      </header>

      <FormEditGatil
        initialState={{ id: local.id, nome: local.nome, tipoLocal: local.tipoLocal, ativo: local.ativo }}
      />

      <section className="flex flex-col gap-3 rounded-xl border border-[#3A250B]/30 bg-white p-4 shadow-[2px_4px_14px_rgba(58,37,11,0.1)]">
        <h2 className="font-poppins text-lg font-bold text-[#755835]">Animais neste local</h2>
        {presentes.length === 0 ? (
          <p className="font-poppins text-sm font-semibold text-[#755835]/70">Nenhum animal está aqui agora.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {presentes.map((historico) => (
              <li key={historico.id} className="font-poppins text-sm font-semibold text-[#755835]">
                <Link href={`/animais/${historico.animal.id}`} className="hover:underline">
                  {historico.animal.nome}
                </Link>
                <span className="text-[#755835]/70">
                  {' '}
                  · {historico.status} · desde {formatDate(historico.dataEntrada)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {anteriores.length > 0 ? (
        <section className="flex flex-col gap-3 rounded-xl border border-[#3A250B]/30 bg-white p-4 shadow-[2px_4px_14px_rgba(58,37,11,0.1)]">
          <h2 className="font-poppins text-lg font-bold text-[#755835]">Passaram por aqui</h2>
          <ul className="flex flex-col gap-2">
            {anteriores.map((historico) => (
              <li key={historico.id} className="font-poppins text-sm font-semibold text-[#755835]">
                <Link href={`/animais/${historico.animal.id}`} className="hover:underline">
                  {historico.animal.nome}
                </Link>
                <span className="text-[#755835]/70">
                  {' '}
                  · {formatDate(historico.dataEntrada)} até {historico.dataSaida ? formatDate(historico.dataSaida) : '—'}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}

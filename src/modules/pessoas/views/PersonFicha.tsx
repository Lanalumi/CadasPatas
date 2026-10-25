import { personRole } from '@/modules/pessoas/personRole'
import type { loadPessoaById } from '@/modules/pessoas/server/loadPessoa'
import Link from 'next/link'

type PessoaRecord = NonNullable<Awaited<ReturnType<typeof loadPessoaById>>>

function formatDate(value: Date) {
  const day = String(value.getDate()).padStart(2, '0')
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const year = value.getFullYear()
  return `${day}/${month}/${year}`
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="font-poppins text-sm font-semibold">
      <dt className="inline text-[#755835]/70">{label}: </dt>
      <dd className="inline text-[#755835]">{value}</dd>
    </div>
  )
}

export function PersonFicha({ pessoa }: { pessoa: PessoaRecord }) {
  const role = personRole(pessoa.tipo.tipo)
  const isVolunteer = role === 'voluntario'
  const title = isVolunteer ? 'Ficha de voluntário' : 'Ficha de adotante'
  const endereco = `${pessoa.rua}, ${pessoa.numero} — ${pessoa.bairro}, ${pessoa.cidade}`

  return (
    <div className="flex max-w-[94%] flex-col items-center justify-center p-4">
      <header className="flex w-full max-w-full flex-col gap-2 bg-[#FFF9F7] p-4">
        <p className="text-center font-poppins text-sm font-semibold text-[#755835]/70">{title}</p>
        <h1 className="text-center font-poppins text-2xl font-bold text-[#755835]">{pessoa.nome}</h1>
      </header>
      <div className="mt-4 flex w-full max-w-xl flex-col gap-4">
        <section className="flex flex-col gap-3 rounded-xl border border-[#3A250B]/30 bg-white p-4 shadow-[2px_4px_14px_rgba(58,37,11,0.1)]">
          <h2 className="font-poppins text-base font-semibold text-[#755835]">Dados pessoais</h2>
          <dl className="flex flex-col gap-2">
            <Detail label="CPF" value={pessoa.cpf} />
            <Detail label="Telefone" value={pessoa.telefone} />
            <Detail label="Nascimento" value={formatDate(pessoa.dataNascimento)} />
            <Detail label="Endereço" value={endereco} />
          </dl>
        </section>

        {isVolunteer ? (
          <section className="flex flex-col gap-3 rounded-xl border border-[#3A250B]/30 bg-white p-4 shadow-[2px_4px_14px_rgba(58,37,11,0.1)]">
            <h2 className="font-poppins text-base font-semibold text-[#755835]">Dados do voluntariado</h2>
            <dl className="flex flex-col gap-2">
              <Detail label="Data de inscrição" value={formatDate(pessoa.dataInicio)} />
              <Detail label="Data de saída" value={pessoa.dataSaida ? formatDate(pessoa.dataSaida) : '—'} />
              <Detail label="Status" value={pessoa.dataSaida ? 'Inativo' : 'Ativo'} />
            </dl>
          </section>
        ) : (
          <section className="flex flex-col gap-3 rounded-xl border border-[#3A250B]/30 bg-white p-4 shadow-[2px_4px_14px_rgba(58,37,11,0.1)]">
            <h2 className="font-poppins text-base font-semibold text-[#755835]">Dados do adotante</h2>
            <dl className="flex flex-col gap-2">
              <Detail label="Data de cadastro" value={formatDate(pessoa.dataInicio)} />
            </dl>
            <div className="flex flex-col gap-2">
              <h3 className="font-poppins text-sm font-semibold text-[#755835]/70">Animais adotados</h3>
              {pessoa.adocoes.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {pessoa.adocoes.map((adocao) => (
                    <li key={adocao.animalId} className="font-poppins text-sm font-semibold text-[#755835]">
                      <Link href={`/animais/${adocao.animal.id}`} className="text-[#8AA36C] hover:underline">
                        {adocao.animal.nome}
                      </Link>
                      <span>{` — ${formatDate(adocao.dataAdocao)}`}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="font-poppins text-sm font-semibold text-[#755835]/70">Nenhum animal adotado</p>
              )}
            </div>
          </section>
        )}

        <Link href="/comunidade" className="font-poppins text-sm font-semibold text-[#8AA36C] hover:underline">
          Voltar para a comunidade
        </Link>
      </div>
    </div>
  )
}

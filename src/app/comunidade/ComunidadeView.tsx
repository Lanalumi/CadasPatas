import { prisma } from '@/lib/db'
import { CommunityActions } from './CommunityActions'
import { CommunityCardItem, CommunityColumn } from './CommunityColumn'

function normalizeRole(value: string) {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
}

function formatDate(value: Date) {
  const day = String(value.getDate()).padStart(2, '0')
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const year = value.getFullYear()

  return {
    label: `${day}/${month}/${year}`,
    sort: `${year}-${month}-${day}`,
  }
}

async function loadCommunityLists() {
  const [pessoas, clinicas] = await Promise.all([
    prisma.pessoa.findMany({
      orderBy: { nome: 'asc' },
      select: {
        id: true,
        nome: true,
        cpf: true,
        cidade: true,
        telefone: true,
        dataNascimento: true,
        dataInicio: true,
        tipo: { select: { tipo: true } },
      },
    }),
    prisma.clinica.findMany({
      orderBy: { nome: 'asc' },
      select: {
        id: true,
        nome: true,
        cnpj: true,
        cidade: true,
        telefone: true,
        bairro: true,
        rua: true,
      },
    }),
  ])

  const voluntarios: CommunityCardItem[] = []
  const adotantes: CommunityCardItem[] = []

  for (const pessoa of pessoas) {
    const role = normalizeRole(pessoa.tipo.tipo)
    const nascimento = formatDate(pessoa.dataNascimento)
    const inicio = formatDate(pessoa.dataInicio)
    const searchText = [pessoa.nome, pessoa.cpf, pessoa.cidade, pessoa.telefone, nascimento.label, inicio.label].join(
      ' ',
    )
    const base = {
      id: pessoa.id,
      nome: pessoa.nome,
      searchText,
      infos: [
        { label: 'Cidade', value: pessoa.cidade },
        { label: 'Telefone', value: pessoa.telefone },
        { label: 'Data de nascimento', value: nascimento.label },
      ],
    }

    if (role.includes('volunt')) {
      voluntarios.push({
        ...base,
        href: `/voluntarios/${pessoa.id}`,
        infos: [...base.infos, { label: 'Data de inscrição', value: inicio.label }],
        sortValues: {
          nome: pessoa.nome,
          dataNascimento: nascimento.sort,
          dataInscricao: inicio.sort,
        },
      })
    } else if (role.includes('adot')) {
      adotantes.push({
        ...base,
        href: `/adotantes/${pessoa.id}`,
        infos: [...base.infos, { label: 'Cadastro', value: inicio.label }],
        sortValues: {
          nome: pessoa.nome,
          dataNascimento: nascimento.sort,
          criadoEm: inicio.sort,
        },
      })
    }
  }

  return {
    voluntarios,
    adotantes,
    clinicas: clinicas.map((clinica) => ({
      id: clinica.id,
      nome: clinica.nome,
      searchText: [clinica.nome, clinica.cnpj, clinica.cidade, clinica.telefone, clinica.bairro, clinica.rua].join(' '),
      sortValues: {
        nome: clinica.nome,
        cidade: clinica.cidade,
      },
      infos: [
        { label: 'Cidade', value: clinica.cidade },
        { label: 'Telefone', value: clinica.telefone },
        { label: 'Bairro', value: clinica.bairro },
        { label: 'CNPJ', value: clinica.cnpj },
      ],
    })),
  }
}

export default async function ComunidadeView() {
  let voluntarios: CommunityCardItem[] = []
  let adotantes: CommunityCardItem[] = []
  let clinicas: CommunityCardItem[] = []
  let errorLabel: string | undefined

  try {
    const lists = await loadCommunityLists()
    voluntarios = lists.voluntarios
    adotantes = lists.adotantes
    clinicas = lists.clinicas
  } catch {
    errorLabel = 'Não foi possível carregar a lista'
  }

  return (
    <div className="fixed top-[10%] right-0 bottom-0 left-[5%] flex flex-col overflow-hidden py-4 pr-4 pl-2 md:top-0 md:left-[20%] md:pl-4 lg:left-[10%]">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
        <h1 className="font-poppins text-2xl font-bold text-[#755835]">Comunidade</h1>
        <CommunityActions />
      </div>
      <div className="mt-4 grid min-h-0 flex-1 grid-cols-3 gap-4">
        <CommunityColumn
          heading="Voluntários"
          searchId="search-voluntarios"
          searchPlaceholder="Pesquisar voluntários"
          sortOptions={[
            { value: 'dataInscricao', label: 'Data de inscrição' },
            { value: 'nome', label: 'Nome' },
            { value: 'dataNascimento', label: 'Data de nascimento' },
          ]}
          defaultSortBy="dataInscricao"
          defaultSortDir="desc"
          items={voluntarios}
          emptyLabel="Nenhum voluntário encontrado"
          filteredEmptyLabel="Tente ajustar os filtros"
          errorLabel={errorLabel}
        />
        <CommunityColumn
          heading="Adotantes"
          searchId="search-adotantes"
          searchPlaceholder="Pesquisar adotantes"
          sortOptions={[
            { value: 'criadoEm', label: 'Data de cadastro' },
            { value: 'nome', label: 'Nome' },
            { value: 'dataNascimento', label: 'Data de nascimento' },
          ]}
          defaultSortBy="criadoEm"
          defaultSortDir="desc"
          items={adotantes}
          emptyLabel="Nenhum adotante encontrado"
          filteredEmptyLabel="Tente ajustar os filtros"
          errorLabel={errorLabel}
        />
        <CommunityColumn
          heading="Clínicas"
          searchId="search-clinicas"
          searchPlaceholder="Pesquisar clínicas"
          sortOptions={[
            { value: 'nome', label: 'Nome' },
            { value: 'cidade', label: 'Cidade' },
          ]}
          defaultSortBy="nome"
          defaultSortDir="asc"
          items={clinicas}
          emptyLabel="Nenhuma clínica encontrada"
          filteredEmptyLabel="Tente ajustar os filtros"
          errorLabel={errorLabel}
        />
      </div>
    </div>
  )
}

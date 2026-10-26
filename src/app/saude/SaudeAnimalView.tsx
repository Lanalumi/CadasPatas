import { prisma } from '@/lib/db'
import { CommunityCardItem, CommunityColumn } from '../comunidade/CommunityColumn'
import { SaudeActions } from './SaudeActions'

function formatDate(value: Date) {
  const day = String(value.getDate()).padStart(2, '0')
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const year = value.getFullYear()

  return {
    label: `${day}/${month}/${year}`,
    sort: `${year}-${month}-${day}`,
  }
}

async function loadSaudeLists() {
  const [consultas, prescricoes] = await Promise.all([
    prisma.consulta.findMany({
      orderBy: { dataAtendimento: 'desc' },
      select: {
        id: true,
        observacao: true,
        dataAtendimento: true,
        dataRetorno: true,
        animal: { select: { id: true, nome: true } },
        clinica: { select: { nome: true } },
        motivo: { select: { nome: true } },
      },
    }),
    prisma.prescreve.findMany({
      orderBy: { consulta: { dataAtendimento: 'desc' } },
      select: {
        id: true,
        dosagem: true,
        quantidade: true,
        frequencia: true,
        duracaoTratamento: true,
        medicamento: { select: { nome: true } },
        consulta: {
          select: {
            id: true,
            dataAtendimento: true,
            animal: { select: { id: true, nome: true } },
          },
        },
      },
    }),
  ])

  const fichas: CommunityCardItem[] = consultas.map((consulta) => {
    const atendimento = formatDate(consulta.dataAtendimento)
    const retorno = consulta.dataRetorno ? formatDate(consulta.dataRetorno) : null
    const searchText = [
      consulta.animal.nome,
      consulta.clinica.nome,
      consulta.motivo.nome,
      consulta.observacao,
      atendimento.label,
      retorno?.label,
    ]
      .filter(Boolean)
      .join(' ')

    return {
      id: consulta.id,
      nome: consulta.animal.nome,
      href: `/animais/${consulta.animal.id}/fichamedica#consulta-${consulta.id}`,
      searchText,
      sortValues: {
        dataAtendimento: atendimento.sort,
        animal: consulta.animal.nome,
        clinica: consulta.clinica.nome,
        motivo: consulta.motivo.nome,
      },
      infos: [
        { label: 'Clínica', value: consulta.clinica.nome },
        { label: 'Motivo', value: consulta.motivo.nome },
        { label: 'Data de atendimento', value: atendimento.label },
        { label: 'Retorno', value: retorno?.label ?? '' },
        { label: 'Observação', value: consulta.observacao },
      ],
    }
  })

  const medicacoes: CommunityCardItem[] = prescricoes.map((prescricao) => {
    const atendimento = formatDate(prescricao.consulta.dataAtendimento)
    const animal = prescricao.consulta.animal
    const searchText = [
      prescricao.medicamento.nome,
      animal.nome,
      prescricao.dosagem,
      prescricao.frequencia,
      prescricao.duracaoTratamento,
      atendimento.label,
    ].join(' ')

    return {
      id: prescricao.id,
      nome: prescricao.medicamento.nome,
      href: `/animais/${animal.id}/fichamedica#consulta-${prescricao.consulta.id}`,
      searchText,
      sortValues: {
        data: atendimento.sort,
        medicamento: prescricao.medicamento.nome,
        animal: animal.nome,
      },
      infos: [
        { label: 'Animal', value: animal.nome },
        { label: 'Dosagem', value: prescricao.dosagem },
        { label: 'Quantidade', value: String(prescricao.quantidade) },
        { label: 'Frequência', value: prescricao.frequencia },
        { label: 'Duração', value: prescricao.duracaoTratamento },
        { label: 'Data', value: atendimento.label },
      ],
    }
  })

  return { fichas, medicacoes }
}

export default async function SaudeAnimalView() {
  let fichas: CommunityCardItem[] = []
  let medicacoes: CommunityCardItem[] = []
  let errorLabel: string | undefined

  try {
    const lists = await loadSaudeLists()
    fichas = lists.fichas
    medicacoes = lists.medicacoes
  } catch {
    errorLabel = 'Não foi possível carregar a lista'
  }

  return (
    <div className="fixed top-[10%] right-0 bottom-0 left-[5%] flex flex-col overflow-y-auto py-4 pr-4 pl-2 md:top-0 md:left-[20%] md:overflow-hidden md:pl-4 lg:left-[10%]">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
        <h1 className="font-poppins text-2xl font-bold text-[#755835]">Saúde animal</h1>
        <SaudeActions />
      </div>
      <div className="mt-4 flex min-h-0 flex-1 flex-col gap-4 md:grid md:grid-rows-2">
        <div className="h-[28rem] shrink-0 md:h-full md:min-h-0">
          <CommunityColumn
            heading="Fichas Médicas"
            searchId="search-fichas"
            searchPlaceholder="Pesquisar fichas médicas"
            sortOptions={[
              { value: 'dataAtendimento', label: 'Data de atendimento' },
              { value: 'animal', label: 'Animal' },
              { value: 'clinica', label: 'Clínica' },
              { value: 'motivo', label: 'Motivo' },
            ]}
            defaultSortBy="dataAtendimento"
            defaultSortDir="desc"
            items={fichas}
            emptyLabel="Nenhuma ficha médica encontrada"
            filteredEmptyLabel="Tente ajustar os filtros"
            errorLabel={errorLabel}
          />
        </div>
        <div className="h-[28rem] shrink-0 md:h-full md:min-h-0">
          <CommunityColumn
            heading="Medicações"
            searchId="search-medicacoes"
            searchPlaceholder="Pesquisar medicações"
            sortOptions={[
              { value: 'data', label: 'Data' },
              { value: 'medicamento', label: 'Medicamento' },
              { value: 'animal', label: 'Animal' },
            ]}
            defaultSortBy="data"
            defaultSortDir="desc"
            items={medicacoes}
            emptyLabel="Nenhuma medicação encontrada"
            filteredEmptyLabel="Tente ajustar os filtros"
            errorLabel={errorLabel}
          />
        </div>
      </div>
    </div>
  )
}

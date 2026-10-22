'use client'

import { Button } from '@/global/ui/Button/Button'
import { Table, TableColumn } from '@/global/ui/Table/Table'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { useDeleteVoluntario } from '../../hooks/useDeleteVoluntario'
import { Voluntario } from '../../types'

type VoluntariosTableProps = {
  items: Voluntario[]
  loading: boolean
  totalPages: number
  page: number
  onPageChange?: (page: number) => void
  onSortChange?: (sortBy: string, sortDir: 'asc' | 'desc') => void
  currentSort?: { sortBy: string; sortDir: 'asc' | 'desc' }
}

export default function VoluntariosTable({
  items,
  loading,
  totalPages,
  page,
  onPageChange,
  onSortChange,
  currentSort,
}: VoluntariosTableProps) {
  const deleteVoluntarioMutation = useDeleteVoluntario()
  const route = useRouter()

  const onDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este voluntário?')) return

    deleteVoluntarioMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Voluntário excluído com sucesso')
        route.push('/voluntarios')
      },
      onError: () => {
        toast.error('Erro ao excluir voluntário')
      },
    })
  }

  const columns: TableColumn<Voluntario>[] = [
    {
      key: 'nome',
      label: 'Nome',
      sortable: true,
    },
    {
      key: 'email',
      label: 'E-mail',
    },
    {
      key: 'telefone',
      label: 'Telefone',
    },
    {
      key: 'cidade',
      label: 'Cidade',
    },
    {
      key: 'dataInscricao',
      label: 'Data de inscrição',
      sortable: true,
      render: (item) => new Date(item.dataInscricao).toLocaleDateString(),
    },
    {
      key: 'dataNascimento',
      label: 'Data de nascimento',
      sortable: true,
      render: (item) => new Date(item.dataNascimento).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (item) => (
        <div className="flex gap-2 max-w-40">
          <img
            src="/images/icons/green-edit-button.svg"
            alt="Editar"
            onClick={() => route.push(`/voluntarios/${item.id}`)}
            className="cursor-pointer"
          />
          <Button
            id="delete-button"
            type="button"
            onClick={() => onDelete(item.id)}
            disabled={deleteVoluntarioMutation.isPending}
          >
            {deleteVoluntarioMutation.isPending ? (
              'Excluindo...'
            ) : (
              <img src="/images/icons/red-delete-button.svg" alt="Excluir" className="cursor-pointer" />
            )}
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex justify-center ">
      <Table
        data={items}
        columns={columns}
        loading={loading}
        totalPages={totalPages}
        currentPage={page}
        onPageChange={onPageChange}
        onSortChange={onSortChange}
        currentSort={currentSort}
        getRowKey={(item) => item.id}
      />
    </div>
  )
}

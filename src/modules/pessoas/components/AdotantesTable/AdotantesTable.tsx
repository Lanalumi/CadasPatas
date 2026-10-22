'use client'

import { Button } from '@/global/ui/Button/Button'
import { Table, TableColumn } from '@/global/ui/Table/Table'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { useDeleteAdotante } from '../../hooks/useDeleteAdotante'
import { Adotante } from '../../types'

type AdotantesTableProps = {
  items: Adotante[]
  loading: boolean
  totalPages: number
  page: number
  onPageChange?: (page: number) => void
  onSortChange?: (sortBy: string, sortDir: 'asc' | 'desc') => void
  currentSort?: { sortBy: string; sortDir: 'asc' | 'desc' }
}

export default function AdotantesTable({
  items,
  loading,
  totalPages,
  page,
  onPageChange,
  onSortChange,
  currentSort,
}: AdotantesTableProps) {
  const deleteAdotanteMutation = useDeleteAdotante()
  const route = useRouter()

  const onDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este adotante?')) return

    deleteAdotanteMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Adotante excluído com sucesso')
        route.push('/adotantes')
      },
      onError: () => {
        toast.error('Erro ao excluir adotante')
      },
    })
  }

  const columns: TableColumn<Adotante>[] = [
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
      key: 'aptoDoacao',
      label: 'Apto para doação',
      render: (item) => (item.aptoDoacao ? 'Sim' : 'Não'),
    },
    {
      key: 'dataNascimento',
      label: 'Data de nascimento',
      sortable: true,
      render: (item) => new Date(item.dataNascimento).toLocaleDateString(),
    },
    {
      key: 'criadoEm',
      label: 'Cadastro',
      sortable: true,
      render: (item) => new Date(item.criadoEm).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (item) => (
        <div className="flex gap-2 max-w-40">
          <img
            src="/images/icons/green-edit-button.svg"
            alt="Editar"
            onClick={() => route.push(`/adotantes/${item.id}`)}
            className="cursor-pointer"
          />
          <Button
            id="delete-button"
            type="button"
            onClick={() => onDelete(item.id)}
            disabled={deleteAdotanteMutation.isPending}
          >
            {deleteAdotanteMutation.isPending ? (
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

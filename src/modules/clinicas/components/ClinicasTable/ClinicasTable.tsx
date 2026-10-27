'use client'

import { Button } from '@/global/ui/Button/Button'
import { Table, TableColumn } from '@/global/ui/Table/Table'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { useDeleteClinica } from '../../hooks/useDeleteClinica'
import { Clinica } from '../../types'

type ClinicasTableProps = {
  items: Clinica[]
  loading: boolean
  totalPages: number
  page: number
  onPageChange?: (page: number) => void
  onSortChange?: (sortBy: string, sortDir: 'asc' | 'desc') => void
  currentSort?: { sortBy: string; sortDir: 'asc' | 'desc' }
}

export default function ClinicasTable({
  items,
  loading,
  totalPages,
  page,
  onPageChange,
  onSortChange,
  currentSort,
}: ClinicasTableProps) {
  const deleteClinicaMutation = useDeleteClinica()
  const route = useRouter()

  const onDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta clínica?')) return

    deleteClinicaMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Clínica excluída com sucesso')
        route.push('/clinicas')
      },
      onError: () => {
        toast.error('Erro ao excluir clínica')
      },
    })
  }

  const columns: TableColumn<Clinica>[] = [
    {
      key: 'nome',
      label: 'Nome',
      sortable: true,
    },
    {
      key: 'cnpj',
      label: 'CNPJ',
      sortable: true,
    },
    {
      key: 'telefone',
      label: 'Telefone',
    },
    {
      key: 'cidade',
      label: 'Cidade',
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (item) => (
        <div className="flex gap-2 max-w-40">
          <img
            src="/images/icons/green-edit-button.svg"
            alt="Editar"
            onClick={() => route.push(`/clinicas/${item.id}`)}
            className="cursor-pointer"
          />
          <Button
            id="delete-button"
            type="button"
            onClick={() => onDelete(item.id)}
            disabled={deleteClinicaMutation.isPending}
          >
            {deleteClinicaMutation.isPending ? (
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

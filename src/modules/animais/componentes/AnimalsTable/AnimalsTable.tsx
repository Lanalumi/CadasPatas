'use client'

import { Button } from '@/global/ui/Button/Button'
import { Table, TableColumn } from '@/global/ui/Table/Table'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { Animal } from '../../types'
import { useDeleteAnimal } from '../../hooks/useDeleteAnimal'

type AnimalsTableProps = {
  items: Animal[]
  loading: boolean
  totalPages: number
  page: number
  onPageChange?: (page: number) => void
  onSortChange?: (sortBy: string, sortDir: 'asc' | 'desc') => void
  currentSort?: { sortBy: string; sortDir: 'asc' | 'desc' }
}

export default function AnimalsTable({
  items,
  loading,
  totalPages,
  page,
  onPageChange,
  onSortChange,
  currentSort,
}: AnimalsTableProps) {
  const deleteAnimalMutation = useDeleteAnimal()

  const route = useRouter()

  const onDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este animal?')) return

    deleteAnimalMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Animal excluído com sucesso')
        route.push('/animais')
      },
      onError: () => {
        toast.error('Erro ao excluir animal')
      },
    })
  }

  const columns: TableColumn<Animal>[] = [
    {
      key: 'nome',
      label: 'Nome',
      sortable: true,
    },
    {
      key: 'especie',
      label: 'Espécie',
      sortable: true,
    },
    {
      key: 'sexo',
      label: 'Sexo',
      sortable: true,
    },
    {
      key: 'dataChegada',
      label: 'Data de chegada',
      sortable: true,
      render: (item) => new Date(item.dataChegada).toLocaleDateString(),
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
            onClick={() => route.push(`/animais/${item.id}`)}
            className="cursor-pointer"
          />

          <Button
            id="delete-button"
            type="button"
            onClick={() => onDelete(item.id)}
            disabled={deleteAnimalMutation.isPending}
          >
            {deleteAnimalMutation.isPending ? (
              'Excluindo...'
            ) : (
              <img
                src="/images/icons/red-delete-button.svg"
                alt="Excluir"
                onClick={() => onDelete(item.id)}
                className="cursor-pointer"
              />
            )}
          </Button>
          {deleteAnimalMutation.error && <p className="error text-sm">{deleteAnimalMutation.error.message}</p>}
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

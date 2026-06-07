'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import AnimalsTable from '../componentes/AnimalsTable/AnimalsTable'
import { useAnimalsList } from '../hooks/useAnimalsList'
import { AnimalsListFilters, ListAnimalsQuery } from '../types'
import { animalsListFiltersSchema } from '@/schemas/cadastroSchemas'
import { Field } from '@/global/ui/Field/Field'
import { Button } from '@/global/ui/Button/Button'
import { useRouter } from 'next/navigation'

export default function AnimalListView() {
  const route = useRouter()
  // State for filters, pagination, and sorting
  const [filters, setFilters] = useState<AnimalsListFilters>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // Build the complete query object with defaults
  const query: ListAnimalsQuery = {
    page: currentPage,
    pageSize,
    sortBy: filters.sortBy || 'dataChegada',
    sortDir: filters.sortDir || 'desc',
    search: filters.search,
  }

  const { data: animalsResponse, isLoading, error } = useAnimalsList(query)

  // Form for search and sorting
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnimalsListFilters>({
    resolver: zodResolver(animalsListFiltersSchema),
    defaultValues: {
      search: '',
      sortBy: 'dataChegada',
      sortDir: 'desc',
    },
  })

  const items = animalsResponse?.items || []
  const total = animalsResponse?.total || 0
  const page = animalsResponse?.page || 1
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  // Form handlers
  const onFiltersSubmit = (data: AnimalsListFilters) => {
    setFilters(data)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const onPageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const onSortChange = (sortBy: string, sortDir: 'asc' | 'desc') => {
    setFilters((prev) => ({
      ...prev,
      sortBy: sortBy as 'nome' | 'sexo' | 'dataNascimento' | 'dataChegada',
      sortDir,
    }))
    setCurrentPage(1)
  }

  const onPageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1) // Reset to first page when page size changes
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center h-lvh">
        <h1>{'Erro ao carregar animais'}</h1>
        <p className="error">{'Erro ao carregar animais'}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center h-lvh">
      <div className="flex p-4">
        <h1 className="font-poppins font-bold text-[#755835] text-2xl">{'Animais'}</h1>
      </div>

      {/* Search and Sort Form */}
      <form onSubmit={handleSubmit(onFiltersSubmit)} className="flex gap-2 mb-4">
        <div className="flex items-center justify-center">
          <Field {...register('search')} placeholder={'Pesquisar animais'} id="search-animais" type="text" />
        </div>
        <select
          {...register('sortBy')}
          className="border border-[#3A250B]/30 rounded p-2 text-[#755835]/70 bg-[#FFF9F7] font-poppins font-semibold text-[12px] max-h-[36px] outline-none"
        >
          <option value="dataChegada">{'Data de chegada'}</option>
          <option value="nome">{'Nome'}</option>
          <option value="dataNascimento">{'Data de nascimento'}</option>
          <option value="sexo">{'Sexo'}</option>
        </select>
        <select
          {...register('sortDir')}
          className="border border-[#3A250B]/30 rounded p-2 text-[#755835]/70 bg-[#FFF9F7] font-poppins font-semibold text-[12px] max-h-[36px] outline-none"
        >
          <option value="desc">{'Descendente'}</option>
          <option value="asc">{'Ascendente'}</option>
        </select>
        <Button
          type="submit"
          className="border rounded px-3 text-[#755835]/70 bg-[#FFF9F7] font-poppins font-semibold text-[12px] max-h-[36px] outline-none cursor-pointer"
        >
          {'Aplicar filtros'}
        </Button>
      </form>

      {/* Page Size Selector */}
      <div className="flex gap-2 items-center mb-4">
        <label
          htmlFor="pageSize"
          className="text-sm font-medium text-[#755835]/70 font-poppins font-bold text-[16px] max-h-[36px] outline-none"
        >
          {'Itens por página'}
        </label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="border border-[#3A250B]/30 rounded p-2 text-[#755835]/70 bg-[#FFF9F7] font-poppins font-semibold text-[14px] max-h-[36px] outline-none"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      {/* Results information */}
      <div className="mb-4">
        <p className="text-[#755835]/70 font-poppins font-semibold text-[16px] max-h-[36px] outline-none">
          {'Mostrando'} {items.length} {'de'} {total} {'Animais'} • {'Página'} {page} {'de'} {totalPages}
        </p>
      </div>

      {/* Animals Table */}
      {isLoading ? (
        <div className="text-[#755835]/70 font-poppins font-semibold text-[16px] max-h-[36px] outline-none">
          {'Carregando animais...'}
        </div>
      ) : items.length > 0 ? (
        <>
          <AnimalsTable
            items={items}
            loading={isLoading}
            totalPages={totalPages}
            page={page}
            onPageChange={onPageChange}
            onSortChange={onSortChange}
            currentSort={{
              sortBy: filters.sortBy || 'dataChegada',
              sortDir: filters.sortDir || 'desc',
            }}
          />
        </>
      ) : (
        <div className="no-content">
          <h1 className="no-content__title">{'Nenhum animal encontrado'}</h1>
          <h3 className="no-content__subtitle">
            {Object.keys(filters).length > 0 ? 'Tente ajustar os filtros' : 'Crie um animal'}
          </h3>
        </div>
      )}

      {/* Create Animal Link */}
      <div className="mt-6">
        <Button type="button" onClick={() => route.push('/animais/new')} green icon="/images/icons/add-button.svg">
          Cadastrar Animal
        </Button>
      </div>
    </div>
  )
}

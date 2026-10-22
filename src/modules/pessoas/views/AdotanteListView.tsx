'use client'

import { Button } from '@/global/ui/Button/Button'
import { Field } from '@/global/ui/Field/Field'
import { adotantesListFiltersSchema } from '@/schemas/personSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import AdotantesTable from '../components/AdotantesTable/AdotantesTable'
import { useAdotantesList } from '../hooks/useAdotantesList'
import { AdotantesListFilters, ListAdotantesQuery } from '../types'

export default function AdotanteListView() {
  const route = useRouter()
  const [filters, setFilters] = useState<AdotantesListFilters>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const query: ListAdotantesQuery = {
    page: currentPage,
    pageSize,
    sortBy: filters.sortBy || 'criadoEm',
    sortDir: filters.sortDir || 'desc',
    search: filters.search,
  }

  const { data: adotantesResponse, isLoading, error } = useAdotantesList(query)

  const { register, handleSubmit } = useForm<AdotantesListFilters>({
    resolver: zodResolver(adotantesListFiltersSchema),
    defaultValues: {
      search: '',
      sortBy: 'criadoEm',
      sortDir: 'desc',
    },
  })

  const items = adotantesResponse?.items || []
  const total = adotantesResponse?.total || 0
  const page = adotantesResponse?.page || 1
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const onFiltersSubmit = (data: AdotantesListFilters) => {
    setFilters(data)
    setCurrentPage(1)
  }

  const onPageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const onSortChange = (sortBy: string, sortDir: 'asc' | 'desc') => {
    setFilters((prev) => ({
      ...prev,
      sortBy: sortBy as 'nome' | 'dataNascimento' | 'criadoEm',
      sortDir,
    }))
    setCurrentPage(1)
  }

  const onPageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1)
  }

  if (error) {
    return (
      <div className="flex flex-col items-center h-lvh">
        <h1>{'Erro ao carregar adotantes'}</h1>
        <p className="error">{'Erro ao carregar adotantes'}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center h-lvh">
      <div className="flex p-4">
        <h1 className="font-poppins font-bold text-[#755835] text-2xl">{'Adotantes'}</h1>
      </div>

      <form onSubmit={handleSubmit(onFiltersSubmit)} className="flex gap-2 mb-4">
        <div className="flex items-center justify-center">
          <Field {...register('search')} placeholder={'Pesquisar adotantes'} id="search-adotantes" type="text" />
        </div>
        <select
          {...register('sortBy')}
          className="border border-[#3A250B]/30 rounded p-2 text-[#755835]/70 bg-[#FFF9F7] font-poppins font-semibold text-[12px] max-h-[36px] outline-none"
        >
          <option value="criadoEm">{'Data de cadastro'}</option>
          <option value="nome">{'Nome'}</option>
          <option value="dataNascimento">{'Data de nascimento'}</option>
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

      <div className="mb-4">
        <p className="text-[#755835]/70 font-poppins font-semibold text-[16px] max-h-[36px] outline-none">
          {'Mostrando'} {items.length} {'de'} {total} {'Adotantes'} • {'Página'} {page} {'de'} {totalPages}
        </p>
      </div>

      {isLoading ? (
        <div className="text-[#755835]/70 font-poppins font-semibold text-[16px] max-h-[36px] outline-none">
          {'Carregando adotantes...'}
        </div>
      ) : items.length > 0 ? (
        <AdotantesTable
          items={items}
          loading={isLoading}
          totalPages={totalPages}
          page={page}
          onPageChange={onPageChange}
          onSortChange={onSortChange}
          currentSort={{
            sortBy: filters.sortBy || 'criadoEm',
            sortDir: filters.sortDir || 'desc',
          }}
        />
      ) : (
        <div className="no-content">
          <h1 className="no-content__title">{'Nenhum adotante encontrado'}</h1>
          <h3 className="no-content__subtitle">
            {Object.keys(filters).length > 0 ? 'Tente ajustar os filtros' : 'Cadastre um adotante'}
          </h3>
        </div>
      )}

      <div className="mt-6">
        <Button type="button" onClick={() => route.push('/voluntarios/new')} green icon="/images/icons/add-button.svg">
          Cadastrar Adotante
        </Button>
      </div>
    </div>
  )
}

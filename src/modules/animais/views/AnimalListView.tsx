'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import AnimalsTable from '../componentes/AnimalsTable/AnimalsTable'
import { useAnimalsList } from '../hooks/useAnimalsList'
import { AnimalsListFilters, ListAnimalsQuery } from '../types'
import { animalsListFiltersSchema } from '@/schemas/animalSchema'
import { Field } from '@/global/ui/Field/Field'
import { Button } from '@/global/ui/Button/Button'
import { useRouter } from 'next/navigation'

export default function AnimalListView() {
  const route = useRouter()
  
  const [filters, setFilters] = useState<AnimalsListFilters>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const query: ListAnimalsQuery = {
    page: currentPage,
    pageSize,
    sortBy: filters.sortBy || 'dataChegada',
    sortDir: filters.sortDir || 'desc',
    search: filters.search,
  }

  const { data: animalsResponse, isLoading, error } = useAnimalsList(query)

  const { register, handleSubmit } = useForm<AnimalsListFilters>({
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

  const onFiltersSubmit = (data: AnimalsListFilters) => {
    setFilters(data)
    setCurrentPage(1)
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
    setCurrentPage(1)
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-[#8A3B3B] mb-2">Erro ao carregar animais</h1>
        <p className="text-[#8A3B3B]/80">Verifique a sua ligação ou tente novamente mais tarde.</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 md:p-10 flex flex-col gap-8">
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-poppins font-bold text-[#3A250B] text-3xl">Animais Registrados</h1>
          <p className="text-[#755835]/70 font-poppins text-sm mt-1">Lista de animais sob os cuidados da ONG.</p>
        </div>
        <Button 
          type="button" 
          onClick={() => route.push('/animais/new')} 
          green 
          icon="/images/icons/add-button.svg"
        >
          Cadastrar Animal
        </Button>
      </header>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#3A250B]/10 flex flex-col lg:flex-row justify-between items-center gap-4 w-full">
        <form onSubmit={handleSubmit(onFiltersSubmit)} className="flex flex-wrap md:flex-nowrap items-center gap-4 w-full">
          
          {/* Ajuste atualizado para -top-1 */}
          <div className="w-full md:w-80 relative -top-1">
            <Field 
              {...register('search')} 
              placeholder="Pesquisar animal..." 
              id="search-animais" 
              type="text" 
            />
          </div>
          
          <select
            {...register('sortBy')}
            className="h-11 px-4 border border-[#3A250B]/20 rounded-lg text-[#3A250B] bg-[#FFF9F7] font-poppins text-sm outline-none focus:border-[#8AA36C] transition-colors cursor-pointer w-full md:w-auto"
          >
            <option value="dataChegada">Data de chegada</option>
            <option value="nome">Nome</option>
            <option value="dataNascimento">Data de nascimento</option>
            <option value="sexo">Sexo</option>
          </select>
          
          <select
            {...register('sortDir')}
            className="h-11 px-4 border border-[#3A250B]/20 rounded-lg text-[#3A250B] bg-[#FFF9F7] font-poppins text-sm outline-none focus:border-[#8AA36C] transition-colors cursor-pointer w-full md:w-auto"
          >
            <option value="desc">Descendente</option>
            <option value="asc">Ascendente</option>
          </select>
          
          <button
            type="submit"
            className="h-11 px-6 rounded-lg bg-[#F0CA72] text-[#3A250B] font-poppins font-bold text-sm hover:bg-[#FFA686] transition-colors w-full md:w-auto"
          >
            Aplicar Filtros
          </button>
        </form>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center px-2 text-[#755835] font-poppins text-sm">
        <p>
          A mostrar <span className="font-bold">{items.length}</span> de <span className="font-bold">{total}</span> Animais • Página <span className="font-bold">{page}</span> de <span className="font-bold">{totalPages}</span>
        </p>
        
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <label htmlFor="pageSize" className="font-semibold">Itens por página:</label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-9 px-3 border border-[#3A250B]/20 rounded-md bg-white text-[#3A250B] outline-none cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <div className="w-full bg-white rounded-2xl shadow-sm border border-[#3A250B]/5 p-2 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64 text-[#755835] font-poppins font-semibold">
            A carregar animais...
          </div>
        ) : items.length > 0 ? (
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
        ) : (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <h2 className="text-xl font-bold text-[#3A250B] font-poppins">Nenhum animal encontrado</h2>
            <p className="text-[#755835]/70 font-poppins">
              {Object.keys(filters).length > 0 ? 'Tente ajustar os filtros de pesquisa.' : 'Comece por cadastrar um novo animal.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
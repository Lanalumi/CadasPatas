'use client'

import { Card } from '@/global/ui'
import { Button } from '@/global/ui/Button/Button'
import { Field } from '@/global/ui/Field/Field'
import { localizacoesListFiltersSchema } from '@/schemas/localizacaoSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useGatisList } from '../hooks/useGatisList'
import { ListLocalizacoesQuery, LocalizacoesListFilters } from '../types'
import { GatisActions } from './GatisActions'

export default function GatisView() {
  const [filters, setFilters] = useState<LocalizacoesListFilters>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const query: ListLocalizacoesQuery = {
    page: currentPage,
    pageSize,
    sortBy: filters.sortBy || 'nome',
    sortDir: filters.sortDir || 'asc',
    search: filters.search,
  }

  const { data, isLoading, error } = useGatisList(query)

  const { register, handleSubmit } = useForm<LocalizacoesListFilters>({
    resolver: zodResolver(localizacoesListFiltersSchema),
    defaultValues: {
      search: '',
      sortBy: 'nome',
      sortDir: 'asc',
    },
  })

  const items = data?.items || []
  const total = data?.total || 0
  const page = data?.page || 1
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const onFiltersSubmit = (values: LocalizacoesListFilters) => {
    setFilters(values)
    setCurrentPage(1)
  }

  if (error) {
    return (
      <div className="flex h-lvh flex-col items-center">
        <h1 className="font-poppins text-2xl font-bold text-[#755835]">Erro ao carregar gatis</h1>
      </div>
    )
  }

  return (
    <div className="flex min-h-lvh flex-col items-center px-4 py-6">
      <header className="mb-6 flex w-full max-w-5xl flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-poppins text-2xl font-bold text-[#755835]">Gatis</h1>
          <p className="mt-1 font-poppins text-sm font-semibold text-[#755835]/70">Locais cadastrados</p>
        </div>
        <GatisActions />
      </header>

      <form onSubmit={handleSubmit(onFiltersSubmit)} className="mb-4 flex flex-wrap gap-2">
        <Field {...register('search')} placeholder="Pesquisar gatis" id="search-gatis" type="text" />
        <select
          {...register('sortBy')}
          className="max-h-[36px] rounded border border-[#3A250B]/30 bg-[#FFF9F7] p-2 font-poppins text-[12px] font-semibold text-[#755835]/70 outline-none"
        >
          <option value="nome">Nome</option>
          <option value="tipoLocal">Tipo de local</option>
        </select>
        <select
          {...register('sortDir')}
          className="max-h-[36px] rounded border border-[#3A250B]/30 bg-[#FFF9F7] p-2 font-poppins text-[12px] font-semibold text-[#755835]/70 outline-none"
        >
          <option value="asc">Ascendente</option>
          <option value="desc">Descendente</option>
        </select>
        <Button
          type="submit"
          className="max-h-[36px] cursor-pointer rounded border bg-[#FFF9F7] px-3 font-poppins text-[12px] font-semibold text-[#755835]/70 outline-none"
        >
          Aplicar filtros
        </Button>
      </form>

      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="pageSize" className="font-poppins text-[16px] font-bold text-[#755835]/70">
          Itens por página
        </label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={(event) => {
            setPageSize(Number(event.target.value))
            setCurrentPage(1)
          }}
          className="max-h-[36px] rounded border border-[#3A250B]/30 bg-[#FFF9F7] p-2 font-poppins text-[14px] font-semibold text-[#755835]/70 outline-none"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      <p className="mb-4 font-poppins text-[16px] font-semibold text-[#755835]/70">
        Mostrando {items.length} de {total} Gatis • Página {page} de {totalPages}
      </p>

      {isLoading ? (
        <p className="font-poppins text-[16px] font-semibold text-[#755835]/70">Carregando gatis...</p>
      ) : items.length > 0 ? (
        <>
          <ul className="grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((local) => (
              <li key={local.id}>
                <Card
                  className="relative h-full transition-shadow hover:shadow-[2px_6px_16px_rgba(58,37,11,0.16)]"
                  title={
                    <Link
                      href={`/gatis/${local.id}`}
                      className="rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8AA36C] after:absolute after:inset-0 after:content-['']"
                    >
                      {local.nome}
                    </Link>
                  }
                  infos={[
                    { label: 'Tipo de local', value: local.tipoLocal },
                    { label: 'Animais no local', value: String(local.totalAnimais ?? 0) },
                    { label: 'Status', value: local.ativo ? 'Ativo' : 'Inativo' },
                  ]}
                />
              </li>
            ))}
          </ul>
          {totalPages > 1 && (
            <nav className="mt-4 flex items-center gap-2" aria-label="Paginação">
              <button
                type="button"
                onClick={() => setCurrentPage(page - 1)}
                disabled={page <= 1}
                className="cursor-pointer rounded-[10px] border border-[#3A250B]/30 bg-[#FFF9F7] px-3 py-2 font-poppins text-[12px] font-semibold text-[#755835] disabled:cursor-default disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="font-poppins text-[12px] font-semibold text-[#755835]/70">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage(page + 1)}
                disabled={page >= totalPages}
                className="cursor-pointer rounded-[10px] border border-[#3A250B]/30 bg-[#FFF9F7] px-3 py-2 font-poppins text-[12px] font-semibold text-[#755835] disabled:cursor-default disabled:opacity-50"
              >
                Próxima
              </button>
            </nav>
          )}
        </>
      ) : (
        <div className="no-content">
          <h1 className="no-content__title">Nenhum gatil encontrado</h1>
          <h3 className="no-content__subtitle">
            {filters.search ? 'Tente ajustar os filtros' : 'Cadastre um gatil'}
          </h3>
        </div>
      )}
    </div>
  )
}

'use client'

import { Button } from '@/global/ui/Button/Button'
import { Card } from '@/global/ui/Card/Card'
import { Field } from '@/global/ui/Field/Field'
import Link from 'next/link'
import { FormEvent, useMemo, useState } from 'react'

export type CommunityCardItem = {
  id: string
  nome: string
  href?: string
  searchText: string
  sortValues: Record<string, string>
  infos: { label: string; value: string }[]
}

type SortOption = {
  value: string
  label: string
}

type CommunityColumnProps = {
  heading: string
  searchId: string
  searchPlaceholder: string
  sortOptions: SortOption[]
  defaultSortBy: string
  defaultSortDir: 'asc' | 'desc'
  items: CommunityCardItem[]
  emptyLabel: string
  filteredEmptyLabel: string
  errorLabel?: string
}

type ColumnFilters = {
  search: string
  sortBy: string
  sortDir: 'asc' | 'desc'
}

const selectClassName =
  'w-full rounded border border-[#3A250B]/30 bg-[#FFF9F7] p-2 font-poppins text-[12px] font-semibold text-[#755835]/70 outline-none'

export function CommunityColumn({
  heading,
  searchId,
  searchPlaceholder,
  sortOptions,
  defaultSortBy,
  defaultSortDir,
  items,
  emptyLabel,
  filteredEmptyLabel,
  errorLabel,
}: CommunityColumnProps) {
  const [filters, setFilters] = useState<ColumnFilters>({
    search: '',
    sortBy: defaultSortBy,
    sortDir: defaultSortDir,
  })

  const visibleItems = useMemo(() => {
    const query = filters.search.trim().toLocaleLowerCase('pt-BR')
    const filtered = query ? items.filter((item) => item.searchText.toLocaleLowerCase('pt-BR').includes(query)) : items
    const direction = filters.sortDir === 'asc' ? 1 : -1

    return [...filtered].sort((left, right) => {
      const leftValue = left.sortValues[filters.sortBy] ?? ''
      const rightValue = right.sortValues[filters.sortBy] ?? ''
      return leftValue.localeCompare(rightValue, 'pt-BR', { numeric: true, sensitivity: 'base' }) * direction
    })
  }, [filters, items])

  const onFiltersSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const sortDir = String(data.get('sortDir') ?? defaultSortDir)

    setFilters({
      search: String(data.get('search') ?? ''),
      sortBy: String(data.get('sortBy') ?? defaultSortBy),
      sortDir: sortDir === 'asc' ? 'asc' : 'desc',
    })
  }

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-[#3A250B]/30 bg-white p-4 shadow-[2px_4px_14px_rgba(58,37,11,0.1)]">
      <h2 className="shrink-0 truncate font-poppins text-lg font-bold text-[#755835]">{heading}</h2>
      <form onSubmit={onFiltersSubmit} className="mt-3 flex shrink-0 flex-col gap-2">
        <div className="w-full [&>div]:w-full [&>div]:max-w-none">
          <Field name="search" placeholder={searchPlaceholder} id={searchId} type="text" />
        </div>
        <select
          name="sortBy"
          defaultValue={defaultSortBy}
          aria-label={`Ordenar ${heading}`}
          className={selectClassName}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          name="sortDir"
          defaultValue={defaultSortDir}
          aria-label={`Direção de ${heading}`}
          className={selectClassName}
        >
          <option value="desc">Descendente</option>
          <option value="asc">Ascendente</option>
        </select>
        <Button
          type="submit"
          className="w-fit cursor-pointer rounded border bg-[#FFF9F7] px-3 font-poppins text-[12px] font-semibold text-[#755835]/70 outline-none"
        >
          Aplicar filtros
        </Button>
      </form>
      <p className="mt-3 shrink-0 font-poppins text-sm font-semibold text-[#755835]/70">
        {errorLabel ? 'Indisponível' : `Mostrando ${visibleItems.length} de ${items.length}`}
      </p>
      <div className="mt-3 min-h-0 flex-1 overflow-y-auto overscroll-y-contain pr-1">
        {errorLabel ? (
          <p className="font-poppins text-sm font-semibold text-[#755835]">{errorLabel}</p>
        ) : visibleItems.length === 0 ? (
          <p className="font-poppins text-sm font-semibold text-[#755835]/70">
            {items.length === 0 ? emptyLabel : filteredEmptyLabel}
          </p>
        ) : (
          <ul className="flex w-full flex-col gap-3 pb-2">
            {visibleItems.map((item) => (
              <li key={item.id}>
                <Card
                  className="relative transition-shadow hover:shadow-[2px_6px_16px_rgba(58,37,11,0.16)]"
                  title={
                    item.href ? (
                      <Link
                        href={item.href}
                        className="rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8AA36C] after:absolute after:inset-0 after:content-['']"
                      >
                        {item.nome}
                      </Link>
                    ) : (
                      item.nome
                    )
                  }
                  infos={item.infos}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

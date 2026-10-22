import { API_URL } from '@/global/constants/api'
import { useListQuery } from '@/global/hooks/useListQuery'
import { api } from '@/lib/http/api'
import { listAdotantesQuerySchema } from '@/schemas/personSchema'
import { ListAdotantesQuery, ListAdotantesResponse } from '../types'

const fetchAdotantesList = async (query: Partial<ListAdotantesQuery> = {}): Promise<ListAdotantesResponse> => {
  const validatedQuery = listAdotantesQuerySchema.parse(query)
  const searchParams = new URLSearchParams()

  if (validatedQuery.page) searchParams.set('page', validatedQuery.page.toString())
  if (validatedQuery.pageSize) searchParams.set('pageSize', validatedQuery.pageSize.toString())
  if (validatedQuery.search) searchParams.set('search', validatedQuery.search)
  if (validatedQuery.sortBy) searchParams.set('sortBy', validatedQuery.sortBy)
  if (validatedQuery.sortDir) searchParams.set('sortDir', validatedQuery.sortDir)

  const url = `${API_URL}/adotantes${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
  return api<ListAdotantesResponse>(url)
}

export const useAdotantesList = (query: Partial<ListAdotantesQuery> = {}) => {
  return useListQuery({
    queryKey: ['adotantes', query],
    queryFn: () => fetchAdotantesList(query),
  })
}

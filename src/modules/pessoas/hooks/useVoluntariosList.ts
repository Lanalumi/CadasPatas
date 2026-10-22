import { API_URL } from '@/global/constants/api'
import { useListQuery } from '@/global/hooks/useListQuery'
import { api } from '@/lib/http/api'
import { listVoluntariosQuerySchema } from '@/schemas/personSchema'
import { ListVoluntariosQuery, ListVoluntariosResponse } from '../types'

const fetchVoluntariosList = async (query: Partial<ListVoluntariosQuery> = {}): Promise<ListVoluntariosResponse> => {
  const validatedQuery = listVoluntariosQuerySchema.parse(query)
  const searchParams = new URLSearchParams()

  if (validatedQuery.page) searchParams.set('page', validatedQuery.page.toString())
  if (validatedQuery.pageSize) searchParams.set('pageSize', validatedQuery.pageSize.toString())
  if (validatedQuery.search) searchParams.set('search', validatedQuery.search)
  if (validatedQuery.sortBy) searchParams.set('sortBy', validatedQuery.sortBy)
  if (validatedQuery.sortDir) searchParams.set('sortDir', validatedQuery.sortDir)

  const url = `${API_URL}/voluntarios${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
  return api<ListVoluntariosResponse>(url)
}

export const useVoluntariosList = (query: Partial<ListVoluntariosQuery> = {}) => {
  return useListQuery({
    queryKey: ['voluntarios', query],
    queryFn: () => fetchVoluntariosList(query),
  })
}

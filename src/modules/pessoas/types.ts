import {
  createAdotanteSchema,
  createPersonSchema,
  createVoluntarioSchema,
  adotantePublicSchema,
  adotantesListFiltersSchema,
  listAdotantesQuerySchema,
  listAdotantesResponseSchema,
  listVoluntariosQuerySchema,
  listVoluntariosResponseSchema,
  personPublicSchema,
  voluntarioPublicSchema,
  voluntariosListFiltersSchema,
} from '@/schemas/personSchema'
import { z } from 'zod'

export type CreateAdotante = z.infer<typeof createAdotanteSchema>
export type CreatePessoa = z.infer<typeof createPersonSchema>
export type CreateVoluntario = z.infer<typeof createVoluntarioSchema>

export type Pessoa = z.infer<typeof personPublicSchema>
export type Voluntario = z.infer<typeof voluntarioPublicSchema>
export type ListVoluntariosQuery = z.infer<typeof listVoluntariosQuerySchema>
export type ListVoluntariosResponse = z.infer<typeof listVoluntariosResponseSchema>
export type VoluntariosListFilters = z.infer<typeof voluntariosListFiltersSchema>
export type Adotante = z.infer<typeof adotantePublicSchema>
export type ListAdotantesQuery = z.infer<typeof listAdotantesQuerySchema>
export type ListAdotantesResponse = z.infer<typeof listAdotantesResponseSchema>
export type AdotantesListFilters = z.infer<typeof adotantesListFiltersSchema>

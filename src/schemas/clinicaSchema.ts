import z from 'zod'

export const clinicaPublicSchema = z.object({
  id: z.uuid(),
  nome: z.string(),
  email: z.string(),
  telefone: z.string(),
  cidade: z.string(),
  criadoEm: z.coerce.date(),
})

export const listClinicasQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  sortBy: z.enum(['criadoEm', 'nome', 'cidade']).default('criadoEm'),
  sortDir: z.enum(['asc', 'desc']).default('desc'),
})

export const listClinicasResponseSchema = z.object({
  items: z.array(clinicaPublicSchema),
  total: z.number().int(),
  page: z.number().int(),
  pageSize: z.number().int(),
})

export const clinicasListFiltersSchema = listClinicasQuerySchema
  .pick({
    search: true,
    sortBy: true,
    sortDir: true,
  })
  .partial()

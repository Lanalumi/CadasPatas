import z from 'zod'

export const createLocalizacaoSchema = z.object({
  tipoLocal: z.string().trim().min(1, 'O tipo de local é obrigatório'),
  nome: z.string().trim().min(1, 'O nome é obrigatório'),
})

export const localizacaoPublicSchema = z.object({
  id: z.uuid(),
  tipoLocal: z.string(),
  nome: z.string(),
  ativo: z.boolean(),
})

export const updateLocalizacaoSchema = createLocalizacaoSchema.extend({
  ativo: z.boolean(),
})

export const localizacaoListItemSchema = localizacaoPublicSchema.extend({
  totalAnimais: z.number().int().nonnegative().default(0),
})

export const listLocalizacoesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  sortBy: z.enum(['nome', 'tipoLocal']).default('nome'),
  sortDir: z.enum(['asc', 'desc']).default('asc'),
})

export const listLocalizacoesResponseSchema = z.object({
  items: z.array(localizacaoListItemSchema),
  total: z.number().int(),
  page: z.number().int(),
  pageSize: z.number().int(),
})

export const localizacoesListFiltersSchema = listLocalizacoesQuerySchema
  .pick({
    search: true,
    sortBy: true,
    sortDir: true,
  })
  .partial()

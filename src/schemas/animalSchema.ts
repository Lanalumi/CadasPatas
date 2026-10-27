import z from 'zod'

function asDate(val: unknown) {
  if (val instanceof Date) return val
  return new Date(val as string)
}

function asOptionalDate(val: unknown) {
  if (val === null || val === undefined || val === '') return null
  return asDate(val)
}

const animalFields = {
  nome: z.string().min(1, 'Nome do animal é obrigatório'),
  sexo: z.boolean(),
  cor: z.string().min(1, 'A cor é obrigatória'),
  raca: z.string().min(1, 'A raça é obrigatória'),
  pelagem: z.string().min(1, 'A pelagem é obrigatória'),
  dataNascimento: z.preprocess(asOptionalDate, z.date().nullable()),
  dataChegada: z.preprocess(asDate, z.date()),
  fivFelv: z.boolean(),
  foto: z.preprocess(
    (val) => (val === '' ? null : val),
    z.string().url('A foto deve ser uma URL válida').nullable().optional(),
  ),
  especie: z.string().min(1),
  motivoSaida: z.string().nullable().optional(),
}

export const animalEntitySchema = z.object({
  id: z.uuid(),
  ...animalFields,
})

export const situacaoAnimalSchema = z.enum(['abrigo', 'adotado', 'obito', 'saiu'])

const obitoPattern = /obito|morte|morreu|faleceu|falecimento|eutanasia/

export function deriveSituacao(motivoSaida: string | null | undefined, adotado: boolean) {
  if (adotado) return 'adotado' as const

  const motivo = motivoSaida?.trim() ?? ''
  if (!motivo) return 'abrigo' as const

  const normalized = motivo.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()

  if (obitoPattern.test(normalized)) return 'obito' as const
  return 'saiu' as const
}

export const situacaoAnimalLabel = {
  abrigo: 'Disponível',
  adotado: 'Adotado',
  obito: 'Faleceu',
  saiu: 'Saiu',
} as const

export const animalPublicSchema = animalEntitySchema.extend({
  localizacaoAtual: z.string().nullable().optional(),
  adotado: z.boolean(),
  situacao: situacaoAnimalSchema,
})

export const updateAnimalSchema = z.object(animalFields)
export const listAnimalsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  sortBy: z.enum(['dataChegada', 'nome', 'dataNascimento', 'sexo']).default('dataChegada'),
  sortDir: z.enum(['asc', 'desc']).default('desc'),
})

export const listAnimalsResponseSchema = z.object({
  items: z.array(animalPublicSchema),
  total: z.number().int(),
  page: z.number().int(),
  pageSize: z.number().int(),
})

// Extract only the filter fields for form validation (not pagination)
export const animalsListFiltersSchema = listAnimalsQuerySchema
  .pick({
    search: true,
    sortBy: true,
    sortDir: true,
  })
  .partial()

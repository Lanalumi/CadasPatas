import z from 'zod'

export const animalPublicSchema = z.object({
  id: z.uuid(),
  nome: z.string().min(1, 'Nome do animal é obrigatório'),
  sexo: z.string().min(1, 'Especifique o sexo'),
  cor: z.string().min(1, 'A cor é obrigatória'),
  raca: z.string().min(1, 'A raça é obrigatória'),
  pelagem: z.string().min(1, 'A pelagem é obrigatória'),
  dataNascimento: z.preprocess((val) => new Date(val as string), z.date()),
  dataChegada: z.preprocess((val) => new Date(val as string), z.date()),
  chip: z.boolean(),
  foto: z.string().url('A foto deve ser uma URL válida').optional(),
  especie: z.string().min(1),
  observacoes: z.string().optional().nullable(),
})

export const animalEntitySchema = z.object({
  id: z.uuid(),
  nome: z.string().min(1, 'Nome do animal é obrigatório'),
  sexo: z.string().min(1, 'Especifique o sexo'),
  cor: z.string().min(1, 'A cor é obrigatória'),
  raca: z.string().min(1, 'A raça é obrigatória'),
  pelagem: z.string().min(1, 'A pelagem é obrigatória'),
  dataNascimento: z.preprocess((val) => new Date(val as string), z.date()),
  dataChegada: z.preprocess((val) => new Date(val as string), z.date()),
  chip: z.boolean(),
  foto: z.string().url('A foto deve ser uma URL válida').optional(),
  especie: z.string().min(1),
  observacoes: z.string().optional().nullable(),
})

export const updateAnimalSchema = z.object({
  nome: z.string().min(1, 'Nome do animal é obrigatório'),
  sexo: z.string().min(1, 'Especifique o sexo'),
  cor: z.string().min(1, 'A cor é obrigatória'),
  raca: z.string().min(1, 'A raça é obrigatória'),
  pelagem: z.string().min(1, 'A pelagem é obrigatória'),
  dataNascimento: z.preprocess((val) => new Date(val as string), z.date()),
  dataChegada: z.preprocess((val) => new Date(val as string), z.date()),
  chip: z.boolean(),
  foto: z.string().url('A foto deve ser uma URL válida').optional(),
  especie: z.string().min(1),
  observacoes: z.string().optional().nullable(),
})
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

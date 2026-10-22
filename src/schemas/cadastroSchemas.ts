import { z } from 'zod'

export const idSchema = z.string().uuid('ID inválido')

export const createAnimalSchema = z.object({
  nome: z.string().min(1, 'Nome do animal é obrigatório'),
  sexo: z.string().min(1, 'Especifique o sexo'),
  cor: z.string().min(1, 'A cor é obrigatória'),
  raca: z.string().min(1, 'A raça é obrigatória'),
  pelagem: z.string().min(1, 'A pelagem é obrigatória'),
  dataNascimento: z.preprocess((val) => new Date(val as string), z.date()),
  dataChegada: z.preprocess((val) => new Date(val as string), z.date()),
  observacoes: z.string().optional().nullable(),
  chip: z.boolean(),
  especie: z.string().min(1),
  foto: z.string().url('A foto deve ser uma URL válida').optional(),
})

export const createAdocaoSchema = z.object({
  adotanteId: z.string().uuid('ID do adotante inválido'),
  animalId: z.string().uuid('ID do animal inválido'),
  dataAdocao: z.preprocess((val) => new Date(val as string), z.date()),
})

export const createFichaMedicaSchema = z.object({
  consultaId: z.string().uuid('ID da consulta inválido'),
  castracao: z.preprocess((val) => val === 'true' || val === true, z.boolean()),
  vermifucacao: z.preprocess((val) => val === 'true' || val === true, z.boolean()),
  vacina: z.preprocess((val) => val === 'true' || val === true, z.boolean()),
})

export type CreateAdocao = z.infer<typeof createAdocaoSchema>
export type CreateFichaMedica = z.infer<typeof createFichaMedicaSchema>

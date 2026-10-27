import { z } from 'zod'
import { updateAnimalSchema } from './animalSchema'

export const idSchema = z.string().uuid('ID inválido')

export const createAnimalSchema = updateAnimalSchema

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

import { z } from 'zod'

export const createAdotanteSchema = z.object({
  nome: z.string().min(3, 'Nome é obrigatório'),
  cpf: z.string().min(11, 'CPF inválido').max(14),
  email: z.string().email('E-mail inválido'),
  dataNascimento: z.preprocess((val) => new Date(val as string), z.date()),
  telefone: z.string().min(10, 'Telefone inválido'),
  rua: z.string().min(1, 'A rua é obrigatória'),
  cidade: z.string().min(1, 'A cidade é obrigatória'),
  numero: z.preprocess((val) => Number(val), z.number().int().positive('Número inválido')),
  bairro: z.string().min(1, 'O bairro é obrigatório'),
  aptoDoacao: z.preprocess((val) => val === 'true' || val === true, z.boolean()),
})

export const createVetSchema = z.object({
  nome: z.string().min(3, 'Nome é obrigatório'),
  cpf: z.string().min(11, 'CPF inválido').max(14),
  email: z.string().email('E-mail inválido'),
  dataNascimento: z.preprocess((val) => new Date(val as string), z.date()),
  telefone: z.string().min(10, 'Telefone inválido'),
  rua: z.string().min(1, 'A rua é obrigatória'),
  cidade: z.string().min(1, 'A cidade é obrigatória'),
  numero: z.preprocess((val) => Number(val), z.number().int().positive()),
  bairro: z.string().min(1, 'O bairro é obrigatório'),
  especializacao: z.string().min(2, 'Especialização é obrigatória'),
  crmvNum: z.string().min(3, 'Número do CRMV é obrigatório'),
  crmvUf: z.string().length(2, 'UF deve ter exatamente 2 caracteres (ex: SP)'),
})

export const createVoluntarioSchema = z.object({
  nome: z.string().min(3, 'Nome é obrigatório'),
  cpf: z.string().min(11, 'CPF inválido').max(14),
  email: z.string().email('E-mail inválido'),
  dataNascimento: z.preprocess((val) => new Date(val as string), z.date()),
  telefone: z.string().min(10, 'Telefone inválido'),
  rua: z.string().min(1, 'A rua é obrigatória'),
  cidade: z.string().min(1, 'A cidade é obrigatória'),
  numero: z.preprocess((val) => Number(val), z.number().int().positive()),
  bairro: z.string().min(1, 'O bairro é obrigatório'),
  dataInscricao: z.preprocess((val) => new Date(val as string), z.date()),
  dataSaida: z.preprocess((val) => (val ? new Date(val as string) : null), z.date().nullable().optional()),
  senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
})

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
export const createConsultaSchema = z.object({
  vetId: z.string().uuid('ID do veterinário inválido'),
  animalId: z.string().uuid('ID do animal inválido'),
  motivo: z.string().min(1, 'O motivo é obrigatório').max(20, 'Máximo 20 caracteres'),
  observacao: z.string().min(1, 'A observação é obrigatória').max(100, 'Máximo 100 caracteres'),
  prescricao: z.string().min(1, 'A prescrição é obrigatória').max(100, 'Máximo 100 caracteres'),
  dataAtendimento: z.preprocess((val) => new Date(val as string), z.date()),
})

export const createFichaMedicaSchema = z.object({
  consultaId: z.string().uuid('ID da consulta inválido'),
  castracao: z.preprocess((val) => val === 'true' || val === true, z.boolean()),
  vermifucacao: z.preprocess((val) => val === 'true' || val === true, z.boolean()),
  vacina: z.preprocess((val) => val === 'true' || val === true, z.boolean()),
})

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

export type CreateAdotante = z.infer<typeof createAdotanteSchema>
export type CreateVet = z.infer<typeof createVetSchema>
export type CreateVoluntario = z.infer<typeof createVoluntarioSchema>
export type CreateAdocao = z.infer<typeof createAdocaoSchema>
export type CreateConsulta = z.infer<typeof createConsultaSchema>
export type CreateFichaMedica = z.infer<typeof createFichaMedicaSchema>

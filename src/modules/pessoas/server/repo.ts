import { Prisma } from '@/generated/prisma/client'
import { prisma } from '@/lib/db'
import { listAdotantesQuerySchema, listVoluntariosQuerySchema } from '@/schemas/personSchema'

function tryParseSearchDate(value: string): Date | null {
  const trimmed = value.trim()
  const brMatch = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(trimmed)
  if (brMatch) {
    const day = Number(brMatch[1])
    const month = Number(brMatch[2])
    const year = Number(brMatch[3])
    const date = new Date(year, month - 1, day)
    if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
      return date
    }
    return null
  }

  const parsed = new Date(trimmed)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function dayRange(date: Date) {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  const end = new Date(date)
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

export async function voluntarioFindMany(raw: unknown) {
  const { page, pageSize, search, sortBy, sortDir } = listVoluntariosQuerySchema.parse(raw)

  const searchConditions: Prisma.VoluntarioWhereInput[] = []

  if (search) {
    searchConditions.push(
      { nome: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { cpf: { contains: search, mode: 'insensitive' } },
      { telefone: { contains: search, mode: 'insensitive' } },
      { cidade: { contains: search, mode: 'insensitive' } },
    )

    const parsedDate = tryParseSearchDate(search)
    if (parsedDate) {
      const { start, end } = dayRange(parsedDate)
      searchConditions.push(
        { dataNascimento: { gte: start, lte: end } },
        { dataInscricao: { gte: start, lte: end } },
      )
    }
  }

  const where: Prisma.VoluntarioWhereInput = {
    ...(searchConditions.length > 0 ? { OR: searchConditions } : {}),
  }

  const [items, total] = await Promise.all([
    prisma.voluntario.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortBy]: sortDir },
    }),
    prisma.voluntario.count({ where }),
  ])

  return { items, total, page, pageSize }
}

export const voluntarioDelete = (id: string) => prisma.voluntario.delete({ where: { id } })

export async function adotanteFindMany(raw: unknown) {
  const { page, pageSize, search, sortBy, sortDir } = listAdotantesQuerySchema.parse(raw)

  const searchConditions: Prisma.AdotanteWhereInput[] = []

  if (search) {
    searchConditions.push(
      { nome: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { cpf: { contains: search, mode: 'insensitive' } },
      { telefone: { contains: search, mode: 'insensitive' } },
      { cidade: { contains: search, mode: 'insensitive' } },
    )

    const parsedDate = tryParseSearchDate(search)
    if (parsedDate) {
      const { start, end } = dayRange(parsedDate)
      searchConditions.push({ dataNascimento: { gte: start, lte: end } }, { criadoEm: { gte: start, lte: end } })
    }
  }

  const where: Prisma.AdotanteWhereInput = {
    ...(searchConditions.length > 0 ? { OR: searchConditions } : {}),
  }

  const [items, total] = await Promise.all([
    prisma.adotante.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortBy]: sortDir },
    }),
    prisma.adotante.count({ where }),
  ])

  return { items, total, page, pageSize }
}

export const adotanteDelete = (id: string) => prisma.adotante.delete({ where: { id } })

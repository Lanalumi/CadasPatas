import { Prisma } from '@/generated/prisma/client'
import { prisma } from '@/lib/db'
import { listAnimalsQuerySchema } from '@/schemas/cadastroSchemas'

export const animalById = (id: string) => {
  const where: { id: string } = { id }
  return prisma.animal.findUnique({ where })
}

export const animalCreate = (data: {
  nome: string
  sexo: string
  cor: string
  raca: string
  pelagem: string
  dataNascimento: Date
  chip: boolean
  foto?: string
  especie: string
  dataChegada: Date
  observacoes?: string | null
}) => prisma.animal.create({ data })

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

export async function animalFindMany(raw: unknown) {
  const { page, pageSize, search, sortBy, sortDir } = listAnimalsQuerySchema.parse(raw)

  const searchConditions: Prisma.AnimalWhereInput[] = []

  if (search) {
    searchConditions.push(
      { nome: { contains: search, mode: 'insensitive' } },
      { sexo: { contains: search, mode: 'insensitive' } },
      { raca: { contains: search, mode: 'insensitive' } },
      { especie: { contains: search, mode: 'insensitive' } },
    )

    const parsedDate = tryParseSearchDate(search)
    if (parsedDate) {
      const { start, end } = dayRange(parsedDate)
      searchConditions.push({ dataNascimento: { gte: start, lte: end } }, { dataChegada: { gte: start, lte: end } })
    }
  }

  const where: Prisma.AnimalWhereInput = {
    ...(searchConditions.length > 0 ? { OR: searchConditions } : {}),
  }

  const [items, total] = await Promise.all([
    prisma.animal.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortBy]: sortDir },
    }),
    prisma.animal.count({ where }),
  ])

  return { items, total, page, pageSize }
}

export const animalUpdate = (id: string, data: Prisma.AnimalUpdateInput) =>
  prisma.animal.update({ where: { id }, data })

export const animalDelete = (id: string) => prisma.animal.delete({ where: { id } })

import { prisma } from '@/lib/db'
import type { Animal as PrismaAnimal } from '@/generated/prisma/client'
import { animalPublicSchema, updateAnimalSchema } from '@/schemas/cadastroSchemas'
import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export const runtime = 'nodejs'

function toPublicAnimal(animal: PrismaAnimal) {
  return animalPublicSchema.parse({
    id: animal.id,
    nome: animal.nome,
    sexo: animal.sexo,
    cor: animal.cor,
    raca: animal.raca,
    pelagem: animal.pelagem,
    dataNascimento: animal.dataNascimento,
    dataChegada: animal.dataChegada,
    chip: animal.chip,
    foto: animal.foto,
    especie: animal.especie,
    observacoes: animal.observacoes,
  })
}

export const GET = async (_request: Request, { params }: { params: Promise<{ idAnimal: string }> }) => {
  const { idAnimal } = await params

  const animal = await prisma.animal.findUnique({
    where: { id: idAnimal },
  })

  if (!animal) {
    return NextResponse.json({ message: 'Animal não encontrado' }, { status: 404 })
  }

  return NextResponse.json(toPublicAnimal(animal), { status: 200 })
}

export const DELETE = async (_request: Request, { params }: { params: Promise<{ idAnimal: string }> }) => {
  const { idAnimal } = await params

  const animal = await prisma.animal.delete({
    where: { id: idAnimal },
  })

  return NextResponse.json(animal, { status: 200 })
}

export const PATCH = async (request: Request, { params }: { params: Promise<{ idAnimal: string }> }) => {
  const { idAnimal } = await params

  try {
    const body = await request.json()
    const data = updateAnimalSchema.partial().parse(body)
    const { observacoes, ...rest } = data

    const animal = await prisma.animal.update({
      data: {
        ...rest,
        ...(observacoes !== undefined && {
          observacoes: observacoes?.trim() || null,
        }),
      },
      where: { id: idAnimal },
    })

    return NextResponse.json(toPublicAnimal(animal), { status: 200 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: 'Dados inválidos', error: error.flatten().fieldErrors }, { status: 400 })
    }

    console.error('[PATCH /api/animais/:id]', error)
    return NextResponse.json({ message: 'Erro ao atualizar animal' }, { status: 500 })
  }
}

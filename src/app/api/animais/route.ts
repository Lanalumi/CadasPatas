import { prisma } from '@/lib/db'
import { animalPublicSchema, createAnimalSchema } from '@/schemas/cadastroSchemas'
import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = createAnimalSchema.parse(body)

    const animal = await prisma.animal.create({
      data: {
        nome: data.nome,
        peso: 0,
        sexo: data.sexo,
        cor: data.cor,
        raca: data.raca,
        pelagem: data.pelagem,
        dataNascimento: data.dataNascimento,
        dataChegada: data.dataChegada,
        chip: data.chip,
        foto: data.foto,
        especie: data.especie,
      },
    })

    const response = animalPublicSchema.parse({
      id: animal.id,
      nome: animal.nome,
      sexo: animal.sexo,
      cor: animal.cor,
      raca: animal.raca,
      pelagem: animal.pelagem,
      dataNascimento: animal.dataNascimento,
      dataChegada: animal.dataChegada,
      observacoes: data.observacoes ?? null,
      chip: animal.chip,
      foto: animal.foto,
      especie: animal.especie,
    })

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: 'Dados inválidos', error: error.flatten().fieldErrors }, { status: 400 })
    }

    console.error('[POST /api/animais]', error)
    return NextResponse.json({ message: 'Erro ao cadastrar animal' }, { status: 500 })
  }
}

import { updateLocalizacao } from '@/modules/gatis/server/service'
import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export async function PATCH(request: Request, { params }: { params: Promise<{ idGatil: string }> }) {
  const { idGatil } = await params

  try {
    const body = await request.json()
    const localizacao = await updateLocalizacao(idGatil, body)
    return NextResponse.json(localizacao)
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: 'Dados inválidos', error: error.flatten().fieldErrors }, { status: 400 })
    }

    console.error('[PATCH /api/gatis/:id]', error)
    return NextResponse.json({ message: 'Erro ao atualizar gatil' }, { status: 500 })
  }
}

import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export const DELETE = async (_request: Request, { params }: { params: Promise<{ idAdotante: string }> }) => {
  const { idAdotante } = await params

  const adotante = await prisma.adotante.delete({
    where: { id: idAdotante },
  })

  return NextResponse.json({ id: adotante.id }, { status: 200 })
}

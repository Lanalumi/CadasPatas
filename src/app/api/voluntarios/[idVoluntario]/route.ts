import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export const DELETE = async (_request: Request, { params }: { params: Promise<{ idVoluntario: string }> }) => {
  const { idVoluntario } = await params

  const voluntario = await prisma.voluntario.delete({
    where: { id: idVoluntario },
  })

  return NextResponse.json({ id: voluntario.id }, { status: 200 })
}

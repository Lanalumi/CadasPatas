import { deleteClinicaById } from '@/modules/clinicas/server/service'
import { NextResponse } from 'next/server'

export const DELETE = async (_request: Request, { params }: { params: Promise<{ idClinica: string }> }) => {
  const { idClinica } = await params

  await deleteClinicaById(idClinica)

  return NextResponse.json({ id: idClinica }, { status: 200 })
}

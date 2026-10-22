import { listVoluntarios } from '@/modules/pessoas/server/service'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const queryParams = Object.fromEntries(url.searchParams.entries())
  const data = await listVoluntarios(queryParams)

  return NextResponse.json(data)
}

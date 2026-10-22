import { listClinicas } from '@/modules/clinicas/server/service'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const queryParams = Object.fromEntries(url.searchParams.entries())
  const data = await listClinicas(queryParams)

  return NextResponse.json(data)
}

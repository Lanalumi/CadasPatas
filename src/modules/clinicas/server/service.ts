import { clinicaPublicSchema, createClinicaSchema, listClinicasResponseSchema } from '@/schemas/clinicaSchema'
import { clinicaCreate, clinicaDelete, clinicaFindMany } from './repo'

export async function listClinicas(rawQuery: unknown) {
  const response = await clinicaFindMany(rawQuery)
  const clinicas = response.items.map((row) => clinicaPublicSchema.parse(row))
  return listClinicasResponseSchema.parse({ ...response, items: clinicas })
}

export async function createClinica(raw: unknown) {
  const data = createClinicaSchema.parse(raw)
  const created = await clinicaCreate(data)
  return clinicaPublicSchema.parse(created)
}

export async function deleteClinicaById(id: string) {
  await clinicaDelete(id)
}

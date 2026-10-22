import { clinicaPublicSchema, listClinicasResponseSchema } from '@/schemas/clinicaSchema'
import { clinicaDelete, clinicaFindMany } from './repo'

export async function listClinicas(rawQuery: unknown) {
  const response = await clinicaFindMany(rawQuery)
  const clinicas = response.items.map((row) => clinicaPublicSchema.parse(row))
  return listClinicasResponseSchema.parse({ ...response, items: clinicas })
}

export async function deleteClinicaById(id: string) {
  await clinicaDelete(id)
}

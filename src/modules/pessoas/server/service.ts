import {
  adotantePublicSchema,
  listAdotantesResponseSchema,
  listVoluntariosResponseSchema,
  voluntarioPublicSchema,
} from '@/schemas/personSchema'
import { adotanteDelete, adotanteFindMany, voluntarioDelete, voluntarioFindMany } from './repo'

function toPublic(row: unknown) {
  return voluntarioPublicSchema.parse(row)
}

export async function listVoluntarios(rawQuery: unknown) {
  const response = await voluntarioFindMany(rawQuery)
  const voluntarios = response.items.map(toPublic)
  return listVoluntariosResponseSchema.parse({ ...response, items: voluntarios })
}

export async function deleteVoluntarioById(id: string) {
  await voluntarioDelete(id)
}

export async function listAdotantes(rawQuery: unknown) {
  const response = await adotanteFindMany(rawQuery)
  const adotantes = response.items.map((row) => adotantePublicSchema.parse(row))
  return listAdotantesResponseSchema.parse({ ...response, items: adotantes })
}

export async function deleteAdotanteById(id: string) {
  await adotanteDelete(id)
}

import {
  createLocalizacaoSchema,
  listLocalizacoesResponseSchema,
  localizacaoListItemSchema,
  localizacaoPublicSchema,
  updateLocalizacaoSchema,
} from '@/schemas/localizacaoSchema'
import { localizacaoCreate, localizacaoFindMany, localizacaoUpdate } from './repo'

function totalAnimaisAtivos(animalIds: Iterable<string> | null | undefined) {
  if (!animalIds) return 0
  return new Set(animalIds).size
}

export async function listLocalizacoes(rawQuery: unknown) {
  const response = await localizacaoFindMany(rawQuery)
  const locais = response.items.map((row) =>
    localizacaoListItemSchema.parse({
      id: row.id,
      nome: row.nome,
      tipoLocal: row.tipoLocal,
      ativo: row.ativo,
      totalAnimais: totalAnimaisAtivos(row.historicos?.map((historico) => historico.animalId)),
    }),
  )
  return listLocalizacoesResponseSchema.parse({ ...response, items: locais })
}

export async function createLocalizacao(raw: unknown) {
  const data = createLocalizacaoSchema.parse(raw)
  const created = await localizacaoCreate(data)
  return localizacaoPublicSchema.parse(created)
}

export async function updateLocalizacao(id: string, raw: unknown) {
  const data = updateLocalizacaoSchema.parse(raw)
  const updated = await localizacaoUpdate(id, data)
  return localizacaoPublicSchema.parse(updated)
}

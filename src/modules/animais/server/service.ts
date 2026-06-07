import {
  animalEntitySchema,
  animalPublicSchema,
  createAnimalSchema,
  idSchema,
  listAnimalsQuerySchema,
  listAnimalsResponseSchema,
  updateAnimalSchema,
} from '@/schemas/cadastroSchemas'
import { animalById, animalCreate, animalDelete, animalFindMany, animalUpdate } from './repo'

export async function createAnimal(raw: unknown) {
  const animal = createAnimalSchema.parse(raw)

  const created = await animalCreate(animal)

  return created
}

function toPublic(row: unknown) {
  const entity = animalEntitySchema.parse(row)

  return animalPublicSchema.parse({
    ...entity,
    dataChegada: entity.dataChegada.toISOString(),
    dataNascimento: entity.dataNascimento.toISOString(),
  })
}
export async function listAnimals(rawQuery: unknown) {
  const query = listAnimalsQuerySchema.parse(rawQuery)
  const response = await animalFindMany(query)
  const animals = response.items.map(toPublic)
  return listAnimalsResponseSchema.parse({ ...response, items: animals })
}

export async function getAnimalById(raw: unknown) {
  const id = idSchema.parse(raw)
  const foundAnimal = await animalById(id)

  if (!foundAnimal) {
    throw new Error('Animal not found')
  }

  return toPublic(foundAnimal)
}

export async function updateAnimalById(id: string, raw: unknown) {
  const existingAnimal = await animalById(id)

  if (!existingAnimal) throw new Error('Animal not found')

  const patch = updateAnimalSchema.parse(raw)

  const prismaPatch: Record<string, unknown> = {}

  if (typeof patch.nome !== 'undefined') {
    prismaPatch.nome = patch.nome.trim()
  }

  const updatedAnimal = await animalUpdate(existingAnimal.id, prismaPatch)

  return toPublic(updatedAnimal)
}

export async function deleteAnimalById(id: string) {
  const existingAnimal = await animalById(id)

  if (!existingAnimal) throw new Error('Animal not found')

  await animalDelete(existingAnimal.id)

  return
}

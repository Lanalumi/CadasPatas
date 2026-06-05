import { animalPublicSchema, createAnimalSchema } from '@/schemas/cadastroSchemas'

import { z } from 'zod'

export type CreateAnimalForm = z.input<typeof createAnimalSchema>
export type CreateAnimal = z.infer<typeof createAnimalSchema>
export type Animal = z.infer<typeof animalPublicSchema>

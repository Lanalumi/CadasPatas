import z from 'zod'

function emptyToNull(val: unknown) {
  if (val === null || val === undefined || val === '') return null
  return val
}

export const createFichaMedicaSchema = z.object({
  animalId: z.uuid('Selecione o animal'),
  clinicaId: z.uuid('Selecione a clínica'),
  motivo: z.string().trim().min(1, 'Informe o motivo'),
  observacao: z.string().trim().min(1, 'Informe a observação'),
  dataAtendimento: z.coerce.date('Data de atendimento inválida. Use dd/mm/aaaa'),
  dataRetorno: z.preprocess(emptyToNull, z.coerce.date('Data de retorno inválida. Use dd/mm/aaaa').nullable()),
})

export const createMedicacaoSchema = z.object({
  animalId: z.uuid('Selecione o animal'),
  consultaId: z.uuid('Selecione a ficha médica'),
  medicamento: z.string().trim().min(1, 'Informe o medicamento'),
  tipo: z.preprocess(emptyToNull, z.string().trim().nullable()),
  dosagem: z.string().trim().min(1, 'Informe a dosagem'),
  quantidade: z.coerce.number('Informe a quantidade').int('A quantidade deve ser um número inteiro').positive('A quantidade deve ser maior que zero'),
  frequencia: z.string().trim().min(1, 'Informe a frequência'),
  duracaoTratamento: z.string().trim().min(1, 'Informe a duração do tratamento'),
})

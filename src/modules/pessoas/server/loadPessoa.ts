import { prisma } from '@/lib/db'
import { notFound, redirect } from 'next/navigation'
import { personHref, personRole, type PersonRole } from '../personRole'

export async function loadPessoaById(id: string) {
  return prisma.pessoa.findUnique({
    where: { id },
    include: {
      tipo: true,
      adocoes: {
        orderBy: { dataAdocao: 'desc' },
        include: { animal: { select: { id: true, nome: true } } },
      },
    },
  })
}

export async function requirePersonRole(id: string, expected: PersonRole) {
  const pessoa = await loadPessoaById(id)
  if (!pessoa) notFound()

  const role = personRole(pessoa.tipo.tipo)
  if (role !== expected) {
    if (role) redirect(personHref(pessoa.id, role))
    notFound()
  }

  return pessoa
}

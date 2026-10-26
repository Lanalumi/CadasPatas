import Link from 'next/link'

export default function NovaFichaMedicaPage() {
  return (
    <div className="flex min-h-lvh flex-col items-center gap-4 p-4">
      <h1 className="font-poppins text-2xl font-bold text-[#755835]">Nova ficha médica</h1>
      <Link href="/saude" className="font-poppins text-sm font-semibold text-[#8AA36C] hover:underline">
        Voltar para Saúde animal
      </Link>
    </div>
  )
}

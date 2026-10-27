import { FormNewGatil } from '@/modules/gatis/components/FormNewGatil/FormNewGatil'

export default function NewGatisPage() {
  return (
    <div className="flex max-w-[94%] flex-col items-center justify-center p-4">
      <header className="flex w-full flex-col gap-2 bg-[#FFF9F7] p-4">
        <h1 className="text-center font-poppins font-semibold text-[#755835]">Cadastro de gatil</h1>
        <div className="flex w-full flex-row items-center justify-center gap-2 text-center">
          <img src="/images/icons/paw.svg" alt="" width={24} height={24} />
          <span className="font-poppins font-semibold text-[#755835]">Novo gatil</span>
        </div>
      </header>
      <FormNewGatil />
    </div>
  )
}

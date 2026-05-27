import { FormNewAnimal } from '@/modules/animais/componentes/FormNewAnimal/FormNewAnimal'

export default function NewAnimalPage() {
  return (
    <div className="flex w-full min-w-0 max-w-full flex-col">
      <header className="flex w-full max-w-full flex-col bg-[#FFF9F7]">
        <h1 className="text-center font-poppins text-[#755835] font-semibold">Cadastro de Animal</h1>
        <div className="flex w-full max-w-full flex-row items-center justify-center gap-2 text-center">
          <img src="/images/icons/paw.svg" alt="animal" width={24} height={24} />
          <span className="font-poppins font-semibold text-[#755835]">Nome Animal</span>
        </div>
      </header>
      <FormNewAnimal />
    </div>
  )
}

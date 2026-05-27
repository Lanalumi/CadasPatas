import { FormNewAnimal } from '@/modules/animais/componentes/FormNewAnimal/FormNewAnimal'

export default function NewAnimalPage() {
  return (
    <div className="flex w-full min-w-0 max-w-full flex-col">
      <header className="flex w-full max-w-full flex-col bg-[#FFF9F7]">
        <h1 className="text-center text-[#755835] font-poppins font-semibold ">Cadastro de Animal</h1>
        <div className="flex flex-row items-center justify-center text-center gap-2 w-full max-w-full">
          <img src="/images/icons/paw.svg" alt="animal" width={24} height={24} />
          <span className="text-[#755835] font-poppins font-semibold">Nome Animal</span>
        </div>
      </header>
      <FormNewAnimal />
    </div>
  )
}

import { FormNewAnimal } from '@/modules/animais/componentes/FormNewAnimal/FormNewAnimal'

export default function NewAnimalPage() {
  return (
    <div>
      <header>
        <h1>Cadastro de Animal</h1>
        <div>{/* //icone //Nome Animal */}</div>
        {/* //Botao cadastrar */}
      </header>
      <FormNewAnimal />
    </div>
  )
}

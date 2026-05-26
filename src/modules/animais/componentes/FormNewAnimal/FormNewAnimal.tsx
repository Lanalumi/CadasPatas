import { CheckBox } from '@/global/ui/CheckBox/CheckBox'
import { DropDown } from '@/global/ui/DropDown/DropDown'
import { Field } from '@/global/ui/Field/Field'

export const FormNewAnimal = () => {
  const Especies = [
    {
      value: 'cachorro',
      label: 'Cachorro',
    },
    {
      value: 'gato',
      label: 'Gato',
    },
  ]
  const Cores = [
    {
      value: 'preto',
      label: 'Preto',
    },
    {
      value: 'branco',
      label: 'Branco',
    },
    {
      value: 'cinza',
      label: 'Cinza',
    },
    {
      value: 'caramelo',
      label: 'Caramelo',
    },
    {
      value: 'laranja',
      label: 'Laranja',
    },
  ]

  const Sexos = [
    {
      label: 'Fêmea',
      value: 'femea',
      checked: true,
    },
    {
      label: 'Macho',
      value: 'macho',
      checked: false,
    },
  ]
  return (
    <div>
      <header>
        <h1>Dados do animal</h1>
      </header>
      <form>
        <div>
          <Field label="Código de Identificação" id="codigoIdentificacao" type="text" />
          <Field label="Data de Chegada" id="dataChegada" type="text" />
          <DropDown
            options={[Especies[0].label, Especies[1].label]}
            value={[Especies[0].value, Especies[1].value]}
            id="especie"
          />
          <DropDown options={Cores.map((cor) => cor.label)} value={Cores.map((cor) => cor.value)} id="cor" />
        </div>
        <div>
          <Field label="Nome" id="nome" type="text" />
          <Field label="Data de Nascimento" id="dataNascimento" type="text" />
          <CheckBox title="Sexo" id="sexo" options={Sexos} />
        </div>
        <div>
          {/* //Foto //chip */}
          <CheckBox
            title="Chip"
            id="chip"
            options={[
              { label: 'Sim', value: 'sim', checked: true },
              { label: 'Não', value: 'nao', checked: false },
            ]}
          />
        </div>
        <div>{/* //Salvar //Atualizar //Limpar //Excluir */}</div>
      </form>
    </div>
  )
}

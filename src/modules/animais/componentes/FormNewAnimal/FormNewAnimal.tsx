import { AvatarUpload } from '@/global/ui/AvatarUpload/AvatarUpload'
import { Button } from '@/global/ui/Button/Button'
import { CheckBox } from '@/global/ui/CheckBox/CheckBox'
import { DropDown } from '@/global/ui/DropDown/DropDown'
import { Field } from '@/global/ui/Field/Field'
import { TextArea } from '@/global/ui/TextArea/TextArea'

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
  const Pelagens = [
    {
      label: 'Longo',
      value: 'longo',
    },
    {
      label: 'Curto',
      value: 'curto',
    },
    {
      label: 'Médio',
      value: 'medio',
    },
  ]
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[#3A250B]/30 bg-white shadow-[2px_4px_14px_rgba(58,37,11,0.1)] p-4">
      <header className="flex flex-row items-center justify-center gap-2 w-full max-w-full p-4">
        <img src="/images/icons/paw2.svg" alt="paw" width={24} height={24} />
        <div className="flex items-center justify-center text-center ">
          <span className="text-[#755835] font-poppins font-semibold ">Dados do animal</span>
        </div>
      </header>
      <form className="flex flex-col w-full max-w-full gap-4">
        <div className="flex md:flex-row flex-col gap-4 max-w-full md:justify-center md:items-center lg:justify-start border border-red-400">
          <div className="flex flex-row gap-4 ">
            <div className="flex flex-wrap flex-col gap-4">
              <Field label="Código de Identificação" id="codigoIdentificacao" type="text" />
              <Field label="Data de Chegada" id="dataChegada" type="text" />
              <DropDown
                options={[Especies[0].label, Especies[1].label]}
                value={[Especies[0].value, Especies[1].value]}
                id="especie"
              />
              <DropDown options={Cores.map((cor) => cor.label)} value={Cores.map((cor) => cor.value)} id="cor" />
            </div>
            <div className="flex flex-col gap-4  ">
              <Field label="Nome" id="nome" type="text" />
              <Field label="Data de Nascimento" id="dataNascimento" type="text" />
              <CheckBox title="Sexo" id="sexo" options={Sexos} />
              <DropDown
                options={Pelagens.map((pelagem) => pelagem.label)}
                value={Pelagens.map((pelagem) => pelagem.value)}
                id="pelagem"
              />
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <AvatarUpload label="Foto" id="foto" />
            <CheckBox
              title="Chip"
              id="chip"
              options={[
                { label: 'Sim', value: 'sim', checked: true },
                { label: 'Não', value: 'nao', checked: false },
              ]}
            />
          </div>
        </div>
        <div className="flex w-full justify-center">
          <TextArea label="Observações" id="observacoes" placeholder="Fale um pouco sobre o animal..." />
        </div>
        <div className="flex flex-wrap md:flex-row md:gap-4 lg:gap-16 items-center justify-center max-w-full">
          <Button green>Salvar</Button>
          <Button yellow>Atualizar</Button>
          <Button green>Limpar</Button>
          <Button red>Excluir</Button>
        </div>
      </form>
    </div>
  )
}

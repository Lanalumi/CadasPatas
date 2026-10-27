'use client'

import { AvatarUpload } from '@/global/ui/AvatarUpload/AvatarUpload'
import { Button } from '@/global/ui/Button/Button'
import { CheckBox } from '@/global/ui/CheckBox/CheckBox'
import { DropDown } from '@/global/ui/DropDown/DropDown'
import { Field } from '@/global/ui/Field/Field'
import { TextArea } from '@/global/ui/TextArea/TextArea'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { CreateAnimal, CreateAnimalForm } from '../../types'
import { toast } from 'react-toastify'
import { Especies, Cores, Sexos, Pelagens } from './components/especies'
import { createAnimalSchema } from '@/schemas/cadastroSchemas'
import { useCreateAnimal } from '../../hooks/useCreateAnimal'
import { ApiError } from '@/lib/client/errors'
import { parseBrDate } from '@/modules/pessoas/components/FormNewPerson/functions/parseDate'

type AnimalFormInput = Omit<CreateAnimalForm, 'dataNascimento' | 'dataChegada'> & {
  dataNascimento: string
  dataChegada: string
}

export const FormNewAnimal = () => {
  const router = useRouter()
  const createAnimalMutation = useCreateAnimal()

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AnimalFormInput>({
    defaultValues: {
      dataChegada: '',
      especie: '',
      raca: '',
      cor: '',
      nome: '',
      dataNascimento: '',
      sexo: 'femea',
      pelagem: '',
      foto: '',
      chip: false,
      observacoes: '',
    },
  })

  const onSubmit = (values: AnimalFormInput) => {
    const dataNascimento = parseBrDate(values.dataNascimento)
    if (!dataNascimento) {
      setError('dataNascimento', { message: 'Data inválida. Use dd/mm/aaaa' })
      toast.error('Data de nascimento inválida. Use dd/mm/aaaa')
      return
    }

    const dataChegada = parseBrDate(values.dataChegada)
    if (!dataChegada) {
      setError('dataChegada', { message: 'Data inválida. Use dd/mm/aaaa' })
      toast.error('Data de chegada inválida. Use dd/mm/aaaa')
      return
    }

    const result = createAnimalSchema.safeParse({
      ...values,
      dataNascimento,
      dataChegada,
    })

    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0]
        if (typeof field === 'string') {
          setError(field as keyof AnimalFormInput, { message: issue.message })
        }
      }
      toast.error(result.error.issues[0]?.message ?? 'Verifique os campos do formulário')
      return
    }

    createAnimalMutation.mutate(result.data as CreateAnimal, {
      onSuccess: (createdAnimal) => {
        toast.success('Animal registrado com sucesso')
        router.push(`/animais/${createdAnimal.id}`)
      },
      onError: (error) => {
        const message = error instanceof ApiError ? error.message : 'Erro ao registrar animal, tente novamente'
        toast.error(message)
      },
    })
  }

  const validationMessages = Object.values(errors)
    .map((error) => error?.message)
    .filter((message): message is string => Boolean(message))

  const isLoading = createAnimalMutation.isPending || isSubmitting

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#3A250B]/5 overflow-hidden">
      <div className="h-3 w-full bg-[#8AA36C]"></div>

      <div className="p-8 lg:p-12">
        <header className="mb-10 flex items-center gap-4 border-b border-[#3A250B]/10 pb-6">
          <div className="p-3 bg-[#FFF9F7] rounded-full border border-[#8AA36C]/40">
            <img src="/images/icons/paw2.svg" alt="paw" width={32} height={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#3A250B] font-poppins">Ficha de Admissão</h1>
            <p className="text-[#755835]/70 text-sm mt-1 font-poppins">Registre as informações do animal resgatado para facilitar o controle e acompanhamento pela ONG.</p>
          </div>
        </header>

        <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
          {validationMessages.length > 0 && (
            <div role="alert" className="rounded-xl border border-[#B85454]/40 bg-[#FFF0ED] p-5 text-sm text-[#8A3B3B] shadow-sm">
              <p className="font-poppins font-bold mb-2">Atenção aos seguintes campos:</p>
              <ul className="list-disc pl-5 font-poppins space-y-1">
                {validationMessages.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* Coluna da Esquerda */}
            <div className="w-full lg:w-1/3 flex flex-col items-center gap-8 p-8 bg-[#FFF9F7] rounded-3xl border border-[#3A250B]/5 relative">
              <h3 className="absolute top-4 left-6 text-xs font-bold text-[#755835]/50 uppercase tracking-widest">Identificação</h3>
              
              <div className="mt-4 w-full flex justify-center">
                <Controller
                  name="foto"
                  control={control}
                  render={({ field }) => (
                    <AvatarUpload
                      id="foto"
                      label="Foto do Animal"
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              </div>

              <div className="w-full h-px bg-[#3A250B]/10"></div>

              <div className="w-full flex flex-col items-center gap-2">
                <Controller
                  name="chip"
                  control={control}
                  render={({ field }) => (
                    <CheckBox
                      id="chip"
                      title="Possui Microchip?"
                      value={field.value ? 'sim' : 'nao'}
                      onChange={(selected) => field.onChange(selected === 'sim')}
                      onBlur={field.onBlur}
                      options={[
                        { label: 'Sim', value: 'sim' },
                        { label: 'Não', value: 'nao' },
                      ]}
                    />
                  )}
                />
              </div>
            </div>

            {/* Coluna da Direita */}
            <div className="w-full lg:w-2/3 flex flex-col gap-6">
              <div className="w-full">
                <Field label="Nome do Animal" id="nome" type="text" {...register('nome')} />
              </div>

              <div className="flex flex-col md:flex-row gap-6 w-full">
                <div className="flex-1 w-full">
                  <DropDown
                    label="Espécie"
                    options={[Especies[0].label, Especies[1].label]}
                    value={[Especies[0].value, Especies[1].value]}
                    id="especie"
                    {...register('especie')}
                  />
                </div>
                <div className="flex-1 w-full">
                  <Field label="Raça" id="raça" type="text" {...register('raca')} />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 w-full">
                <div className="flex-1 w-full">
                  <DropDown
                    label="Cor Predominante"
                    options={Cores.map((cor) => cor.label)}
                    value={Cores.map((cor) => cor.value)}
                    id="cor"
                    {...register('cor')}
                  />
                </div>
                <div className="flex-1 w-full">
                  <DropDown
                    label="Tipo de Pelagem"
                    options={Pelagens.map((pelagem) => pelagem.label)}
                    value={Pelagens.map((pelagem) => pelagem.value)}
                    id="pelagem"
                    {...register('pelagem')}
                  />
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 w-full items-end">
                {/* Forçando o alinhamento do CheckBox para a esquerda com ajustes de margem e flexbox */}
                <div className="flex-1 w-full pb-1 flex justify-start [&>div]:w-full [&>div]:items-start [&>div]:text-left -ml-2 md:-ml-0">
                  <div className="w-full relative -left-2 sm:-left-3 lg:-left-4 xl:-left-6">
                    <Controller
                      name="sexo"
                      control={control}
                      render={({ field }) => (
                        <CheckBox
                          id="sexo"
                          title="Sexo"
                          options={Sexos}
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="flex-1 w-full">
                  <Field label="Data de Nascimento" id="dataNascimento" type="text" {...register('dataNascimento')} />
                </div>
              </div>

              <div className="w-full">
                <Field label="Data de Chegada ao Abrigo" id="dataChegada" type="text" {...register('dataChegada')} />
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-[#3A250B]/10 my-2"></div>

          <div className="flex flex-col gap-6 w-full">
            <div className="w-full flex">
              <div className="w-full flex-1">
                <TextArea
                  label="Histórico e Observações"
                  id="observacoes"
                  placeholder="Descreva as condições de saúde, o histórico de resgate ou necessidades especiais..."
                  {...register('observacoes')}
                />
              </div>
            </div>

            <div className="flex w-full justify-end mt-4">
              {isLoading ? (
                <Button type="submit" disabled icon="/images/icons/save-button.svg">
                  Salvando...
                </Button>
              ) : (
                <Button type="submit" green icon="/images/icons/save-button.svg">
                  Salvar Ficha do Animal
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
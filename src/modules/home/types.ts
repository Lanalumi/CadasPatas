export type HomeMedicamento = {
  id: string
  nome: string
  dosagem: string
  frequencia: string
  duracaoTratamento: string
  proximaDose: string
}

export type HomeGato = {
  id: string
  nome: string
  foto: string | null
  sexoLabel: string
  especieLabel: string
  corLabel: string
  raca: string
  pelagemLabel: string
  dataChegada: string
  localizacaoAtual: string
  localizacaoIds: string[]
  situacaoLabel: string
  fivFelv: boolean
  medicamentos: HomeMedicamento[]
  medicineLabel: string
  proximaDoseLabel: string
}

export type HomeGatil = {
  id: string
  nome: string
  tipoLocal: string
  totalAnimais: number
  gatos: HomeGato[]
}

export type HomeAdocao = {
  id: string
  dataAdocao: string
  animal: {
    nome: string
    foto: string | null
    especieLabel: string
    situacaoLabel: string
  }
  adotante: {
    nome: string
    telefone: string
    cidade: string
    rua: string
    numero: number
    bairro: string
  }
}

export type HomeComunidade = {
  voluntarios: number
  clinicas: number
  adotantes: number
}

import Image from 'next/image'

export default function Login() {
  return (
    <div className="relative min-h-screen w-full max-w-none bg-[#FFF9F7]">
      <div aria-label="icone">
        <Image width={100} height={100} src="/images/icone.svg" alt="Ícone CadasPatas" />
        <h1>CadasPatas</h1>
      </div>
      <div className="border-2 border-[#3A250B]/[30%] rounded">
        <h1>Login</h1>
        <div aria-label="email" className="flex">
          <Image src="/images/email.svg" width={16} height={16} alt="email" />
          <input placeholder="E-mail"></input>
        </div>
        <div aria-label="senha" className="flex flex-col">
          <div className="flex">
            <Image src="/images/senha.svg" width={16} height={16} alt="senha" />
            <input placeholder="Senha"></input>
          </div>
          <a>Esqueceu a Senha?</a>
        </div>
        <button> Entrar</button>
      </div>
      <div
        className="absolute inset-0 -z-10 bg-[url('/images/background-login.png')] bg-bottom bg-no-repeat bg-size-[100%_auto]"
        aria-hidden
      />
    </div>
  )
}

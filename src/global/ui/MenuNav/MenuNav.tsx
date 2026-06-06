import Link from 'next/link'

export const MenuNav = () => {
  return (
    <div className="fixed top-0 left-0 z-10 flex md:h-[100vh] w-[100vw] h-[10%] flex-col bg-[#D0DAC4] md:max-w-[20%] lg:max-w-[10%] md:w-[20%] lg:w-[10%] ">
      <aside className="flex md:justify-center h-full w-full md:pt-20 p-4">
        <nav className="flex flex-wrap md:flex-col flex-row items-center md:gap-4 gap-2">
          <img src="/images/logo.svg" alt="logo" width={60} height={60} />
          <Link href="/home">Inicio</Link>
          <Link href="/animais">Animais</Link>
          <Link href="/voluntarios">Voluntários</Link>
          <Link href="/veterinarios">Veterinários</Link>
          <Link href="/logout">Sair</Link>
        </nav>
      </aside>
      <div className="hidden md:flex mt-auto flex w-full">
        <img src="/images/navFooter.svg" alt="" width={200} height={100} className="max-w-full" />
      </div>
    </div>
  )
}

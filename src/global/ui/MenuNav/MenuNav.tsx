import Link from 'next/link'

export const MenuNav = () => {
  return (
    <div className="fixed top-0 left-0 z-10 flex h-dvh flex-col bg-[#D0DAC4] border border-red-400 md:max-w-[20%] lg:max-w-[10%] md:w-[20%] lg:w-[10%]">
      <aside className="border border-blue-400 h-full w-full">
        <nav className="flex flex-col items-center gap-4 ">
          <img src="/images/logo.svg" alt="logo" width={60} height={60} />
          <Link href="/home">Inicio</Link>
          <Link href="/animais">Animais</Link>
          <Link href="/voluntarios">Voluntários</Link>
          <Link href="/veterinarios">Veterinários</Link>
          <Link href="/logout">Sair</Link>
        </nav>
      </aside>
      <div className="mt-auto flex w-full">
        <img src="/images/navFooter.svg" alt="" width={200} height={100} className="max-w-full" />
      </div>
    </div>
  )
}

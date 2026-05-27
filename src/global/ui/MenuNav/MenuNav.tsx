import Link from 'next/link'

export const MenuNav = () => {
  return (
    <aside className="grid h-dvh grid-rows-[1fr_auto] bg-[#D0DAC4] p-4">
      <nav className="flex flex-col items-center gap-4 self-start p-2">
        <img src="/images/logo.svg" alt="logo" width={60} height={60} />
        <Link href="/home">Inicio</Link>
        <Link href="/animais">Animais</Link>
        <Link href="/voluntarios">Voluntários</Link>
        <Link href="/veterinarios">Veterinários</Link>
        <Link href="/logout">Sair</Link>
      </nav>
      <div className="flex w-full justify-center pb-2">
        <img src="/images/navFooter.svg" alt="" width={200} height={100} className="max-w-full" />
      </div>
    </aside>
  )
}

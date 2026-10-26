'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { SummaryTag } from '../SummaryTag/SummaryTag'

export const MenuNav = () => {
  const pathname = usePathname()
  const isActive = (path: string) =>
    pathname === path ? 'bg-[#FFF9F7] rounded-[4px] px-4 w-full items-center justify-center flex' : 'bg-none'
  const router = useRouter()
  const isComunidadeSection =
    pathname.startsWith('/comunidade') ||
    pathname.startsWith('/voluntarios') ||
    pathname.startsWith('/adotantes') ||
    pathname.startsWith('/clinicas')
  const isAnimaisSection = pathname === '/animais' || pathname.startsWith('/animais/')
  const isSaudeSection = pathname.startsWith('/saude') || pathname.startsWith('/fichamedica')
  const [isOpenComunidade, setIsOpenComunidade] = useState(isComunidadeSection)
  const saudeItemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isComunidadeSection) {
      setIsOpenComunidade(true)
    }
  }, [isComunidadeSection])

  useEffect(() => {
    if (isSaudeSection) {
      saudeItemRef.current?.scrollIntoView({ inline: 'nearest', block: 'nearest' })
    }
  }, [isSaudeSection])
  return (
    <div className="fixed top-0 left-0 z-10 flex md:h-[100vh] w-[100vw] h-[10%] flex-col bg-[#D0DAC4] md:max-w-[20%] lg:max-w-[10%] md:w-[20%] lg:w-[10%] ">
      <aside className="flex h-full w-full min-w-0 p-4 md:justify-center md:pt-20">
        <nav className="flex h-full min-w-0 flex-row flex-nowrap items-center gap-2 overflow-x-auto md:h-auto md:flex-col md:gap-4 md:overflow-visible">
          <img src="/images/logo.svg" alt="logo" width={60} height={60} />
          <div className={isActive('/home')}>
            <Link href="/home">Inicio</Link>
          </div>
          <div
            className={`flex flex-row items-center gap-2 ${
              isAnimaisSection ? 'flex w-full items-center justify-center rounded-[4px] bg-[#FFF9F7] px-4' : 'bg-none'
            }`}
          >
            <Link href="/animais">Animais</Link>
            <img
              src="/images/icons/add-button.svg"
              alt="add"
              width={12}
              height={12}
              onClick={() => router.push('/animais/new')}
              className="cursor-pointer invert mt-1"
            />
          </div>
          <div className={`flex flex-col gap-2  transition-all duration-300 cursor-pointer`}>
            <SummaryTag
              title={
                <Link href="/comunidade" onClick={(event) => event?.stopPropagation()}>
                  Comunidade
                </Link>
              }
              description={
                <div>
                  <div
                    className={`flex flex-row items-center gap-2 ${pathname.startsWith('/voluntarios') ? 'bg-[#FFF9F7] rounded-[4px] px-4 w-full items-center justify-center flex' : 'bg-none'} `}
                  >
                    <Link href="/voluntarios">Voluntários</Link>
                    <img
                      src="/images/icons/add-button.svg"
                      alt="add"
                      width={12}
                      height={12}
                      onClick={() => router.push('/voluntarios/new')}
                      className="cursor-pointer invert mt-1"
                    />
                  </div>
                  <div
                    className={`flex flex-row items-center gap-2 ${pathname.startsWith('/adotantes') ? 'bg-[#FFF9F7] rounded-[4px] px-4 w-full items-center justify-center flex' : 'bg-none'} `}
                  >
                    <Link href="/adotantes">Adotantes</Link>
                    <img
                      src="/images/icons/add-button.svg"
                      alt="add"
                      width={12}
                      height={12}
                      onClick={() => router.push('/adotantes/new')}
                      className="cursor-pointer invert mt-1"
                    />
                  </div>
                  <div className={`flex flex-row items-center gap-2 ${isActive('/clinicas')} `}>
                    <Link href="/clinicas">Clínicas</Link>
                    <img
                      src="/images/icons/add-button.svg"
                      alt="add"
                      width={12}
                      height={12}
                      onClick={() => router.push('/clinicas/new')}
                      className="cursor-pointer invert mt-1"
                    />
                  </div>
                </div>
              }
              expanded={isOpenComunidade}
              onExpandedChange={setIsOpenComunidade}
            />
          </div>

          <div
            ref={saudeItemRef}
            className={
              isSaudeSection
                ? 'flex items-center justify-center rounded-[4px] bg-[#FFF9F7] px-4 text-center md:w-full'
                : 'bg-none'
            }
          >
            <Link href="/saude" className="whitespace-nowrap">
              Saúde animal
            </Link>
          </div>

          <div className={isActive('/logout')}>
            <Link href="/logout">Sair</Link>
          </div>
        </nav>
      </aside>
      <div className="hidden md:flex mt-auto flex w-full">
        <img src="/images/navFooter.svg" alt="" width={200} height={100} className="max-w-full" />
      </div>
    </div>
  )
}

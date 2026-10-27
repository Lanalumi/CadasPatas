import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/global/providers/QueryProvider'
import { ToastProvider } from '@/global/providers/ToastProvider'
import { MenuNav } from '@/global/ui/MenuNav/MenuNav'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-family-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AbrigaPet',
  description: 'Plataforma para ONGs de resgate de animais',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={poppins.variable}>
      <body className="bg-[#FFF9F7] font-poppins min-h-screen text-[#3A250B]">
        <QueryProvider>
          <ToastProvider>
            {/* Contêiner da Barra Lateral */}
            <header className="w-full md:w-56 lg:w-60 shrink-0">
              <MenuNav />
            </header>

            {/* Conteúdo Principal Ajustado para não Cortar na Sidebar */}
            <main className="min-h-screen transition-all pt-20 md:pt-0 md:ml-56 lg:ml-60 p-4 sm:p-6 lg:p-8">
              {children}
            </main>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
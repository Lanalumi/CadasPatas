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
  title: 'CadasPatas',
  description: 'Plataforma para ONGs de resgate de animais',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={poppins.variable}>
      <body className="bg-[#FFF9F7]">
        <QueryProvider>
          <ToastProvider>
            <header className="flex md:w-[20%]">
              <MenuNav />
            </header>
            <main className="md:ml-[180px] mt-[20%] md:mt-0 ml-[5%] ">{children}</main>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  )
}

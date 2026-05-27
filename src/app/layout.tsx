import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
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
      <body>
        <header className="flex w-[20%] border border-green-400">
          <MenuNav />
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}

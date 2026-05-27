# Revert snapshot — sidebar layout (before CSS variable refactor)

Created: 2026-05-27

Use this to restore the previous state if needed.

---

## `src/app/globals.css`

```css
@import 'tailwindcss';

@theme {
  --font-poppins: var(--font-family-poppins), sans-serif;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  min-height: 100%;
}

body {
  line-height: 1.5;
  margin-left: 180px;
  margin-top: 200px;
}

@media (min-width: 1024px) {
  body {
    margin-left: 200px;
    margin-top: 120px;
  }
}

h1 {
  margin-bottom: 0.5rem;
}
```

---

## `src/app/layout.tsx`

```tsx
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
```

---

## `src/global/ui/MenuNav/MenuNav.tsx`

```tsx
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
```

---

## `src/app/animais/new/page.tsx` (unchanged in this refactor, for reference)

**Note:** This file was also updated during implementation (removed `calc`, debug borders). Revert to:

```tsx
    <div className="flex flex-col border border-orange-500 max-w-[calc(100%-6%)] p-4">
      <header className="flex w-full max-w-full flex-col bg-[#FFF9F7] border border-blue-400">
```

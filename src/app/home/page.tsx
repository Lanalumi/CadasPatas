'use client'
import { Button } from '@/global/ui/Button/Button'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  return (
    <>
      <div>Home</div>
      <Button green onClick={() => router.push('/animais/new')} icon="/images/icons/add-button.svg">
        Cadastrar Animal
      </Button>
    </>
  )
}

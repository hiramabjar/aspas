'use client'

import { useSession, signOut } from 'next-auth/react'
import { Bell, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-[var(--primary-dark)] border-b border-[var(--border)] shadow-lg">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative w-32 h-12">
            <Image
              src="/images/12-removebg-preview.png"
              alt="Logo"
              fill
              className="object-contain filter brightness-[1.2] drop-shadow-[0_0_10px_rgba(229,213,242,0.3)]"
              priority
              quality={100}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-[var(--text-secondary)] hover:bg-[var(--background)]"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600" />
          </Button>

          <div className="flex items-center gap-2 border-l border-[var(--border)] pl-4">
            <div className="text-right">
              <p className="text-sm font-medium text-[var(--text)]">
                {session?.user?.name}
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                {session?.user?.role === 'admin' ? 'Administrador' : 'Aluno'}
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut()}
              className="text-[var(--text-secondary)] hover:bg-[var(--background)]"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
} 
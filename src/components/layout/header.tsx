'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { LogOut, Settings, User } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = () => {
    router.push('/change-password')
  }

  if (!user) {
    return (
      <header className="min-h-16 shrink-0 border-b border-border bg-card px-6 flex items-center">
        <h1 className="text-2xl font-semibold text-card-foreground">{title}</h1>
      </header>
    )
  }

  return (
    <header className="min-h-16 shrink-0 border-b border-border bg-card px-6 flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-card-foreground">{title}</h1>
      
      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
              <Avatar className="h-8 w-8">
                <div className="h-8 w-8 rounded-full bg-sky-500 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-medium">{user.email}</p>
              </div>
            </Button>
          </PopoverTrigger>
          
          <PopoverContent className="w-56" align="end">
            <div className="space-y-2">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user.email}</p>
                <p className="text-xs text-muted-foreground">Usuário autenticado</p>
              </div>
              
              <div className="border-t pt-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={handleChangePassword}
                >
                  <Settings className="h-4 w-4" />
                  Alterar Senha
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleSignOut}
                  disabled={isLoading}
                >
                  <LogOut className="h-4 w-4" />
                  {isLoading ? 'Saindo...' : 'Sair'}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  )
}
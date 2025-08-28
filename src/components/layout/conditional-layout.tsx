'use client'

import { useAuth } from '@/contexts/auth-context'
import { Sidebar } from '@/components/layout/sidebar'
import { RefreshButton } from '@/components/layout/refresh-button'
import { InstallPrompt } from '@/components/pwa/install-prompt'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  
  // Páginas que não precisam do layout autenticado
  const publicPages = ['/login', '/auth/callback']
  const isPublicPage = publicPages.some(page => pathname.startsWith(page))
  
  // Proteção no lado cliente - redirecionar se não autenticado
  useEffect(() => {
    console.log('🔍 ConditionalLayout - User:', !!user, 'Loading:', loading, 'Path:', pathname, 'IsPublic:', isPublicPage)
    
    if (!loading && !user && !isPublicPage) {
      console.log('🚫 Redirecionando para login - sem usuário autenticado')
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [user, loading, pathname, isPublicPage, router])
  
  // Se está carregando, mostrar loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
          <p className="text-sm text-muted-foreground">Verificando autenticação...</p>
        </div>
        <InstallPrompt />
      </div>
    )
  }
  
  // Se é página pública, mostrar apenas o conteúdo
  if (isPublicPage) {
    return (
      <>
        {children}
        <InstallPrompt />
      </>
    )
  }
  
  // Se não há usuário em página privada, mostrar loading (redirecionamento em andamento)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
          <p className="text-sm text-muted-foreground">Redirecionando para login...</p>
        </div>
        <InstallPrompt />
      </div>
    )
  }
  
  // Layout completo para usuários autenticados
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-background lg:ml-0">
        <div className="lg:hidden h-16 flex items-center px-16 border-b border-border bg-card">
          {/* Espaço para o botão mobile */}
        </div>
        {children}
      </main>
      <RefreshButton />
      <InstallPrompt />
    </div>
  )
}

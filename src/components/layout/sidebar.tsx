'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, MessageCircle, AlertTriangle, Bot, FileSearch } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeSwitch } from '@/components/ui/theme-switch'
import Image from 'next/image'
import { useTheme } from '@/hooks/useTheme'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Chat', href: '/chat', icon: MessageCircle },
  { name: 'Ocorrências', href: '/ocorrencias', icon: AlertTriangle },
  { name: 'Análise', href: '/analise', icon: FileSearch },
  { name: 'Agente', href: '/agente', icon: Bot },
]

export function Sidebar() {
  const pathname = usePathname()
  const { theme } = useTheme()

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <Image
          src="/bluebird_logo.svg"
          alt="Blue Bird Logo"
          width={160}
          height={32}
          className="h-8 w-auto max-w-[160px]"
          style={{
            filter: theme === 'dark' 
              ? 'brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(103%) contrast(103%)'
              : 'none'
          }}
        />
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive
                    ? 'text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground group-hover:text-sidebar-accent-foreground'
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>
      
      {/* Theme Switch no canto inferior */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center justify-start">
          <ThemeSwitch />
        </div>
      </div>
    </div>
  )
}
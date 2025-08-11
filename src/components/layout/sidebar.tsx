'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, MessageCircle, AlertTriangle, Bot } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Chat', href: '/chat', icon: MessageCircle },
  { name: 'Ocorrências', href: '/ocorrencias', icon: AlertTriangle },
  { name: 'Agente', href: '/agente', icon: Bot },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <h1 className="text-xl font-bold text-black">
          WhatsApp Monitor
        </h1>
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
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-black'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive
                    ? 'text-white'
                    : 'text-gray-700 group-hover:text-black'
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
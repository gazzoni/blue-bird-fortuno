'use client'

import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { Card, CardContent } from '@/components/ui/card'
import { WifiOff, Wifi } from 'lucide-react'
import { useState, useEffect } from 'react'

export function OfflineIndicator() {
  const isOnline = useOnlineStatus()
  const [showOnlineMessage, setShowOnlineMessage] = useState(false)

  useEffect(() => {
    if (isOnline && !showOnlineMessage) {
      // Mostra mensagem "online" por 3 segundos quando volta a conexão
      setShowOnlineMessage(true)
      const timer = setTimeout(() => {
        setShowOnlineMessage(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOnline, showOnlineMessage])

  if (isOnline && !showOnlineMessage) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 lg:top-6 lg:right-6">
      <Card className={`shadow-lg transition-all duration-300 ${
        isOnline 
          ? 'border-green-200 bg-green-50' 
          : 'border-orange-200 bg-orange-50'
      }`}>
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="w-4 h-4 text-green-600" />
            ) : (
              <WifiOff className="w-4 h-4 text-orange-600" />
            )}
            <span className={`text-sm font-medium ${
              isOnline ? 'text-green-700' : 'text-orange-700'
            }`}>
              {isOnline ? 'Conectado' : 'Modo Offline'}
            </span>
          </div>
          {!isOnline && (
            <p className="text-xs text-orange-600 mt-1">
              Algumas funcionalidades podem estar limitadas
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useRefreshData } from '@/hooks/useRefreshData'

export function RefreshButton() {
  const { refreshAll, isRefreshing } = useRefreshData();

  return (
    <Button
      size="icon"
      onClick={refreshAll}
      disabled={isRefreshing}
      className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg bg-black hover:bg-gray-800 text-white z-50 border-2 border-gray-200"
    >
      <RefreshCw
        className={cn(
          'h-5 w-5',
          isRefreshing && 'animate-spin'
        )}
      />
    </Button>
  )
}
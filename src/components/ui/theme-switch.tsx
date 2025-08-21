'use client'

import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'

export function ThemeSwitch() {
  const { toggleTheme, isDark } = useTheme()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="h-9 w-9 p-0 hover:bg-sidebar-accent transition-colors rounded-md"
      title={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-sidebar-foreground transition-transform hover:rotate-12" />
      ) : (
        <Moon className="h-4 w-4 text-sidebar-foreground transition-transform hover:-rotate-12" />
      )}
    </Button>
  )
}

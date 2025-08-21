'use client'

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="min-h-16 shrink-0 border-b border-border bg-card px-6 flex items-center">
      <h1 className="text-2xl font-semibold text-card-foreground">{title}</h1>
    </header>
  )
}
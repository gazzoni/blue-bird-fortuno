'use client'

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="min-h-16 shrink-0 border-b border-gray-200 bg-white px-6 flex items-center">
      <h1 className="text-2xl font-semibold text-black">{title}</h1>
    </header>
  )
}
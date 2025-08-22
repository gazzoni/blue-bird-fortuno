'use client'

import React, { useState, useCallback } from 'react'

export function useTableResize() {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
    id: 80,
    created_at: 140,
    occurrence_name: 350, // Dobrado de 150px para 300px
    description: 450, // Dobrado de 300px para 600px
    client_name: 200,
    status: 130, // Aumentado 5% (100px + 5px)
    category: 130,
    squad: 130,
    chat_name: 300, // Dobrado de 150px para 300px
    resolution: 300, // Maior para resolução
    keywords: 500, // Triplicado de 160px para 480px
    actions: 100,
  })

  const [isResizing, setIsResizing] = useState<string | null>(null)
  const [startX, setStartX] = useState(0)
  const [startWidth, setStartWidth] = useState(0)

  const handleMouseDown = useCallback((e: React.MouseEvent, columnId: string) => {
    setIsResizing(columnId)
    setStartX(e.clientX)
    setStartWidth(columnWidths[columnId] || 150)
    e.preventDefault()
    e.stopPropagation()
  }, [columnWidths])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return

    const deltaX = e.clientX - startX
    const newWidth = Math.max(80, startWidth + deltaX) // Largura mínima de 80px
    
    setColumnWidths(prev => ({
      ...prev,
      [isResizing]: newWidth
    }))
  }, [isResizing, startX, startWidth])

  const handleMouseUp = useCallback(() => {
    setIsResizing(null)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [])

  // Effect para adicionar/remover event listeners
  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  return {
    columnWidths,
    handleMouseDown,
    isResizing
  }
}

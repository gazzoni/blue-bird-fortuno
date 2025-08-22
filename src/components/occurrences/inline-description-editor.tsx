'use client'

import { useState, useRef, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2, Check, X, Edit3 } from 'lucide-react'

interface InlineDescriptionEditorProps {
  currentDescription: string
  occurrenceId: number
  onDescriptionUpdate: (occurrenceId: number, newDescription: string) => Promise<void>
  disabled?: boolean
  maxLength?: number
}

export function InlineDescriptionEditor({ 
  currentDescription, 
  occurrenceId, 
  onDescriptionUpdate, 
  disabled = false,
  maxLength = 500
}: InlineDescriptionEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [tempDescription, setTempDescription] = useState(currentDescription)
  const [isExpanded, setIsExpanded] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setTempDescription(currentDescription)
  }, [currentDescription])

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      // Posicionar cursor no final
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      )
    }
  }, [isEditing])

  const handleClick = () => {
    if (disabled || isUpdating) return
    
    if (!isExpanded && !isEditing) {
      // Primeiro clique: expandir texto
      setIsExpanded(true)
    } else if (isExpanded && !isEditing) {
      // Segundo clique: entrar em modo de edição
      setIsEditing(true)
      setTempDescription(currentDescription)
    }
  }

  const handleSave = async () => {
    if (tempDescription.trim() === currentDescription.trim()) {
      handleCancel()
      return
    }

    setIsUpdating(true)
    try {
      await onDescriptionUpdate(occurrenceId, tempDescription.trim())
      setIsEditing(false)
      setIsExpanded(false)
    } catch (error) {
      console.error('Erro ao atualizar descrição:', error)
      setTempDescription(currentDescription) // Reverter
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setIsExpanded(false)
    setTempDescription(currentDescription)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel()
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSave()
    }
  }

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  // Renderizar loading state
  if (isUpdating) {
    return (
      <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded">
        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
        <span className="text-sm text-blue-700">Atualizando...</span>
      </div>
    )
  }

  // Renderizar modo de edição
  if (isEditing) {
    return (
      <div className="space-y-2 p-2 bg-blue-50 border border-blue-200 rounded max-w-full">
        <Textarea
          ref={textareaRef}
          value={tempDescription}
          onChange={(e) => setTempDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[80px] resize-none text-sm w-full"
          maxLength={maxLength}
          placeholder="Digite a descrição da ocorrência..."
        />
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs text-gray-500 flex-1 min-w-0">
            <div>{tempDescription.length}/{maxLength} caracteres</div>
            <div className="text-gray-400 hidden sm:block">
              Ctrl+Enter para salvar, Esc para cancelar
            </div>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleCancel}
              className="h-7 px-2"
            >
              <X className="w-3 h-3" />
            </Button>
            <Button 
              size="sm" 
              onClick={handleSave}
              disabled={tempDescription.trim() === currentDescription.trim()}
              className="h-7 px-2"
            >
              <Check className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Renderizar modo expandido (apenas visualização)
  if (isExpanded) {
    return (
      <div 
        onClick={handleClick}
        className="cursor-pointer p-2 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition-colors group max-w-full"
      >
        <div className="flex items-start justify-between gap-2 max-w-full overflow-hidden">
          <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed flex-1 min-w-0 break-words">
            {currentDescription}
          </p>
          <Edit3 className="w-3 h-3 text-gray-400 group-hover:text-gray-600 mt-0.5 flex-shrink-0" />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Clique para editar
        </div>
      </div>
    )
  }

  // Renderizar modo normal (truncado)
  return (
    <div 
      onClick={handleClick}
      className="cursor-pointer hover:bg-gray-50 transition-colors rounded p-1 group max-w-full"
      title={currentDescription}
    >
      <div className="flex items-center gap-1 max-w-full overflow-hidden">
        <span className="text-sm text-gray-900 truncate flex-1 min-w-0">
          {truncateText(currentDescription)}
        </span>
        {currentDescription.length > 50 && (
          <span className="text-xs text-blue-600 group-hover:text-blue-800 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            ver mais
          </span>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Edit3, Check, X, Loader2 } from 'lucide-react'

interface ModalDescriptionEditorProps {
  currentDescription: string
  occurrenceId: number
  onDescriptionUpdate: (occurrenceId: number, newDescription: string) => Promise<void>
  disabled?: boolean
  maxLength?: number
  placeholder?: string
}

export function ModalDescriptionEditor({ 
  currentDescription, 
  occurrenceId, 
  onDescriptionUpdate, 
  disabled = false,
  maxLength = 1000,
  placeholder = "Digite a descrição..."
}: ModalDescriptionEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [tempDescription, setTempDescription] = useState(currentDescription)
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

  const handleEdit = () => {
    if (disabled || isUpdating) return
    setIsEditing(true)
    setTempDescription(currentDescription)
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
    } catch (error) {
      console.error('Erro ao atualizar descrição:', error)
      setTempDescription(currentDescription) // Reverter
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setTempDescription(currentDescription)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel()
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSave()
    }
  }

  // Renderizar loading state
  if (isUpdating) {
    return (
      <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded">
        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
        <span className="text-sm text-blue-700">Atualizando descrição...</span>
      </div>
    )
  }

  // Renderizar modo de edição
  if (isEditing) {
    return (
      <div className="space-y-3">
        <Textarea
          ref={textareaRef}
          value={tempDescription}
          onChange={(e) => setTempDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[120px] resize-none text-sm"
          maxLength={maxLength}
          placeholder={placeholder}
        />
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {tempDescription.length}/{maxLength} caracteres
            <span className="ml-3 text-gray-400">
              Ctrl+Enter para salvar, Esc para cancelar
            </span>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleCancel}
              className="h-8 px-3"
            >
              <X className="w-3 h-3 mr-1" />
              Cancelar
            </Button>
            <Button 
              size="sm" 
              onClick={handleSave}
              disabled={tempDescription.trim() === currentDescription.trim()}
              className="h-8 px-3"
            >
              <Check className="w-3 h-3 mr-1" />
              Salvar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Renderizar modo visualização
  return (
    <div className="relative group">
      {currentDescription ? (
        <p className="text-sm leading-relaxed whitespace-pre-wrap pr-10">
          {currentDescription}
        </p>
      ) : (
        <p className="text-sm text-gray-500 italic pr-10">
          Clique para adicionar uma resolução...
        </p>
      )}
      <Button
        size="sm"
        variant="ghost"
        onClick={handleEdit}
        disabled={disabled}
        className="absolute top-0 right-0 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Edit3 className="w-3 h-3" />
      </Button>
    </div>
  )
}

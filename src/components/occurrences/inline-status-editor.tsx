'use client'

import { useState, useRef, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Clock, CheckCircle, Loader2 } from 'lucide-react'

interface InlineStatusEditorProps {
  currentStatus: string
  occurrenceId: number
  onStatusUpdate: (occurrenceId: number, newStatus: string) => Promise<void>
  disabled?: boolean
}

const getStatusBadge = (status: string, isEditing: boolean = false) => {
  const baseClasses = isEditing 
    ? "cursor-pointer hover:bg-opacity-80 transition-colors" 
    : "cursor-pointer hover:bg-opacity-80 transition-colors"
  
  switch (status) {
    case 'aberto':
      return (
        <Badge variant="outline" className={`bg-yellow-50 text-yellow-700 border-yellow-200 ${baseClasses}`}>
          <Clock className="w-3 h-3 mr-1" />
          Aberto
        </Badge>
      )
    case 'resolvido':
      return (
        <Badge variant="outline" className={`bg-green-50 text-green-700 border-green-200 ${baseClasses}`}>
          <CheckCircle className="w-3 h-3 mr-1" />
          Resolvido
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className={baseClasses}>
          {status}
        </Badge>
      )
  }
}

const getStatusOptions = () => {
  const options = [
    { value: 'aberto', label: 'Aberto', icon: Clock },
    { value: 'resolvido', label: 'Resolvido', icon: CheckCircle }
  ]
  return options
}

export function InlineStatusEditor({ 
  currentStatus, 
  occurrenceId, 
  onStatusUpdate, 
  disabled = false 
}: InlineStatusEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [tempStatus, setTempStatus] = useState(currentStatus)
  const selectRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setTempStatus(currentStatus)
  }, [currentStatus])

  const handleClick = () => {
    if (disabled || isUpdating) return
    setIsEditing(true)
    setTempStatus(currentStatus)
  }

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) {
      setIsEditing(false)
      return
    }

    setIsUpdating(true)
    try {
      await onStatusUpdate(occurrenceId, newStatus)
      setIsEditing(false)
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      setTempStatus(currentStatus) // Reverter para o status anterior
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setTempStatus(currentStatus)
  }

  // Renderizar loading state
  if (isUpdating) {
    return (
      <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
        Atualizando...
      </Badge>
    )
  }

  // Renderizar modo de edição
  if (isEditing) {
    return (
      <div className="relative">
        <Select
          value={tempStatus}
          onValueChange={handleStatusChange}
          onOpenChange={(open) => {
            if (!open) {
              // Pequeno delay para permitir seleção
              setTimeout(() => {
                setIsEditing(false)
              }, 100)
            }
          }}
          defaultOpen={true}
        >
          <SelectTrigger 
            ref={selectRef}
            className="h-6 w-auto min-w-[100px] text-xs border-blue-200 bg-blue-50"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent 
            align="start" 
            className="min-w-[120px]"
            onCloseAutoFocus={(e) => {
              e.preventDefault()
              handleCancel()
            }}
          >
            {getStatusOptions().map((option) => {
              const Icon = option.icon
              return (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-3 h-3" />
                    {option.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>
    )
  }

  // Renderizar modo normal (clicável)
  return (
    <div onClick={handleClick} className="inline-block">
      {getStatusBadge(currentStatus, true)}
    </div>
  )
}

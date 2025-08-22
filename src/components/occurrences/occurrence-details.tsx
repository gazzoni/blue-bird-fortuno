"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WhatsAppChat } from "@/components/ui/whatsapp-chat"
import { InlineStatusEditor } from "@/components/occurrences/inline-status-editor"
import { ModalDescriptionEditor } from "@/components/occurrences/modal-description-editor"
import { Clock, CheckCircle, User, MessageSquare, Hash, Calendar, Building, Users, Heart } from "lucide-react"
import type { Occurrence } from "@/hooks/useOccurrenceFilters"

interface Message {
  created_at: string
  sender_name: string
  sender_id: string
  message_content: string
}

interface OccurrenceDetailsProps {
  occurrence: Occurrence
  onFeedbackClick?: () => void
  onStatusUpdate?: (occurrenceId: number, newStatus: string) => Promise<void>
  onDescriptionUpdate?: (occurrenceId: number, newDescription: string) => Promise<void>
  onResolutionUpdate?: (occurrenceId: number, newResolution: string) => Promise<void>
}

function formatDateTime(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'aberto':
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          Aberto
        </Badge>
      )
    case 'resolvido':
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Resolvido
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export function OccurrenceDetails({ occurrence, onFeedbackClick, onStatusUpdate, onDescriptionUpdate, onResolutionUpdate }: OccurrenceDetailsProps) {
  // Parse messages from jsonb
  const messages: Message[] = Array.isArray(occurrence.messages) 
    ? occurrence.messages as Message[]
    : typeof occurrence.messages === 'object' && occurrence.messages !== null
    ? Object.values(occurrence.messages) as Message[]
    : []

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Ocorrência #{occurrence.id}</h2>
            {occurrence.occurrenceName && (
              <p className="text-sm text-gray-600 mt-1">{occurrence.occurrenceName}</p>
            )}
          </div>
          {onStatusUpdate ? (
            <InlineStatusEditor
              currentStatus={occurrence.status}
              occurrenceId={occurrence.id}
              onStatusUpdate={onStatusUpdate}
            />
          ) : (
            getStatusBadge(occurrence.status)
          )}
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          {formatDateTime(occurrence.createdAt)}
        </div>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            <User className="w-4 h-4 mr-2" />
            Informações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Chat</label>
              <p className="text-sm font-medium mt-1">{occurrence.chatName}</p>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Cliente</label>
              <p className="text-sm font-medium mt-1">{occurrence.clientName}</p>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Canal</label>
              <p className="text-sm mt-1">{occurrence.channel}</p>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Gate Keeper</label>
              <p className="text-sm mt-1">{occurrence.gateKepper ? 'Sim' : 'Não'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Squad</label>
              <div className="mt-1">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Users className="w-3 h-3 mr-1" />
                  {occurrence.squad}
                </Badge>
              </div>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Categoria</label>
              <div className="mt-1">
                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                  <Building className="w-3 h-3 mr-1" />
                  {occurrence.category}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            <MessageSquare className="w-4 h-4 mr-2" />
            Descrição
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {onDescriptionUpdate ? (
            <ModalDescriptionEditor
              currentDescription={occurrence.description}
              occurrenceId={occurrence.id}
              onDescriptionUpdate={onDescriptionUpdate}
              maxLength={1000}
            />
          ) : (
            <p className="text-sm leading-relaxed">{occurrence.description}</p>
          )}
        </CardContent>
      </Card>

      {/* Keywords */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            <Hash className="w-4 h-4 mr-2" />
            Palavras-chave
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            {occurrence.keywords.split(', ').map((keyword, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {keyword}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resolution */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            Resolução
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {onResolutionUpdate ? (
            <ModalDescriptionEditor
              currentDescription={occurrence.occurrenceResolution || ''}
              occurrenceId={occurrence.id}
              onDescriptionUpdate={onResolutionUpdate}
              maxLength={500}
              placeholder="Digite a resolução da ocorrência..."
            />
          ) : (
            <p className="text-sm leading-relaxed text-gray-500">
              {occurrence.occurrenceResolution || 'Nenhuma resolução registrada ainda.'}
            </p>
          )}
        </CardContent>
      </Card>

      {/* WhatsApp Messages */}
      {messages.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <MessageSquare className="w-4 h-4 mr-2 text-green-600" />
              Mensagens do WhatsApp
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 min-h-[390px]">
            <WhatsAppChat messages={messages} />
          </CardContent>
        </Card>
      )}

      {/* Feedback Button */}
      {onFeedbackClick && (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-center">
            <Button
              onClick={onFeedbackClick}
              className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Heart className="w-4 h-4" />
              Avaliar esta Ocorrência
            </Button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            Seu feedback nos ajuda a melhorar o sistema
          </p>
        </div>
      )}
    </div>
  )
}

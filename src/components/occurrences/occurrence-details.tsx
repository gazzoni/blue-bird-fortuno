"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WhatsAppChat } from "@/components/ui/whatsapp-chat"
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

export function OccurrenceDetails({ occurrence, onFeedbackClick }: OccurrenceDetailsProps) {
  // Parse messages from jsonb
  const messages: Message[] = Array.isArray(occurrence.messages) 
    ? occurrence.messages as Message[]
    : typeof occurrence.messages === 'object' && occurrence.messages !== null
    ? Object.values(occurrence.messages) as Message[]
    : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Ocorrência #{occurrence.id}</h2>
          {getStatusBadge(occurrence.status)}
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          {formatDateTime(occurrence.createdAt)}
        </div>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <User className="w-5 h-5 mr-2" />
            Informações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Chat</label>
              <p className="text-sm font-medium">{occurrence.chatName}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Cliente</label>
              <p className="text-sm font-medium">{occurrence.clientName}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Canal</label>
              <p className="text-sm">{occurrence.channel}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Squad</label>
                <div className="mt-1">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Users className="w-3 h-3 mr-1" />
                    {occurrence.squad}
                  </Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Categoria</label>
                <div className="mt-1">
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                    <Building className="w-3 h-3 mr-1" />
                    {occurrence.category}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Descrição
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{occurrence.description}</p>
        </CardContent>
      </Card>

      {/* Keywords */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Hash className="w-5 h-5 mr-2" />
            Palavras-chave
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {occurrence.keywords.split(', ').map((keyword, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {keyword}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp Messages */}
      {messages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
              Mensagens do WhatsApp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WhatsAppChat messages={messages} />
          </CardContent>
        </Card>
      )}

      {/* Feedback Button */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex justify-center">
          <Button
            onClick={onFeedbackClick}
            className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <Heart className="w-4 h-4" />
            Avaliar esta Ocorrência
          </Button>
        </div>
        <p className="text-xs text-gray-500 text-center mt-2">
          Seu feedback nos ajuda a melhorar o sistema
        </p>
      </div>
    </div>
  )
}

"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Message {
  created_at: string
  sender_name: string
  sender_id: string
  message_content: string
}

interface WhatsAppChatProps {
  messages: Message[]
  className?: string
}

function formatTime(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function WhatsAppChat({ messages, className }: WhatsAppChatProps) {
  if (!messages || messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500">
        Nenhuma mensagem encontrada
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col space-y-3 p-4 bg-gray-50 rounded-lg max-h-[416px] overflow-y-auto", className)}>
      {messages.map((message, index) => (
        <div key={index} className="flex items-start space-x-3">
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarFallback className="text-xs bg-green-100 text-green-700">
              {getInitials(message.sender_name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-lg p-3 shadow-sm border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900">
                  {message.sender_name}
                </span>
                <span className="text-xs text-gray-500">
                  {formatTime(message.created_at)}
                </span>
              </div>
              
              <p className="text-sm text-gray-700 leading-relaxed">
                {message.message_content}
              </p>
              
              <div className="text-xs text-gray-400 mt-2">
                ID: {message.sender_id}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

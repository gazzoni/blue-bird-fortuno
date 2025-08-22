/**
 * Utilitários para integração com n8n
 */

const N8N_WEBHOOK_URL = 'https://n8n.rudimentar.com/webhook/cc8d6bdc-5888-4bd2-be50-61e86538a935'
const N8N_FEEDBACK_WEBHOOK_URL = 'https://n8n.rudimentar.com/webhook/57377a45-2ac9-4dfd-8f74-3cb38563c8b7'

export interface N8nTranscriptPayload {
  timestamp: string
  name: string
  type: 'TRANSCRIPT'
  transcript: string
}

export interface N8nFilePayload {
  timestamp: string
  name: string
  type: 'MEDIA'
  file: File
}

export interface N8nResponse {
  id: number
  status: 'running' | 'completed' | 'error'
  message: string
}

export interface N8nFeedbackPayload {
  occurrence_id: number
  feedback_type: 'positive' | 'negative'
  feedback_content: string
}

export interface N8nFeedbackResponse {
  success: boolean
  message: string
}

/**
 * Gera timestamp no timezone América/São_Paulo
 */
export function getSaoPauloTimestamp(): string {
  const now = new Date()
  
  // Converter para timezone de São Paulo
  const saoPauloDate = new Date(now.toLocaleString("en-US", {timeZone: "America/Sao_Paulo"}))
  
  // Formato ISO 8601 para São Paulo
  const year = saoPauloDate.getFullYear()
  const month = String(saoPauloDate.getMonth() + 1).padStart(2, '0')
  const day = String(saoPauloDate.getDate()).padStart(2, '0')
  const hours = String(saoPauloDate.getHours()).padStart(2, '0')
  const minutes = String(saoPauloDate.getMinutes()).padStart(2, '0')
  const seconds = String(saoPauloDate.getSeconds()).padStart(2, '0')
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}-03:00`
}

/**
 * Envia transcript para o webhook do n8n
 */
export async function sendTranscriptToN8n(payload: Omit<N8nTranscriptPayload, 'timestamp'>): Promise<N8nResponse> {
  const data: N8nTranscriptPayload = {
    ...payload,
    timestamp: getSaoPauloTimestamp()
  }

  const response = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error(`Erro ao enviar para n8n: ${response.status} ${response.statusText}`)
  }

  return await response.json() as N8nResponse
}

/**
 * Envia arquivo para o webhook do n8n
 */
export async function sendFileToN8n(payload: Omit<N8nFilePayload, 'timestamp'>): Promise<N8nResponse> {
  const formData = new FormData()
  
  formData.append('timestamp', getSaoPauloTimestamp())
  formData.append('name', payload.name)
  formData.append('type', payload.type)
  formData.append('file', payload.file)

  const response = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    throw new Error(`Erro ao enviar arquivo para n8n: ${response.status} ${response.statusText}`)
  }

  return await response.json() as N8nResponse
}

/**
 * Envia feedback de ocorrência para o n8n
 */
export async function sendFeedbackToN8n(payload: N8nFeedbackPayload): Promise<N8nFeedbackResponse> {
  const response = await fetch(N8N_FEEDBACK_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error(`Erro ao enviar feedback para n8n: ${response.status} ${response.statusText}`)
  }

  return await response.json() as N8nFeedbackResponse
}

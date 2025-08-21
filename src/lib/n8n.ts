/**
 * Utilitários para integração com n8n
 */

const N8N_WEBHOOK_URL = 'https://n8n.rudimentar.com/webhook/cc8d6bdc-5888-4bd2-be50-61e86538a935'

export interface N8nTranscriptPayload {
  timestamp: string
  name: string
  type: 'TRANSCRIPT'
  transcript: string
}

export interface N8nFilePayload {
  timestamp: string
  name: string
  type: 'FILE'
  file: File
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
export async function sendTranscriptToN8n(payload: Omit<N8nTranscriptPayload, 'timestamp'>): Promise<void> {
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
}

/**
 * Envia arquivo para o webhook do n8n
 */
export async function sendFileToN8n(payload: Omit<N8nFilePayload, 'timestamp'>): Promise<void> {
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
}

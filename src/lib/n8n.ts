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
  message?: string
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

  const responseData = await response.json()
  
  // Validar se a resposta tem o formato esperado
  if (!responseData || typeof responseData.id === 'undefined' || !responseData.status) {
    throw new Error('Resposta inválida do servidor n8n')
  }

  return responseData as N8nResponse
}

/**
 * Converte arquivo para base64
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // Remover o prefixo "data:tipo/subtipo;base64,"
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Envia arquivo para o webhook do n8n (versão alternativa com base64)
 */
export async function sendFileToN8nBase64(payload: Omit<N8nFilePayload, 'timestamp'>): Promise<N8nResponse> {
  const fileBase64 = await fileToBase64(payload.file)
  
  const data = {
    timestamp: getSaoPauloTimestamp(),
    name: payload.name,
    type: payload.type,
    file: {
      name: payload.file.name,
      size: payload.file.size,
      type: payload.file.type,
      content: fileBase64
    }
  }
  
  const response = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error(`Erro ao enviar arquivo (base64) para n8n: ${response.status} ${response.statusText}`)
  }

  const responseData = await response.json()
  
  if (!responseData || typeof responseData.id === 'undefined' || !responseData.status) {
    throw new Error('Resposta inválida do servidor n8n (base64)')
  }

  return responseData as N8nResponse
}

/**
 * Envia arquivo para o webhook do n8n
 */
export async function sendFileToN8n(payload: Omit<N8nFilePayload, 'timestamp'>): Promise<N8nResponse> {
  // Verificar se o arquivo é válido
  if (!payload.file || payload.file.size === 0) {
    throw new Error('Arquivo inválido ou vazio')
  }
  
  const formData = new FormData()
  
  // Criar metadata JSON com a mesma estrutura do transcript
  const metadata = {
    timestamp: getSaoPauloTimestamp(),
    name: payload.name,
    type: payload.type
  }
  
  // Adicionar o arquivo binário
  formData.append('file', payload.file, payload.file.name)
  
  // Adicionar metadados
  formData.append('timestamp', metadata.timestamp)
  formData.append('name', metadata.name)
  formData.append('type', metadata.type)
  formData.append('metadata', JSON.stringify(metadata))

  const response = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    throw new Error(`Erro ao enviar arquivo para n8n: ${response.status} ${response.statusText}`)
  }

  const responseData = await response.json()
  
  // Validar se a resposta tem o formato esperado
  if (!responseData || typeof responseData.id === 'undefined' || !responseData.status) {
    throw new Error('Resposta inválida do servidor n8n')
  }

  return responseData as N8nResponse
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

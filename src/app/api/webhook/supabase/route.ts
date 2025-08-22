import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('Webhook recebido do Supabase:', body)
    
    // Verificar se é um evento de INSERT na tabela documents
    if (body.type === 'INSERT' && body.table === 'documents') {
      const newDocument = body.record
      
      console.log('Novo documento inserido:', newDocument)
      
      // Aqui podemos implementar diferentes estratégias:
      // 1. Server-Sent Events para notificar clientes conectados
      // 2. WebSocket para real-time updates
      // 3. Ou simplesmente log para polling do frontend
      
      // Por agora, vamos apenas logar e retornar sucesso
      return NextResponse.json({ 
        success: true, 
        message: 'Document received',
        documentId: newDocument.id 
      })
    }
    
    // Outros tipos de eventos do Supabase
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook received but not processed' 
    })
    
  } catch (error) {
    console.error('Erro no webhook:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

// Permitir apenas POST
export async function GET() {
  return NextResponse.json({ 
    message: 'Webhook endpoint - apenas POST permitido' 
  }, { status: 405 })
}

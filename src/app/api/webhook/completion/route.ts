import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('Webhook de completion recebido:', body)
    
    const { id, status } = body
    
    if (!id || !status) {
      return NextResponse.json({ 
        success: false, 
        error: 'ID e status são obrigatórios' 
      }, { status: 400 })
    }
    
    // Verificar se é um status válido
    if (!['completed', 'error'].includes(status)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Status inválido' 
      }, { status: 400 })
    }
    
    console.log(`Documento ${id} mudou para status: ${status}`)
    
    // Aqui poderíamos implementar Server-Sent Events ou WebSockets
    // para notificar clientes conectados em tempo real
    // Por enquanto, apenas logamos e retornamos sucesso
    
    return NextResponse.json({ 
      success: true, 
      message: 'Completion webhook recebido com sucesso',
      documentId: id,
      status: status
    })
    
  } catch (error) {
    console.error('Erro no webhook de completion:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

// Permitir apenas POST
export async function GET() {
  return NextResponse.json({ 
    message: 'Webhook de completion - apenas POST permitido' 
  }, { status: 405 })
}

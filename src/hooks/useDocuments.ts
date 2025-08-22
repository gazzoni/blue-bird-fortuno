import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import type { Document } from '@/types/database'

// Criar cliente Supabase uma única vez fora do componente
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
)

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Função para buscar documentos (só chama quando necessário)
  const fetchDocuments = useCallback(async () => {
    try {
      setError(null)
      
      const { data, error: fetchError } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (fetchError) {
        throw fetchError
      }
      
      setDocuments(data || [])
    } catch (err) {
      console.error('❌ Erro ao buscar documentos:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar documentos')
    } finally {
      setLoading(false)
    }
  }, [])

  // Carregar documentos apenas uma vez no mount
  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments]) // Incluir fetchDocuments como dependência

  // Configurar Realtime apenas uma vez
  useEffect(() => {
    const channel = supabase
      .channel('documents_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'documents' },
        (payload) => {
          console.log('🔄 Realtime update:', payload.eventType)
          
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const newDoc = payload.new as Document
            setDocuments(prev => {
              // Evitar duplicatas
              const filtered = prev.filter(doc => doc.id !== newDoc.id)
              return [newDoc, ...filtered].sort((a, b) => 
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
              )
            })
          } else if (payload.eventType === 'DELETE') {
            setDocuments(prev => prev.filter(doc => doc.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, []) // Dependência vazia - configura só uma vez

  return {
    documents,
    loading,
    error,
    fetchDocuments
  }
}
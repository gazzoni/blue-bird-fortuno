 'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Filter, Eye, AlertTriangle, Clock, CheckCircle, X, Loader2 } from 'lucide-react'
import type { Occurrence as OccurrenceFiltersType } from '@/hooks/useOccurrenceFilters'
import { supabase } from '@/lib/supabase'

// Estado que receberá os dados reais do Supabase
type Occurrence = OccurrenceFiltersType

const useSupabaseOccurrences = (
  params: {
    search: string;
    status: 'all' | 'aberta' | 'urgente' | 'resolvida';
    category: 'all' | 'contas_a_pagar' | 'contas_a_receber' | 'conciliacao';
    chatType: 'all' | 'group' | 'private';
    page: number;
    pageSize: number;
  }
) => {
  const [occurrences, setOccurrences] = useState<Occurrence[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const from = (params.page - 1) * params.pageSize
        const to = from + params.pageSize - 1

        let query = supabase
          .from('occurrences')
          .select(
            'id, created_at, justification, evidence, key_words, chat_type, chat_id, chat_name, channel, status, category',
            { count: 'exact' }
          )
          .order('created_at', { ascending: false })
          .range(from, to)

        if (params.status !== 'all') query = query.eq('status', params.status)
        if (params.category !== 'all') query = query.eq('category', params.category)
        if (params.chatType !== 'all') query = query.eq('chat_type', params.chatType)
        if (params.search.trim().length > 0) {
          query = query.ilike('justification', `%${params.search.trim()}%`)
        }

        const { data, error, count } = await query
        if (error) throw error
        setTotalCount(count || 0)

        const mapped: Occurrence[] = (data || []).map((row: {
          id: number;
          created_at: string;
          justification: string | null;
          evidence: string | null;
          key_words: string | null;
          chat_type: string | null;
          chat_id: string | null;
          chat_name: string | null;
          channel: string | null;
          status: string | null;
          category: string | null;
        }) => ({
          id: row.id,
          createdAt: row.created_at,
          justification: row.justification ?? '',
          evidence: row.evidence ?? '',
          keywords: row.key_words ?? '',
          chatType: row.chat_type ?? '',
          chatId: row.chat_id ?? '',
          chatName: row.chat_name ?? '',
          channel: row.channel ?? '',
          status: row.status ?? '',
          category: row.category ?? '',
        }))
        setOccurrences(mapped)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erro ao carregar ocorrências')
        setOccurrences([])
        setTotalCount(0)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [
    params.search,
    params.status,
    params.category,
    params.chatType,
    params.page,
    params.pageSize,
  ])

  return { occurrences, loading, error, totalCount }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'aberta':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
        <Clock className="w-3 h-3 mr-1" />
        Pendente
      </Badge>
    case 'urgente':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        <AlertTriangle className="w-3 h-3 mr-1" />
        Em Andamento
      </Badge>
    case 'resolvida':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        Concluído
      </Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

const getCategoryBadge = (category: string) => {
  const label = (category || '').replaceAll('_', ' ') || '—'
  return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">{label}</Badge>
}

export default function Occurrences() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'aberta' | 'urgente' | 'resolvida'>('all')
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'contas_a_pagar' | 'contas_a_receber' | 'conciliacao'>('all')
  const [chatTypeFilter, setChatTypeFilter] = useState<'all' | 'group' | 'private'>('all')
  const [page, setPage] = useState(1)
  const pageSize = 50

  const { occurrences, loading, error, totalCount } = useSupabaseOccurrences({
    search,
    status: statusFilter,
    category: categoryFilter,
    chatType: chatTypeFilter,
    page,
    pageSize,
  })

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const hasActiveFilters = search !== '' || statusFilter !== 'all' || categoryFilter !== 'all' || chatTypeFilter !== 'all'

  const clearFilters = () => {
    setSearch('')
    setStatusFilter('all')
    setCategoryFilter('all')
    setChatTypeFilter('all')
    setPage(1)
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Ocorrências" />
      
      <div className="flex-1 p-6 space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filtros
              </CardTitle>
              {hasActiveFilters && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearFilters}
                  className="text-gray-600 hover:text-black"
                >
                  <X className="w-4 h-4 mr-1" />
                  Limpar Filtros
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      placeholder="Buscar por justificativa, chat..." 
                      className="pl-10"
                      value={search}
                      onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as typeof statusFilter); setPage(1); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="aberta">Pendente</SelectItem>
                    <SelectItem value="urgente">Em Andamento</SelectItem>
                    <SelectItem value="resolvida">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoria</label>
                <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v as typeof categoryFilter); setPage(1); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    <SelectItem value="contas_a_pagar">contas_a_pagar</SelectItem>
                    <SelectItem value="contas_a_receber">contas_a_receber</SelectItem>
                    <SelectItem value="conciliacao">conciliacao</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Chat</label>
                <Select value={chatTypeFilter} onValueChange={(v) => { setChatTypeFilter(v as typeof chatTypeFilter); setPage(1); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="group">Grupo</SelectItem>
                    <SelectItem value="private">Privado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Filter Summary */}
            {hasActiveFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">Total: {totalCount} ocorrências</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Occurrences Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lista de Ocorrências</CardTitle>
              <div className="text-sm text-gray-600">Página {page} de {totalPages}</div>
            </div>
          </CardHeader>
            <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-16 text-muted-foreground">
                <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Carregando...
              </div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Chat</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Justificativa</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Palavras-chave</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                    {occurrences.map((occurrence) => (
                  <TableRow key={occurrence.id}>
                    <TableCell className="font-medium">#{occurrence.id}</TableCell>
                    <TableCell>
                      {new Date(occurrence.createdAt).toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{occurrence.chatName}</div>
                        <div className="text-sm text-muted-foreground">
                          {occurrence.chatType === 'group' ? 'Grupo' : 'Privado'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getCategoryBadge(occurrence.category)}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={occurrence.justification}>
                        {occurrence.justification}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(occurrence.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {occurrence.keywords.split(', ').map((keyword, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="text-xs"
                          >
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            )}
            
            {!loading && occurrences.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma ocorrência encontrada</h3>
                <p>
                  {hasActiveFilters 
                    ? 'Não há ocorrências que correspondam aos filtros selecionados.'
                    : 'Não há ocorrências para exibir.'
                  }
                </p>
                {hasActiveFilters && (
                  <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={clearFilters}
                  >
                    Limpar Filtros
                  </Button>
                )}
              </div>
            )}
            {error && (
              <div className="text-center py-4 text-red-600 text-sm">{error}</div>
            )}

            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <Button variant="outline" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Anterior</Button>
                <div className="text-sm text-gray-600">Mostrando {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, totalCount)} de {totalCount}</div>
                <Button variant="outline" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Próxima</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
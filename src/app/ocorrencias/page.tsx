 'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Filter, Eye, AlertTriangle, X, Loader2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FeedbackModal } from '@/components/feedback/feedback-modal'
import { OccurrenceDetails } from '@/components/occurrences/occurrence-details'
import { InlineStatusEditor } from '@/components/occurrences/inline-status-editor'
import { InlineDescriptionEditor } from '@/components/occurrences/inline-description-editor'
import { useTableResize } from '@/hooks/useTableResize'
import type { Occurrence as OccurrenceFiltersType } from '@/hooks/useOccurrenceFilters'
import { supabase, updateOccurrenceStatus, updateOccurrenceDescription, updateOccurrenceResolution } from '@/lib/supabase'

// Estado que receberá os dados reais do Supabase
type Occurrence = OccurrenceFiltersType

type SortField = 'created_at' | 'status' | 'client_name' | 'squad' | 'category' | 'occurrence_name'
type SortDirection = 'asc' | 'desc'

const useSupabaseOccurrences = (
  params: {
    search: string;
    status: 'all' | 'aberto' | 'resolvido';
    category: 'all' | 'contas a pagar' | 'contas a receber' | 'conciliação bancária';
    squad: 'all' | string;
    page: number;
    pageSize: number;
    sortField: SortField;
    sortDirection: SortDirection;
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
          .from('new-occurrences')
          .select(
            'id, created_at, occurrence_name, description, occurrence_resolution, key_words, chat_id, chat_name, client_name, channel, status, category, squad, gate_kepper, messages',
            { count: 'exact' }
          )
          .order(params.sortField, { ascending: params.sortDirection === 'asc' })
          .range(from, to)

        if (params.status !== 'all') query = query.eq('status', params.status)
        if (params.category !== 'all') query = query.eq('category', params.category)
        if (params.squad !== 'all') query = query.eq('squad', params.squad)
        if (params.search.trim().length > 0) {
          const searchTerm = params.search.trim()
          query = query.or(`occurrence_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,chat_name.ilike.%${searchTerm}%,client_name.ilike.%${searchTerm}%,key_words.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
        }

        const { data, error, count } = await query
        
        if (error) {
          throw error
        }
        
        setTotalCount(count || 0)

        const mapped: Occurrence[] = (data || []).map((row: {
          id: number;
          created_at: string;
          occurrence_name: string | null;
          description: string | null;
          occurrence_resolution: string | null;
          key_words: string | null;
          chat_id: string | null;
          chat_name: string | null;
          client_name: string | null;
          channel: string | null;
          status: string | null;
          category: string | null;
          squad: string | null;
          gate_kepper: boolean | null;
          messages: Record<string, unknown> | null;
        }) => ({
          id: row.id,
          createdAt: row.created_at,
          occurrenceName: row.occurrence_name ?? '',
          description: row.description ?? '',
          occurrenceResolution: row.occurrence_resolution ?? '',
          keywords: row.key_words ?? '',
          chatId: row.chat_id ?? '',
          chatName: row.chat_name ?? '',
          clientName: row.client_name ?? '',
          channel: row.channel ?? '',
          status: row.status ?? '',
          category: row.category ?? '',
          squad: row.squad ?? '',
          gateKepper: row.gate_kepper ?? false,
          messages: row.messages ?? {},
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
    params.squad,
    params.page,
    params.pageSize,
    params.sortField,
    params.sortDirection,
  ])

  return { occurrences, loading, error, totalCount }
}



const getCategoryBadge = (category: string) => {
  const label = (category || '').replaceAll('_', ' ') || '—'
  return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">{label}</Badge>
}

export default function Occurrences() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'aberto' | 'resolvido'>('all')
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'contas a pagar' | 'contas a receber' | 'conciliação bancária'>('all')
  const [squadFilter, setSquadFilter] = useState<'all' | string>('all')
  const [page, setPage] = useState(1)
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [selectedOccurrence, setSelectedOccurrence] = useState<Occurrence | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [localOccurrences, setLocalOccurrences] = useState<Occurrence[]>([])
  const { columnWidths, handleMouseDown } = useTableResize()
  const pageSize = 50

  const { occurrences: fetchedOccurrences, loading, error, totalCount } = useSupabaseOccurrences({
    search,
    status: statusFilter,
    category: categoryFilter,
    squad: squadFilter,
    page,
    pageSize,
    sortField,
    sortDirection,
  })

  // Sincronizar dados locais com os fetchados
  useEffect(() => {
    setLocalOccurrences(fetchedOccurrences)
  }, [fetchedOccurrences])

  const occurrences = localOccurrences
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const hasActiveFilters = search !== '' || statusFilter !== 'all' || categoryFilter !== 'all' || squadFilter !== 'all'

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
    setPage(1)
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4" />
    }
    return sortDirection === 'asc' ? 
      <ArrowUp className="w-4 h-4" /> : 
      <ArrowDown className="w-4 h-4" />
  }

  const handleOpenDetails = (occurrence: Occurrence) => {
    setSelectedOccurrence(occurrence)
    setIsDetailsOpen(true)
  }

  const handleOpenFeedback = () => {
    setIsFeedbackOpen(true)
  }



  const handleStatusUpdate = async (occurrenceId: number, newStatus: string) => {
    try {
      await updateOccurrenceStatus(occurrenceId, newStatus)
      
      // Atualizar a lista local para refletir a mudança imediatamente
      setLocalOccurrences(prev => 
        prev.map(occ => 
          occ.id === occurrenceId 
            ? { ...occ, status: newStatus }
            : occ
        )
      )
      
      // Mostrar mensagem de sucesso (opcional - pode ser removida para UX mais limpa)
      // alert('✅ Status atualizado com sucesso!')
      
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert('❌ Erro ao atualizar status. Tente novamente.')
      throw error // Re-throw para que o modal saiba que houve erro
    }
  }

  const handleDescriptionUpdate = async (occurrenceId: number, newDescription: string) => {
    try {
      await updateOccurrenceDescription(occurrenceId, newDescription)
      
      // Atualizar a lista local para refletir a mudança imediatamente
      setLocalOccurrences(prev => 
        prev.map(occ => 
          occ.id === occurrenceId 
            ? { ...occ, description: newDescription }
            : occ
        )
      )
      
    } catch (error) {
      console.error('Erro ao atualizar descrição:', error)
      alert('❌ Erro ao atualizar descrição. Tente novamente.')
      throw error // Re-throw para que o componente saiba que houve erro
    }
  }

  const handleResolutionUpdate = async (occurrenceId: number, newResolution: string) => {
    try {
      await updateOccurrenceResolution(occurrenceId, newResolution)
      
      // Atualizar a lista local para refletir a mudança imediatamente
      setLocalOccurrences(prev => 
        prev.map(occ => 
          occ.id === occurrenceId 
            ? { ...occ, occurrenceResolution: newResolution }
            : occ
        )
      )
      
    } catch (error) {
      console.error('Erro ao atualizar resolução:', error)
      alert('❌ Erro ao atualizar resolução. Tente novamente.')
      throw error // Re-throw para que o componente saiba que houve erro
    }
  }

  const handleFeedbackSubmit = async (feedback: { type: 'like' | 'dislike'; comment: string; occurrenceId: number }) => {
    try {
      // Importar a função de envio de feedback
      const { sendFeedbackToN8n } = await import('@/lib/n8n')
      
      // Enviar feedback para o webhook n8n
      const response = await sendFeedbackToN8n({
        occurrence_id: feedback.occurrenceId,
        feedback_type: feedback.type === 'like' ? 'positive' : 'negative',
        feedback_content: feedback.comment
      })
      
      console.log('Feedback enviado com sucesso:', response)
      
      // Mostrar mensagem de sucesso (você pode substituir por um toast se preferir)
      alert('✅ Feedback enviado com sucesso!')
      
    } catch (error) {
      console.error('Erro ao enviar feedback:', error)
      alert('❌ Erro ao enviar feedback. Tente novamente.')
    }
  }

  const clearFilters = () => {
    setSearch('')
    setStatusFilter('all')
    setCategoryFilter('all')
    setSquadFilter('all')
    setSortField('created_at')
    setSortDirection('desc')
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
            <div className="flex flex-col gap-4">
              {/* Campo de busca - largura completa */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      placeholder="Buscar por descrição, chat, cliente, palavras-chave..." 
                      className="pl-10 w-full"
                      value={search}
                      onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>
              </div>

              {/* Filtros com largura fixa */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as typeof statusFilter); setPage(1); }}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="aberto">Aberto</SelectItem>
                      <SelectItem value="resolvido">Resolvido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Categoria</label>
                  <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v as typeof categoryFilter); setPage(1); }}>
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as categorias</SelectItem>
                      <SelectItem value="contas a pagar">Contas a Pagar</SelectItem>
                      <SelectItem value="contas a receber">Contas a Receber</SelectItem>
                      <SelectItem value="conciliação bancária">Conciliação Bancária</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Squad</label>
                  <Select value={squadFilter} onValueChange={(v) => { setSquadFilter(v); setPage(1); }}>
                    <SelectTrigger className="w-[240px]">
                      <SelectValue placeholder="Todos os squads" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os squads</SelectItem>
                      <SelectItem value="Elite do Fluxo">Elite do Fluxo</SelectItem>
                      <SelectItem value="Força Tática Financeira">Força Tática Financeira</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
            <div className="overflow-x-auto">
              <Table className="min-w-full"
                style={{
                  tableLayout: 'fixed',
                  width: Object.values(columnWidths).reduce((sum, width) => sum + width, 0) + 'px'
                }}
              >
              <TableHeader>
                <TableRow className="divide-x divide-gray-200">
                  <TableHead 
                    className="relative group border-r border-gray-200"
                    style={{ width: columnWidths.id }}
                  >
                    <span className="truncate">ID</span>
                    <div 
                      className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      onMouseDown={(e) => handleMouseDown(e, 'id')}
                    />
                  </TableHead>
                  <TableHead 
                    className="relative group border-r border-gray-200"
                    style={{ width: columnWidths.created_at }}
                  >
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-0 font-medium hover:bg-transparent truncate"
                      onClick={() => handleSort('created_at')}
                    >
                      Data/Hora
                      {getSortIcon('created_at')}
                    </Button>
                    <div 
                      className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      onMouseDown={(e) => handleMouseDown(e, 'created_at')}
                    />
                  </TableHead>
                  <TableHead 
                    className="relative group border-r border-gray-200"
                    style={{ width: columnWidths.occurrence_name }}
                  >
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-0 font-medium hover:bg-transparent truncate"
                      onClick={() => handleSort('occurrence_name')}
                    >
                      Nome
                      {getSortIcon('occurrence_name')}
                    </Button>
                    <div 
                      className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      onMouseDown={(e) => handleMouseDown(e, 'occurrence_name')}
                    />
                  </TableHead>
                  <TableHead 
                    className="relative group border-r border-gray-200"
                    style={{ width: columnWidths.description }}
                  >
                    <span className="truncate">Descrição</span>
                    <div 
                      className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      onMouseDown={(e) => handleMouseDown(e, 'description')}
                    />
                  </TableHead>
                  <TableHead 
                    className="relative group border-r border-gray-200"
                    style={{ width: columnWidths.client_name }}
                  >
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-0 font-medium hover:bg-transparent truncate"
                      onClick={() => handleSort('client_name')}
                    >
                      Cliente
                      {getSortIcon('client_name')}
                    </Button>
                    <div 
                      className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      onMouseDown={(e) => handleMouseDown(e, 'client_name')}
                    />
                  </TableHead>
                  <TableHead 
                    className="relative group border-r border-gray-200"
                    style={{ width: columnWidths.status }}
                  >
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-0 font-medium hover:bg-transparent truncate"
                      onClick={() => handleSort('status')}
                    >
                      Status
                      {getSortIcon('status')}
                    </Button>
                    <div 
                      className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      onMouseDown={(e) => handleMouseDown(e, 'status')}
                    />
                  </TableHead>
                  <TableHead 
                    className="relative group border-r border-gray-200"
                    style={{ width: columnWidths.category }}
                  >
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-0 font-medium hover:bg-transparent truncate"
                      onClick={() => handleSort('category')}
                    >
                      Categoria
                      {getSortIcon('category')}
                    </Button>
                    <div 
                      className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      onMouseDown={(e) => handleMouseDown(e, 'category')}
                    />
                  </TableHead>
                  <TableHead 
                    className="relative group border-r border-gray-200"
                    style={{ width: columnWidths.squad }}
                  >
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-0 font-medium hover:bg-transparent truncate"
                      onClick={() => handleSort('squad')}
                    >
                      Squad
                      {getSortIcon('squad')}
                    </Button>
                    <div 
                      className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      onMouseDown={(e) => handleMouseDown(e, 'squad')}
                    />
                  </TableHead>
                  <TableHead 
                    className="relative group border-r border-gray-200"
                    style={{ width: columnWidths.chat_name }}
                  >
                    <span className="truncate">Chat</span>
                    <div 
                      className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      onMouseDown={(e) => handleMouseDown(e, 'chat_name')}
                    />
                  </TableHead>
                  <TableHead 
                    className="relative group border-r border-gray-200"
                    style={{ width: columnWidths.resolution }}
                  >
                    <span className="truncate">Resolução</span>
                    <div 
                      className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      onMouseDown={(e) => handleMouseDown(e, 'resolution')}
                    />
                  </TableHead>
                  <TableHead 
                    className="relative group border-r border-gray-200"
                    style={{ width: columnWidths.keywords }}
                  >
                    <span className="truncate">Palavras-chave</span>
                    <div 
                      className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      onMouseDown={(e) => handleMouseDown(e, 'keywords')}
                    />
                  </TableHead>
                  <TableHead style={{ width: columnWidths.actions }}>
                    <span className="truncate">Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                    {occurrences.map((occurrence) => (
                  <TableRow key={occurrence.id}>
                    <TableCell className="font-medium">
                      <div className="truncate">#{occurrence.id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="truncate">{new Date(occurrence.createdAt).toLocaleString('pt-BR')}</div>
                    </TableCell>
                    <TableCell>
                      <div className="relative group">
                        <div className="font-medium truncate pr-8">{occurrence.occurrenceName}</div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenDetails(occurrence)}
                          className="absolute right-0 top-0 h-full w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-blue-50"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="truncate">
                        <InlineDescriptionEditor
                          currentDescription={occurrence.description}
                          occurrenceId={occurrence.id}
                          onDescriptionUpdate={handleDescriptionUpdate}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium truncate">{occurrence.clientName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="truncate">
                        <InlineStatusEditor
                          currentStatus={occurrence.status}
                          occurrenceId={occurrence.id}
                          onStatusUpdate={handleStatusUpdate}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="truncate">
                        {getCategoryBadge(occurrence.category)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="truncate">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {occurrence.squad || '—'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium truncate">{occurrence.chatName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="truncate" title={occurrence.occurrenceResolution}>
                        {occurrence.occurrenceResolution || '—'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="truncate">
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
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleOpenDetails(occurrence)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              </Table>
            </div>
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

      {/* Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Ocorrência</DialogTitle>
          </DialogHeader>
          
          <div className="mt-6 pb-6">
            {selectedOccurrence && (
              <OccurrenceDetails 
                occurrence={selectedOccurrence} 
                onFeedbackClick={handleOpenFeedback}
                onStatusUpdate={handleStatusUpdate}
                onDescriptionUpdate={handleDescriptionUpdate}
                onResolutionUpdate={handleResolutionUpdate}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Feedback Modal */}
      {selectedOccurrence && (
        <FeedbackModal
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
          occurrenceId={selectedOccurrence.id}
          onSubmit={handleFeedbackSubmit}
        />
      )}

    </div>
  )
}
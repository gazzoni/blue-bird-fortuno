 'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Filter, Eye, AlertTriangle, Clock, CheckCircle, X, Loader2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { FeedbackModal } from '@/components/feedback/feedback-modal'
import { OccurrenceDetails } from '@/components/occurrences/occurrence-details'
import type { Occurrence as OccurrenceFiltersType } from '@/hooks/useOccurrenceFilters'
import { supabase } from '@/lib/supabase'

// Estado que receberá os dados reais do Supabase
type Occurrence = OccurrenceFiltersType

type SortField = 'created_at' | 'status' | 'client_name' | 'squad' | 'category'
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
            'id, created_at, description, key_words, chat_id, chat_name, client_name, channel, status, category, squad, gate_kepper, messages',
            { count: 'exact' }
          )
          .order(params.sortField, { ascending: params.sortDirection === 'asc' })
          .range(from, to)

        if (params.status !== 'all') query = query.eq('status', params.status)
        if (params.category !== 'all') query = query.eq('category', params.category)
        if (params.squad !== 'all') query = query.eq('squad', params.squad)
        if (params.search.trim().length > 0) {
          const searchTerm = params.search.trim()
          query = query.or(`description.ilike.%${searchTerm}%,chat_name.ilike.%${searchTerm}%,client_name.ilike.%${searchTerm}%,key_words.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
        }

        const { data, error, count } = await query
        
        if (error) {
          throw error
        }
        
        setTotalCount(count || 0)

        const mapped: Occurrence[] = (data || []).map((row: {
          id: number;
          created_at: string;
          description: string | null;
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
          description: row.description ?? '',
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

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'aberto':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
        <Clock className="w-3 h-3 mr-1" />
        Aberto
      </Badge>
    case 'resolvido':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        Resolvido
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
  const [statusFilter, setStatusFilter] = useState<'all' | 'aberto' | 'resolvido'>('all')
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'contas a pagar' | 'contas a receber' | 'conciliação bancária'>('all')
  const [squadFilter, setSquadFilter] = useState<'all' | string>('all')
  const [page, setPage] = useState(1)
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [selectedOccurrence, setSelectedOccurrence] = useState<Occurrence | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const pageSize = 50

  const { occurrences, loading, error, totalCount } = useSupabaseOccurrences({
    search,
    status: statusFilter,
    category: categoryFilter,
    squad: squadFilter,
    page,
    pageSize,
    sortField,
    sortDirection,
  })

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

  const handleFeedbackSubmit = async (feedback: { type: 'like' | 'dislike'; comment: string; occurrenceId: number }) => {
    console.log('Feedback enviado:', feedback)
    // TODO: Integrar com banco de dados
    // Aqui você pode implementar a integração com o Supabase posteriormente
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-0 font-medium hover:bg-transparent"
                      onClick={() => handleSort('created_at')}
                    >
                      Data/Hora
                      {getSortIcon('created_at')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-0 font-medium hover:bg-transparent"
                      onClick={() => handleSort('client_name')}
                    >
                      Chat/Cliente
                      {getSortIcon('client_name')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-0 font-medium hover:bg-transparent"
                      onClick={() => handleSort('squad')}
                    >
                      Squad
                      {getSortIcon('squad')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-0 font-medium hover:bg-transparent"
                      onClick={() => handleSort('category')}
                    >
                      Categoria
                      {getSortIcon('category')}
                    </Button>
                  </TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-0 font-medium hover:bg-transparent"
                      onClick={() => handleSort('status')}
                    >
                      Status
                      {getSortIcon('status')}
                    </Button>
                  </TableHead>
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
                          {occurrence.clientName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {occurrence.squad || '—'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getCategoryBadge(occurrence.category)}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={occurrence.description}>
                        {occurrence.description}
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
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="w-[900px] sm:max-w-[900px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Detalhes da Ocorrência</SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 pb-6">
            {selectedOccurrence && (
              <OccurrenceDetails 
                occurrence={selectedOccurrence} 
                onFeedbackClick={handleOpenFeedback}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

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